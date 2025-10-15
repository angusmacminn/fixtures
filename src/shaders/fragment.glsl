// Uniforms passed from JavaScript
uniform vec2 u_resolution;  // Canvas width and height
uniform float u_time;       // Elapsed time for animation
uniform vec2 u_mouse;       // Mouse position (normalized 0-1)
varying vec2 vUv;           // UV coordinates from vertex shader (0-1)

uniform float u_homeGoals;
uniform float u_homeCorners;
uniform float u_homePossession;
uniform float u_homeYellowCards;
uniform float u_homeAssists;
uniform float u_homeDribbleSuccess;
uniform float u_awayGoals;
uniform float u_awayCorners;
uniform float u_awayPossession;
uniform float u_awayYellowCards;
uniform float u_awayAssists;
uniform float u_awayDribbleSuccess;


// Generates pseudo-random value from 2D coordinate
// Uses hash function for consistent noise per pixel
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Reduces UV resolution to create pixelated effect
// Higher 'pixels' value = more pixelation
vec2 pixelate(vec2 uv, float pixels) {
    return floor(uv * pixels) / pixels;
}

// Smoothly interpolated 2D noise using random values at grid points
// Creates organic, flowing patterns
float noise(vec2 st) {
    vec2 i = floor(st);  // Integer part (grid cell)
    vec2 f = fract(st);  // Fractional part (position within cell)
    
    // Get random values at four corners of grid cell
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // Smooth interpolation curve (smoothstep)
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    // Bilinear interpolation between corner values
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Maps 0-1 value to heat map colors
// 0.0-0.5: dark green -> red
// 0.5-1.0: red -> yellow
vec3 heatmapColor(float value) {
    vec3 col1 = vec3(0.0, 0.5, 0.2);  // Dark green (low)
    vec3 col2 = vec3(1.0, 0.0, 0.0);  // Red (medium)
    vec3 col3 = vec3(1.0, 1.0, 0.0);  // Yellow (high)
    
    if (value < 0.5) {
        return mix(col1, col2, value * 2.0);
    } else {
        return mix(col2, col3, (value - 0.5) * 2.0);
    }
}

void main() {
    // Correct aspect ratio so pattern isn't stretched
    vec2 aspect = u_resolution / min(u_resolution.x, u_resolution.y);
    vec2 uv = vUv * aspect;
    
    // Determine which side we're on: left (home) or right (away)
    float side = step(0.5, vUv.x);  // 0 = home (left), 1 = away (right)
    
    // === PIXELATION (affected by goals scored) ===
    // More goals = less pixelation (smoother, more controlled)
    float goals = mix(u_homeGoals, u_awayGoals, side);
    float pixelDensity = 15.0 + goals * 2.0;  // Base 15, +2 per goal
    vec2 pixelUV = pixelate(uv, pixelDensity);
    
    // === NOISE FREQUENCY (affected by corners) ===
    // More corners = higher frequency noise (busier pattern)
    float corners = mix(u_homeCorners, u_awayCorners, side);
    float noiseFreq = 2.0 + corners * 0.3;  // Base 2.0, +0.3 per corner
    
    // === ANIMATION SPEED (affected by assists) ===
    // More assists = faster animation (more dynamic play)
    float assists = mix(u_homeAssists, u_awayAssists, side);
    float timeScale = 0.1 + assists * 0.05;  // Base 0.1, +0.05 per assist
    
    // Generate animated noise pattern with stats-driven parameters
    float n = noise(pixelUV * noiseFreq + u_time * timeScale);
    
    // === INTENSITY MODIFIER (affected by possession %) ===
    // Higher possession = brighter, more intense colors
    float possession = mix(u_homePossession, u_awayPossession, side);
    float intensity = possession / 100.0;  // Convert percentage to 0-1
    n = n * intensity + (1.0 - intensity) * 0.3;  // Boost with possession
    
    // === DRIBBLE SUCCESS (affects pattern smoothness) ===
    // Higher dribble success = smoother transitions
    float dribble = mix(u_homeDribbleSuccess, u_awayDribbleSuccess, side);
    float smoothing = dribble / 100.0;  // Convert percentage to 0-1
    n = mix(n, smoothstep(0.0, 1.0, n), smoothing);  // Smooth based on dribble %
    
    // Normalize noise to 0-1 range
    n = n * 0.5 + 0.5;
    
    // Convert noise value to heat map color
    vec3 color = heatmapColor(n);
    
    // === YELLOW CARDS (affects grid intensity) ===
    // More yellow cards = darker, more visible grid (aggression)
    float yellowCards = mix(u_homeYellowCards, u_awayYellowCards, side);
    float gridIntensity = 0.1 + yellowCards * 0.5;  // Base 0.1, +0.1 per card
    
    // Add grid lines with stats-driven intensity
    float gridLine = step(0.95, fract(uv.x * pixelDensity)) + step(0.95, fract(uv.y * pixelDensity));
    color = mix(color, vec3(0.0), gridLine * gridIntensity);
    
    // === CENTER LINE (divider between home/away) ===
    // Subtle white line down the middle
    float centerLine = 1.0 - smoothstep(1.0, 0.01, abs(vUv.x - 0.5));
    color = mix(color, vec3(1.0), centerLine * 0.3);
    
    // Output final color
    gl_FragColor = vec4(color, 1.0);
    
    #include <colorspace_fragment>  // Three.js color space correction
}