precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_homeGoals;
uniform float u_awayGoals;
uniform float u_homeCorners;
uniform float u_awayCorners;
uniform float u_homePossession;
uniform float u_awayPossession;
uniform float u_homeYellowCards;
uniform float u_awayYellowCards;
uniform float u_homeDribbleSuccess;
uniform float u_awayDribbleSuccess;
varying vec2 vUv;

// Normalize goals to 0-1 range based on total goals
float normalizeGoals(float goals) {
    float totalGoals = u_homeGoals + u_awayGoals;
    if (totalGoals == 0.0) return 0.5; // No goals scored, return neutral
    return goals / totalGoals;
}

// Get goal difference normalized to -1 to 1 range
// Returns positive if home winning, negative if away winning
float normalizeGoalDifference() {
    float diff = u_homeGoals - u_awayGoals;
    float maxGoals = max(u_homeGoals, u_awayGoals);
    if (maxGoals == 0.0) return 0.0; // Draw at 0-0
    return diff / (u_homeGoals + u_awayGoals + 1.0); // +1 to avoid division issues
}

// Normalize possession to 0-1 range (assumes input is 0-100)
float normalizePossession(float possession) {
    return clamp(possession / 100.0, 0.0, 1.0);
}

// Get possession difference normalized to -1 to 1 range
// Returns positive if home has more possession, negative if away has more
float normalizePossessionDifference() {
    return (u_homePossession - u_awayPossession) / 100.0;
}

// Hash function for noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// 2D Value noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smoothstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// FBM (Fractal Brownian Motion)
float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = normalizeGoalDifference() * 5.0;
    
    for(int i = 0; i < 6; i++) {
        sum += noise(p * freq) * amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    
    return sum;
}

// Domain warping function with time animation
vec2 domainWarp(vec2 p, float time) {
    float homeSpeed = normalizePossession(u_homePossession) * 2.0;
    float awaySpeed = normalizePossession(u_awayPossession) * 2.0;
    
    vec2 offset1 = vec2(fbm(p + vec2(time * 0.1 * awaySpeed, time * 0.15 * awaySpeed)), 
                        fbm(p + vec2(5.2, 1.3 + time * 0.12 * awaySpeed)));
    vec2 offset2 = vec2(fbm(p + 4.0 * offset1 + vec2(1.7 + time * 0.08 * homeSpeed, 9.2)), 
                        fbm(p + 4.0 * offset1 + vec2(8.3, 2.8 + time * 0.1 * homeSpeed)));
    return p + 2.5 * offset2;
}

// Pixelate function
vec2 pixelate(vec2 uv, float pixelSize) {
    return floor(uv * pixelSize) / pixelSize;
}



void main() {
    // Correct aspect ratio
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Pixelation - blocky style
    float pixelSize = 100.0;
    vec2 pixelUV = pixelate(uv, pixelSize);
    
    // Create separate warped UVs for each team
    // Home uses warp influenced by home possession (offset2)
    vec2 homeWarpedUV = domainWarp(pixelUV, u_time);
    // Away uses warp influenced by away possession (offset1) - add offset for variation
    vec2 awayWarpedUV = domainWarp(pixelUV + vec2(50.0, 50.0), u_time);
    
    // Calculate noise scale based on goals (more goals = bigger patterns = lower frequency)
    // Map goals to a frequency range (higher goals -> lower frequency -> bigger blocks)
    float homeGoalRatio = normalizeGoals(u_homeGoals);
    float awayGoalRatio = normalizeGoals(u_awayGoals);
    
    // Inverse relationship: more goals = lower frequency = bigger patterns
    float homeFreq = mix(10.0, 0.5, homeGoalRatio); // Higher ratio -> lower frequency
    float awayFreq = mix(10.0, 0.5, awayGoalRatio);
    
    // Generate separate noise patterns for each team using their own warped UVs
    float homeNoise = fbm(homeWarpedUV * homeFreq);
    float awayNoise = fbm(awayWarpedUV * awayFreq);
    
    // Team colors
    vec3 homeColor = vec3(0.0, 0.2, 1.0);  // Blue
    vec3 awayColor = vec3(1.0, 0.2, 0.0);  // Red
    
    // Apply colors with their noise patterns AND scale by goal ratio
    // This makes the winning team's color more prominent
    vec3 homeLayer = homeColor * homeNoise * homeGoalRatio * 2.0;
    vec3 awayLayer = awayColor * awayNoise * awayGoalRatio * 2.0;
    
    // Blend both layers together
    vec3 finalColor = smoothstep(homeLayer, awayLayer, 0.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
    
    #include <colorspace_fragment>
}
