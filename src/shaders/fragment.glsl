// Uniforms passed from JavaScript
uniform vec2 u_resolution;  // Canvas width and height
uniform float u_time;       // Elapsed time for animation
uniform vec2 u_mouse;       // Mouse position (normalized 0-1)
varying vec2 vUv;           // UV coordinates from vertex shader (0-1)

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
    vec3 col1 = vec3(0.0, 0.5, 0.0);  // Dark green (low)
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
    
    // Create pixelated grid (20x20 cells)
    float pixels = 20.0;
    vec2 pixelUV = pixelate(uv, pixels);
    
    // Calculate influence from mouse position (currently unused)
    float mouseInfluence = 1.0 - distance(u_mouse * aspect, uv) * 0.8;
    mouseInfluence = clamp(mouseInfluence, 0.0, 1.0);
    
    // Generate animated noise pattern
    // Multiply by 3.0 for more frequency, add time for animation
    float n = noise(pixelUV * 3.0 + u_time * 0.2);
    n = n * 0.5 + 0.5;  // Remap from 0-1 to 0.5-1.0 range
    //n += mouseInfluence * 0.3;  // Optional: add mouse interaction
    
    // Convert noise value to heat map color
    vec3 color = heatmapColor(n);
    
    // Add subtle dark grid lines between pixels
    float gridLine = step(0.95, fract(uv.x * pixels)) + step(0.95, fract(uv.y * pixels));
    color = mix(color, vec3(0.0), gridLine * 0.2);  // Darken grid by 20%
    
    // Output final color
    gl_FragColor = vec4(color, 1.0);
    
    #include <colorspace_fragment>  // Three.js color space correction
}