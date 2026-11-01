import React, { useState, useMemo } from 'react';
import {
  X,
  Image as ImageIcon,
  ExternalLink,
  Bone,
  Search
} from 'lucide-react';
import { CANINE_MEDIA_CATALOG } from '../../data/canineMediaData';
import { BONE_BY_ID } from '../../data/canineSkeletonData';

const ALL_MEDIA = Object.values(CANINE_MEDIA_CATALOG);

export default function WikiAtlasModal({ isOpen, onClose, onSelectBone }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'diagram' | 'radiograph' | 'specimen' | 'histology'
  const [search, setSearch] = useState('');
  const [activeMedia, setActiveMedia] = useState(ALL_MEDIA[0]);

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_MEDIA.filter((item) => {
      const matchType = filterType === 'all' || item.type === filterType;
      if (!matchType) return false;
      if (!q) return true;
      return (
        item.titleTh.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.captionTh.toLowerCase().includes(q)
      );
    });
  }, [filterType, search]);

  if (!isOpen) return null;

  const selected = activeMedia && filteredList.some((m) => m.id === activeMedia.id)
    ? activeMedia
    : filteredList[0] || ALL_MEDIA[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[88vh] rounded-2xl chai-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold chai-text-primary">
                คลังแผนภาพกายวิภาคและฟิล์มเอกซเรย์อ้างอิง (Wikimedia Veterinary Atlas)
              </h2>
              <p className="text-[11px] chai-text-secondary">
                รวบรวมแผนภาพเวกเตอร์ ฟิล์ม X-Ray จริง ตัวอย่างกระดูกพิพิธภัณฑ์ และตำรา Sisson / Ellenberger เชื่อมโยงตรงกับโมเดล 3D
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200/70 dark:hover:bg-slate-800 chai-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-2.5 border-b border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `ทั้งหมด (${ALL_MEDIA.length})` },
              { id: 'diagram', label: 'แผนภาพ & ตำราคลาสสิก' },
              { id: 'radiograph', label: 'ฟิล์มเอกซเรย์ X-Ray' },
              { id: 'specimen', label: 'กระดูกจริงพิพิธภัณฑ์' },
              { id: 'histology', label: 'จุลกายวิภาคเนื้อกระดูก' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  filterType === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'chai-card chai-text-secondary hover:border-blue-500/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 chai-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาภาพเอกซเรย์ หรือชื่อกระดูก..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl chai-card text-xs chai-text-primary focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Main Split View: Thumbnail Grid (Left) + High-Res Viewer & 3D Links (Right) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Grid */}
          <div className="lg:col-span-5 overflow-y-auto p-3 border-r border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-2.5 content-start">
            {filteredList.map((item) => {
              const isCurrent = selected?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveMedia(item)}
                  className={`rounded-xl overflow-hidden cursor-pointer border transition-all flex flex-col ${
                    isCurrent
                      ? 'border-blue-600 ring-2 ring-blue-500/30 chai-card'
                      : 'chai-card hover:border-blue-500/40'
                  }`}
                >
                  <div className="h-28 bg-slate-900 flex items-center justify-center p-1">
                    <img
                      src={item.url}
                      alt={item.titleTh}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-2 text-[11px]">
                    <div className="font-bold chai-text-primary line-clamp-2 leading-snug">
                      {item.titleTh}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right High-Res Plate Inspector */}
          {selected && (
            <div className="lg:col-span-7 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 min-h-[300px] sm:min-h-[390px] flex items-center justify-center p-3">
                <img
                  src={selected.svgUrl || selected.url}
                  alt={selected.titleTh}
                  className="max-h-[430px] max-w-full object-contain rounded"
                />
                <a
                  href={selected.svgUrl || selected.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-slate-700 text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ดูภาพขนาดเต็ม</span>
                </a>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold chai-text-primary">
                  {selected.titleTh}
                </h3>
                <div className="text-xs font-medium chai-text-secondary">
                  {selected.titleEn}
                </div>
                <p className="text-xs chai-text-primary leading-relaxed pt-1">
                  {selected.captionTh}
                </p>
                <p className="text-[11px] chai-text-muted">
                  สัญญาอนุญาต: {selected.license} · ที่มา: {selected.attribution}
                </p>
              </div>

              {/* Jump to 3D Bone Links */}
              {selected.relatedBoneIds?.length > 0 && (
                <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold chai-text-primary flex items-center gap-1.5">
                    <Bone className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>คลิกเพื่อไปดูชิ้นกระดูกที่ปรากฏในภาพนี้บนโมเดล 3 มิติ:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.relatedBoneIds.map((bId) => {
                      const bone = BONE_BY_ID[bId];
                      if (!bone) return null;
                      return (
                        <button
                          key={bId}
                          onClick={() => {
                            onSelectBone(bId, null);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <span>ดู {bone.nameTh} ใน 3D</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
