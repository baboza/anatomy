import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Bone, Stethoscope, Layers, ArrowRight, Columns3 } from 'lucide-react';
import { CANINE_BONES, VET_PATHOLOGIES } from '../../data/canineSkeletonData';
import { CEPHALIC_TYPE_ORDER, CEPHALIC_TYPES } from '../../utils/cephalicMorph';

export default function SearchCommandModal({
  isOpen,
  onClose,
  bones: bonesProp = CANINE_BONES,
  pathologies: pathologiesProp = VET_PATHOLOGIES,
  onSelectBone,
  onSelectPathology,
  onSelectCephalicType
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        cephalics: CEPHALIC_TYPE_ORDER.map((id) => CEPHALIC_TYPES[id]),
        bones: bonesProp.slice(0, 10),
        subPieces: [],
        pathologies: pathologiesProp.slice(0, 4)
      };
    }

    const cephalics = CEPHALIC_TYPE_ORDER.map((id) => CEPHALIC_TYPES[id]).filter(
      (c) =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameTh.toLowerCase().includes(q) ||
        c.headShapeEn.toLowerCase().includes(q) ||
        c.headShapeTh.toLowerCase().includes(q) ||
        q.includes('cephalic') ||
        q.includes('กะโหลก') ||
        c.breedsEn.some((b) => b.toLowerCase().includes(q)) ||
        c.breedsTh.some((b) => b.toLowerCase().includes(q))
    );

    const bones = bonesProp.filter(
      (b) =>
        b.nameTh.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.nameLatin.toLowerCase().includes(q) ||
        b.summaryTh.toLowerCase().includes(q) ||
        (b.landmarks || []).some((lm) => lm.toLowerCase().includes(q))
    );

    const subPieces = [];
    for (const b of bonesProp) {
      if (b.meshes.length <= 1) continue;
      for (const sp of b.subPieces || []) {
        if (
          sp.shortLabel.toLowerCase().includes(q) ||
          sp.labelTh.toLowerCase().includes(q) ||
          sp.labelEn.toLowerCase().includes(q) ||
          sp.meshName.toLowerCase().includes(q)
        ) {
          subPieces.push({ bone: b, subPiece: sp });
          if (subPieces.length >= 16) break;
        }
      }
      if (subPieces.length >= 16) break;
    }

    const pathologies = pathologiesProp.filter(
      (p) =>
        p.nameTh.toLowerCase().includes(q) ||
        (p.nameEn || '').toLowerCase().includes(q) ||
        p.descriptionTh.toLowerCase().includes(q)
    );

    return { cephalics, bones, subPieces, pathologies };
  }, [query, bonesProp, pathologiesProp]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl chai-panel overflow-hidden flex flex-col max-h-[78vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-3.5 border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && results.bones.length > 0) {
                onSelectBone(results.bones[0].id, null);
                onClose();
              } else if (e.key === 'Enter' && results.subPieces.length > 0) {
                const first = results.subPieces[0];
                onSelectBone(first.bone.id, first.subPiece.meshName);
                onClose();
              }
            }}
            placeholder="พิมพ์ชื่อกระดูก เช่น กะโหลก, Femur, T11, ซี่โครง 5, สะบ้า, Os penis, Hip Dysplasia..."
            className="flex-1 bg-transparent text-sm chai-text-primary placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs chai-text-secondary hover:underline"
            >
              ล้างคำค้น
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 chai-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* 3 Cephalic Skull Morphotypes */}
          {results.cephalics?.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider chai-text-muted flex items-center gap-1.5">
                <Columns3 className="w-3.5 h-3.5 text-indigo-500" />
                <span>รูปทรงกะโหลกสุนัข 3 ประเภท · Cephalic Types ({results.cephalics.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {results.cephalics.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectCephalicType) onSelectCephalicType(c.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl chai-card hover:border-blue-500/50 text-left transition-all space-y-0.5"
                  >
                    <div className="font-extrabold flex items-center gap-1.5" style={{ color: c.accentColor }}>
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: c.accentColor }}
                      />
                      <span>{c.nameEn}</span>
                    </div>
                    <div className="text-[11px] font-bold chai-text-primary truncate">
                      {c.headShapeEn} · CI {c.cephalicIndex}
                    </div>
                    <div className="text-[10px] chai-text-muted truncate">
                      {c.breedsEn.slice(0, 3).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Structures */}
          {results.bones.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider chai-text-muted flex items-center gap-1.5">
                <Bone className="w-3.5 h-3.5" />
                <span>โครงสร้างกระดูกหลัก ({results.bones.length})</span>
              </div>
              <div className="space-y-1">
                {results.bones.map((bone) => (
                  <button
                    key={bone.id}
                    onClick={() => {
                      onSelectBone(bone.id, null);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-blue-600/10 flex items-center justify-between gap-3 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: bone.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold chai-text-primary truncate">
                          {bone.nameTh}{' '}
                          <span className="font-medium chai-text-secondary">
                            · {bone.nameEn}
                          </span>
                        </div>
                        <div className="text-[11px] italic chai-text-muted truncate">
                          {bone.nameLatin} · {bone.meshes.length} ชิ้นโมเดล 3D
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 chai-text-muted group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Individual Sub-Pieces (e.g. T11, Rib 6 L, Left Femur) */}
          {results.subPieces.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider chai-text-muted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>ชิ้นกระดูกย่อยรายชิ้น ({results.subPieces.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {results.subPieces.map(({ bone, subPiece }) => (
                  <button
                    key={subPiece.meshName}
                    onClick={() => {
                      onSelectBone(bone.id, subPiece.meshName);
                      onClose();
                    }}
                    className="p-2 rounded-xl chai-card hover:border-blue-500/50 flex items-center justify-between text-left transition-all"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold chai-text-primary truncate">
                        {subPiece.labelTh}
                      </div>
                      <div className="text-[10px] chai-text-muted truncate">
                        {subPiece.labelEn}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-700 dark:text-sky-300 font-mono text-[10px] shrink-0">
                      {subPiece.shortLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pathologies */}
          {results.pathologies.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider chai-text-muted flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                <span>พยาธิวิทยาและโรคกระดูกที่เกี่ยวข้อง ({results.pathologies.length})</span>
              </div>
              <div className="space-y-1">
                {results.pathologies.map((pathItem) => (
                  <button
                    key={pathItem.id}
                    onClick={() => {
                      onSelectPathology(pathItem);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-rose-500/10 flex items-center justify-between gap-3 text-left transition-all"
                  >
                    <div className="min-w-0">
                      <div className="font-bold chai-text-primary truncate">
                        {pathItem.nameTh}
                      </div>
                      <div className="text-[11px] chai-text-secondary truncate">
                        {pathItem.nameEn} · {pathItem.severity}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-300 shrink-0">
                      ดูรอยโรค 3D
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.bones.length === 0 &&
            results.subPieces.length === 0 &&
            results.pathologies.length === 0 && (
              <div className="py-10 text-center chai-text-secondary">
                ไม่พบผลลัพธ์สำหรับ “{query}” — ลองค้นหาด้วยคำว่า Skull, Femur, T11, ซี่โครง หรือ สะบ้า
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
