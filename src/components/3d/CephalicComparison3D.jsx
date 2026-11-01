import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import {
  CEPHALIC_TYPE_ORDER,
  CEPHALIC_TYPES,
  deformCephalicScenePoint,
  prepareMorphableGeometry,
  applyCephalicMorphToMesh
} from '../../utils/cephalicMorph';

const configureMeshopt = (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

const SPECIMEN_SCALE = 5.0;
const SLOT_X = {
  brachycephalic: -1.22,
  mesocephalic: 0.0,
  dolichocephalic: 1.22
};

function createXrayShaderMaterial(isLight, accentHex) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uBaseColor: { value: new THREE.Color(accentHex || '#0284c7') },
      uRimColor: { value: new THREE.Color(isLight ? '#0f172a' : '#e0f2fe') },
      uCenterOpacity: { value: isLight ? 0.09 : 0.06 },
      uRimOpacity: { value: isLight ? 0.62 : 0.72 },
      uPower: { value: 1.8 }
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uBaseColor;
      uniform vec3 uRimColor;
      uniform float uCenterOpacity;
      uniform float uRimOpacity;
      uniform float uPower;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float ndotv = clamp(abs(dot(normalize(vNormalWorld), viewDir)), 0.0, 1.0);
        float fresnel = pow(1.0 - ndotv, uPower);
        vec3 col = mix(uBaseColor, uRimColor, fresnel);
        float alpha = mix(uCenterOpacity, uRimOpacity, fresnel);
        gl_FragColor = vec4(col, alpha);
      }
    `
  });
}

function CaliperLine({ start, end, color }) {
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      depthTest: false
    });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 12;
    return line;
  }, [start, end, color]);

  useEffect(() => {
    return () => {
      lineObj.geometry.dispose();
      lineObj.material.dispose();
    };
  }, [lineObj]);

  return <primitive object={lineObj} />;
}

export default function CephalicComparison3D({
  theme = 'light',
  activeCephalicType = 'mesocephalic',
  onSelectCephalicType,
  renderMode = 'natural',
  showMandible = true,
  jawOpenDeg = 0,
  showCalipers = true,
  comparisonView = 'dorsal' // 'dorsal' | '3d' | 'lateral' | 'rostral' | 'ventral'
}) {
  const skeletalGltf = useLoader(GLTFLoader, '/models/dog_skeletal.glb', configureMeshopt);
  const [hoveredType, setHoveredType] = useState(null);
  const pedestalRefs = useRef({});

  // Build 3 independent morphed 3D skull + mandible museum rigs
  const specimens = useMemo(() => {
    const src = skeletalGltf.scene;
    src.updateMatrixWorld(true);
    const invRoot = src.matrixWorld.clone().invert();

    let rawSkull = null;
    let rawMandible = null;
    src.traverse((ch) => {
      if (ch.isMesh && ch.name === 'dog_skeletal_skull') rawSkull = ch;
      if (ch.isMesh && ch.name === 'dog_skeletal_mandible') rawMandible = ch;
    });

    if (!rawSkull || !rawMandible) return [];

    const skullSceneMat = invRoot.clone().multiply(rawSkull.matrixWorld);
    const mandibleSceneMat = invRoot.clone().multiply(rawMandible.matrixWorld);

    // Transformation from raw GLTF scene coordinates to horizontal palatal specimen space
    const toHorizontalMat = new THREE.Matrix4()
      .makeTranslation(0, -0.012, 0.095)
      .multiply(new THREE.Matrix4().makeRotationX((20 * Math.PI) / 180))
      .multiply(new THREE.Matrix4().makeTranslation(-0.00085, -0.582, 0.246));

    return CEPHALIC_TYPE_ORDER.map((typeId) => {
      const info = CEPHALIC_TYPES[typeId];

      const skullMesh = rawSkull.clone();
      skullSceneMat.decompose(skullMesh.position, skullMesh.quaternion, skullMesh.scale);
      const skullOrig = prepareMorphableGeometry(skullMesh);
      applyCephalicMorphToMesh(
        skullMesh,
        skullOrig,
        skullSceneMat,
        skullSceneMat.clone().invert(),
        typeId,
        'skull'
      );

      const mandibleMesh = rawMandible.clone();
      mandibleSceneMat.decompose(mandibleMesh.position, mandibleMesh.quaternion, mandibleMesh.scale);
      const mandibleOrig = prepareMorphableGeometry(mandibleMesh);
      applyCephalicMorphToMesh(
        mandibleMesh,
        mandibleOrig,
        mandibleSceneMat,
        mandibleSceneMat.clone().invert(),
        typeId,
        'mandible'
      );

      const hasSkullVC = Boolean(skullMesh.geometry.attributes.color);
      const hasJawVC = Boolean(mandibleMesh.geometry.attributes.color);

      const skullMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f5efe1'),
        roughness: 0.7,
        metalness: 0.02,
        clearcoat: 0.09,
        clearcoatRoughness: 0.5,
        vertexColors: hasSkullVC,
        side: THREE.DoubleSide
      });

      const jawMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#efe7d4'),
        roughness: 0.72,
        metalness: 0.02,
        clearcoat: 0.08,
        clearcoatRoughness: 0.52,
        vertexColors: hasJawVC,
        side: THREE.DoubleSide
      });

      const xrayMat = createXrayShaderMaterial(true, info.accentColor);

      skullMesh.material = skullMat;
      skullMesh.castShadow = true;
      skullMesh.receiveShadow = true;

      mandibleMesh.material = jawMat;
      mandibleMesh.castShadow = true;
      mandibleMesh.receiveShadow = true;

      // Exact morphed TMJ hinge pivot in raw GLTF scene coordinates
      const tmjScene = deformCephalicScenePoint(0.00085, 0.562, -0.295, typeId, 'mandible');

      // Measure exact horizontal specimen bounds (in scaled pedestal local coordinates) for 3D calipers!
      const posAttr = skullMesh.geometry.attributes.position;
      const v = new THREE.Vector3();
      const fullLocalMat = new THREE.Matrix4()
        .makeScale(SPECIMEN_SCALE, SPECIMEN_SCALE, SPECIMEN_SCALE)
        .multiply(new THREE.Matrix4().makeRotationY(Math.PI))
        .multiply(toHorizontalMat)
        .multiply(skullSceneMat);

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
      let zygoZ = 0;
      for (let i = 0; i < posAttr.count; i++) {
        v.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).applyMatrix4(fullLocalMat);
        if (v.x < minX) minX = v.x;
        if (v.x > maxX) {
          maxX = v.x;
          zygoZ = v.z;
        }
        if (v.y < minY) minY = v.y;
        if (v.y > maxY) maxY = v.y;
        if (v.z < minZ) minZ = v.z;
        if (v.z > maxZ) maxZ = v.z;
      }

      const widthMm = ((maxX - minX) / SPECIMEN_SCALE) * 1000;
      const lengthMm = ((maxZ - minZ) / SPECIMEN_SCALE) * 1000;
      const measuredCI = (widthMm / lengthMm) * 100;

      return {
        typeId,
        info,
        skullMesh,
        mandibleMesh,
        skullMat,
        jawMat,
        xrayMat,
        hasSkullVC,
        hasJawVC,
        tmjScene,
        metrics: {
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
          zygoZ,
          widthMm: widthMm.toFixed(0),
          lengthMm: lengthMm.toFixed(0),
          measuredCI: measuredCI.toFixed(1)
        }
      };
    });
  }, [skeletalGltf]);

  // Clean up cloned geometries & materials on unmount
  useEffect(() => {
    return () => {
      for (const sp of specimens) {
        sp.skullMesh.geometry.dispose();
        sp.mandibleMesh.geometry.dispose();
        sp.skullMat.dispose();
        sp.jawMat.dispose();
        sp.xrayMat.dispose();
      }
    };
  }, [specimens]);

  // Update materials reactively for theme, renderMode, hover & active selection
  useEffect(() => {
    const isLight = theme === 'light';
    for (const sp of specimens) {
      const isSelected = activeCephalicType === sp.typeId;
      const isHovered = hoveredType === sp.typeId;

      sp.mandibleMesh.visible = showMandible;

      if (renderMode === 'xray') {
        sp.xrayMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
        sp.xrayMat.uniforms.uBaseColor.value.set(sp.info.accentColor);
        sp.xrayMat.uniforms.uRimColor.value.set(isLight ? '#0f172a' : '#f8fafc');
        sp.xrayMat.uniforms.uCenterOpacity.value = isSelected ? 0.14 : 0.06;
        sp.xrayMat.uniforms.uRimOpacity.value = isSelected ? 0.85 : 0.58;
        sp.skullMesh.material = sp.xrayMat;
        sp.mandibleMesh.material = sp.xrayMat;
      } else {
        sp.skullMesh.material = sp.skullMat;
        sp.mandibleMesh.material = sp.jawMat;

        const wire = renderMode === 'wireframe';
        sp.skullMat.wireframe = wire;
        sp.jawMat.wireframe = wire;
        sp.skullMat.vertexColors = wire ? false : sp.hasSkullVC;
        sp.jawMat.vertexColors = wire ? false : sp.hasJawVC;

        if (renderMode === 'colored') {
          sp.skullMat.color.set(sp.info.accentColor);
          sp.jawMat.color.set(sp.info.accentColor).offsetHSL(0, -0.08, 0.14);
        } else if (wire) {
          sp.skullMat.color.set(sp.info.accentColor);
          sp.jawMat.color.set(sp.info.accentColor);
        } else {
          sp.skullMat.color.set(isLight ? '#f6efe0' : '#f2ead8');
          sp.jawMat.color.set(isLight ? '#eee5d1' : '#e8dec8');
        }

        if (isSelected || isHovered) {
          sp.skullMat.emissive.set(sp.info.accentColor);
          sp.jawMat.emissive.set(sp.info.accentColor);
          sp.skullMat.emissiveIntensity = isHovered ? 0.16 : 0.09;
          sp.jawMat.emissiveIntensity = isHovered ? 0.14 : 0.07;
        } else {
          sp.skullMat.emissive.set('#000000');
          sp.jawMat.emissive.set('#000000');
          sp.skullMat.emissiveIntensity = 0;
          sp.jawMat.emissiveIntensity = 0;
        }
        sp.skullMat.needsUpdate = true;
        sp.jawMat.needsUpdate = true;
      }
    }
  }, [specimens, theme, renderMode, activeCephalicType, hoveredType, showMandible]);

  // Smoothly animate pedestal yaw (-90 deg in Side-by-Side Lateral view so all 3 profiles face forward cleanly!)
  const targetYaw = comparisonView === 'lateral' ? -Math.PI / 2 : 0;
  useFrame((_, delta) => {
    const step = 1 - Math.exp(-8 * delta);
    for (const typeId of CEPHALIC_TYPE_ORDER) {
      const grp = pedestalRefs.current[typeId];
      if (grp) {
        grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, targetYaw, step);
      }
    }
  });

  const jawOpenRad = (jawOpenDeg * Math.PI) / 180;

  return (
    <group>
      {/* Dedicated Multi-Angle Museum Skull Showcase Lighting (illuminates Dorsal, Front, Lateral & Ventral Palate evenly) */}
      <directionalLight
        position={[1.6, 5.2, 4.6]}
        intensity={theme === 'light' ? 1.35 : 1.55}
        color="#fffdf7"
      />
      <directionalLight
        position={[-2.8, 3.4, 3.8]}
        intensity={theme === 'light' ? 0.85 : 0.95}
        color="#f0f9ff"
      />
      <directionalLight
        position={[0, -4.2, 2.0]}
        intensity={0.72}
        color="#fffbeb"
      />

      {specimens.map((sp) => {
        const slotX = SLOT_X[sp.typeId];
        const isSelected = activeCephalicType === sp.typeId;
        const { minX, maxX, maxY, minZ, maxZ, zygoZ, widthMm, lengthMm, measuredCI } = sp.metrics;

        return (
          <group
            key={sp.typeId}
            position={[slotX, 0.12, -0.05]}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              setHoveredType(sp.typeId);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
              setHoveredType(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectCephalicType) onSelectCephalicType(sp.typeId);
            }}
          >
            {/* Subtle Studio Specimen Halo Ring beneath each skull */}
            <mesh position={[0, -0.46, 0.08]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
              <ringGeometry args={[0.42, isSelected ? 0.48 : 0.445, 64]} />
              <meshBasicMaterial
                color={sp.info.accentColor}
                transparent
                opacity={isSelected ? 0.72 : 0.24}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Rotating Pedestal (rotates -90 deg in Lateral Profile mode so all 3 skulls show side profile without overlap!) */}
            <group ref={(el) => (pedestalRefs.current[sp.typeId] = el)}>
              <group scale={SPECIMEN_SCALE} rotation={[0, Math.PI, 0]}>
                <group position={[0, -0.012, 0.095]}>
                  <group rotation={[(20 * Math.PI) / 180, 0, 0]}>
                    <group position={[-0.00085, -0.582, 0.246]}>
                      {/* Cranium */}
                      <primitive object={sp.skullMesh} />

                      {/* Articulated Mandible with real-time TMJ hinge rotation */}
                      <group position={sp.tmjScene}>
                        <group rotation={[-jawOpenRad, 0, 0]}>
                          <group
                            position={[
                              -sp.tmjScene[0],
                              -sp.tmjScene[1],
                              -sp.tmjScene[2]
                            ]}
                          >
                            <primitive object={sp.mandibleMesh} />
                          </group>
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>

              {/* 3D Osteometric Calipers: Bizygomatic Breadth (W) & Total Cranial Length (L) */}
              {showCalipers && (
                <group>
                  {/* Bizygomatic Width Line (W) */}
                  <CaliperLine
                    start={[minX, maxY + 0.04, zygoZ]}
                    end={[maxX, maxY + 0.04, zygoZ]}
                    color={sp.info.accentColor}
                  />
                  {/* Cranial Length Line (L) */}
                  <CaliperLine
                    start={[0, maxY + 0.06, minZ]}
                    end={[0, maxY + 0.06, maxZ]}
                    color={theme === 'light' ? '#0f172a' : '#fbbf24'}
                  />
                </group>
              )}
            </group>

            {/* Poster-Style 3D Specimen Plaque Label (Scientifically Accurate Definitions!) */}
            <Html
              position={[0, -0.58, 0.34]}
              center
              distanceFactor={4.1}
              zIndexRange={[20, 0]}
            >
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (onSelectCephalicType) onSelectCephalicType(sp.typeId);
                }}
                className={`px-3.5 py-2 rounded-2xl text-center transition-all border shadow-lg min-w-[205px] ${
                  isSelected
                    ? 'chai-panel ring-2 scale-105'
                    : 'chai-panel opacity-90 hover:opacity-100'
                }`}
                style={{
                  borderColor: isSelected ? sp.info.accentColor : undefined,
                  boxShadow: isSelected ? `0 8px 26px -6px ${sp.info.accentColor}55` : undefined
                }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sp.info.accentColor }}
                  />
                  <span className="text-sm font-extrabold tracking-tight chai-text-primary">
                    {sp.info.nameEn}
                  </span>
                </div>
                <div className="text-[11px] font-bold mt-0.5" style={{ color: sp.info.accentColor }}>
                  {sp.info.headShapeEn} · {sp.info.shortTh}
                </div>
                <div className="text-[10px] font-mono chai-text-secondary mt-0.5">
                  CI ≈ {measuredCI} (กว้าง {widthMm} / ยาว {lengthMm} มม.)
                </div>
                <div className="text-[10px] chai-text-muted mt-0.5 max-w-[210px] truncate">
                  เช่น {sp.info.breedsEn.slice(0, 4).join(', ')}
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
