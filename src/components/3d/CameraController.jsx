import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Veterinary Anatomical Camera Presets in Scene World Space
// Model orientation: Cranial = -Z, Caudal = +Z, Left = -X, Right = +X, Dorsal = +Y, Ventral = -Y
// Scaled skeleton spans roughly X:[-0.36, 0.36], Y:[-1.12, 1.28], Z:[-1.63, 1.44], center ~ [0, 0.06, -0.09]
const SCENE_CENTER = [0, 0.06, -0.08];

const PRESET_VIEWS = {
  default: { pos: [-2.85, 0.95, -2.35], target: SCENE_CENTER }, // Classic 3/4 Left-Cranial Veterinary Studio View
  left:    { pos: [-3.55, 0.18, -0.08], target: SCENE_CENTER }, // Left Lateral (ด้านข้างซ้าย)
  right:   { pos: [3.55, 0.18, -0.08],  target: SCENE_CENTER }, // Right Lateral (ด้านข้างขวา)
  front:   { pos: [0.0, 0.32, -3.75],   target: [0, 0.18, -0.25] }, // Cranial / Rostral (ด้านหน้า)
  back:    { pos: [0.0, 0.32, 3.55],    target: [0, 0.12, 0.10] },  // Caudal (ด้านท้าย)
  top:     { pos: [-0.05, 4.10, -0.08], target: SCENE_CENTER }, // Dorsal (ด้านหลังบน)
  bottom:  { pos: [-0.05, -3.85, -0.08], target: SCENE_CENTER } // Ventral (ด้านท้อง)
};

// Camera views for 3-Skull Side-by-Side Cephalic Type Comparison Studio
const CEPHALIC_COMPARE_VIEWS = {
  dorsal:  { pos: [0, 3.55, 0.18],  target: [0, 0.02, 0.08] },  // Poster Dorsal Top-Down View
  '3d':    { pos: [0, 1.55, 3.35],  target: [0, -0.05, 0.06] }, // 3D Museum Showcase View
  lateral: { pos: [0, 0.12, 3.65],  target: [0, -0.02, 0.0] },  // Side-by-Side Left Lateral Profile
  rostral: { pos: [0, 0.16, 3.45],  target: [0, 0.02, 0.12] },  // Rostral Nasal & Zygomatic View
  ventral: { pos: [0, -3.55, 0.18], target: [0, 0.02, 0.08] }   // Ventral Palatal & Dental Arcade View
};

export default function CameraController({
  cephalicCompareMode = false,
  comparisonView = 'dorsal',
  selectedBone,
  selectedMeshName,
  boundsMap,
  cameraPreset,
  focusTrigger,
  autoRotate = false,
  onResetPreset
}) {
  const controlsRef = useRef();
  const { camera } = useThree();

  const targetPos = useRef(new THREE.Vector3(...PRESET_VIEWS.default.pos));
  const targetLookAt = useRef(new THREE.Vector3(...PRESET_VIEWS.default.target));
  const isAnimating = useRef(true);

  // Stop programmatic camera flight immediately when user drags or zooms manually
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const stopAnim = () => {
      isAnimating.current = false;
    };
    controls.addEventListener('start', stopAnim);
    return () => controls.removeEventListener('start', stopAnim);
  }, []);

  // Apply 3-Skull Comparison Studio camera view when in Cephalic Comparison Mode
  useEffect(() => {
    if (cephalicCompareMode) {
      const view = CEPHALIC_COMPARE_VIEWS[comparisonView] || CEPHALIC_COMPARE_VIEWS.dorsal;
      targetPos.current.set(...view.pos);
      targetLookAt.current.set(...view.target);
      isAnimating.current = true;
    } else {
      // Returning to full 115-bone skeleton
      targetPos.current.set(...PRESET_VIEWS.default.pos);
      targetLookAt.current.set(...PRESET_VIEWS.default.target);
      isAnimating.current = true;
    }
  }, [cephalicCompareMode, comparisonView]);

  // Apply named camera angle presets
  useEffect(() => {
    if (cephalicCompareMode) {
      const mapPreset = {
        default: '3d',
        top: 'dorsal',
        left: 'lateral',
        right: 'lateral',
        front: 'rostral',
        bottom: 'ventral',
        back: 'dorsal'
      };
      if (cameraPreset && CEPHALIC_COMPARE_VIEWS[mapPreset[cameraPreset]]) {
        const view = CEPHALIC_COMPARE_VIEWS[mapPreset[cameraPreset]];
        targetPos.current.set(...view.pos);
        targetLookAt.current.set(...view.target);
        isAnimating.current = true;
        if (onResetPreset) {
          const timer = setTimeout(() => onResetPreset(), 650);
          return () => clearTimeout(timer);
        }
      }
      return;
    }

    if (cameraPreset && PRESET_VIEWS[cameraPreset]) {
      const preset = PRESET_VIEWS[cameraPreset];
      targetPos.current.set(...preset.pos);
      targetLookAt.current.set(...preset.target);
      isAnimating.current = true;
      if (onResetPreset) {
        const timer = setTimeout(() => onResetPreset(), 650);
        return () => clearTimeout(timer);
      }
    }
  }, [cameraPreset, cephalicCompareMode, onResetPreset]);

  // Smoothly frame selected bone or specific sub-piece using real 3D mesh bounding boxes
  useEffect(() => {
    if (cephalicCompareMode || !selectedBone || !boundsMap) return;

    const key = selectedMeshName && boundsMap.meshes?.[selectedMeshName]
      ? boundsMap.meshes[selectedMeshName]
      : boundsMap.bones?.[selectedBone.id];

    if (!key) return;

    const center = key.center; // [x, y, z]
    const radius = Math.max(key.radius || 0.25, 0.12);

    // Choose an intelligent viewing direction based on bone side & region
    const dist = THREE.MathUtils.clamp(radius * 3.1 + 0.42, 0.68, 3.35);

    let dirX = -0.82;
    let dirY = 0.34;
    let dirZ = -0.46;

    if (center[0] > 0.04) {
      // Right-side bone -> view from right-cranial oblique
      dirX = 0.85;
      dirZ = -0.42;
    } else if (center[0] < -0.04) {
      // Left-side bone -> view from left-cranial oblique
      dirX = -0.85;
      dirZ = -0.42;
    } else if (selectedBone.id === 'skull' || selectedBone.id === 'mandible' || selectedBone.id === 'hyoid') {
      dirX = -0.76;
      dirY = 0.24;
      dirZ = -0.60;
    } else if (selectedBone.id === 'sacrum' || selectedBone.id === 'vertebrae-caudal') {
      dirX = -0.78;
      dirY = 0.44;
      dirZ = 0.44;
    }

    const offset = new THREE.Vector3(dirX, dirY, dirZ).normalize().multiplyScalar(dist);
    targetLookAt.current.set(center[0], center[1], center[2]);
    targetPos.current.set(center[0] + offset.x, center[1] + offset.y, center[2] + offset.z);
    isAnimating.current = true;
  }, [selectedBone, selectedMeshName, boundsMap, focusTrigger]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isAnimating.current) {
      const step = 1 - Math.exp(-5.5 * delta);
      camera.position.lerp(targetPos.current, step);
      controlsRef.current.target.lerp(targetLookAt.current, step);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetPos.current) < 0.012 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.012
      ) {
        isAnimating.current = false;
      }
    } else if (autoRotate) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      rotateSpeed={0.78}
      zoomSpeed={0.95}
      panSpeed={0.78}
      minDistance={0.32}
      maxDistance={9.5}
      autoRotate={autoRotate}
      autoRotateSpeed={1.1}
    />
  );
}
