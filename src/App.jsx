import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import CanineCanvas from './components/3d/CanineCanvas';
import Header from './components/ui/Header';
import AnatomyHierarchyTree from './components/ui/AnatomyHierarchyTree';
import BoneDetailPanel from './components/ui/BoneDetailPanel';
import ViewerToolbar from './components/ui/ViewerToolbar';
import {
  CephalicFloatingSwitcher,
  CephalicComparisonInspector
} from './components/ui/CephalicControlBar';
import SearchCommandModal from './components/ui/SearchCommandModal';
import WikiAtlasModal from './components/ui/WikiAtlasModal';
import JourneysModal, { ActiveJourneyBanner } from './components/ui/JourneysModal';
import FirebaseModal from './components/ui/FirebaseModal';
import PathologyModal from './components/ui/PathologyModal';
import QuizModal from './components/ui/QuizModal';
import BlenderGuideModal from './components/ui/BlenderGuideModal';

import { CANINE_BONES } from './data/canineSkeletonData';
import {
  isConnectedToFirebase,
  fetchAllBones,
  getStudiedBones,
  toggleStudiedBone,
  getBookmarkedBones,
  toggleBookmarkBone
} from './services/firebase';

export default function App() {
  // Theme: 'light' (CHAi Clinical Light) | 'dark' (Radiology Dark Studio)
  const [theme, setTheme] = useState(() => localStorage.getItem('chai_canine_theme') || 'light');

  // Osteology Dataset & Selection
  const [bones, setBones] = useState(CANINE_BONES);
  const [selectedBoneId, setSelectedBoneId] = useState('skull');
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const [hoveredBoneId, setHoveredBoneId] = useState(null);
  const [focusTrigger, setFocusTrigger] = useState(0);

  // 3D Studio Controls & 3 Cephalic Skull Morphotypes (Brachycephalic / Mesocephalic / Dolichocephalic)
  const [cephalicType, setCephalicType] = useState('mesocephalic');
  const [cephalicCompareMode, setCephalicCompareMode] = useState(false);
  const [comparisonView, setComparisonView] = useState('dorsal');
  const [compareShowMandible, setCompareShowMandible] = useState(true);
  const [compareJawOpenDeg, setCompareJawOpenDeg] = useState(0);
  const [compareShowCalipers, setCompareShowCalipers] = useState(true);

  const [explodeProgress, setExplodeProgress] = useState(0);
  const [renderMode, setRenderMode] = useState('natural');
  const [bodyContourMode, setBodyContourMode] = useState('ghost');
  const [isolatedMode, setIsolatedMode] = useState(false);
  const [ghostOpacity, setGhostOpacity] = useState(0.14);
  const [hiddenBoneIds, setHiddenBoneIds] = useState([]);
  const [showLabels3D, setShowLabels3D] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState(null);
  const [clippingConfig, setClippingConfig] = useState({
    enabled: false,
    axis: 'x',
    position: 0,
    invert: false,
    showHelper: true
  });

  // UI & Study Progress
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [studiedBoneIds, setStudiedBoneIds] = useState(() => getStudiedBones());
  const [bookmarkedBoneIds, setBookmarkedBoneIds] = useState(() => getBookmarkedBones());
  const [isFirebaseActive, setIsFirebaseActive] = useState(isConnectedToFirebase());
  const [customGltfScene, setCustomGltfScene] = useState(null);

  // Active Learning Journey
  const [activeJourney, setActiveJourney] = useState(null);
  const [journeyStepIndex, setJourneyStepIndex] = useState(0);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isJourneysOpen, setIsJourneysOpen] = useState(false);
  const [isWikiGalleryOpen, setIsWikiGalleryOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isPathologyModalOpen, setIsPathologyModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isBlenderModalOpen, setIsBlenderModalOpen] = useState(false);

  const screenshotFnRef = useRef(null);

  // Sync HTML theme attribute + Tailwind dark class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('chai_canine_theme', theme);
  }, [theme]);

  // Global keyboard shortcut: '/' or Ctrl+K opens instant search
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea';
      if ((e.key === '/' && !isTyping) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Load bones (merges Firestore overrides if connected)
  useEffect(() => {
    let active = true;
    fetchAllBones().then((data) => {
      if (active && data?.length) setBones(data);
    });
    return () => {
      active = false;
    };
  }, [isFirebaseActive]);

  const selectedBone = bones.find((b) => b.id === selectedBoneId) || null;

  const handleSelectBone = useCallback((boneId, subPieceMeshName = null) => {
    if (boneId) {
      setCephalicCompareMode(false);
    }
    setSelectedBoneId(boneId);
    setSelectedMeshName(subPieceMeshName);
  }, []);

  const handleChangeCephalicType = useCallback(
    (nextType) => {
      setCephalicType(nextType);
      if (!cephalicCompareMode && selectedBoneId !== 'skull' && selectedBoneId !== 'mandible') {
        setSelectedBoneId('skull');
        setSelectedMeshName(null);
        setFocusTrigger((n) => n + 1);
      }
    },
    [cephalicCompareMode, selectedBoneId]
  );

  const handleApplyCephalicToSkeleton = useCallback((typeId) => {
    setCephalicType(typeId);
    setCephalicCompareMode(false);
    setSelectedBoneId('skull');
    setSelectedMeshName(null);
    setTimeout(() => setFocusTrigger((n) => n + 1), 80);
  }, []);

  const handleToggleHideBone = useCallback((boneId) => {
    setHiddenBoneIds((prev) =>
      prev.includes(boneId) ? prev.filter((id) => id !== boneId) : [...prev, boneId]
    );
  }, []);

  const handleToggleStudied = async (boneId) => {
    const updated = await toggleStudiedBone(boneId);
    setStudiedBoneIds(updated);
  };

  const handleToggleBookmark = (boneId) => {
    const updated = toggleBookmarkBone(boneId);
    setBookmarkedBoneIds(updated);
  };

  const handleResetView = () => {
    if (cephalicCompareMode) {
      setComparisonView('dorsal');
      setCompareJawOpenDeg(0);
      setCompareShowMandible(true);
      setCompareShowCalipers(true);
      setAutoRotate(false);
      return;
    }
    setCameraPreset('default');
    setSelectedMeshName(null);
    setIsolatedMode(false);
    setExplodeProgress(0);
    setHiddenBoneIds([]);
    setAutoRotate(false);
    setClippingConfig({
      enabled: false,
      axis: 'x',
      position: 0,
      invert: false,
      showHelper: true
    });
  };

  const handleSelectPathology = (pathology) => {
    if (pathology?.affectedBones?.length > 0) {
      const primaryId = pathology.affectedBones[0];
      setSelectedBoneId(primaryId);
      setSelectedMeshName(null);
      const toHide = CANINE_BONES.map((b) => b.id).filter(
        (id) => !pathology.affectedBones.includes(id)
      );
      setHiddenBoneIds(toHide);
      setIsolatedMode(false);
      setFocusTrigger((n) => n + 1);
    }
  };

  // Connected Learning Journeys navigation
  const applyJourneyStep = (journey, index) => {
    const step = journey.steps[index];
    if (!step) return;
    setHiddenBoneIds([]);
    setExplodeProgress(0);
    setSelectedBoneId(step.boneId);
    setSelectedMeshName(null);
    setFocusTrigger((n) => n + 1);
  };

  const handleStartJourney = (journey) => {
    setActiveJourney(journey);
    setJourneyStepIndex(0);
    applyJourneyStep(journey, 0);
  };

  const handleJourneyStepChange = (nextIndex) => {
    if (!activeJourney) return;
    setJourneyStepIndex(nextIndex);
    applyJourneyStep(activeJourney, nextIndex);
  };

  // Custom Blender GLB Drag & Drop with Meshopt support
  const handleDropModel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.parse(
        e.target.result,
        '',
        (gltf) => {
          setCustomGltfScene(gltf.scene);
        },
        (err) => {
          console.error('Error parsing dropped GLB:', err);
          alert('ไม่สามารถอ่านไฟล์ .glb/.gltf นี้ได้ กรุณาตรวจสอบการส่งออกจาก Blender');
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans">
      {/* Top Clinical Navigation Bar */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        cephalicCompareMode={cephalicCompareMode}
        onToggleCephalicCompareMode={() => setCephalicCompareMode((c) => !c)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenJourneys={() => setIsJourneysOpen(true)}
        onOpenWikiGallery={() => setIsWikiGalleryOpen(true)}
        onOpenPathologyModal={() => setIsPathologyModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        onOpenBlenderModal={() => setIsBlenderModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        isFirebaseActive={isFirebaseActive}
        studiedCount={studiedBoneIds.length}
      />

      {/* Main Interactive 3D Osteology Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <CanineCanvas
          theme={theme}
          cephalicType={cephalicType}
          onChangeCephalicType={handleChangeCephalicType}
          cephalicCompareMode={cephalicCompareMode}
          comparisonView={comparisonView}
          compareShowMandible={compareShowMandible}
          compareJawOpenDeg={compareJawOpenDeg}
          compareShowCalipers={compareShowCalipers}
          selectedBone={selectedBone}
          selectedMeshName={selectedMeshName}
          onSelectBone={handleSelectBone}
          hoveredBoneId={hoveredBoneId}
          onHoverBone={setHoveredBoneId}
          explodeProgress={explodeProgress}
          renderMode={renderMode}
          bodyContourMode={bodyContourMode}
          isolatedMode={isolatedMode}
          ghostOpacity={ghostOpacity}
          hiddenBoneIds={hiddenBoneIds}
          showLabels3D={showLabels3D}
          clippingConfig={clippingConfig}
          cameraPreset={cameraPreset}
          focusTrigger={focusTrigger}
          autoRotate={autoRotate}
          onResetPreset={() => setCameraPreset(null)}
          customGltfScene={customGltfScene}
          onDropModel={handleDropModel}
          onClearCustomModel={() => setCustomGltfScene(null)}
          onRegisterScreenshot={(fn) => {
            screenshotFnRef.current = fn;
          }}
        />

        {/* Floating 3 Cephalic Types Switcher & Side-by-Side 3D Studio Bar */}
        <CephalicFloatingSwitcher
          cephalicType={cephalicType}
          onChangeCephalicType={handleChangeCephalicType}
          cephalicCompareMode={cephalicCompareMode}
          onToggleCephalicCompareMode={() => setCephalicCompareMode((c) => !c)}
          comparisonView={comparisonView}
          onChangeComparisonView={setComparisonView}
          compareShowMandible={compareShowMandible}
          onToggleCompareMandible={() => setCompareShowMandible((m) => !m)}
          compareJawOpenDeg={compareJawOpenDeg}
          onChangeCompareJawOpenDeg={setCompareJawOpenDeg}
          compareShowCalipers={compareShowCalipers}
          onToggleCompareCalipers={() => setCompareShowCalipers((c) => !c)}
          hasActiveJourney={Boolean(activeJourney)}
        />

        {/* Active Connected Journey Stepper */}
        {!cephalicCompareMode && (
          <ActiveJourneyBanner
            journey={activeJourney}
            stepIndex={journeyStepIndex}
            onStepChange={handleJourneyStepChange}
            onExit={() => setActiveJourney(null)}
          />
        )}

        {/* Left Skeletal Inventory & Cross-Section Slicer */}
        {!cephalicCompareMode && (
          <AnatomyHierarchyTree
            selectedBoneId={selectedBoneId}
            onSelectBone={handleSelectBone}
            hiddenBoneIds={hiddenBoneIds}
            onToggleHideBone={handleToggleHideBone}
            onShowAllBones={() => setHiddenBoneIds([])}
            studiedBoneIds={studiedBoneIds}
            bookmarkedBoneIds={bookmarkedBoneIds}
            clippingConfig={clippingConfig}
            onChangeClippingConfig={setClippingConfig}
            isOpen={isTreeOpen}
            onToggleOpen={() => setIsTreeOpen((o) => !o)}
          />
        )}

        {/* Right CHAi Structure Inspector OR 3-Cephalic Morphometry Inspector */}
        {cephalicCompareMode ? (
          <CephalicComparisonInspector
            activeType={cephalicType}
            onSelectType={setCephalicType}
            onApplyToFullSkeleton={handleApplyCephalicToSkeleton}
            onExitCompare={() => setCephalicCompareMode(false)}
          />
        ) : (
          selectedBone && (
            <BoneDetailPanel
              bone={selectedBone}
              cephalicType={cephalicType}
              onChangeCephalicType={handleChangeCephalicType}
              onOpenCephalicCompare={() => setCephalicCompareMode(true)}
              selectedMeshName={selectedMeshName}
              onSelectBone={handleSelectBone}
              onClose={() => {
                setSelectedBoneId(null);
                setSelectedMeshName(null);
              }}
              onFocusBone={() => setFocusTrigger((n) => n + 1)}
              isolatedMode={isolatedMode}
              onToggleIsolatedMode={() => setIsolatedMode((iso) => !iso)}
              isStudied={studiedBoneIds.includes(selectedBone.id)}
              onToggleStudied={handleToggleStudied}
              isBookmarked={bookmarkedBoneIds.includes(selectedBone.id)}
              onToggleBookmark={handleToggleBookmark}
              onSelectPathology={handleSelectPathology}
            />
          )
        )}

        {/* Bottom Floating 3D Control Dock */}
        <ViewerToolbar
          explodeProgress={explodeProgress}
          onChangeExplodeProgress={setExplodeProgress}
          renderMode={renderMode}
          onChangeRenderMode={setRenderMode}
          bodyContourMode={bodyContourMode}
          onChangeBodyContourMode={setBodyContourMode}
          isolatedMode={isolatedMode}
          onToggleIsolatedMode={() => setIsolatedMode((iso) => !iso)}
          hasSelectedBone={Boolean(selectedBone)}
          ghostOpacity={ghostOpacity}
          onChangeGhostOpacity={setGhostOpacity}
          showLabels3D={showLabels3D}
          onToggleLabels3D={() => setShowLabels3D((s) => !s)}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((r) => !r)}
          onSelectCameraPreset={setCameraPreset}
          onCaptureScreenshot={() => screenshotFnRef.current?.()}
          onResetView={handleResetView}
        />
      </main>

      {/* Modals */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBone={handleSelectBone}
        onSelectPathology={handleSelectPathology}
        onSelectCephalicType={(typeId) => {
          setCephalicType(typeId);
          setCephalicCompareMode(true);
        }}
      />

      <JourneysModal
        isOpen={isJourneysOpen}
        onClose={() => setIsJourneysOpen(false)}
        onStartJourney={handleStartJourney}
      />

      <WikiAtlasModal
        isOpen={isWikiGalleryOpen}
        onClose={() => setIsWikiGalleryOpen(false)}
        onSelectBone={handleSelectBone}
      />

      <PathologyModal
        isOpen={isPathologyModalOpen}
        onClose={() => setIsPathologyModalOpen(false)}
        onSelectPathology={handleSelectPathology}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectBone={handleSelectBone}
      />

      <BlenderGuideModal
        isOpen={isBlenderModalOpen}
        onClose={() => setIsBlenderModalOpen(false)}
      />

      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConfigUpdated={(active) => setIsFirebaseActive(active)}
      />
    </div>
  );
}
