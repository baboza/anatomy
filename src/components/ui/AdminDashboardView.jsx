import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  Bone,
  Stethoscope,
  Users,
  Settings,
  LayoutDashboard,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Ban,
  Crown,
  ArrowLeft,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import {
  PRIMARY_ADMIN_EMAIL,
  isPrimaryAdminEmail,
  fetchCatalogBundle,
  seedFirestoreWithCanineData,
  adminSaveBoneOverride,
  adminResetBoneToDefault,
  adminSavePathologies,
  adminSavePortalSettings,
  adminImportFullCatalogJson,
  adminFetchUsersRegistry,
  adminUpdateUserRoleOrStatus,
  adminSetPreAuthorizedEmail,
  adminRemovePreAuthorizedEmail
} from '../../services/firebase';

export default function AdminDashboardView({
  isOpen = true,
  onClose,
  currentUser,
  theme = 'light',
  onToggleTheme,
  onLogout,
  bones = [],
  pathologies = [],
  portalSettings = {},
  initialTab = 'overview',
  initialBoneId = 'skull',
  onCatalogUpdated,
  onJumpToBone3D
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ text: '', type: '' });

  // Tab 2: Bone Editor State
  const [boneSearch, setBoneSearch] = useState('');
  const [editingBoneId, setEditingBoneId] = useState(initialBoneId || 'skull');
  const [boneForm, setBoneForm] = useState({
    nameTh: '',
    nameEn: '',
    nameLatin: '',
    color: '#3b82f6',
    summaryTh: '',
    descriptionTh: '',
    landmarksText: '',
    articulationsText: '',
    clinicalNotes: '',
    customMedia: []
  });
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Tab 3: Pathology CRUD State
  const [selectedPathId, setSelectedPathId] = useState('');
  const [pathForm, setPathForm] = useState({
    id: '',
    nameTh: '',
    nameEn: '',
    severity: 'พบบ่อยทางคลินิก',
    affectedBones: ['skull'],
    descriptionTh: '',
    radiographicSigns: '',
    mediaId: '',
    customImageUrl: ''
  });
  const [isCreatingNewPath, setIsCreatingNewPath] = useState(false);

  // Tab 4: Users & Roles State
  const [usersList, setUsersList] = useState([]);
  const [preAuthorizedList, setPreAuthorizedList] = useState([]);
  const [newRoleEmail, setNewRoleEmail] = useState('');
  const [newRoleValue, setNewRoleValue] = useState('admin');

  // Tab 5: Portal Settings State
  const [settingsForm, setSettingsForm] = useState({
    portalTitle: 'CHAi Canine Osteology Atlas',
    institutionName: 'มหาวิทยาลัยมหาสารคาม (MSU) · Veterinary Osteology 3D',
    announcementEnabled: false,
    announcementText: '',
    announcementColor: 'blue',
    defaultCephalicType: 'mesocephalic',
    maintenanceMode: false
  });

  const fileInputRef = useRef(null);

  const showNotice = (text, type = 'success') => {
    setToast({ text, type });
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'overview');
      if (initialBoneId) setEditingBoneId(initialBoneId);
      setToast({ text: '', type: '' });
      setSettingsForm((prev) => ({ ...prev, ...portalSettings }));
    }
  }, [isOpen, initialTab, initialBoneId, portalSettings]);

  // Populate bone form whenever editingBoneId or bones changes
  useEffect(() => {
    if (!isOpen) return;
    const target = bones.find((b) => b.id === editingBoneId) || bones[0];
    if (!target) return;
    setBoneForm({
      nameTh: target.nameTh || '',
      nameEn: target.nameEn || '',
      nameLatin: target.nameLatin || '',
      color: target.color || '#3b82f6',
      summaryTh: target.summaryTh || '',
      descriptionTh: target.descriptionTh || '',
      landmarksText: (target.landmarks || []).join('\n'),
      articulationsText: (target.articulations || []).join('\n'),
      clinicalNotes: target.clinicalNotes || '',
      customMedia: Array.isArray(target.customMedia) ? target.customMedia : []
    });
  }, [isOpen, editingBoneId, bones]);

  // Populate pathology form
  useEffect(() => {
    if (!isOpen || isCreatingNewPath) return;
    const first = pathologies.find((p) => p.id === selectedPathId) || pathologies[0];
    if (!first) return;
    if (selectedPathId !== first.id) setSelectedPathId(first.id);
    setPathForm({
      id: first.id,
      nameTh: first.nameTh || '',
      nameEn: first.nameEn || '',
      severity: first.severity || '',
      affectedBones: Array.isArray(first.affectedBones) ? first.affectedBones : [],
      descriptionTh: first.descriptionTh || '',
      radiographicSigns: first.radiographicSigns || '',
      mediaId: first.mediaId || '',
      customImageUrl: first.customImageUrl || ''
    });
  }, [isOpen, selectedPathId, pathologies, isCreatingNewPath]);

  // Load users registry when opening Users or Overview tab
  useEffect(() => {
    if (!isOpen || !currentUser?.isAdmin) return;
    if (activeTab === 'users' || activeTab === 'overview') {
      adminFetchUsersRegistry(activeTab === 'users')
        .then((res) => {
          setUsersList(res.usersList || []);
          setPreAuthorizedList(res.preAuthorizedList || []);
        })
        .catch((err) => console.warn('Admin users fetch warning:', err));
    }
  }, [isOpen, activeTab, currentUser?.isAdmin]);

  if (!isOpen || !currentUser?.isAdmin) return null;

  const customizedBonesCount = bones.filter((b) => b.isCloudCustomized).length;

  // ---- Handlers ----
  const handleForceSyncFromCloud = async () => {
    setBusy(true);
    try {
      const bundle = await fetchCatalogBundle(true);
      onCatalogUpdated?.(bundle);
      const reg = await adminFetchUsersRegistry(true);
      setUsersList(reg.usersList || []);
      setPreAuthorizedList(reg.preAuthorizedList || []);
      showNotice('ดึงข้อมูลล่าสุดเรียบร้อยแล้ว');
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSeedDefaultDatabase = async () => {
    if (
      !window.confirm(
        'ต้องการรีเซ็ตข้อมูลโครงสร้างกระดูกทั้ง 31 หมวดและโรคกระดูกกลับเป็นค่าเริ่มต้นหรือไม่?'
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await seedFirestoreWithCanineData();
      if (res.bundle) onCatalogUpdated?.(res.bundle);
      showNotice(`รีเซ็ตข้อมูลมาตรฐานครบ ${res.count} โครงสร้างเรียบร้อยแล้ว`);
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleExportJson = () => {
    const bonesObj = {};
    for (const b of bones) {
      const { subPieces, ...rest } = b;
      bonesObj[b.id] = rest;
    }
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.email,
      bones: bonesObj,
      pathologiesList: pathologies,
      settings: settingsForm
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canine-osteology-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('ดาวน์โหลดไฟล์สำรองเรียบร้อยแล้ว');
  };

  const handleImportJsonFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const bundle = await adminImportFullCatalogJson(parsed);
      onCatalogUpdated?.(bundle);
      showNotice('นำเข้าไฟล์สำรองเรียบร้อยแล้ว');
    } catch (err) {
      showNotice(`นำเข้าไฟล์ไม่สำเร็จ: ${err.message}`, 'error');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const handleSaveBone = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updatedFields = {
        nameTh: boneForm.nameTh.trim(),
        nameEn: boneForm.nameEn.trim(),
        nameLatin: boneForm.nameLatin.trim(),
        color: boneForm.color,
        summaryTh: boneForm.summaryTh.trim(),
        descriptionTh: boneForm.descriptionTh.trim(),
        landmarks: boneForm.landmarksText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        articulations: boneForm.articulationsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        clinicalNotes: boneForm.clinicalNotes.trim(),
        customMedia: boneForm.customMedia
      };
      const bundle = await adminSaveBoneOverride(editingBoneId, updatedFields);
      onCatalogUpdated?.(bundle);
      showNotice(`บันทึกข้อมูล "${updatedFields.nameTh}" เรียบร้อยแล้ว`);
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleResetBone = async () => {
    if (!window.confirm('ต้องการคืนค่าข้อมูลกระดูกชิ้นนี้กลับเป็นค่าเริ่มต้นหรือไม่?')) return;
    setBusy(true);
    try {
      const bundle = await adminResetBoneToDefault(editingBoneId);
      onCatalogUpdated?.(bundle);
      showNotice('คืนค่ามาตรฐานให้ชิ้นกระดูกนี้เรียบร้อยแล้ว');
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAddCustomMediaToBone = () => {
    if (!newMediaUrl.trim()) return;
    const item = {
      id: 'custom_' + Date.now(),
      titleTh: newMediaTitle.trim() || 'ภาพอ้างอิงเพิ่มเติม',
      titleEn: 'Reference Image',
      type: 'radiograph',
      url: newMediaUrl.trim(),
      credit: `Added by ${currentUser.email}`
    };
    setBoneForm((prev) => ({
      ...prev,
      customMedia: [...(prev.customMedia || []), item]
    }));
    setNewMediaTitle('');
    setNewMediaUrl('');
  };

  // Pathology CRUD Handlers
  const handleStartNewPathology = () => {
    setIsCreatingNewPath(true);
    setSelectedPathId('__new__');
    setPathForm({
      id: 'path_' + Date.now().toString(36),
      nameTh: '',
      nameEn: '',
      severity: 'พบบ่อยทางคลินิก',
      affectedBones: ['skull'],
      descriptionTh: '',
      radiographicSigns: '',
      mediaId: '',
      customImageUrl: ''
    });
  };

  const handleToggleAffectedBone = (boneId) => {
    setPathForm((prev) => {
      const exists = prev.affectedBones.includes(boneId);
      const next = exists
        ? prev.affectedBones.filter((id) => id !== boneId)
        : [...prev.affectedBones, boneId];
      return { ...prev, affectedBones: next.length ? next : [boneId] };
    });
  };

  const handleSavePathologyForm = async (e) => {
    e.preventDefault();
    if (!pathForm.nameTh.trim()) {
      showNotice('กรุณาระบุชื่อโรคกระดูกภาษาไทย', 'error');
      return;
    }
    setBusy(true);
    try {
      const cleanItem = {
        ...pathForm,
        id: pathForm.id.trim() || 'path_' + Date.now().toString(36),
        nameTh: pathForm.nameTh.trim(),
        nameEn: pathForm.nameEn.trim(),
        severity: pathForm.severity.trim(),
        descriptionTh: pathForm.descriptionTh.trim(),
        radiographicSigns: pathForm.radiographicSigns.trim(),
        customImageUrl: pathForm.customImageUrl.trim()
      };

      const existsIdx = pathologies.findIndex((p) => p.id === cleanItem.id);
      const nextList =
        existsIdx >= 0
          ? pathologies.map((p, i) => (i === existsIdx ? cleanItem : p))
          : [...pathologies, cleanItem];

      const bundle = await adminSavePathologies(nextList);
      onCatalogUpdated?.(bundle);
      setIsCreatingNewPath(false);
      setSelectedPathId(cleanItem.id);
      showNotice(`บันทึกข้อมูลโรค "${cleanItem.nameTh}" เรียบร้อยแล้ว`);
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeletePathology = async (targetId) => {
    if (pathologies.length <= 1) {
      showNotice('ต้องมีรายการโรคกระดูกอย่างน้อย 1 รายการ', 'error');
      return;
    }
    if (!window.confirm('ยืนยันการลบรายการโรคกระดูกนี้ออกจากระบบ?')) return;
    setBusy(true);
    try {
      const nextList = pathologies.filter((p) => p.id !== targetId);
      const bundle = await adminSavePathologies(nextList);
      onCatalogUpdated?.(bundle);
      setIsCreatingNewPath(false);
      setSelectedPathId(nextList[0]?.id || '');
      showNotice('ลบรายการโรคกระดูกเรียบร้อยแล้ว');
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  // User Role Handlers
  const handleToggleUserRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'member' : 'admin';
    setBusy(true);
    try {
      const res = await adminUpdateUserRoleOrStatus(u.uid, { role: nextRole });
      setUsersList(res.usersList);
      showNotice(`เปลี่ยนสิทธิ์ของ ${u.email} เป็น ${nextRole.toUpperCase()} เรียบร้อยแล้ว`);
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleToggleUserStatus = async (u) => {
    const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
    setBusy(true);
    try {
      const res = await adminUpdateUserRoleOrStatus(u.uid, { status: nextStatus });
      setUsersList(res.usersList);
      showNotice(
        nextStatus === 'suspended'
          ? `ระงับการใช้งานบัญชี ${u.email} ชั่วคราวแล้ว`
          : `ปลดระงับบัญชี ${u.email} เรียบร้อยแล้ว`
      );
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAddPreAuthEmail = async (e) => {
    e.preventDefault();
    if (!newRoleEmail.trim()) return;
    setBusy(true);
    try {
      const res = await adminSetPreAuthorizedEmail(newRoleEmail, newRoleValue);
      setUsersList(res.usersList);
      setPreAuthorizedList(res.preAuthorizedList);
      setNewRoleEmail('');
      showNotice(
        `กำหนดสิทธิ์ล่วงหน้าให้ ${newRoleEmail.trim()} เป็น ${newRoleValue.toUpperCase()} เรียบร้อยแล้ว`
      );
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRemovePreAuth = async (email) => {
    setBusy(true);
    try {
      const res = await adminRemovePreAuthorizedEmail(email);
      setPreAuthorizedList(res.preAuthorizedList);
      showNotice(`ลบรายการกำหนดสิทธิ์ล่วงหน้าของ ${email} แล้ว`);
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const bundle = await adminSavePortalSettings(settingsForm);
      onCatalogUpdated?.(bundle);
      showNotice('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (err) {
      showNotice(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const filteredBones = bones.filter((b) => {
    const q = boneSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      b.nameTh.toLowerCase().includes(q) ||
      b.nameEn.toLowerCase().includes(q) ||
      b.nameLatin.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const TABS = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
    { id: 'bones', label: `โครงสร้างกระดูก (${bones.length})`, icon: Bone },
    { id: 'pathologies', label: `โรคกระดูกและข้อ (${pathologies.length})`, icon: Stethoscope },
    { id: 'users', label: `ผู้ใช้งานและสิทธิ์ (${usersList.length})`, icon: Users },
    { id: 'settings', label: 'ตั้งค่าระบบ & ประกาศ', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans animate-fade-in">
      {/* ==================== 1. FULL-PAGE HEADER BAR ==================== */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 shadow-sm">
        {/* Left: Back to 3D Atlas Button + Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 transition shrink-0"
            title="กลับไปยังหน้าสำรวจโครงกระดูก 3 มิติ"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้า 3D Atlas</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-md font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="truncate leading-tight">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  ศูนย์จัดการข้อมูลผู้ดูแลระบบ
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm shrink-0">
                  {currentUser.isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block truncate">
                ผู้ดูแลระบบ: <strong className="text-slate-700 dark:text-slate-300">{currentUser.email}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle + User Info + Logout */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition"
              title={theme === 'light' ? 'สลับเป็นโหมดห้องฟิล์มมืด (Radiology Dark)' : 'สลับเป็นโหมดคลินิกสว่าง (CHAi Light)'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>
          )}

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-[200px]">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="w-5 h-5 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 text-[10px] font-black flex items-center justify-center shrink-0">
                {(currentUser.email || 'A')[0].toUpperCase()}
              </div>
            )}
            <div className="truncate leading-none">
              <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.isSuperAdmin ? 'Super Admin' : 'Admin'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
            title="ปิดหน้าต่างจัดการ (กลับสู่ 3D Atlas)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ==================== 2. FULL-PAGE TAB NAVIGATION BAR ==================== */}
      <nav className="px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Toast Notification Banner */}
      {toast.text && (
        <div
          className={`mx-4 sm:mx-8 mt-3 px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 shadow-sm ${
            toast.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-200'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast({ text: '', type: '' })} className="opacity-70 hover:opacity-100 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== 3. FULL-PAGE WORKSPACE CONTENT ==================== */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5">
        <div className="w-full max-w-[1720px] mx-auto">
          {/* ==================== TAB 1: OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">โครงสร้างกระดูกทั้งหมด</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{bones.length} หมวด</div>
                  <div className="text-xs font-medium text-blue-600 dark:text-sky-400">
                    115 ชิ้น 3D · ปรับแต่งแล้ว {customizedBonesCount} หมวด
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">โรคกระดูกและข้อ</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {pathologies.length} รายการ
                  </div>
                  <div className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    เชื่อมโยงฟิล์มเอกซเรย์คลินิก
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">ผู้ใช้งานในระบบ</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {usersList.length} บัญชี
                  </div>
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    Super Admin: {PRIMARY_ADMIN_EMAIL}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">สถานะระบบ</div>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span>ออนไลน์</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ระบบฐานข้อมูลทำงานปกติ
                  </div>
                </div>
              </div>

              {/* Data Management & Backup Toolbox */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    สำรองและซิงก์ข้อมูล (Data &amp; Backup Tools)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ซิงก์ข้อมูลโครงสร้างกระดูกล่าสุด หรือส่งออก/นำเข้าไฟล์สำรอง (.JSON) ของระบบ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={handleForceSyncFromCloud}
                    disabled={busy}
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>ซิงก์ข้อมูลล่าสุด</span>
                  </button>

                  <button
                    onClick={handleSeedDefaultDatabase}
                    disabled={busy}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>รีเซ็ตค่ามาตรฐานเริ่มต้น</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    disabled={busy}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                    <span>ส่งออกไฟล์สำรอง (.JSON)</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>นำเข้าไฟล์สำรอง (.JSON)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Quick Jump Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('bones')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm text-left space-y-2 transition"
                >
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400">
                      <Bone className="w-5 h-5" />
                    </div>
                    <span>แก้ไขคำอธิบายกระดูก 31 โครงสร้าง</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    แก้ไขชื่อไทย/อังกฤษ/ละติน ปุ่มกระดูก Landmark ข้อต่อ โน้ตคลินิก และรูปภาพเพิ่มเติม
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('pathologies')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 shadow-sm text-left space-y-2 transition"
                >
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <span>จัดการโรคกระดูกทางคลินิก</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    เพิ่ม/แก้ไขกรณีศึกษาโรคกระดูก และผูกตำแหน่งชิ้นกระดูกที่แสดงผลบนโมเดล 3D
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-sm text-left space-y-2 transition"
                >
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span>จัดการผู้ใช้และแต่งตั้ง Admin</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    ตรวจสอบรายชื่อผู้เข้าเรียน แต่งตั้งอาจารย์ท่านอื่นเป็น Admin หรือระงับสิทธิ์การใช้งาน
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: BONES EDITOR ==================== */}
          {activeTab === 'bones' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-160px)]">
              {/* Left Column: Bone Selection List */}
              <div className="lg:col-span-4 xl:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col h-full overflow-hidden">
                <div className="relative mb-3 shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={boneSearch}
                    onChange={(e) => setBoneSearch(e.target.value)}
                    placeholder="ค้นหาโครงสร้างกระดูก..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {filteredBones.map((b) => {
                    const selected = b.id === editingBoneId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setEditingBoneId(b.id)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all ${
                          selected
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">{b.nameTh}</div>
                          <div
                            className={`text-[10px] truncate ${
                              selected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {b.nameEn} ({b.meshes.length} ชิ้น 3D)
                          </div>
                        </div>
                        {b.isCloudCustomized && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            แก้ไขแล้ว
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Full-featured Bone Form */}
              <form
                onSubmit={handleSaveBone}
                className="lg:col-span-8 xl:col-span-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full overflow-hidden"
              >
                {/* Form Top Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-600 dark:text-sky-400">
                      ID: {editingBoneId}
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      แก้ไขเนื้อหา: {boneForm.nameTh}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onJumpToBone3D?.(editingBoneId);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                      <span>ดูบนโมเดล 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetBone}
                      disabled={busy}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>คืนค่าเริ่มต้น</span>
                    </button>
                  </div>
                </div>

                {/* Form Scrollable Body */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อภาษาไทย</label>
                      <input
                        type="text"
                        required
                        value={boneForm.nameTh}
                        onChange={(e) => setBoneForm({ ...boneForm, nameTh: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อภาษาอังกฤษ</label>
                      <input
                        type="text"
                        required
                        value={boneForm.nameEn}
                        onChange={(e) => setBoneForm({ ...boneForm, nameEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อละติน (NAV)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={boneForm.nameLatin}
                          onChange={(e) => setBoneForm({ ...boneForm, nameLatin: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="color"
                          value={boneForm.color}
                          onChange={(e) => setBoneForm({ ...boneForm, color: e.target.value })}
                          title="สีป้ายหมวดหมู่"
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">คำอธิบายสรุปย่อ</label>
                    <textarea
                      rows={2}
                      value={boneForm.summaryTh}
                      onChange={(e) => setBoneForm({ ...boneForm, summaryTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                      เนื้อหากายวิภาคศาสตร์ฉบับเต็ม
                    </label>
                    <textarea
                      rows={4}
                      value={boneForm.descriptionTh}
                      onChange={(e) => setBoneForm({ ...boneForm, descriptionTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                        ปุ่มและจุดสำคัญบนกระดูก (บรรทัดละ 1 ข้อ)
                      </label>
                      <textarea
                        rows={5}
                        value={boneForm.landmarksText}
                        onChange={(e) => setBoneForm({ ...boneForm, landmarksText: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                        ข้อต่อที่เชื่อมโยง (บรรทัดละ 1 ข้อ)
                      </label>
                      <textarea
                        rows={5}
                        value={boneForm.articulationsText}
                        onChange={(e) =>
                          setBoneForm({ ...boneForm, articulationsText: e.target.value })
                        }
                        className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                      ความสำคัญทางคลินิกสัตวแพทย์ (Clinical Notes)
                    </label>
                    <textarea
                      rows={2}
                      value={boneForm.clinicalNotes}
                      onChange={(e) => setBoneForm({ ...boneForm, clinicalNotes: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* External Reference Image Links */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="font-bold text-slate-900 dark:text-white">
                      รูปภาพและฟิล์มเอกซเรย์เพิ่มเติม (URL)
                    </div>
                    {(boneForm.customMedia || []).length > 0 && (
                      <div className="space-y-1.5">
                        {boneForm.customMedia.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                          >
                            <div className="truncate">
                              <span className="font-bold text-slate-900 dark:text-white">{m.titleTh}</span>
                              <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">{m.url}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setBoneForm((prev) => ({
                                  ...prev,
                                  customMedia: prev.customMedia.filter((x) => x.id !== m.id)
                                }))
                              }
                              className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="ลบรูปนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        placeholder="ชื่อภาพ เช่น ฟิล์มเอกซเรย์กะโหลกด้านข้าง (Lateral Skull)"
                        className="sm:w-64 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <input
                        type="url"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder="https://... (ลิงก์ตรงของรูปภาพ)"
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomMediaToBone}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shrink-0 transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มรูป</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Bottom Save Button */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
                  <button
                    type="submit"
                    disabled={busy}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{busy ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== TAB 3: PATHOLOGIES CRUD ==================== */}
          {activeTab === 'pathologies' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-160px)]">
              {/* Left Column: Pathology List */}
              <div className="lg:col-span-4 xl:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col h-full overflow-hidden space-y-3">
                <button
                  type="button"
                  onClick={handleStartNewPathology}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มโรคกระดูกทางคลินิกใหม่</span>
                </button>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {pathologies.map((p) => {
                    const active = !isCreatingNewPath && p.id === selectedPathId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setIsCreatingNewPath(false);
                          setSelectedPathId(p.id);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-left transition-all ${
                          active
                            ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="line-clamp-1 text-xs">{p.nameTh}</div>
                        <div
                          className={`text-[10px] truncate ${
                            active ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {p.nameEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Pathology Editor */}
              <form
                onSubmit={handleSavePathologyForm}
                className="lg:col-span-8 xl:col-span-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isCreatingNewPath ? 'สร้างรายการโรคกระดูกใหม่' : `แก้ไขโรคกระดูก: ${pathForm.nameTh}`}
                  </h2>
                  {!isCreatingNewPath && (
                    <button
                      type="button"
                      onClick={() => handleDeletePathology(pathForm.id)}
                      disabled={busy}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>ลบรายการนี้</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อโรคภาษาไทย</label>
                      <input
                        type="text"
                        required
                        value={pathForm.nameTh}
                        onChange={(e) => setPathForm({ ...pathForm, nameTh: e.target.value })}
                        placeholder="เช่น โรคข้อสะโพกเสื่อมในสุนัข"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อโรคภาษาอังกฤษ</label>
                      <input
                        type="text"
                        value={pathForm.nameEn}
                        onChange={(e) => setPathForm({ ...pathForm, nameEn: e.target.value })}
                        placeholder="Canine Hip Dysplasia"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                        ป้ายความสำคัญ / ความชุกทางคลินิก
                      </label>
                      <input
                        type="text"
                        value={pathForm.severity}
                        onChange={(e) => setPathForm({ ...pathForm, severity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                        URL ภาพเอกซเรย์ประกอบ (ถ้าต้องการกำหนดเอง)
                      </label>
                      <input
                        type="url"
                        value={pathForm.customImageUrl}
                        onChange={(e) => setPathForm({ ...pathForm, customImageUrl: e.target.value })}
                        placeholder="https://... (เว้นว่างเพื่อใช้ภาพมาตรฐานในระบบ)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                      คำอธิบายพยาธิสภาพและอาการทางคลินิก
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={pathForm.descriptionTh}
                      onChange={(e) => setPathForm({ ...pathForm, descriptionTh: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">
                      จุดสังเกตในฟิล์มเอกซเรย์ (Radiographic Signs)
                    </label>
                    <textarea
                      rows={2}
                      value={pathForm.radiographicSigns}
                      onChange={(e) => setPathForm({ ...pathForm, radiographicSigns: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-2">
                      เลือกชิ้นกระดูกที่เกี่ยวข้อง (คลิกเพื่อผูกไฮไลต์บนโมเดล 3D):
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      {bones.map((b) => {
                        const checked = pathForm.affectedBones.includes(b.id);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleToggleAffectedBone(b.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              checked
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-500'
                            }`}
                          >
                            {b.nameTh}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
                  <button
                    type="submit"
                    disabled={busy}
                    className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-rose-600/25 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกข้อมูลโรค</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== TAB 4: USERS & ROLES ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Pre-authorize Admin Email Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                    <span>กำหนดสิทธิ์ผู้ดูแลระบบล่วงหน้าตามอีเมล (Pre-authorize Admin Email)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    ระบุอีเมลของอาจารย์หรือผู้ช่วยสอนล่วงหน้า เมื่อเจ้าของอีเมล Login เข้ามาครั้งแรก ระบบจะมอบสิทธิ์ตามที่กำหนดทันที
                  </p>
                </div>

                <form onSubmit={handleAddPreAuthEmail} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={newRoleEmail}
                    onChange={(e) => setNewRoleEmail(e.target.value)}
                    placeholder="กรอกอีเมล เช่น instructor@msu.ac.th"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={newRoleValue}
                    onChange={(e) => setNewRoleValue(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="admin">สิทธิ์ผู้ดูแลระบบ (Admin)</option>
                    <option value="member">ผู้ใช้งานทั่วไป (Member)</option>
                  </select>
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>บันทึกสิทธิ์</span>
                  </button>
                </form>

                {preAuthorizedList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {preAuthorizedList.map((item) => (
                      <div
                        key={item.email}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/12 border border-amber-500/30 text-xs"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">{item.email}</span>
                        <span className="uppercase font-extrabold text-amber-700 dark:text-amber-300">
                          {item.role}
                        </span>
                        {!isPrimaryAdminEmail(item.email) && (
                          <button
                            type="button"
                            onClick={() => handleRemovePreAuth(item.email)}
                            className="text-rose-500 hover:text-rose-600 p-0.5"
                            title="ลบรายการล่วงหน้า"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registered Users Full-width Table */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      รายชื่อผู้ใช้งานที่เข้าสู่ระบบแล้ว ({usersList.length} บัญชี)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      รายชื่อและสถานะของผู้ใช้งานทั้งหมดในระบบ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setBusy(true);
                      try {
                        const res = await adminFetchUsersRegistry(true);
                        setUsersList(res.usersList || []);
                        setPreAuthorizedList(res.preAuthorizedList || []);
                        showNotice('อัปเดตรายชื่อผู้ใช้งานล่าสุดแล้ว');
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>รีเฟรชรายชื่อ</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] border-b border-slate-200 dark:border-slate-800">
                        <th className="py-3 px-5">ผู้ใช้งาน</th>
                        <th className="py-3 px-5">สิทธิ์ (Role)</th>
                        <th className="py-3 px-5">สถานะ</th>
                        <th className="py-3 px-5">ความก้าวหน้าการเรียน</th>
                        <th className="py-3 px-5">เข้าใช้ล่าสุด</th>
                        <th className="py-3 px-5 text-right">จัดการสิทธิ์</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {usersList.map((u) => {
                        const isPrimary = isPrimaryAdminEmail(u.email);
                        const isUserAdmin = isPrimary || u.role === 'admin' || u.role === 'super_admin';
                        const isSuspended = u.status === 'suspended';
                        return (
                          <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-5">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{u.displayName || 'ผู้ใช้งาน'}</span>
                                {isPrimary && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{u.email}</div>
                            </td>
                            <td className="py-3.5 px-5">
                              {isPrimary ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm">
                                  SUPER ADMIN (หลัก)
                                </span>
                              ) : isUserAdmin ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600/15 text-blue-700 dark:text-sky-300 border border-blue-500/30">
                                  ADMIN
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  MEMBER
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5">
                              {isSuspended ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                                  ระงับชั่วคราว
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                  ปกติ
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                              {u.studiedCount || 0} / {bones.length} หมวด
                            </td>
                            <td className="py-3.5 px-5 text-[11px] text-slate-500 dark:text-slate-400">
                              {u.lastLoginAt
                                ? new Date(u.lastLoginAt).toLocaleString('th-TH')
                                : '-'}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              {isPrimary ? (
                                <span className="text-xs text-slate-400 italic">
                                  ผู้ดูแลระบบหลักถาวร
                                </span>
                              ) : (
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleToggleUserRole(u)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 transition"
                                  >
                                    {u.role === 'admin' ? 'ปรับเป็น Member' : 'ตั้งเป็น Admin'}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleToggleUserStatus(u)}
                                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
                                      isSuspended
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300'
                                    }`}
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    <span>{isSuspended ? 'ปลดระงับ' : 'ระงับ'}</span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {usersList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                            ยังไม่มีข้อมูลรายชื่อผู้ใช้งานที่ซิงก์ในระบบ
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: PORTAL SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSaveSettings}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    ตั้งค่าระบบและแถบประกาศหน้าเว็บ (Portal Settings)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ปรับแต่งชื่อสถาบัน ข้อความประกาศ และการตั้งค่าเริ่มต้นของระบบ Atlas
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อระบบบนแถบหัวเว็บ</label>
                    <input
                      type="text"
                      value={settingsForm.portalTitle}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, portalTitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-900 dark:text-white mb-1.5">ชื่อหน่วยงาน / รายวิชา</label>
                    <input
                      type="text"
                      value={settingsForm.institutionName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, institutionName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Announcement Banner Controls */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <label className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(settingsForm.announcementEnabled)}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcementEnabled: e.target.checked
                        })
                      }
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>เปิดแสดงแถบประกาศข่าวสารด้านบนสุดของหน้าเว็บ</span>
                  </label>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-300 text-xs mb-1.5">
                      ข้อความประกาศถึงนิสิต / ผู้ใช้งาน
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                      }
                      placeholder="เช่น สอบปฏิบัติกายวิภาคกระดูกสุนัข วันศุกร์นี้ เวลา 13:00 น."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-300 text-xs mb-1.5">
                        โทนสีแถบประกาศ
                      </label>
                      <select
                        value={settingsForm.announcementColor}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, announcementColor: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                      >
                        <option value="blue">สีน้ำเงินคลินิก (Blue)</option>
                        <option value="emerald">สีเขียวสด (Emerald)</option>
                        <option value="amber">สีเหลืองอำพัน (Amber)</option>
                        <option value="rose">สีแดงแจ้งเตือน (Rose)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-300 text-xs mb-1.5">
                        รูปทรงกะโหลกเริ่มต้นเมื่อเปิดเว็บ
                      </label>
                      <select
                        value={settingsForm.defaultCephalicType}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            defaultCephalicType: e.target.value
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                      >
                        <option value="mesocephalic">Mesocephalic (กะโหลกสมดุลมาตรฐาน)</option>
                        <option value="brachycephalic">Brachycephalic (กะโหลกสั้น-กว้าง)</option>
                        <option value="dolichocephalic">Dolichocephalic (กะโหลกยาว-แคบ)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Maintenance Mode Lock */}
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(settingsForm.maintenanceMode)}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-rose-600"
                    />
                    <div>
                      <div className="font-bold text-sm text-rose-700 dark:text-rose-300">
                        โหมดปิดปรับปรุงชั่วคราว (Maintenance Mode Lock)
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        เมื่อเปิดใช้งาน เฉพาะบัญชี Admin ({PRIMARY_ADMIN_EMAIL} และ Admin ร่วม) เท่านั้นที่เข้าดูโมเดล 3D ได้ ผู้ใช้งานทั่วไปจะพบหน้าแจ้งเตือนการปิดปรับปรุง
                      </div>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกการตั้งค่า</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
