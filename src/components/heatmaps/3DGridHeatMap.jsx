// 3DGridHeatMap.jsx - full structure
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useGridHeatmapData from '@/utils/useGridHeatMapData';

const PITCH_WIDTH = 120;
const PITCH_HEIGHT = 80;
const MAX_BAR_HEIGHT = 8;
const MIN_BAR_HEIGHT = 0.15;
const PITCH_OFFSET = -0.02;
const LINE_HEIGHT = 0.02; // Slightly above pitch plane

// Generate circle points for center circle and arcs
function getCirclePoints(cx, cz, radius, segments = 32, startAngle = 0, endAngle = Math.PI * 2) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / segments);
    points.push([cx + Math.cos(angle) * radius, LINE_HEIGHT, cz + Math.sin(angle) * radius]);
  }
  return points;
}

// Convert points array to line segment pairs for BufferGeometry
function pointsToSegments(points) {
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push(...points[i], ...points[i + 1]);
  }
  return segments;
}

// All pitch lines in a single draw call
function PitchLines() {
  const geometry = useMemo(() => {
    const segments = [];
    
    // Helper to add a line segment
    const addLine = (x1, z1, x2, z2) => {
      segments.push(x1, LINE_HEIGHT, z1, x2, LINE_HEIGHT, z2);
    };
    
    // Helper to add a rectangle
    const addRect = (x1, z1, x2, z2) => {
      addLine(x1, z1, x2, z1); // top
      addLine(x2, z1, x2, z2); // right
      addLine(x2, z2, x1, z2); // bottom
      addLine(x1, z2, x1, z1); // left
    };

    // Pitch dimensions (x: 0-120, z: 0 to -80)
    const penaltyAreaDepth = 18;
    const penaltyAreaWidth = 44;
    const goalAreaDepth = 6;
    const goalAreaWidth = 20;
    const centerCircleRadius = 10;
    const penaltySpotDist = 12;
    const cornerArcRadius = 2;
    const centerX = PITCH_WIDTH / 2;  // 60
    const centerZ = -PITCH_HEIGHT / 2; // -40

    // Outer boundary
    addRect(0, 0, PITCH_WIDTH, -PITCH_HEIGHT);
    
    // Center line
    addLine(centerX, 0, centerX, -PITCH_HEIGHT);
    
    // Center circle
    const centerCircle = getCirclePoints(centerX, centerZ, centerCircleRadius, 32);
    segments.push(...pointsToSegments(centerCircle));
    
    // Center spot (small cross)
    addLine(centerX - 0.5, centerZ, centerX + 0.5, centerZ);
    addLine(centerX, centerZ - 0.5, centerX, centerZ + 0.5);

    // Left penalty area (x = 0 side)
    const leftPenaltyTop = centerZ + penaltyAreaWidth / 2;
    const leftPenaltyBottom = centerZ - penaltyAreaWidth / 2;
    addLine(0, leftPenaltyTop, penaltyAreaDepth, leftPenaltyTop);
    addLine(penaltyAreaDepth, leftPenaltyTop, penaltyAreaDepth, leftPenaltyBottom);
    addLine(penaltyAreaDepth, leftPenaltyBottom, 0, leftPenaltyBottom);

    // Left goal area
    const leftGoalTop = centerZ + goalAreaWidth / 2;
    const leftGoalBottom = centerZ - goalAreaWidth / 2;
    addLine(0, leftGoalTop, goalAreaDepth, leftGoalTop);
    addLine(goalAreaDepth, leftGoalTop, goalAreaDepth, leftGoalBottom);
    addLine(goalAreaDepth, leftGoalBottom, 0, leftGoalBottom);

    // Left penalty spot
    addLine(penaltySpotDist - 0.5, centerZ, penaltySpotDist + 0.5, centerZ);
    addLine(penaltySpotDist, centerZ - 0.5, penaltySpotDist, centerZ + 0.5);

    // Left penalty arc (outside penalty area)


    // Right penalty area (x = 120 side)
    const rightPenaltyX = PITCH_WIDTH - penaltyAreaDepth;
    addLine(PITCH_WIDTH, leftPenaltyTop, rightPenaltyX, leftPenaltyTop);
    addLine(rightPenaltyX, leftPenaltyTop, rightPenaltyX, leftPenaltyBottom);
    addLine(rightPenaltyX, leftPenaltyBottom, PITCH_WIDTH, leftPenaltyBottom);

    // Right goal area
    const rightGoalX = PITCH_WIDTH - goalAreaDepth;
    addLine(PITCH_WIDTH, leftGoalTop, rightGoalX, leftGoalTop);
    addLine(rightGoalX, leftGoalTop, rightGoalX, leftGoalBottom);
    addLine(rightGoalX, leftGoalBottom, PITCH_WIDTH, leftGoalBottom);

    // Right penalty spot
    const rightSpotX = PITCH_WIDTH - penaltySpotDist;
    addLine(rightSpotX - 0.5, centerZ, rightSpotX + 0.5, centerZ);
    addLine(rightSpotX, centerZ - 0.5, rightSpotX, centerZ + 0.5);


    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" linewidth={1} />
    </lineSegments>
  );
}

// Animated bar with smooth height transitions
const LERP_SPEED = 8; // Higher = faster animation

function AnimatedBar({ x, z, targetHeight, opacity, color, gridSize }) {
  const meshRef = useRef();
  const currentHeight = useRef(MIN_BAR_HEIGHT);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Lerp current height towards target
    const diff = targetHeight - currentHeight.current;
    if (Math.abs(diff) > 0.001) {
      currentHeight.current += diff * Math.min(delta * LERP_SPEED, 1);
      
      // Update scale (geometry is 1 unit tall, scale to actual height)
      meshRef.current.scale.y = currentHeight.current;
      // Update position (pivot from bottom)
      meshRef.current.position.y = currentHeight.current / 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, targetHeight / 2, z]} scale={[1, targetHeight, 1]}>
      <boxGeometry args={[gridSize - 0.2, 1, gridSize - 0.2]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        polygonOffset
        polygonOffsetFactor={2}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
}

export default function ThreeDGridHeatMap({ gameData, team, color, eventType, minute = 90, flipX = false }) {
  const { gridCounts, gridSize, maxCount } = useGridHeatmapData(gameData, {
    team, eventType, minute, flipX
  });

  const barColorHex = color || '#EF0107';
  const emptyColorHex = '#55B500';

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 300,  }}>
      <Canvas
        camera={{ position: [60, 50, -152], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[60, 80, 40]} intensity={1} />
        <OrbitControls 
          target={[60, 0, -40]} 
          minDistance={40} 
          maxDistance={180} 
          
        />

        {/* Pitch plane - slightly below bars to avoid z-fighting */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[60, PITCH_OFFSET, -40]}>
          <planeGeometry args={[PITCH_WIDTH, PITCH_HEIGHT]} />
          <meshStandardMaterial
            color="#2d5a27"
            polygonOffset
            polygonOffsetFactor={-4}
            polygonOffsetUnits={-4}
          />
        </mesh>

        {/* Pitch lines - single draw call */}
        <PitchLines />

        {/* Grid bars */}
        {gridCounts.map((row, rowIndex) =>
          row.map((count, colIndex) => {
            const x = colIndex * gridSize + gridSize / 2;
            const z = -(rowIndex * gridSize + gridSize / 2);
            const normalized = maxCount > 0 ? count / maxCount : 0;
            const height = count > 0
              ? normalized * MAX_BAR_HEIGHT + MIN_BAR_HEIGHT
              : MIN_BAR_HEIGHT;
            const barOpacity = count > 0 ? normalized * 0.8 + 0.2 : 1;
            const hexColor = count > 0 ? barColorHex : emptyColorHex;

            return (
              <AnimatedBar
                key={`${rowIndex}-${colIndex}`}
                x={x}
                z={z}
                targetHeight={height}
                opacity={barOpacity}
                color={hexColor}
                gridSize={gridSize}
              />
            );
          })
        )}
      </Canvas>
    </div>
  );
}