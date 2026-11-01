import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Bvh, Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import { CANINE_BONES, MESH_TO_BONE_MAP, BONE_BY_ID } from '../../data/canineSkeletonData';
import {
  prepareMorphableGeometry,
  applyCephalicMorphToMesh
} from '../../utils/cephalicMorph';

export const MODEL_SCALE = 3.8;
export const MODEL_Y_OFFSET = -1.14;

const configureMeshopt = (loader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

// Key structures shown when "3D Callout Pins" is enabled in overview
const LANDMARK_PIN_IDS = [
  'skull',
  'mandible',
  'atlas',
  'axis',
  'vertebrae-thoracic',
  'vertebrae-lumbar',
  'sacrum',
  'ribs',
  'manubrium',
  'scapula',
  'humerus',
  'radius',
  'ulna',
  'carpus',
  'os-coxae',
  'femur',
  'patella',
  'tibia',
  'tarsus',
  'os-penis'
];

// Custom Fresnel Silhouette Shader for Canine Body Contour & Clinical X-Ray Mode
function createFresnelShaderMaterial({
  baseColor = '#38bdf8',
  rimColor = '#e0f2fe',
  centerOpacity = 0.025,
  rimOpacity = 0.34,
  fresnelPower = 2.4,
  additive = false
}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uBaseColor: { value: new THREE.Color(baseColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uCenterOpacity: { value: centerOpacity },
      uRimOpacity: { value: rimOpacity },
      uPower: { value: fresnelPower },
      uClipEnabled: { value: 0.0 },
      uClipNormal: { value: new THREE.Vector3(1, 0, 0) },
      uClipConstant: { value: 0.0 }
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
      uniform float uClipEnabled;
      uniform vec3 uClipNormal;
      uniform float uClipConstant;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      void main() {
        if (uClipEnabled > 0.5 && (dot(vWorldPos, uClipNormal) + uClipConstant) < 0.0) {
          discard;
        }
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

// Compute anatomically natural world-space explosion vector for each of the 115 bones
function computeAnatomicalExplodeVector(boneId, side, worldCenter) {
  const [wx, wy, wz] = worldCenter;
  let dx = 0;
  let dy = 0;
  let dz = 0;

  // Axial vs Appendicular logic (remember: Cranial = -Z, Caudal = +Z, Left = -X, Right = +X, Dorsal = +Y)
  if (boneId === 'skull') {
    dy = 0.34;
    dz = -0.62;
  } else if (boneId === 'mandible') {
    dy = -0.36;
    dz = -0.52;
  } else if (boneId === 'hyoid') {
    dy = -0.14;
    dz = -0.32;
  } else if (
    boneId === 'atlas' ||
    boneId === 'axis' ||
    boneId === 'vertebrae-cervical' ||
    boneId === 'vertebra-c7' ||
    boneId === 'vertebrae-thoracic' ||
    boneId === 'vertebra-l1' ||
    boneId === 'vertebrae-lumbar' ||
    boneId === 'sacrum' ||
    boneId === 'vertebrae-caudal'
  ) {
    dy = 0.34 + Math.max(0, wy) * 0.18;
    dz = (wz + 0.08) * 0.72;
  } else if (boneId === 'manubrium' || boneId === 'sternum') {
    dy = -0.52;
    dz = (wz + 0.12) * 0.45;
  } else if (boneId === 'ribs') {
    const signX = side === 'L' ? -1 : 1;
    dx = signX * (0.48 + Math.abs(wx) * 1.15);
    dy = 0.06;
    dz = (wz + 0.15) * 0.38;
  } else if (boneId === 'os-penis') {
    dy = -0.42;
    dz = 0.18;
  } else {
    // Thoracic & Pelvic Paired Limbs
    const signX = side === 'L' ? -1 : side === 'R' ? 1 : Math.sign(wx || 1);
    const tierOffset =
      boneId === 'scapula' || boneId === 'os-coxae' ? 0.38 :
      boneId === 'humerus' || boneId === 'femur' ? 0.62 :
      boneId === 'patella' ? 0.88 :
      boneId === 'radius' || boneId === 'tibia' ? 0.78 :
      boneId === 'ulna' || boneId === 'fibula' ? 0.96 :
      boneId === 'carpus' || boneId === 'tarsus' ? 0.92 :
      boneId === 'metacarpus' || boneId === 'metatarsus' ? 1.05 : 1.18;

    dx = signX * tierOffset;
    dy = (wy - 0.05) * 0.28;
    dz = (wz + 0.08) * 0.34;
    if (boneId === 'patella') {
      dz -= 0.22;
    }
  }

  return new THREE.Vector3(dx, dy, dz);
}

export default function CanineSkeletonModel({
  theme = 'light',
  cephalicType = 'mesocephalic',
  selectedBoneId,
  selectedMeshName,
  onSelectBone,
  hoveredBoneId,
  onHoverBone,
  explodeProgress = 0,
  renderMode = 'natural',
  bodyContourMode = 'ghost', // 'ghost' | 'wire' | 'off'
  isolatedMode = false,
  ghostOpacity = 0.14,
  hiddenBoneIds = [],
  showLabels3D = false,
  clippingConfig = { enabled: false, axis: 'x', position: 0, invert: false, showHelper: true },
  measureMode = 'off',
  onMeasureClick,
  onBoundsComputed
}) {
  const { gl } = useThree();
  const rootGroupRef = useRef();
  const [hoveredSubPiece, setHoveredSubPiece] = useState(null);

  // Enable WebGL local clipping planes
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // Load real 115-part Canine Skeleton GLB + Canine Integumentary Skin Silhouette GLB
  const skeletalGltf = useLoader(GLTFLoader, '/models/dog_skeletal.glb', configureMeshopt);
  const integumentaryGltf = useLoader(GLTFLoader, '/models/dog_integumentary.glb', configureMeshopt);

  // Shared world clipping plane updated reactively
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), []);

  useEffect(() => {
    const sign = clippingConfig.invert ? -1 : 1;
    if (clippingConfig.axis === 'x') {
      clippingPlane.normal.set(sign, 0, 0);
      clippingPlane.constant = -sign * clippingConfig.position;
    } else if (clippingConfig.axis === 'y') {
      clippingPlane.normal.set(0, sign, 0);
      clippingPlane.constant = -sign * clippingConfig.position;
    } else {
      clippingPlane.normal.set(0, 0, sign);
      clippingPlane.constant = -sign * clippingConfig.position;
    }
  }, [clippingConfig, clippingPlane]);

  // Clone scenes & create cortical bone materials for all 115 bone meshes
  const preparedData = useMemo(() => {
    const sourceScene = skeletalGltf.scene.clone(true);
    const skinScene = integumentaryGltf.scene.clone(true);

    // Apply model transform onto temporary wrapper to compute exact scene-world bounding boxes
    const tempWrapper = new THREE.Group();
    tempWrapper.scale.setScalar(MODEL_SCALE);
    tempWrapper.position.set(0, MODEL_Y_OFFSET, 0);
    tempWrapper.add(sourceScene);
    tempWrapper.updateMatrixWorld(true);
    const invSourceRoot = sourceScene.matrixWorld.clone().invert();

    const meshEntries = [];
    const morphTargets = [];
    const boundsMeshes = {};
    const boneBoxes = {};

    sourceScene.traverse((child) => {
      if (!child.isMesh) return;

      // Prepare morphable Float32 buffers for Skull, Mandible & Hyoid on standard 115-bone model
      const partType =
        child.name === 'dog_skeletal_skull'
          ? 'skull'
          : child.name === 'dog_skeletal_mandible'
          ? 'mandible'
          : child.name === 'dog_skeletal_hyoid'
          ? 'hyoid'
          : null;
      if (partType) {
        const origLocalPositions = prepareMorphableGeometry(child);
        const sceneMatrix = invSourceRoot.clone().multiply(child.matrixWorld);
        morphTargets.push({
          mesh: child,
          partType,
          boneId: partType,
          origLocalPositions,
          sceneMatrix,
          invSceneMatrix: sceneMatrix.clone().invert()
        });
      }

      const geom = child.geometry;
      if (geom && !geom.attributes.normal) {
        geom.computeVertexNormals();
      } else if (
        geom &&
        geom.attributes.normal &&
        geom.attributes.normal.array instanceof Int8Array &&
        geom.attributes.normal.getX(0) === 0 &&
        geom.attributes.normal.getY(0) === 0 &&
        geom.attributes.normal.getZ(0) === 0
      ) {
        // Self-heal if cached GLB normal buffer was ever zeroed during hot-reload
        const c = geom.attributes.position.count;
        geom.deleteAttribute('normal');
        geom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(c * 3), 3));
        geom.computeVertexNormals();
      }
      const hasVertexColors = Boolean(geom && geom.attributes && geom.attributes.color);

      // Map GLB node name -> Bone Structure
      const meta = MESH_TO_BONE_MAP[child.name];
      if (!meta) return;

      // Compute exact scene-world bounding box
      const wBox = new THREE.Box3().setFromObject(child);
      const wCenter = new THREE.Vector3();
      const wSize = new THREE.Vector3();
      wBox.getCenter(wCenter);
      wBox.getSize(wSize);
      const radius = wSize.length() * 0.5;

      boundsMeshes[child.name] = {
        center: [wCenter.x, wCenter.y, wCenter.z],
        size: [wSize.x, wSize.y, wSize.z],
        radius
      };

      if (!boneBoxes[meta.boneId]) {
        boneBoxes[meta.boneId] = wBox.clone();
      } else {
        boneBoxes[meta.boneId].union(wBox);
      }

      // Dedicated physical cortical bone material + X-ray shader per mesh
      const physicalMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f5efe1'),
        roughness: 0.72,
        metalness: 0.02,
        clearcoat: 0.08,
        clearcoatRoughness: 0.55,
        vertexColors: hasVertexColors,
        side: THREE.DoubleSide
      });

      const xrayMat = createFresnelShaderMaterial({
        baseColor: '#0284c7',
        rimColor: '#f0f9ff',
        centerOpacity: 0.06,
        rimOpacity: 0.68,
        fresnelPower: 1.75,
        additive: true
      });

      child.material = physicalMat;
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.atlasMeta = meta;

      const origWorldPos = new THREE.Vector3();
      child.getWorldPosition(origWorldPos);

      meshEntries.push({
        mesh: child,
        meta,
        hasVertexColors,
        physicalMat,
        xrayMat,
        origLocalPos: child.position.clone(),
        origWorldPos,
        restCenterWorld: [wCenter.x, wCenter.y, wCenter.z],
        explodeWorldVec: computeAnatomicalExplodeVector(
          meta.boneId,
          meta.side,
          [wCenter.x, wCenter.y, wCenter.z]
        )
      });
    });

    // Aggregate bone-level bounding boxes
    const boundsBones = {};
    for (const [boneId, box] of Object.entries(boneBoxes)) {
      const c = new THREE.Vector3();
      const s = new THREE.Vector3();
      box.getCenter(c);
      box.getSize(s);
      boundsBones[boneId] = {
        center: [c.x, c.y, c.z],
        size: [s.x, s.y, s.z],
        radius: s.length() * 0.5
      };
    }

    // Detach sourceScene from tempWrapper so React <primitive> mounts it cleanly
    tempWrapper.remove(sourceScene);

    // Prepare Canine Body Silhouette (strictly skin + claws only; hide eyes)
    skinScene.updateMatrixWorld(true);
    const invSkinRoot = skinScene.matrixWorld.clone().invert();
    const skinMaterials = [];
    skinScene.traverse((child) => {
      if (!child.isMesh) return;
      if (child.name.includes('eyes')) {
        child.visible = false;
        return;
      }
      if (child.name.includes('skin')) {
        const origLocalPositions = prepareMorphableGeometry(child);
        const sceneMatrix = invSkinRoot.clone().multiply(child.matrixWorld);
        morphTargets.push({
          mesh: child,
          partType: 'skin',
          boneId: null,
          origLocalPositions,
          sceneMatrix,
          invSceneMatrix: sceneMatrix.clone().invert()
        });
      }
      if (child.geometry && !child.geometry.attributes.normal) {
        child.geometry.computeVertexNormals();
      }
      const isClaw = child.name.includes('claws');
      const mat = createFresnelShaderMaterial({
        baseColor: isClaw ? '#64748b' : '#3b82f6',
        rimColor: isClaw ? '#cbd5e1' : '#93c5fd',
        centerOpacity: isClaw ? 0.14 : 0.02,
        rimOpacity: isClaw ? 0.42 : 0.28,
        fresnelPower: isClaw ? 1.8 : 2.5,
        additive: false
      });
      child.material = mat;
      child.renderOrder = 4;
      // Never intercept pointer raycasts meant for underlying skeleton bones!
      child.raycast = () => null;
      skinMaterials.push({ mesh: child, mat, isClaw });
    });

    return {
      sourceScene,
      skinScene,
      meshEntries,
      morphTargets,
      skinMaterials,
      bounds: { bones: boundsBones, meshes: boundsMeshes }
    };
  }, [skeletalGltf, integumentaryGltf]);

  // Apply real-time 3D Craniofacial Morphometry (Brachycephalic / Mesocephalic / Dolichocephalic)
  // to Skull, Mandible, Hyoid, and Body Contour Skin while keeping C1 Atlas & TMJ 100% articulated!
  useEffect(() => {
    if (preparedData.morphTargets?.length) {
      const worldWrapperMat = new THREE.Matrix4()
        .makeTranslation(0, MODEL_Y_OFFSET, 0)
        .multiply(new THREE.Matrix4().makeScale(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE));

      for (const target of preparedData.morphTargets) {
        applyCephalicMorphToMesh(
          target.mesh,
          target.origLocalPositions,
          target.sceneMatrix,
          target.invSceneMatrix,
          cephalicType,
          target.partType
        );

        // Refresh world-space bounds & callout pin center for morphed skull/mandible/hyoid
        if (target.boneId && target.mesh.geometry.boundingBox) {
          const fullMat = worldWrapperMat.clone().multiply(target.sceneMatrix);
          const wBox = target.mesh.geometry.boundingBox.clone().applyMatrix4(fullMat);
          const c = new THREE.Vector3();
          const s = new THREE.Vector3();
          wBox.getCenter(c);
          wBox.getSize(s);
          const bInfo = {
            center: [c.x, c.y, c.z],
            size: [s.x, s.y, s.z],
            radius: s.length() * 0.5
          };
          preparedData.bounds.bones[target.boneId] = bInfo;
          preparedData.bounds.meshes[target.mesh.name] = bInfo;
          const entry = preparedData.meshEntries.find((m) => m.mesh === target.mesh);
          if (entry) {
            entry.restCenterWorld = [c.x, c.y, c.z];
          }
        }
      }
    }

    if (onBoundsComputed && preparedData.bounds) {
      onBoundsComputed({
        bones: { ...preparedData.bounds.bones },
        meshes: { ...preparedData.bounds.meshes }
      });
    }
  }, [preparedData, cephalicType, onBoundsComputed]);

  // Dispose custom materials cleanly on unmount
  useEffect(() => {
    return () => {
      for (const entry of preparedData.meshEntries) {
        entry.physicalMat.dispose();
        entry.xrayMat.dispose();
      }
      for (const s of preparedData.skinMaterials) {
        s.mat.dispose();
      }
      for (const t of preparedData.morphTargets || []) {
        t.mesh.geometry?.dispose();
      }
    };
  }, [preparedData]);

  // Reactively update bone materials for selection, sub-piece focus, hover, renderMode, isolation & clipping
  useEffect(() => {
    const activePlanes = clippingConfig.enabled ? [clippingPlane] : [];
    const isLight = theme === 'light';

    for (const entry of preparedData.meshEntries) {
      const { mesh, meta, hasVertexColors, physicalMat, xrayMat } = entry;
      const isHidden = hiddenBoneIds.includes(meta.boneId);

      if (isHidden) {
        mesh.visible = false;
        continue;
      }

      const isBoneSelected = selectedBoneId === meta.boneId;
      const isExactSubPiece = selectedMeshName
        ? selectedMeshName === meta.meshName
        : isBoneSelected;
      const isHoveredMesh = hoveredSubPiece?.meshName === meta.meshName;
      const isHoveredBone = !hoveredSubPiece && hoveredBoneId === meta.boneId;

      const isDimmedByIsolation = isolatedMode && Boolean(selectedBoneId) && !isBoneSelected;
      if (isDimmedByIsolation && ghostOpacity <= 0.015) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;

      if (renderMode === 'xray') {
        mesh.material = xrayMat;
        xrayMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

        if (isExactSubPiece) {
          xrayMat.uniforms.uBaseColor.value.set(isLight ? '#1d4ed8' : '#f59e0b');
          xrayMat.uniforms.uRimColor.value.set(isLight ? '#1e3a8a' : '#fef08a');
          xrayMat.uniforms.uCenterOpacity.value = isLight ? 0.28 : 0.18;
          xrayMat.uniforms.uRimOpacity.value = 0.92;
        } else if (isBoneSelected) {
          xrayMat.uniforms.uBaseColor.value.set('#0284c7');
          xrayMat.uniforms.uRimColor.value.set('#bae6fd');
          xrayMat.uniforms.uCenterOpacity.value = 0.14;
          xrayMat.uniforms.uRimOpacity.value = 0.72;
        } else if (isHoveredMesh || isHoveredBone) {
          xrayMat.uniforms.uBaseColor.value.set('#0ea5e9');
          xrayMat.uniforms.uRimColor.value.set('#e0f2fe');
          xrayMat.uniforms.uCenterOpacity.value = 0.14;
          xrayMat.uniforms.uRimOpacity.value = 0.78;
        } else {
          xrayMat.uniforms.uBaseColor.value.set(isLight ? '#334155' : '#0369a1');
          xrayMat.uniforms.uRimColor.value.set(isLight ? '#0f172a' : '#bae6fd');
          xrayMat.uniforms.uCenterOpacity.value = isDimmedByIsolation ? 0.015 : isLight ? 0.06 : 0.045;
          xrayMat.uniforms.uRimOpacity.value = isDimmedByIsolation ? 0.10 : isLight ? 0.48 : 0.56;
        }

        xrayMat.uniforms.uClipEnabled.value = clippingConfig.enabled ? 1.0 : 0.0;
        xrayMat.uniforms.uClipNormal.value.copy(clippingPlane.normal);
        xrayMat.uniforms.uClipConstant.value = clippingPlane.constant;
      } else {
        mesh.material = physicalMat;
        physicalMat.clippingPlanes = activePlanes;
        physicalMat.wireframe = renderMode === 'wireframe';
        physicalMat.vertexColors = renderMode === 'wireframe' ? false : hasVertexColors;

        // Base color by mode
        if (renderMode === 'colored') {
          physicalMat.color.set(meta.bone.color);
          physicalMat.roughness = 0.62;
        } else if (renderMode === 'wireframe') {
          physicalMat.color.set(isExactSubPiece ? '#f59e0b' : isLight ? '#1e3a8a' : '#38bdf8');
          physicalMat.roughness = 0.5;
        } else {
          // Natural Museum Cortical Bone Studio
          physicalMat.color.set(isLight ? '#f6f0e2' : '#f1ead8');
          physicalMat.roughness = 0.73;
        }

        // Highlighting for selection & hover
        if (isExactSubPiece) {
          if (renderMode === 'natural') {
            physicalMat.color.set(isLight ? '#dbeafe' : '#fef3c7');
          }
          physicalMat.emissive.set(isLight ? '#1d4ed8' : '#d97706');
          physicalMat.emissiveIntensity = isLight ? 0.30 : 0.36;
        } else if (isBoneSelected) {
          // Sibling sub-piece of the selected multi-mesh bone
          physicalMat.emissive.set('#0284c7');
          physicalMat.emissiveIntensity = 0.14;
        } else if (isHoveredMesh || isHoveredBone) {
          physicalMat.emissive.set(isLight ? '#2563eb' : '#38bdf8');
          physicalMat.emissiveIntensity = 0.22;
        } else {
          physicalMat.emissive.set('#000000');
          physicalMat.emissiveIntensity = 0;
        }

        // Ghosting / Isolation transparency
        if (isDimmedByIsolation) {
          physicalMat.transparent = true;
          physicalMat.opacity = ghostOpacity;
          physicalMat.depthWrite = false;
        } else {
          physicalMat.transparent = false;
          physicalMat.opacity = 1.0;
          physicalMat.depthWrite = true;
        }
        physicalMat.needsUpdate = true;
      }
    }

    // Update Canine Body Contour layer
    for (const s of preparedData.skinMaterials) {
      if (bodyContourMode === 'off') {
        s.mesh.visible = false;
        continue;
      }
      s.mesh.visible = true;
      s.mat.wireframe = bodyContourMode === 'wire';
      if (isLight) {
        s.mat.uniforms.uBaseColor.value.set(s.isClaw ? '#475569' : '#2563eb');
        s.mat.uniforms.uRimColor.value.set(s.isClaw ? '#1e293b' : '#1d4ed8');
        s.mat.uniforms.uCenterOpacity.value = bodyContourMode === 'wire' ? 0.08 : s.isClaw ? 0.16 : 0.018;
        s.mat.uniforms.uRimOpacity.value = bodyContourMode === 'wire' ? 0.22 : s.isClaw ? 0.38 : 0.24;
      } else {
        s.mat.uniforms.uBaseColor.value.set(s.isClaw ? '#94a3b8' : '#0284c7');
        s.mat.uniforms.uRimColor.value.set(s.isClaw ? '#e2e8f0' : '#7dd3fc');
        s.mat.uniforms.uCenterOpacity.value = bodyContourMode === 'wire' ? 0.08 : s.isClaw ? 0.14 : 0.022;
        s.mat.uniforms.uRimOpacity.value = bodyContourMode === 'wire' ? 0.24 : s.isClaw ? 0.36 : 0.28;
      }
      s.mat.uniforms.uClipEnabled.value = clippingConfig.enabled ? 1.0 : 0.0;
      s.mat.uniforms.uClipNormal.value.copy(clippingPlane.normal);
      s.mat.uniforms.uClipConstant.value = clippingPlane.constant;
    }
  }, [
    preparedData,
    theme,
    selectedBoneId,
    selectedMeshName,
    hoveredBoneId,
    hoveredSubPiece,
    renderMode,
    bodyContourMode,
    isolatedMode,
    ghostOpacity,
    hiddenBoneIds,
    clippingConfig,
    clippingPlane
  ]);

  // Smoothly animate Exploded View across all 115 individual bone meshes
  const currentExplodeRef = useRef(0);
  const tempWorldTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const diff = Math.abs(currentExplodeRef.current - explodeProgress);
    if (diff < 0.0005 && explodeProgress === currentExplodeRef.current) return;

    const nextVal = diff < 0.001
      ? explodeProgress
      : THREE.MathUtils.lerp(currentExplodeRef.current, explodeProgress, 1 - Math.exp(-9 * delta));
    currentExplodeRef.current = nextVal;

    for (const entry of preparedData.meshEntries) {
      if (nextVal <= 0.0005) {
        entry.mesh.position.copy(entry.origLocalPos);
      } else if (entry.mesh.parent) {
        tempWorldTarget
          .copy(entry.origWorldPos)
          .addScaledVector(entry.explodeWorldVec, nextVal);
        entry.mesh.parent.worldToLocal(tempWorldTarget);
        entry.mesh.position.copy(tempWorldTarget);
      }
    }
  });

  // Pointer interaction handlers (via fast BVH raycast)
  const handlePointerOver = (e) => {
    e.stopPropagation();
    const meta = e.object?.userData?.atlasMeta;
    if (!meta) return;
    document.body.style.cursor = measureMode !== 'off' ? 'crosshair' : 'pointer';
    setHoveredSubPiece(meta);
    if (onHoverBone) onHoverBone(meta.boneId);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setHoveredSubPiece(null);
    if (onHoverBone) onHoverBone(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const meta = e.object?.userData?.atlasMeta;
    if (!meta) return;

    // Measurement tool takes precedence when active
    if (measureMode !== 'off' && onMeasureClick) {
      onMeasureClick({
        point: [e.point.x, e.point.y, e.point.z],
        boneId: meta.boneId,
        boneName: meta.bone.nameTh,
        meshName: meta.meshName
      });
      return;
    }

    if (onSelectBone) {
      // If structure has multiple sub-pieces and is already selected, clicking a specific rib/vertebra/L-R selects that sub-piece;
      // clicking a new structure selects the structure AND remembers which sub-piece was clicked!
      const passSubPiece = meta.bone.meshes.length > 1 ? meta.meshName : null;
      onSelectBone(meta.boneId, passSubPiece);
    }
  };

  // Compute current world position for hovered tooltip & 3D pins (accounting for explodeProgress)
  const getDisplacedAnchor = (boneId, meshName = null) => {
    if (meshName) {
      const entry = preparedData.meshEntries.find((m) => m.meta.meshName === meshName);
      if (entry) {
        return [
          entry.restCenterWorld[0] + entry.explodeWorldVec.x * explodeProgress,
          entry.restCenterWorld[1] + entry.explodeWorldVec.y * explodeProgress + 0.08,
          entry.restCenterWorld[2] + entry.explodeWorldVec.z * explodeProgress
        ];
      }
    }
    const bBound = preparedData.bounds.bones[boneId];
    if (!bBound) return [0, 0.3, 0];
    const rep = preparedData.meshEntries.find((m) => m.meta.boneId === boneId);
    const ev = rep ? rep.explodeWorldVec : new THREE.Vector3();
    return [
      bBound.center[0] + ev.x * explodeProgress,
      bBound.center[1] + ev.y * explodeProgress + 0.06,
      bBound.center[2] + ev.z * explodeProgress
    ];
  };

  return (
    <group ref={rootGroupRef}>
      {/* Bvh accelerates raycasting across 230k+ triangles to <0.2ms */}
      <Bvh key={cephalicType} firstHitOnly>
        <group
          scale={MODEL_SCALE}
          position={[0, MODEL_Y_OFFSET, 0]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <primitive object={preparedData.sourceScene} />
        </group>
      </Bvh>

      {/* Translucent Canine Body Silhouette Contour (Skin + Claws only, only shown when not exploded) */}
      {explodeProgress < 0.08 && !isolatedMode && (
        <group
          scale={MODEL_SCALE}
          position={[0, MODEL_Y_OFFSET, 0]}
        >
          <primitive object={preparedData.skinScene} />
        </group>
      )}

      {/* Visual 3D Cross-Section Slicer Plane Frame */}
      {clippingConfig.enabled && clippingConfig.showHelper && (
        <mesh
          position={[
            clippingConfig.axis === 'x' ? clippingConfig.position : 0,
            clippingConfig.axis === 'y' ? clippingConfig.position : 0.08,
            clippingConfig.axis === 'z' ? clippingConfig.position : -0.08
          ]}
          rotation={[
            clippingConfig.axis === 'y' ? Math.PI / 2 : 0,
            clippingConfig.axis === 'x' ? Math.PI / 2 : 0,
            0
          ]}
          raycast={() => null}
        >
          <planeGeometry args={[2.6, 2.6]} />
          <meshBasicMaterial
            color={theme === 'light' ? '#2563eb' : '#38bdf8'}
            transparent
            opacity={0.09}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Instant 3D Hover Callout Pill */}
      {hoveredSubPiece && (
        <Html
          position={getDisplacedAnchor(hoveredSubPiece.boneId, hoveredSubPiece.meshName)}
          center
          style={{ pointerEvents: 'none' }}
          zIndexRange={[30, 0]}
        >
          <div className="px-3 py-1.5 rounded-xl chai-panel border border-blue-500/40 shadow-xl whitespace-nowrap text-xs animate-fade-in">
            <div className="font-bold flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: hoveredSubPiece.bone.color }}
              />
              <span>{hoveredSubPiece.bone.nameTh}</span>
              <span className="opacity-65 font-normal text-[11px]">
                ({hoveredSubPiece.bone.nameLatin.split(' (')[0]})
              </span>
            </div>
            {hoveredSubPiece.bone.meshes.length > 1 && (
              <div className="text-[10px] font-medium text-blue-600 dark:text-sky-400 mt-0.5">
                ชิ้นย่อย: {hoveredSubPiece.labelTh} · {hoveredSubPiece.labelEn}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Interactive 3D Anatomical Callout Pins (CHAi Atlas Style) */}
      {showLabels3D &&
        LANDMARK_PIN_IDS.filter((id) => !hiddenBoneIds.includes(id)).map((boneId) => {
          const bone = BONE_BY_ID[boneId];
          if (!bone) return null;
          if (isolatedMode && selectedBoneId && selectedBoneId !== boneId) return null;
          const isSel = selectedBoneId === boneId;
          const pos = getDisplacedAnchor(boneId);

          return (
            <Html
              key={boneId}
              position={pos}
              center
              distanceFactor={4.2}
              zIndexRange={[15, 0]}
            >
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectBone(boneId, null);
                }}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shadow-md border whitespace-nowrap ${
                  isSel
                    ? 'bg-blue-600 text-white border-blue-400 scale-110'
                    : theme === 'light'
                    ? 'bg-white/92 text-[#142d52] border-slate-300/90 hover:border-blue-500 hover:bg-blue-50'
                    : 'bg-slate-900/90 text-slate-100 border-slate-700 hover:border-sky-400'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSel ? '#fde047' : bone.color }}
                />
                <span>{bone.nameTh}</span>
              </button>
            </Html>
          );
        })}
    </group>
  );
}
