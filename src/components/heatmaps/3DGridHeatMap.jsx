import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import useGridHeatmapData from "@/utils/useGridHeatMapData";

const PITCH_WIDTH = 120;
const PITCH_HEIGHT = 80;
const MAX_TERRAIN_HEIGHT = 8;
const PITCH_OFFSET = -0.02;
const LINE_HEIGHT = 0.02;
const LERP_SPEED = 6;

const HEAT_SCALE = [
  { stop: 0.0, h: 260, s: 80, l: 5 },
  { stop: 0.15, h: 275, s: 75, l: 18 },
  { stop: 0.3, h: 300, s: 65, l: 28 },
  { stop: 0.45, h: 330, s: 70, l: 35 },
  { stop: 0.6, h: 10, s: 80, l: 42 },
  { stop: 0.75, h: 30, s: 90, l: 52 },
  { stop: 0.9, h: 45, s: 95, l: 65 },
  { stop: 1.0, h: 60, s: 100, l: 85 },
];

function lerpHue(h1, h2, t) {
  let diff = h2 - h1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (((h1 + diff * t) % 360) + 360) % 360;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return { r: r + m, g: g + m, b: b + m };
}

function interpolateHeatRGB(t) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < HEAT_SCALE.length - 1; i++) {
    const a = HEAT_SCALE[i];
    const b = HEAT_SCALE[i + 1];
    if (clamped >= a.stop && clamped <= b.stop) {
      const lt = (clamped - a.stop) / (b.stop - a.stop);
      const h = lerpHue(a.h, b.h, lt);
      const s = a.s + (b.s - a.s) * lt;
      const l = a.l + (b.l - a.l) * lt;
      return hslToRgb(h, s, l);
    }
  }
  const last = HEAT_SCALE[HEAT_SCALE.length - 1];
  return hslToRgb(last.h, last.s, last.l);
}

function bilinearSample(grid, r, c) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  if (rows === 0 || cols === 0) return 0;

  const r0 = Math.floor(r);
  const c0 = Math.floor(c);
  const tr = r - r0;
  const tc = c - c0;

  const get = (ri, ci) =>
    grid[Math.max(0, Math.min(rows - 1, ri))][
      Math.max(0, Math.min(cols - 1, ci))
    ];

  return (
    get(r0, c0) * (1 - tr) * (1 - tc) +
    get(r0, c0 + 1) * (1 - tr) * tc +
    get(r0 + 1, c0) * tr * (1 - tc) +
    get(r0 + 1, c0 + 1) * tr * tc
  );
}

function PitchLines() {
  const geometry = useMemo(() => {
    const segments = [];
    const addLine = (x1, z1, x2, z2) => {
      segments.push(x1, LINE_HEIGHT, z1, x2, LINE_HEIGHT, z2);
    };

    const centerX = PITCH_WIDTH / 2;
    const centerZ = -PITCH_HEIGHT / 2;
    const penaltyAreaDepth = 20;
    const penaltyAreaWidth = 40;
    const penaltyTop = centerZ + penaltyAreaWidth / 2;
    const penaltyBottom = centerZ - penaltyAreaWidth / 2;

    addLine(centerX, 0, centerX, -PITCH_HEIGHT);

    addLine(0, penaltyTop, penaltyAreaDepth, penaltyTop);
    addLine(penaltyAreaDepth, penaltyTop, penaltyAreaDepth, penaltyBottom);
    addLine(penaltyAreaDepth, penaltyBottom, 0, penaltyBottom);

    const rightX = PITCH_WIDTH - penaltyAreaDepth;
    addLine(PITCH_WIDTH, penaltyTop, rightX, penaltyTop);
    addLine(rightX, penaltyTop, rightX, penaltyBottom);
    addLine(rightX, penaltyBottom, PITCH_WIDTH, penaltyBottom);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#8866cc" transparent opacity={0.25} />
    </lineSegments>
  );
}

function TerrainMesh({ gridCounts, gridSize, maxCount }) {
  const meshRef = useRef();

  const rows = gridCounts.length;
  const cols = gridCounts[0]?.length || 1;
  const segX = cols * 3;
  const segZ = rows * 3;

  const geo = useMemo(() => {
    const vertsX = segX + 1;
    const vertsZ = segZ + 1;
    const vertexCount = vertsX * vertsZ;

    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const indices = [];

    // Pitch coordinates match the 2D SVG: x [0..120], z [0..-80].
    let ptr = 0;
    for (let vz = 0; vz < vertsZ; vz++) {
      const z = -(vz / segZ) * PITCH_HEIGHT;
      for (let vx = 0; vx < vertsX; vx++) {
        const x = (vx / segX) * PITCH_WIDTH;
        positions[ptr++] = x;
        positions[ptr++] = 0;
        positions[ptr++] = z;
      }
    }

    for (let z = 0; z < segZ; z++) {
      for (let x = 0; x < segX; x++) {
        const a = z * vertsX + x;
        const b = a + 1;
        const c = a + vertsX;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [segX, segZ]);

  const targets = useMemo(() => {
    const pos = geo.attributes.position;
    const count = pos.count;
    const heights = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const gc = x / gridSize - 0.5;
      const gr = (PITCH_HEIGHT + z) / gridSize - 0.5;

      const raw = bilinearSample(gridCounts, gr, gc);
      const normalized = maxCount > 0 ? raw / maxCount : 0;
      const intensity = Math.pow(Math.min(1, normalized), 0.6);

      heights[i] = Math.pow(intensity, 0.75) * MAX_TERRAIN_HEIGHT;

      const c = interpolateHeatRGB(intensity);
      const alpha = 0.25 + intensity * 0.75;
      const base = { r: 0.07, g: 0.08, b: 0.12 };
      const fade = 0.5 + (heights[i] / MAX_TERRAIN_HEIGHT) * 0.5;

      colors[i * 3]     = (base.r + (c.r - base.r) * alpha) * fade;
      colors[i * 3 + 1] = (base.g + (c.g - base.g) * alpha) * fade;
      colors[i * 3 + 2] = (base.b + (c.b - base.b) * alpha) * fade;
    }

    return { heights, colors };
  }, [gridCounts, gridSize, maxCount, geo]);

  useFrame((_, delta) => {
    const pos = geo.attributes.position;
    const colorAttr = geo.attributes.color;
    const t = Math.min(delta * LERP_SPEED, 1);
    let dirty = false;

    for (let i = 0; i < pos.count; i++) {
      const curY = pos.getY(i);
      const tarY = targets.heights[i];
      if (Math.abs(curY - tarY) > 0.005) {
        pos.setY(i, curY + (tarY - curY) * t);
        dirty = true;
      }
    }

    const ca = colorAttr.array;
    const ta = targets.colors;
    for (let i = 0; i < ca.length; i++) {
      const diff = ta[i] - ca[i];
      if (Math.abs(diff) > 0.003) {
        ca[i] += diff * t;
        dirty = true;
      }
    }

    if (dirty) {
      pos.needsUpdate = true;
      colorAttr.needsUpdate = true;
      geo.computeVertexNormals();
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geo}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geo} position={[0, 0.15, 0]}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#6644aa"
          wireframe
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

const ORBIT_TARGET = [60, 0, -40];

function CanvasPointerGate({ interactive }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.domElement.style.pointerEvents = interactive ? "auto" : "none";
  }, [gl, interactive]);

  return null;
}

function SceneControls({ camera: cameraPreset }) {
  const controlsRef = useRef();
  const initialized = useRef(false);
  const userInteracting = useRef(false);
  const baseAzimuth = useRef(0);
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...ORBIT_TARGET), []);

  useEffect(() => {
    initialized.current = false;
  }, [cameraPreset]);

  useFrame((state) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!initialized.current) {
      const spherical = new THREE.Spherical(
        cameraPreset.distance,
        cameraPreset.phi,
        cameraPreset.theta
      );
      const offset = new THREE.Vector3().setFromSpherical(spherical);

      camera.position.copy(target).add(offset);
      camera.fov = cameraPreset.fov;
      camera.updateProjectionMatrix();

      controls.target.copy(target);
      controls.minDistance = cameraPreset.minDistance;
      controls.maxDistance = cameraPreset.maxDistance;
      controls.update();

      baseAzimuth.current = controls.getAzimuthalAngle();
      initialized.current = true;
      return;
    }

    if (cameraPreset.autoRotate && !userInteracting.current) {
      const speed = cameraPreset.autoRotateSpeed ?? 0.3;
      const range = cameraPreset.autoRotateRange ?? 0.1;
      const swing = Math.sin(state.clock.elapsedTime * speed) * range;
      controls.setAzimuthalAngle(baseAzimuth.current + swing);
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={ORBIT_TARGET}
      minDistance={cameraPreset.minDistance}
      maxDistance={cameraPreset.maxDistance}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={Math.PI / 3}
      minAzimuthAngle={-Math.PI / 6}
      maxAzimuthAngle={Math.PI / 6}
      enableZoom={false}
      onStart={() => {
        userInteracting.current = true;
      }}
      onEnd={() => {
        userInteracting.current = false;
        if (controlsRef.current) {
          baseAzimuth.current = controlsRef.current.getAzimuthalAngle();
        }
      }}
    />
  );
}

const CAMERA_PRESETS = {
  default: {
    distance: 121,
    phi: 1.146,
    theta: 0,
    fov: 45,
    minDistance: 70,
    maxDistance: 150,
    minHeight: 300,
  },
  hero: {
    distance: 320,
    phi: 1.146,
    theta: 0,
    fov: 22,
    minDistance: 72,
    maxDistance: 320,
    minHeight: 0,
    autoRotate: true,
    autoRotateSpeed: 0.35,
    autoRotateRange: 0.09,
  },
  heroMobile: {
    distance: 72,
    phi: 0.955,
    theta: 0,
    fov: 60,
    minDistance: 40,
    maxDistance: 120,
    minHeight: 0,
    autoRotate: true,
    autoRotateSpeed: 0.3,
    autoRotateRange: 0.07,
  },
};

export default function ThreeDGridHeatMap({
  gameData,
  team,
  color,
  eventType,
  minute = 90,
  flipX = false,
  interactive = false,
  variant = "default",
}) {
  const { gridCounts, gridSize, maxCount } = useGridHeatmapData(gameData, {
    team,
    eventType,
    minute,
    flipX,
  });

  const camera = CAMERA_PRESETS[variant] ?? CAMERA_PRESETS.default;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: camera.minHeight,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <Canvas
        camera={{ fov: camera.fov }}
        gl={{ antialias: true }}
        fog={new THREE.Fog(0x0e1118, 40, 220)}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: interactive ? "auto" : "none",
        }}
      >
        <CanvasPointerGate interactive={interactive} />
        <ambientLight intensity={0.15} />
        <SceneControls camera={camera} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[60, PITCH_OFFSET, -40]}>
          <planeGeometry args={[PITCH_WIDTH, PITCH_HEIGHT]} />
          <meshBasicMaterial
            color="#1a0e2e"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <PitchLines />
        <TerrainMesh
          gridCounts={gridCounts}
          gridSize={gridSize}
          maxCount={maxCount}
        />
      </Canvas>
    </div>
  );
}
