import React from 'react';
import {
  Expand,
  RotateCcw,
  Tag,
  Camera,
  RefreshCw,
  Dog,
  Ruler
} from 'lucide-react';

export default function ViewerToolbar({
  explodeProgress,
  onChangeExplodeProgress,
  renderMode,
  onChangeRenderMode,
  bodyContourMode,
  onChangeBodyContourMode,
  measureMode = 'off',
  onToggleMeasure,
  showLabels3D,
  onToggleLabels3D,
  autoRotate,
  onToggleAutoRotate,
  onSelectCameraPreset,
  onCaptureScreenshot,
  onResetView
}) {
  const cycleBodyContour = () => {
    const order = ['ghost', 'wire', 'off'];
    const next = order[(order.indexOf(bodyContourMode) + 1) % order.length];
    onChangeBodyContourMode(next);
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[96vw] chai-panel rounded-2xl px-3 py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
      {/* 1. Exploded View Slider */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-xl chai-card">
        <Expand className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
        <span className="text-[11px] font-bold chai-text-primary hidden md:inline">
          แยกชิ้น
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={explodeProgress}
          onChange={(e) => onChangeExplodeProgress(parseFloat(e.target.value))}
          className="w-20 sm:w-28 h-1.5 cursor-pointer"
          title="เลื่อนเพื่อแยกชิ้นกระดูกทั้ง 115 ชิ้นออกจากกัน"
        />
        <span className="text-[10px] font-mono w-8 text-right chai-text-secondary">
          {Math.round(explodeProgress * 100)}%
        </span>
      </div>

      {/* 2. Render Mode Pills */}
      <div className="flex items-center gap-1 p-0.5 rounded-xl chai-card">
        {[
          { id: 'natural', label: 'กระดูกจริง' },
          { id: 'xray', label: 'X-Ray' },
          { id: 'colored', label: 'แยกสีส่วน' },
          { id: 'wireframe', label: 'เส้นโครง' }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => onChangeRenderMode(mode.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              renderMode === mode.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'chai-text-secondary hover:chai-text-primary'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* 3. Canine Body Contour Silhouette */}
      <button
        onClick={cycleBodyContour}
        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
          bodyContourMode !== 'off'
            ? 'bg-indigo-600/12 border-indigo-500/40 text-indigo-700 dark:text-indigo-300'
            : 'chai-card chai-text-secondary'
        }`}
        title="เปิด/ปิดเงาร่างผิวกายสุนัขรอบโครงกระดูก"
      >
        <Dog className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          เงาลำตัว:{' '}
          {bodyContourMode === 'ghost'
            ? 'โปร่งแสง'
            : bodyContourMode === 'wire'
            ? 'เส้นขอบ'
            : 'ปิด'}
        </span>
      </button>

      {/* 4. Veterinary Camera Angle Presets */}
      <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-xl chai-card text-[11px]">
        {[
          { id: 'default', label: '3D' },
          { id: 'front', label: 'หน้า' },
          { id: 'left', label: 'ซ้าย' },
          { id: 'right', label: 'ขวา' },
          { id: 'top', label: 'บน' },
          { id: 'bottom', label: 'ล่าง' },
          { id: 'back', label: 'ท้าย' }
        ].map((cam) => (
          <button
            key={cam.id}
            onClick={() => onSelectCameraPreset(cam.id)}
            className="px-2 py-1 rounded-lg font-medium chai-text-secondary hover:bg-blue-600/12 hover:text-blue-600 dark:hover:text-sky-300 transition"
          >
            {cam.label}
          </button>
        ))}
      </div>

      {/* 5. 3D Caliper & Orthopedic Angle Measurement Tool */}
      <button
        onClick={onToggleMeasure}
        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
          measureMode !== 'off'
            ? 'bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 shadow-sm'
            : 'chai-card chai-text-secondary hover:chai-text-primary'
        }`}
        title="เปิด/ปิดเครื่องมือวัดระยะ 3D และมุมกระดูกสัตว์แพทย์ (Caliper & Orthopedic Angles)"
      >
        <Ruler className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="hidden sm:inline">ไม้บรรทัด 3D</span>
      </button>

      {/* 6. Utility Icon Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleLabels3D}
          className={`p-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1 transition ${
            showLabels3D
              ? 'bg-blue-600 text-white border-blue-500'
              : 'chai-card chai-text-secondary hover:border-blue-500/40'
          }`}
          title="แสดงป้ายชื่อชี้ตำแหน่งกระดูกในพื้นที่ 3 มิติ"
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">ป้ายชื่อ 3D</span>
        </button>

        <button
          onClick={onToggleAutoRotate}
          className={`p-1.5 rounded-xl border transition ${
            autoRotate
              ? 'bg-blue-600 text-white border-blue-500'
              : 'chai-card chai-text-secondary hover:border-blue-500/40'
          }`}
          title="หมุนโมเดลอัตโนมัติ 360°"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onCaptureScreenshot}
          className="p-1.5 rounded-xl chai-card chai-text-secondary hover:border-blue-500/40 transition"
          title="บันทึกภาพหน้าจอ 3D เป็นไฟล์ PNG ความละเอียดสูง"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetView}
          className="p-1.5 px-2.5 rounded-xl chai-card chai-text-primary hover:border-blue-500/40 font-semibold text-[11px] flex items-center gap-1 transition"
          title="รีเซ็ตมุมกล้องและการแสดงผลทั้งหมด"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">รีเซ็ต</span>
        </button>
      </div>
    </div>
  );
}
