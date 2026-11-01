import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// Anatomical scale calibration: Canine skeleton cranio-sacral length = ~72 cm
// 3D world length = 3.078 units -> 23.39 cm per Three.js unit
export const CANINE_WORLD_TO_CM = 23.39;

function SimpleLine({ points, color = '#38bdf8', lineWidth = 2 }) {
  const lineObj = useMemo(() => {
    if (!points || points.length < 2) return null;
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      linewidth: lineWidth,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 25;
    return line;
  }, [points, color, lineWidth]);

  useEffect(() => {
    return () => {
      if (lineObj) {
        lineObj.geometry.dispose();
        lineObj.material.dispose();
      }
    };
  }, [lineObj]);

  if (!lineObj) return null;
  return <primitive object={lineObj} />;
}

export default function MeasurementOverlay3D({
  measureMode = 'off',
  points = [],
  theme = 'light'
}) {
  const isLight = theme === 'light';

  // Distance calculations
  const distanceData = useMemo(() => {
    if (measureMode !== 'distance' || points.length < 2) return null;
    const p1 = new THREE.Vector3(...points[0].point);
    const p2 = new THREE.Vector3(...points[1].point);
    const worldDist = p1.distanceTo(p2);
    const distCm = (worldDist * CANINE_WORLD_TO_CM).toFixed(1);
    const distMm = (worldDist * CANINE_WORLD_TO_CM * 10).toFixed(0);

    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    midPoint.y += 0.04;

    return {
      p1,
      p2,
      distCm,
      distMm,
      midPoint,
      bone1: points[0].boneName || 'จุดที่ 1',
      bone2: points[1].boneName || 'จุดที่ 2'
    };
  }, [measureMode, points]);

  // Angle calculations
  const angleData = useMemo(() => {
    if (measureMode !== 'angle' || points.length < 2) return null;

    const p1 = new THREE.Vector3(...points[0].point); // Arm 1
    const p2 = new THREE.Vector3(...points[1].point); // Vertex (Apex)
    const p3 = points[2] ? new THREE.Vector3(...points[2].point) : null; // Arm 2

    const v1 = new THREE.Vector3().subVectors(p1, p2);
    const l1 = v1.length();

    let angleDeg = null;
    let arcPoints = [];
    let badgePos = p2.clone().add(new THREE.Vector3(0, 0.06, 0));

    if (p3) {
      const v2 = new THREE.Vector3().subVectors(p3, p2);
      const l2 = v2.length();

      if (l1 > 1e-4 && l2 > 1e-4) {
        const cosTheta = THREE.MathUtils.clamp(v1.dot(v2) / (l1 * l2), -1, 1);
        const thetaRad = Math.acos(cosTheta);
        angleDeg = (thetaRad * 180) / Math.PI;

        // Construct 3D Arc between v1 and v2 centered at vertex p2
        const arcRadius = THREE.MathUtils.clamp(Math.min(l1, l2) * 0.35, 0.04, 0.22);
        const u1 = v1.clone().normalize();
        const normal = new THREE.Vector3().crossVectors(v1, v2);

        if (normal.lengthSq() > 1e-6) {
          normal.normalize();
          const u2 = new THREE.Vector3().crossVectors(normal, u1).normalize();
          const segments = 24;
          for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * thetaRad;
            const pt = p2
              .clone()
              .add(u1.clone().multiplyScalar(Math.cos(t) * arcRadius))
              .add(u2.clone().multiplyScalar(Math.sin(t) * arcRadius));
            arcPoints.push(pt);
          }
        }
      }
    }

    return {
      p1,
      p2,
      p3,
      angleDeg,
      arcPoints,
      badgePos,
      bone1: points[0].boneName || 'แขนมุม 1',
      bone2: points[1].boneName || 'จุดยอดมุม Vertex',
      bone3: points[2]?.boneName || 'แขนมุม 2'
    };
  }, [measureMode, points]);

  if (measureMode === 'off' || points.length === 0) return null;

  return (
    <group>
      {/* 1. Measurement Points Spheres & Markers */}
      {points.map((pt, index) => {
        const isVertex = measureMode === 'angle' && index === 1;
        const color = isVertex
          ? '#f59e0b'
          : index === 0
          ? '#0284c7'
          : index === 1
          ? '#10b981'
          : '#8b5cf6';

        return (
          <group key={`measure-pt-${index}`} position={pt.point}>
            {/* 3D Sphere on bone surface */}
            <mesh renderOrder={26}>
              <sphereGeometry args={[0.016, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.65}
                roughness={0.2}
                depthTest={false}
              />
            </mesh>

            {/* Glowing outer ring */}
            <mesh renderOrder={25}>
              <ringGeometry args={[0.022, 0.028, 32]} />
              <meshBasicMaterial
                color={color}
                side={THREE.DoubleSide}
                transparent
                opacity={0.75}
                depthTest={false}
              />
            </mesh>

            {/* Point Label Pin */}
            <Html
              center
              position={[0, 0.035, 0]}
              distanceFactor={3.6}
              zIndexRange={[35, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg border text-[10px] font-bold whitespace-nowrap bg-slate-900/90 text-white border-white/20 animate-fade-in backdrop-blur-sm">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {measureMode === 'angle' && index === 1
                    ? '2: ยอดมุม (Vertex)'
                    : `จุดที่ ${index + 1}`}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 2. Distance Mode Visuals */}
      {distanceData && (
        <>
          <SimpleLine
            points={[distanceData.p1, distanceData.p2]}
            color={isLight ? '#0284c7' : '#38bdf8'}
            lineWidth={3}
          />

          {/* Floating Measurement Badge */}
          <Html
            position={distanceData.midPoint}
            center
            distanceFactor={3.8}
            zIndexRange={[40, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-3.5 py-2 rounded-2xl shadow-2xl border text-center whitespace-nowrap animate-fade-in chai-panel border-blue-500/50 min-w-[170px] backdrop-blur-md">
              <div className="text-[10px] font-semibold text-blue-600 dark:text-sky-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <span>📏 ระยะห่างผิวกระดูก</span>
              </div>
              <div className="text-base font-extrabold chai-text-primary mt-0.5 font-mono">
                {distanceData.distCm} <span className="text-xs font-normal">cm</span>
                <span className="text-xs font-semibold chai-text-secondary ml-1.5">
                  ({distanceData.distMm} mm)
                </span>
              </div>
              <div className="text-[10px] chai-text-secondary mt-1 flex items-center justify-center gap-1">
                <span className="truncate max-w-[80px]">{distanceData.bone1}</span>
                <span>⟷</span>
                <span className="truncate max-w-[80px]">{distanceData.bone2}</span>
              </div>
            </div>
          </Html>
        </>
      )}

      {/* 3. Angle Mode Visuals */}
      {angleData && (
        <>
          {/* Arm 1 Line (Vertex -> P1) */}
          <SimpleLine
            points={[angleData.p2, angleData.p1]}
            color={isLight ? '#0284c7' : '#38bdf8'}
            lineWidth={2.5}
          />

          {/* Arm 2 Line (Vertex -> P3) */}
          {angleData.p3 && (
            <SimpleLine
              points={[angleData.p2, angleData.p3]}
              color={isLight ? '#059669' : '#34d399'}
              lineWidth={2.5}
            />
          )}

          {/* Arc Curve between Arm 1 & Arm 2 */}
          {angleData.arcPoints.length > 1 && (
            <SimpleLine
              points={angleData.arcPoints}
              color="#f59e0b"
              lineWidth={3}
            />
          )}

          {/* Angle Badge */}
          {angleData.angleDeg !== null && (
            <Html
              position={angleData.badgePos}
              center
              distanceFactor={3.8}
              zIndexRange={[40, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div className="px-3.5 py-2 rounded-2xl shadow-2xl border text-center whitespace-nowrap animate-fade-in chai-panel border-amber-500/50 min-w-[190px] backdrop-blur-md">
                <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>📐 มุมกระดูก (Orthopedic Angle)</span>
                </div>
                <div className="text-lg font-extrabold text-amber-600 dark:text-amber-300 mt-0.5 font-mono">
                  {angleData.angleDeg.toFixed(1)}°
                </div>

                {/* Quick Clinical Classification Helper */}
                <div className="mt-1 flex items-center justify-center gap-1">
                  {angleData.angleDeg >= 105 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      Norberg ≥ 105° (ปกติ)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                      Norberg &lt; 105° (เสี่ยงสะโพกหลวม)
                    </span>
                  )}
                </div>

                <div className="text-[10px] chai-text-secondary mt-1 flex items-center justify-center gap-1 truncate max-w-[220px]">
                  <span>จุดยอด: {angleData.bone2}</span>
                </div>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  );
}
