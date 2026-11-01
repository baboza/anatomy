import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Megaphone, X } from 'lucide-react';

import CanineCanvas from './components/3d/CanineCanvas';
import Header from './components/ui/Header';
import AnatomyHierarchyTree from './components/ui/AnatomyHierarchyTree';
import BoneDetailPanel from './components/ui/BoneDetailPanel';
import ViewerToolbar from './components/ui/ViewerToolbar';
import {
  CephalicFloatingSwitcher,
  CephalicComparisonInspector
} from './components/ui/CephalicControlBar';
import MeasurementControlBar from './components/ui/MeasurementControlBar';
import SearchCommandModal from './components/ui/SearchCommandModal';
import WikiAtlasModal from './components/ui/WikiAtlasModal';
import JourneysModal, { ActiveJourneyBanner } from './components/ui/JourneysModal';
import PathologyModal from './components/ui/PathologyModal';
import QuizModal from './components/ui/QuizModal';
import AuthGateScreen from './components/ui/AuthGateScreen';
import AdminDashboardView from './components/ui/AdminDashboardView';

import { CANINE_BONES, VET_PATHOLOGIES } from './data/canineSkeletonData';
import {
  isConnectedToFirebase,
  subscribeToAuthChanges,
  logoutUser,
  fetchCatalogBundle,
  DEFAULT_ATLAS_SETTINGS,
  getStudiedBones,
  toggleStudiedBone,
  getBookmarkedBones,
  toggleBookmarkBone
} from './services/firebase';

const BANNER_COLOR_MAP = {
  blue: 'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-500 text-slate-950',
  rose: 'bg-rose-600 text-white'
};

export default function App() {
  // Theme: 'light' (CHAi Clinical Light) | 'dark' (Radiology Dark Studio)
  const [theme, setTheme] = useState(() => localStorage.getItem('chai_canine_theme') || 'light');

  // Authentication & Role State (`jirawat.s@msu.ac.th` -> Super Admin)
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Osteology Dataset, Pathologies & Portal Settings
  const [bones, setBones] = useState(CANINE_BONES);
  const [pathologies, setPathologies] = useState(VET_PATHOLOGIES);
  const [portalSettings, setPortalSettings] = useState(DEFAULT_ATLAS_SETTINGS);
  const [bannerDismissed, setBannerDismissed] = useState(false);

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
  const [studiedBoneIds, setStudiedBoneIds] = useState([]);
  const [bookmarkedBoneIds, setBookmarkedBoneIds] = useState([]);
  const [isFirebaseActive, setIsFirebaseActive] = useState(isConnectedToFirebase());

  // 3D Distance Caliper & Orthopedic Angle Measurement Tools
  const [measureMode, setMeasureMode] = useState('off'); // 'off' | 'distance' | 'angle'
  const [measurePoints, setMeasurePoints] = useState([]);

  // Active Learning Journey
  const [activeJourney, setActiveJourney] = useState(null);
  const [journeyStepIndex, setJourneyStepIndex] = useState(0);

  // Modals & Admin Studio
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isJourneysOpen, setIsJourneysOpen] = useState(false);
  const [isWikiGalleryOpen, setIsWikiGalleryOpen] = useState(false);
  const [isPathologyModalOpen, setIsPathologyModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('overview');
  const [adminInitialBoneId, setAdminInitialBoneId] = useState('skull');

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

  // Subscribe to Firebase Authentication & RBAC Role (`jirawat.s@msu.ac.th` -> Super Admin)
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((profile) => {
      setCurrentUser(profile);
      setAuthLoading(false);
      if (profile) {
        setStudiedBoneIds(getStudiedBones());
        setBookmarkedBoneIds(getBookmarkedBones());
      } else {
        setStudiedBoneIds([]);
        setBookmarkedBoneIds([]);
        setIsAdminModalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const applyCatalogBundle = useCallback((bundle) => {
    if (!bundle) return;
    if (bundle.bones?.length) setBones(bundle.bones);
    if (bundle.pathologies?.length) setPathologies(bundle.pathologies);
    if (bundle.settings) {
      setPortalSettings(bundle.settings);
      if (bundle.settings.defaultCephalicType) {
        setCephalicType(bundle.settings.defaultCephalicType);
      }
    }
  }, []);

  // Load Cloud Catalog once authenticated (<= 1 Read per 24h via LocalStorage cache)
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    fetchCatalogBundle(false).then((bundle) => {
      if (active) applyCatalogBundle(bundle);
    });
    return () => {
      active = false;
    };
  }, [currentUser?.uid, isFirebaseActive, applyCatalogBundle]);

  // Global keyboard shortcut: '/' or Ctrl+K opens instant search when signed in
  useEffect(() => {
    if (!currentUser) return;
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
      if ((e.key === '/' && !isTyping) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentUser]);

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
      const toHide = bones
        .map((b) => b.id)
        .filter((id) => !pathology.affectedBones.includes(id));
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

  // 3D Point Measurement click handler on bone mesh surface
  const handleMeasureClick = useCallback((pointData) => {
    setMeasurePoints((prev) => {
      if (measureMode === 'distance') {
        if (prev.length >= 2) {
          return [pointData];
        }
        return [...prev, pointData];
      }
      if (measureMode === 'angle') {
        if (prev.length >= 3) {
          return [pointData];
        }
        return [...prev, pointData];
      }
      return prev;
    });
  }, [measureMode]);

  const handleOpenAdminForBone = (boneId) => {
    setAdminInitialBoneId(boneId);
    setAdminInitialTab('bones');
    setIsAdminModalOpen(true);
  };

  // ==================== AUTHENTICATION & ACCESS GATE ====================
  const isSuspended = currentUser?.status === 'suspended' && !currentUser?.isSuperAdmin;
  const isMaintenanceBlocked =
    Boolean(portalSettings?.maintenanceMode) && currentUser && !currentUser.isAdmin;

  if (authLoading || !currentUser || isSuspended || isMaintenanceBlocked) {
    return (
      <AuthGateScreen
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        authLoading={authLoading}
        suspendedUser={isSuspended ? currentUser : null}
        maintenanceBlockedUser={isMaintenanceBlocked ? currentUser : null}
        onLogout={logoutUser}
      />
    );
  }

  const showAnnouncement =
    !bannerDismissed &&
    portalSettings?.announcementEnabled &&
    Boolean(portalSettings?.announcementText?.trim());

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans">
      {/* Optional Admin Announcement Banner */}
      {showAnnouncement && (
        <div
          className={`relative z-30 px-4 py-1.5 text-xs font-semibold flex items-center justify-between gap-2 ${
            BANNER_COLOR_MAP[portalSettings.announcementColor] || BANNER_COLOR_MAP.blue
          }`}
        >
          <div className="flex items-center gap-2 truncate mx-auto">
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{portalSettings.announcementText}</span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="opacity-80 hover:opacity-100 shrink-0"
            title="ซ่อนแถบประกาศ"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Clinical Navigation Bar */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        portalSettings={portalSettings}
        currentUser={currentUser}
        onOpenAdminModal={() => {
          setAdminInitialTab('overview');
          setAdminInitialBoneId(selectedBoneId || 'skull');
          setIsAdminModalOpen(true);
        }}
        onLogout={logoutUser}
        cephalicCompareMode={cephalicCompareMode}
        onToggleCephalicCompareMode={() => setCephalicCompareMode((c) => !c)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenJourneys={() => setIsJourneysOpen(true)}
        onOpenWikiGallery={() => setIsWikiGalleryOpen(false) || setIsWikiGalleryOpen(true)}
        onOpenPathologyModal={() => setIsPathologyModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
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
          measureMode={measureMode}
          measurePoints={measurePoints}
          onMeasureClick={handleMeasureClick}
          onRegisterScreenshot={(fn) => {
            screenshotFnRef.current = fn;
          }}
        />

        {/* Veterinary 3D Caliper & Orthopedic Angle Measurement Floating Dock */}
        <MeasurementControlBar
          measureMode={measureMode}
          onChangeMode={setMeasureMode}
          points={measurePoints}
          onClearPoints={() => setMeasurePoints([])}
          onClose={() => setMeasureMode('off')}
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
            bones={bones}
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
              bones={bones}
              pathologies={pathologies}
              isAdmin={Boolean(currentUser?.isAdmin)}
              onEditBoneInAdmin={handleOpenAdminForBone}
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
              ghostOpacity={ghostOpacity}
              onChangeGhostOpacity={setGhostOpacity}
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
          measureMode={measureMode}
          onToggleMeasure={() =>
            setMeasureMode((m) => (m === 'off' ? 'distance' : 'off'))
          }
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
        bones={bones}
        pathologies={pathologies}
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
        pathologies={pathologies}
        bones={bones}
        onSelectPathology={handleSelectPathology}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectBone={handleSelectBone}
      />

      <AdminDashboardView
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onLogout={logoutUser}
        bones={bones}
        pathologies={pathologies}
        portalSettings={portalSettings}
        initialTab={adminInitialTab}
        initialBoneId={adminInitialBoneId}
        onCatalogUpdated={applyCatalogBundle}
        onJumpToBone3D={(boneId) => {
          setIsAdminModalOpen(false);
          handleSelectBone(boneId, null);
          setFocusTrigger((n) => n + 1);
        }}
      />
    </div>
  );
}
