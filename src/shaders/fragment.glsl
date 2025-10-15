// Uniforms passed from JavaScript
uniform vec2 u_resolution;  // Canvas width and height
uniform float u_time;       // Elapsed time for animation
uniform vec2 u_mouse;       // Mouse position (normalized 0-1)
varying vec2 vUv;           // UV coordinates from vertex shader (0-1)

uniform float u_homeGoals;
uniform float u_awayGoals;


// Generates pseudo-random value from 2D coordinate
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Reduces UV resolution to create pixelated effect
vec2 pixelate(vec2 uv, float pixels) {
    return floor(uv * pixels) / pixels;
}

// Smoothly interpolated 2D noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractional Brownian Motion (fBm) - layered noise for organic patterns
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float maxValue = 0.0;  // Used for normalizing result to 0.0 - 1.0
    
    // Octaves - more octaves = more detail
    for(int i = 0; i < 6; i++) {
        value += amplitude * noise(st * frequency);
        maxValue += amplitude;
        amplitude *= 0.5;  // Each octave has half the amplitude
        frequency *= 2.0;  // Each octave has double the frequency
        st *= 2.0;  // Scale up the coordinates
    }
    
    return value / maxValue;  // Normalize to 0.0 - 1.0
}

// Ridged noise - creates sharp ridges and valleys
float ridgedNoise(vec2 st) {
    return 1.0 - abs(noise(st));
}

// Ridged fBm - combines ridged noise with fBm for more complex patterns
float ridgedFbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float maxValue = 0.0;
    
    for(int i = 0; i < 4; i++) {
        float ridged = ridgedNoise(st * frequency);
        value += amplitude * ridged * ridged;  // Square for sharper ridges
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
        st *= 2.0;
    }
    
    return value / maxValue;
}

// Heat map colors: green -> yellow -> red
vec3 heatmapColor(float value) {
    vec3 col1 = vec3(0.2, 0.8, 0.3);  // Neon green (no goals)
    vec3 col2 = vec3(1.0, 1.0, 0.0);  // Yellow (some goals)
    vec3 col3 = vec3(1.0, 0.0, 0.0);  // Red (many goals)
    
    if (value < 0.5) {
        return mix(col1, col2, value * 2.0);
    } else {
        return mix(col2, col3, (value - 0.5) * 2.0);
    }
}

void main() {
    // Correct aspect ratio
    vec2 aspect = u_resolution / min(u_resolution.x, u_resolution.y);
    vec2 uv = vUv * aspect;
    
    // Create pixelated grid
    float pixelDensity = 20.0;  // Grid resolution
    vec2 pixelUV = pixelate(uv, pixelDensity);
    
    // Generate complex fBm noise for organic heat map pattern
    vec2 noiseCoord = pixelUV * 10.0 + u_time * 0.05;
    
    // Combine different noise types for complex patterns
    float baseFbm = fbm(noiseCoord);
    float ridgedFbm = ridgedFbm(noiseCoord * 1.5 + vec2(u_time * 0.02));
    
    // Mix different noise types for varied patterns
    float n = mix(baseFbm, ridgedFbm, 0.3);
    
    // Add some turbulence for more dynamic patterns
    float turbulence = fbm(noiseCoord * 4.0 + u_time * 0.01) * 0.5;
    float finalNoise = n + turbulence;
    
    // === COMBINED TEAM VISUALIZATION ===
    // Scale goals to 0-1 range with higher impact
    float homeGoalIntensity = u_homeGoals / 3.0;  // Reduced from 5.0 for more impact
    float awayGoalIntensity = u_awayGoals / 3.0;  // Reduced from 5.0 for more impact
    
    // Create heat values for both teams with higher intensity
    float homeHeatValue = finalNoise * homeGoalIntensity * 2.0;  // Multiply by 2 for more impact
    float awayHeatValue = finalNoise * awayGoalIntensity * 2.0;  // Multiply by 2 for more impact
    
    // Define team colors with higher contrast
    vec3 homeColor = vec3(0.0, 0.2, 1.0);   // Bright blue for home team
    vec3 awayColor = vec3(1.0, 0.2, 0.0);   // Bright red for away team
    vec3 baseColor = vec3(0.1, 0.6, 0.2);   // Darker green base for more contrast
    
    // Create team-specific heat maps with stronger mixing
    vec3 homeHeatMap = mix(baseColor, homeColor, clamp(homeHeatValue, 0.0, 1.0));
    vec3 awayHeatMap = mix(baseColor, awayColor, clamp(awayHeatValue, 0.0, 1.0));
    
    // Blend both team visualizations with more dynamic mixing
    vec3 color = mix(homeHeatMap, awayHeatMap, 0.5);
    
    // Add base intensity so even 0 goals shows some pattern
    float basePattern = finalNoise * 0.9;  // Subtle base pattern
    color = mix(baseColor, color, basePattern + 0.8);
    
    // Add pixelated grid lines
    float gridLine = step(0.95, fract(uv.x * pixelDensity)) + step(0.95, fract(uv.y * pixelDensity));
    color = mix(color, vec3(0.0), gridLine * 0.3);  // Dark grid lines
    
    // Center line (white field line)
    float centerLine = 1.0 - smoothstep(0.0, 0.005, abs(vUv.x - 0.5));
    color = mix(color, vec3(1.0), centerLine * 0.8);
    
    // Side boundaries
    float leftBoundary = 1.0 - smoothstep(0.0, 0.005, vUv.x);
    float rightBoundary = 1.0 - smoothstep(0.0, 0.005, 1.0 - vUv.x);
    color = mix(color, vec3(1.0), (leftBoundary + rightBoundary) * 0.6);
    
    // Top/bottom boundaries
    float topBoundary = 1.0 - smoothstep(0.0, 0.005, vUv.y);
    float bottomBoundary = 1.0 - smoothstep(0.0, 0.005, 1.0 - vUv.y);
    color = mix(color, vec3(1.0), (topBoundary + bottomBoundary) * 0.6);
    
    gl_FragColor = vec4(color, 1.0);
    
    #include <colorspace_fragment>
}