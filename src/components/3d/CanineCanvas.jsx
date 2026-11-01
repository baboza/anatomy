import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  Html,
  useProgress
} from '@react-three/drei';
import CanineSkeletonModel from './CanineSkeletonModel';
import CephalicComparison3D from './CephalicComparison3D';
import CameraController from './CameraController';

function LoadingSkeletonOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-6 py-4 rounded-2xl chai-panel flex flex-col items-center gap-3 min-w-[270px] text-center">
        <div className="w-10 h-10 rounded-full border-3 border-blue-500/30 border-t-blue-600 animate-spin" />
        <div>
          <div className="text-xs font-bold chai-text-primary">
            กำลังประมวลผลโมเดลสแกนกระดูกสุนัข 3 มิติ
          </div>
          <div className="text-[11px] chai-text-secondary mt-0.5">
            115 ชิ้นกระดูกแยกอิสระ (Meshopt WASM) · {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${Math.max(12, Math.round(progress))}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

function ScreenshotBridge({ onRegisterScreenshot }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (!onRegisterScreenshot) return;
    onRegisterScreenshot(() => {
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `CHAi-Canine-Osteology-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
      a.click();
    });
  }, [gl, scene, camera, onRegisterScreenshot]);
  return null;
}

export default function CanineCanvas({
  theme = 'light',
  cephalicType = 'mesocephalic',
  onChangeCephalicType,
  cephalicCompareMode = false,
  comparisonView = 'dorsal',
  compareShowMandible = true,
  compareJawOpenDeg = 0,
  compareShowCalipers = true,
  selectedBone,
  selectedMeshName,
  onSelectBone,
  hoveredBoneId,
  onHoverBone,
  explodeProgress,
  renderMode,
  bodyContourMode,
  isolatedMode,
  ghostOpacity,
  hiddenBoneIds,
  showLabels3D,
  clippingConfig,
  cameraPreset,
  focusTrigger,
  autoRotate,
  onResetPreset,
  customGltfScene,
  onDropModel,
  onClearCustomModel,
  onRegisterScreenshot
}) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [boundsMap, setBoundsMap] = useState(null);

  const handleBoundsComputed = useCallback((bounds) => {
    setBoundsMap(bounds);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      if (onDropModel) onDropModel(file);
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className="relative w-full h-full chai-viewport-bg transition-colors duration-300"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Custom Blender GLB Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-blue-600/15 backdrop-blur-sm border-4 border-dashed border-blue-500 flex items-center justify-center pointer-events-none">
          <div className="chai-panel px-8 py-6 rounded-2xl text-center">
            <p className="text-lg font-bold text-blue-600 dark:text-sky-400">
              วางไฟล์ .glb / .gltf จาก Blender เพื่อเปิดในสตูดิโอ 3 มิติ
            </p>
            <p className="text-xs chai-text-secondary mt-1">
              รองรับทั้งไฟล์มาตรฐานและไฟล์บีบอัด Meshopt / Quantized
            </p>
          </div>
        </div>
      )}

      {/* Custom Model Active Pill */}
      {customGltfScene && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 chai-panel px-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">กำลังแสดงโมเดล .GLB ที่นำเข้าเอง</span>
          <button
            onClick={onClearCustomModel}
            className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] hover:bg-blue-700 transition"
          >
            กลับสู่โมเดลมาตรฐาน 115 ชิ้น
          </button>
        </div>
      )}

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-2.85, 0.95, -2.35], fov: 36, near: 0.02, far: 60 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={() => {
          if (!cephalicCompareMode && onSelectBone) onSelectBone(null, null);
        }}
      >
        {/* Multi-directional Veterinary Museum Osteology Lighting */}
        <ambientLight intensity={isLight ? 0.78 : 0.55} />
        <hemisphereLight
          skyColor={isLight ? '#ffffff' : '#dbeafe'}
          groundColor={isLight ? '#cbd5e1' : '#1e293b'}
          intensity={isLight ? 0.72 : 0.52}
        />
        <directionalLight
          position={[-4.5, 6.2, -3.8]}
          intensity={isLight ? 1.55 : 1.75}
          color="#fffaf0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
        <directionalLight
          position={[4.5, 3.0, 3.5]}
          intensity={isLight ? 0.85 : 0.95}
          color={isLight ? '#e0f2fe' : '#93c5fd'}
        />
        <directionalLight
          position={[0, -3.5, 0]}
          intensity={0.38}
          color="#f8fafc"
        />

        {/* Procedural Studio Environment (100% Offline, Zero Network Fetch) */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer
              form="rect"
              intensity={isLight ? 1.6 : 1.2}
              position={[0, 5, -4]}
              scale={[8, 4, 1]}
              color="#ffffff"
            />
            <Lightformer
              form="rect"
              intensity={0.9}
              position={[-5, 2, 2]}
              scale={[6, 3, 1]}
              color="#e0f2fe"
            />
            <Lightformer
              form="rect"
              intensity={0.75}
              position={[5, 1, -2]}
              scale={[6, 3, 1]}
              color="#fef3c7"
            />
          </group>
        </Environment>

        <Suspense fallback={<LoadingSkeletonOverlay />}>
          {cephalicCompareMode ? (
            <>
              <CephalicComparison3D
                theme={theme}
                activeCephalicType={cephalicType}
                onSelectCephalicType={onChangeCephalicType}
                renderMode={renderMode}
                showMandible={compareShowMandible}
                jawOpenDeg={compareJawOpenDeg}
                showCalipers={compareShowCalipers}
                comparisonView={comparisonView}
              />
              {renderMode !== 'xray' && (
                <ContactShadows
                  position={[0, -0.36, 0]}
                  opacity={isLight ? 0.25 : 0.48}
                  scale={5.5}
                  blur={2.4}
                  far={2.4}
                  color={isLight ? '#1e3a5f' : '#000000'}
                />
              )}
            </>
          ) : (
            <>
              <CanineSkeletonModel
                theme={theme}
                cephalicType={cephalicType}
                selectedBoneId={selectedBone?.id || null}
                selectedMeshName={selectedMeshName}
                onSelectBone={onSelectBone}
                hoveredBoneId={hoveredBoneId}
                onHoverBone={onHoverBone}
                explodeProgress={explodeProgress}
                renderMode={renderMode}
                bodyContourMode={bodyContourMode}
                isolatedMode={isolatedMode}
                ghostOpacity={ghostOpacity}
                hiddenBoneIds={hiddenBoneIds}
                showLabels3D={showLabels3D}
                clippingConfig={clippingConfig}
                customGltfScene={customGltfScene}
                onBoundsComputed={handleBoundsComputed}
              />

              {/* Soft Studio Floor Shadow beneath Canine Paws */}
              {renderMode !== 'xray' && (
                <ContactShadows
                  position={[0, -1.145, -0.05]}
                  opacity={isLight ? 0.28 : 0.52}
                  scale={6.5}
                  blur={2.4}
                  far={3.2}
                  color={isLight ? '#1e3a5f' : '#000000'}
                />
              )}
            </>
          )}
        </Suspense>

        <CameraController
          cephalicCompareMode={cephalicCompareMode}
          comparisonView={comparisonView}
          selectedBone={selectedBone}
          selectedMeshName={selectedMeshName}
          boundsMap={boundsMap}
          cameraPreset={cameraPreset}
          focusTrigger={focusTrigger}
          autoRotate={autoRotate}
          onResetPreset={onResetPreset}
        />

        <ScreenshotBridge onRegisterScreenshot={onRegisterScreenshot} />
      </Canvas>
    </div>
  );
}
