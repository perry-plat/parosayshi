export const EMBROIDERY_VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;

void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const EMBROIDERY_FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uArt;
uniform sampler2D uField;
uniform sampler2D uWeave;
uniform vec2 uTexel;
uniform vec2 uLight;
uniform vec2 uPointer;
uniform float uLightZ;
uniform float uHover;
uniform float uAspect;
uniform float uDepth;
uniform float uWeaveScale;
uniform vec3 uFabric;

float hash(vec2 point) {
  point = mod(point, 137.0);
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 point) {
  point = mod(point, 137.0);
  vec2 cell = floor(point);
  vec2 fraction = fract(point);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  vec2 eased = fraction * fraction * (3.0 - 2.0 * fraction);
  return mix(mix(a, b, eased.x), mix(c, d, eased.x), eased.y);
}

float weaveAt(vec2 uv) {
  return texture2D(
    uWeave,
    fract(uv * vec2(uAspect, 1.0) * uWeaveScale)
  ).r;
}

void main() {
  vec2 uv = vUv;
  vec4 field = texture2D(uField, uv);
  float coverage = field.r;
  float inkMask = field.g;
  float rimMask = field.b;
  float stitchAngle = field.a * 3.14159265;
  vec2 point = uv * vec2(uAspect, 1.0);

  float baseWeave = weaveAt(uv + vec2(0.37, 0.11));
  float blotch = noise(point * 3.0) * 0.1 + noise(point * 7.0) * 0.05;
  vec3 fabric = uFabric * (0.72 + baseWeave * 0.6 + blotch - 0.075);
  fabric += (noise(point * 240.0) - 0.5) * 0.025;
  vec3 color = fabric;

  vec2 shadowOffset = vec2(6.0, -6.0) * uTexel;
  float shiftedCoverage = texture2D(uField, uv - shadowOffset).r;
  float contactShadow = smoothstep(0.16, 0.82, shiftedCoverage);
  color = mix(color, color * 0.47, contactShadow * 0.78);

  if (coverage < 0.004) {
    gl_FragColor = vec4(color, 1.0);
    return;
  }

  float weaveCenter = weaveAt(uv);
  float weaveLeft = weaveAt(uv - vec2(1.0, 0.0) * uTexel);
  float weaveRight = weaveAt(uv + vec2(1.0, 0.0) * uTexel);
  float weaveDown = weaveAt(uv - vec2(0.0, 1.0) * uTexel);
  float weaveUp = weaveAt(uv + vec2(0.0, 1.0) * uTexel);
  vec2 weaveSlope = vec2(weaveRight - weaveLeft, weaveUp - weaveDown) * 22.0;
  vec3 weaveNormal = normalize(vec3(-weaveSlope.x, -weaveSlope.y, 1.0));

  float coverLeft = texture2D(uField, uv - vec2(1.0, 0.0) * uTexel).r;
  float coverRight = texture2D(uField, uv + vec2(1.0, 0.0) * uTexel).r;
  float coverDown = texture2D(uField, uv - vec2(0.0, 1.0) * uTexel).r;
  float coverUp = texture2D(uField, uv + vec2(0.0, 1.0) * uTexel).r;
  vec2 patchSlope = vec2(coverRight - coverLeft, coverUp - coverDown) * uDepth * 16.0;
  vec3 patchNormal = vec3(-patchSlope.x, -patchSlope.y, 1.0);
  float bevel = clamp(length(patchSlope), 0.0, 1.0);
  vec3 normal = normalize(patchNormal + weaveNormal * 2.0);

  vec3 light = normalize(vec3(uLight, uLightZ));
  float diffuse = dot(normal, light);
  float highlight = pow(max(diffuse, 0.0), 1.25);
  float shade = pow(max(-diffuse, 0.0), 1.1);

  vec3 patchColor = texture2D(uArt, uv).rgb;
  vec3 litPatch = patchColor * (0.72 + weaveCenter * 0.6);

  float stitchCos = cos(stitchAngle);
  float stitchSin = sin(stitchAngle);
  float across = point.x * stitchSin - point.y * stitchCos;
  float rows = across * 260.0;
  float satin = sin(mod(rows, 6.2831853));
  float ridge = pow(0.5 + 0.5 * satin, 1.4);
  float jitter = noise(vec2(floor(rows), (point.x * stitchCos + point.y * stitchSin) * 90.0)) * 0.25;
  float satinShade = mix(0.8, 1.18, clamp(ridge + jitter * ridge, 0.0, 1.0));
  float threadMask = max(inkMask, rimMask);
  litPatch *= mix(1.0, satinShade, threadMask * 0.96);

  litPatch += highlight * 0.44 * (0.48 + bevel * 0.52);
  litPatch -= shade * 0.35;

  float innerEdge = 1.0 - smoothstep(0.0, 0.32, coverage);
  litPatch *= 1.0 - innerEdge * 0.28 * coverage;
  litPatch += (noise(point * 380.0) - 0.5) * 0.042;

  float pointerDistance = distance(
    point,
    uPointer * vec2(uAspect, 1.0)
  );
  float halo = 1.0 - smoothstep(0.0, 0.46, pointerDistance);
  float threadCrown = smoothstep(0.72, 1.0, ridge);
  float glint = halo * halo * (0.3 + threadCrown * 0.9) * uHover;
  litPatch += glint * 0.17 * max(threadMask, coverage * 0.18);

  litPatch = clamp(litPatch, 0.0, 1.0);
  float antialias = smoothstep(0.06, 0.2, coverage);
  gl_FragColor = vec4(mix(color, litPatch, antialias), 1.0);
}
`;
