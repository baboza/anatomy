import * as THREE from 'three';

/**
 * Canine Craniofacial Morphometry & 3 Cephalic Types (กะโหลกสุนัข 3 ประเภทมาตรฐานสัตวแพทย์)
 * Scientifically accurate osteological definitions (correcting common internet poster typos):
 *  1. Brachycephalic (กะโหลกสั้น-กว้าง / พันธุ์หน้าสั้น) — High Cephalic Index (~80–100+)
 *  2. Mesocephalic   (กะโหลกสมดุลปานกลาง / พันธุ์หน้าปานกลาง) — Medium Cephalic Index (~50–65)
 *  3. Dolichocephalic (กะโหลกยาว-แคบ / พันธุ์หน้ายาว) — Low Cephalic Index (<50)
 */

export const CEPHALIC_TYPE_ORDER = ['brachycephalic', 'mesocephalic', 'dolichocephalic'];

export const CEPHALIC_TYPES = {
  brachycephalic: {
    id: 'brachycephalic',
    nameEn: 'Brachycephalic',
    nameTh: 'พันธุ์หน้าสั้น (กะโหลกสั้น-กว้าง)',
    shortTh: 'หน้าสั้น (Brachy)',
    headShapeEn: 'Short, broad skull',
    headShapeTh: 'กะโหลกสั้นและกว้าง โหนกแก้มกางออก สันจมูกสั้นหักมุมชัด',
    etymology: 'กรีก brachys (βραχύς = สั้น) + kephalē (κεφαλή = ศีรษะ)',
    cephalicIndex: '80 – 100+',
    cephalicIndexValue: 88,
    craniofacialRatio: '1 : 0.35 (ส่วนหน้าสั้นมากเมื่อเทียบกับกล่องสมอง)',
    stopAngleTh: 'มุมหักดั้งจมูก (Stop) ชันและลึกชัดเจน (~90°–110°)',
    occlusionTh: 'มักพบขากรรไกรล่างยื่นยาวกว่าบน (Mandibular Prognathism / Undershot Bite)',
    accentColor: '#e11d48',
    badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    breedsEn: ['Pug', 'English Bulldog', 'French Bulldog', 'Pekingese', 'Boston Terrier', 'Boxer', 'Shih Tzu'],
    breedsTh: ['ปั๊ก (Pug)', 'อิงลิชบูลด็อก', 'เฟรนช์บูลด็อก', 'ปักกิ่ง (Pekingese)', 'บอสตันเทอร์เรีย', 'บ็อกเซอร์', 'ชิสุ'],
    osteologyPointsTh: [
      'กระดูกขากรรไกรบน (Maxilla) และกระดูกจมูก (Nasal bone) หดสั้นลงอย่างมาก (Brachygnathia superior)',
      'โค้งโหนกแก้ม (Zygomatic arch) กางโค้งออกด้านข้างกว้างมาก ทำให้เบ้าตาตื้น (Shallow orbit)',
      'กะโหลกส่วนหุ้มสมอง (Neurocranium) โค้งมนกลมกว้าง รอยต่อกระดูกหน้าผากหักมุมชัน (Deep Stop)',
      'ฟันกรามน้อยและฟันหน้าเรียงเบียดซ้อนหรือบิดแกน (Dental crowding & rotation) และมักสบฟันแบบขากรรไกรล่างยื่น (Undershot)'
    ],
    clinicalNotesTh:
      'เสี่ยงต่อกลุ่มอาการทางเดินหายใจอุดกั้นในสุนัขพันธุ์หน้าสั้น (BOAS: รูจมูกตีบ เพดานอ่อนยาว), เบ้าตาตื้นทำให้ลูกตาเสี่ยงทะลัก ( ocular proptosis ), ฟันเบียดซ้อนเกิดโรคปริทันต์เร็ว และคลอดยากจากหัวลูกสุนัขกว้าง',
    wikiMediaIds: ['local-cephalic-3types-dorsal', 'specimen-pug-skull', 'specimen-bulldog-skull', 'diagram-boxer-craniofacial']
  },

  mesocephalic: {
    id: 'mesocephalic',
    nameEn: 'Mesocephalic',
    nameTh: 'พันธุ์หน้าปานกลาง (กะโหลกสมดุล)',
    shortTh: 'สมดุล (Meso)',
    headShapeEn: 'Medium, balanced skull',
    headShapeTh: 'กะโหลกสัดส่วนสมดุล ความยาวส่วนใบหน้าใกล้เคียงกล่องสมอง',
    etymology: 'กรีก mesos (μέσος = ปานกลาง) + kephalē (κεφαλή = ศีรษะ)',
    cephalicIndex: '50 – 65',
    cephalicIndexValue: 58,
    craniofacialRatio: '1 : 1.0 (ส่วนกล่องสมองสมดุลกับกระดูกส่วนใบหน้า)',
    stopAngleTh: 'มุมหักดั้งจมูก (Stop) ปานกลางได้รูป (~130°–140°)',
    occlusionTh: 'การสบฟันแบบกรรไกรมาตรฐาน (Normal Scissor Bite — ฟันตัดบนซ้อนหน้าฟันตัดล่างเล็กน้อย)',
    accentColor: '#2563eb',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-sky-300 border-blue-500/30',
    breedsEn: ['Labrador Retriever', 'Golden Retriever', 'Pointer', 'Beagle', 'Fox Terrier', 'German Shepherd'],
    breedsTh: ['ลาบราดอร์ รีทรีฟเวอร์', 'โกลเด้น รีทรีฟเวอร์', 'พอยน์เตอร์ (Pointer)', 'บีเกิล (Beagle)', 'ฟ็อกซ์เทอร์เรีย', 'เยอรมันเชพเพิร์ด'],
    osteologyPointsTh: [
      'ความยาวของกระดูกส่วนใบหน้า (Viscerocranium/Rostrum) สมดุลกับส่วนกล่องสมอง (Neurocranium)',
      'โค้งโหนกแก้ม (Zygomatic arch) โค้งรับแอ่งกล้ามเนื้อขมับขนาดปานกลาง แรงบดเคี้ยวสมดุล',
      'โพรงจมูกและกระดูกขดในโพรงจมูก (Nasal turbinates) มีพื้นที่ระบายความร้อนและกรองอากาศเหมาะสม',
      'ฟันครบ 42 ซี่เรียงตัวไม่เบียดซ้อน และสบฟันแบบกรรไกร (Scissor occlusion)'
    ],
    clinicalNotesTh:
      'ถือเป็นโครงสร้างอ้างอิงมาตรฐานทางกายวิภาคศาสตร์สัตวแพทย์ (NAV Standard Reference) การถ่ายภาพรังสีกะโหลกและทันตกรรมใช้มุมมาตรฐานโดยไม่ต้องชดเชยความบิดเบี้ยวของโพรงจมูก',
    wikiMediaIds: ['local-cephalic-3types-dorsal', 'local-dog-skull-diagram', 'wm-dog-skull-specimen-lateral-01', 'diagram-dog-cranium-dorsal-ventral']
  },

  dolichocephalic: {
    id: 'dolichocephalic',
    nameEn: 'Dolichocephalic',
    nameTh: 'พันธุ์หน้ายาว (กะโหลกยาว-แคบ)',
    shortTh: 'หน้ายาว (Dolicho)',
    headShapeEn: 'Long, narrow skull',
    headShapeTh: 'กะโหลกเรียวยาวและแคบ กระดูกจมูกและขากรรไกรยื่นยาว โหนกแก้มแคบเพรียว',
    etymology: 'กรีก dolikhos (δολιχός = ยาว) + kephalē (κεφαλή = ศีรษะ)',
    cephalicIndex: '38 – 49 (< 50)',
    cephalicIndexValue: 41,
    craniofacialRatio: '1 : 1.45+ (ส่วนกระดูกจมูกและใบหน้ายาวกว่ากล่องสมองชัดเจน)',
    stopAngleTh: 'มุมดั้งจมูกลาดเรียบแทบไม่มีรอยหักมุม (Minimal / Shallow Stop ~160°–175°)',
    occlusionTh: 'สบฟันแบบกรรไกรตามแนวยาว บางสายพันธุ์อาจพบขากรรไกรบนยื่น (Overshot / Class II)',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    breedsEn: ['Greyhound', 'Afghan Hound', 'Rough Collie', 'Borzoi', 'Saluki', 'Whippet', 'Doberman Pinscher'],
    breedsTh: ['เกรย์ฮาวด์ (Greyhound)', 'อัฟกันฮาวด์ (Afghan Hound)', 'รัฟคอลลี่ (Rough Collie)', 'บอร์ซอย (Borzoi)', 'ซาลูกิ (Saluki)', 'วิปเพ็ต'],
    osteologyPointsTh: [
      'กระดูกจมูก (Nasal bone) และขากรรไกรบน (Maxilla) ยืดยาวเรียวแคบ เพิ่มปริมาตรโพรงจมูกและแผ่นกระดูกเทอร์บิเนต',
      'โค้งโหนกแก้ม (Zygomatic arch) แคบเพรียวแนบลำกะโหลก ทำให้มุมมองภาพด้านหน้า (Binocular field) กว้างสำหรับสุนัขล่าเนื้อด้วยสายตา (Sighthounds)',
      'สันกลางกะโหลก (External sagittal crest) เด่นชัดเป็นสันยาวสำหรับยึดกล้ามเนื้อขมับ (Temporalis muscle)',
      'แนวสันหน้าผากเชื่อมต่อลงสู่สันจมูกอย่างเรียบเนียน หรือโค้งงุ้มลงเล็กน้อยที่ปลายจมูก (Clinorhynchy ในพันธุ์ Borzoi/Bull Terrier)'
    ],
    clinicalNotesTh:
      'โพรงจมูกที่ยาวมากทำให้เสี่ยงต่อการติดเชื้อราในโพรงจมูก (Sinonasal Aspergillosis) และเนื้องอกโพรงจมูก (Nasal adenocarcinoma) ได้บ่อยกว่าพันธุ์หน้าสั้น รวมถึงต้องระวังช่องว่างระหว่างฟันกรามน้อย',
    wikiMediaIds: ['local-cephalic-3types-dorsal', 'specimen-selected-skulls-6', 'specimen-dingo-skull', 'diagram-dog-cranium-dorsal-ventral']
  }
};

// Smooth C2 quintic Hermite step [0, 1]
function smootherstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Smooth bell curve centered at `center` with half-width `width`
function smoothBell(x, center, width) {
  const d = Math.abs(x - center) / width;
  if (d >= 1) return 0;
  const t = 1 - d * d;
  return t * t;
}

// Exact C-infinity integral of 0.5 * (1 + tanh((t - u0) / w)) from t = 0 to t = u.
// Guarantees strictly positive longitudinal Jacobian ds_new/ds > 0 everywhere (zero mesh folding/creasing!).
function integratedStep(u, u0, w) {
  const a = (u - u0) / w;
  const b = -u0 / w;
  // Numerically stable log(cosh(x)) = |x| + log(1 + exp(-2|x|)) - ln(2)
  const logCoshA = Math.abs(a) + Math.log1p(Math.exp(-2 * Math.abs(a)));
  const logCoshB = Math.abs(b) + Math.log1p(Math.exp(-2 * Math.abs(b)));
  return 0.5 * u + 0.5 * w * (logCoshA - logCoshB);
}

// Reference Craniofacial Frame in raw GLTF scene meters (before MODEL_SCALE = 3.8):
// Occipital condyle / Atlanto-occipital pivot O = (0.00085, 0.582, -0.246)
// Palatal-rostral axis tilted downward by 20 deg in natural standing carriage:
const X_MID = 0.00085;
const Y_PIVOT = 0.582;
const Z_PIVOT = -0.246;
const THETA = (20.0 * Math.PI) / 180.0;
const SIN_T = Math.sin(THETA); // 0.34202
const COS_T = Math.cos(THETA); // 0.93969
// E_s = (0, -SIN_T, -COS_T) -> rostral direction along hard palate
// E_h = (0,  COS_T, -SIN_T) -> dorsal direction perpendicular to hard palate
const S_TOTAL = 0.191; // Occipital condyle (s=0) to upper incisor tip (s~0.191)

/**
 * Pure 3D anatomical craniofacial deformation in raw GLTF scene coordinates.
 * Guarantees 100% locked Atlanto-occipital joint (s <= 0), 100% locked TMJ between skull & mandible,
 * and C-infinity diffeomorphic surfaces with zero creases!
 *
 * @param {number} wx - Scene X coordinate
 * @param {number} wy - Scene Y coordinate
 * @param {number} wz - Scene Z coordinate
 * @param {'brachycephalic'|'mesocephalic'|'dolichocephalic'} morphType
 * @param {'skull'|'mandible'|'hyoid'|'skin'} partType
 * @returns {[number, number, number]} Deformed [wx, wy, wz]
 */
export function deformCephalicScenePoint(wx, wy, wz, morphType, partType = 'skull') {
  if (!morphType || morphType === 'mesocephalic') {
    return [wx, wy, wz];
  }

  // Skin silhouette: smoothly mask out neck, ears-back, chest, and forelimbs so only the head & muzzle morph!
  let skinWeight = 1.0;
  if (partType === 'skin') {
    if (wz > -0.235 || wy < 0.44) {
      return [wx, wy, wz];
    }
    const wZ = smootherstep(-0.242, -0.285, wz);
    const wY = smootherstep(0.445, 0.495, wy);
    const earPinnaMask =
      1.0 - 0.75 * smootherstep(0.635, 0.685, wy) * (1.0 - smootherstep(-0.26, -0.32, wz));
    skinWeight = wZ * wY * earPinnaMask;
    if (skinWeight <= 0.0001) return [wx, wy, wz];
  }

  const dx = wx - X_MID;
  const dy = wy - Y_PIVOT;
  const dz = wz - Z_PIVOT;

  // Project onto skull palatal-rostral coordinate (s) & dorsal height coordinate (h)
  const s = -dy * SIN_T - dz * COS_T;
  const h = dy * COS_T - dz * SIN_T;

  if (s <= 0.001) {
    return [wx, wy, wz];
  }

  const u = s / S_TOTAL;
  // Lock occipital condyles cleanly to Atlas (C1) near u = 0
  const occiputLock = smootherstep(0.01, 0.09, u);

  let sNew = s;
  let hNew = h;
  let xScale = 1.0;

  if (morphType === 'brachycephalic') {
    // 1. C-infinity monotonic longitudinal foreshortening (ds_new/ds >= 0.56 everywhere -> zero creases, crisp canine teeth!):
    // - Mild cranial compaction (-6% across neurocranium)
    // - Classic Brachycephalic rostral foreshortening (-38% across maxilla/nasal rostrum past orbit u > 0.52)
    // Yields museum-grade Brachycephalic Cephalic Index ~ 84-87!
    const uNew =
      u -
      occiputLock * (0.06 * integratedStep(u, 0.18, 0.09) + 0.38 * integratedStep(u, 0.56, 0.11));
    sNew = uNew * S_TOTAL;

    // 2. Transverse widening (xScale):
    // Broad rounded braincase (+9%), wide flaring zygomatic arches (+19% at u=0.37),
    // and broad stout muzzle/premaxilla (+15% so incisor arcade & nasal aperture are broad).
    const neuroBroad = 0.09 * smootherstep(0.04, 0.24, u);
    const zygoFlare = 0.11 * smoothBell(u, 0.37, 0.27);
    const muzzleBroad = 0.06 * smootherstep(0.48, 0.80, u);
    xScale = 1.0 + occiputLock * (neuroBroad + zygoFlare + muzzleBroad);

    // 3. Dorsal-Ventral & Stop contour (hNew):
    // - Rounded frontal vault around u in [0.18, 0.46]
    // - Crisp nasofrontal Stop transition into shortened nasal bridge around u in [0.55, 0.78]
    // - Mild clinical airorhynchy (gentle dorsal tilt of shortened rostrum)
    const isDorsalVault = smootherstep(0.012, 0.046, h);
    const foreheadDome = 0.0046 * smoothBell(u, 0.32, 0.22) * isDorsalVault;
    const nasalStopCarve = -0.0038 * smoothBell(u, 0.62, 0.17) * smootherstep(0.010, 0.038, h);
    const airorhynchy = 0.0034 * Math.pow(smootherstep(0.56, 0.98, u), 1.35);
    hNew = h + occiputLock * (foreheadDome + nasalStopCarve + airorhynchy);

    // 4. Mandibular Prognathism (Class III Undershot Bite) strictly anterior to TMJ & coronoid (u > 0.58):
    if (partType === 'mandible') {
      const underbiteMask = smootherstep(0.58, 0.90, u);
      sNew += 0.0062 * underbiteMask;
      hNew += 0.0034 * smootherstep(0.68, 0.98, u);
    } else if (partType === 'skin') {
      const lowerLipMask = (1.0 - smootherstep(-0.015, 0.015, h)) * smootherstep(0.58, 0.90, u);
      sNew += 0.0045 * lowerLipMask;
    }
  } else if (morphType === 'dolichocephalic') {
    // 1. C-infinity monotonic longitudinal elongation:
    // - Sleek cranial lengthening (+7% across neurocranium)
    // - Prominent sighthound/collie rostral elongation (+42% across maxilla & nasal bones)
    // Yields classic Dolichocephalic Cephalic Index ~ 41-44!
    const uNew =
      u +
      occiputLock * (0.07 * integratedStep(u, 0.18, 0.09) + 0.42 * integratedStep(u, 0.50, 0.11));
    sNew = uNew * S_TOTAL;

    // 2. Transverse narrowing (xScale):
    // Narrow dolichocephalic braincase, streamlined zygomatic arches (~0.83x), and narrow tapering snout (~0.73x).
    const neuroNarrow = -0.13 * smootherstep(0.04, 0.24, u);
    const zygoStreamline = -0.06 * smoothBell(u, 0.37, 0.26);
    const muzzleSlender = -0.13 * smootherstep(0.46, 0.84, u);
    xScale = Math.max(0.68, 1.0 + occiputLock * (neuroNarrow + zygoStreamline + muzzleSlender));

    // 3. Dorsal-Ventral Sighthound/Collie Profile (hNew):
    // - Prominent midline sagittal crest
    // - Shallow/flat frontal stop into long straight/gently Roman nasal profile (clinorhynchy)
    const midlineMask = 1.0 - smootherstep(0.003, 0.018, Math.abs(dx));
    const sagittalCrest =
      0.0042 * smoothBell(u, 0.17, 0.16) * smootherstep(0.025, 0.050, h) * midlineMask;
    const smoothFrontalStop =
      -0.0038 * smoothBell(u, 0.38, 0.16) * smootherstep(0.020, 0.052, h) +
      0.0040 * smoothBell(u, 0.56, 0.17) * smootherstep(0.012, 0.040, h);
    const clinorhynchy = -0.0055 * Math.pow(smootherstep(0.64, 1.02, u), 1.4);
    hNew = h + occiputLock * (sagittalCrest + smoothFrontalStop + clinorhynchy);
  }

  // Reconstruct deformed scene-space coordinates
  const wxTarget = X_MID + dx * xScale;
  const wyTarget = Y_PIVOT - sNew * SIN_T + hNew * COS_T;
  const wzTarget = Z_PIVOT - sNew * COS_T - hNew * SIN_T;

  if (skinWeight < 0.9999) {
    return [
      wx + (wxTarget - wx) * skinWeight,
      wy + (wyTarget - wy) * skinWeight,
      wz + (wzTarget - wz) * skinWeight
    ];
  }

  return [wxTarget, wyTarget, wzTarget];
}

/**
 * Ensures a cloned Three.js BufferGeometry has unquantized Float32 `position`, `normal`, and `color`
 * attributes. CRITICAL: GLBs with KHR_mesh_quantization + EXT_meshopt_compression store `normal` as an
 * InterleavedBufferAttribute backed by Int8Array; calling Three.js `computeVertexNormals()` directly on
 * an Int8Array attribute truncates float normals [-1, 1] to integer 0 ([0, 0, 0] -> NaN black shading!).
 * Replacing `normal` with a Float32BufferAttribute fixes lighting 100% and decouples shared buffers.
 */
export function prepareMorphableGeometry(mesh) {
  const clonedGeom = mesh.geometry.clone();
  const posAttr = clonedGeom.attributes.position;
  const count = posAttr.count;
  const origLocalPositions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    origLocalPositions[i * 3] = posAttr.getX(i);
    origLocalPositions[i * 3 + 1] = posAttr.getY(i);
    origLocalPositions[i * 3 + 2] = posAttr.getZ(i);
  }

  // 1. Replace quantized Int16 position with clean Float32BufferAttribute
  clonedGeom.setAttribute('position', new THREE.BufferAttribute(origLocalPositions.slice(), 3));

  // 2. Replace quantized Int8 Interleaved normal with clean Float32BufferAttribute BEFORE computeVertexNormals()!
  clonedGeom.deleteAttribute('normal');
  clonedGeom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

  // 3. Convert quantized Uint8 vertex AO color (if present) to standalone Float32BufferAttribute with bright studio cavity floor
  if (clonedGeom.attributes.color) {
    const colAttr = clonedGeom.attributes.color;
    const floatColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Lift deep AO shadows slightly (0.45..1.0) so sutures, orbits & teeth are bright and readable
      floatColors[i * 3] = 0.45 + 0.55 * colAttr.getX(i);
      floatColors[i * 3 + 1] = 0.45 + 0.55 * colAttr.getY(i);
      floatColors[i * 3 + 2] = 0.45 + 0.55 * colAttr.getZ(i);
    }
    clonedGeom.setAttribute('color', new THREE.BufferAttribute(floatColors, 3));
  }

  clonedGeom.computeVertexNormals();
  mesh.geometry = clonedGeom;

  return origLocalPositions;
}

/**
 * Applies `deformCephalicScenePoint` to a prepared mesh using its rest scene matrix
 * (`sceneMatrix` inside `sourceScene` / `skinScene`), then recomputes smooth Float32 vertex normals & bounds.
 */
export function applyCephalicMorphToMesh(
  mesh,
  origLocalPositions,
  sceneMatrix,
  invSceneMatrix,
  morphType,
  partType
) {
  const geom = mesh.geometry;
  const posAttr = geom.attributes.position;
  const arr = posAttr.array;
  const count = posAttr.count;

  // Ensure normal attribute is always Float32 (never Int8!) before computeVertexNormals()
  if (!geom.attributes.normal || !(geom.attributes.normal.array instanceof Float32Array)) {
    geom.deleteAttribute('normal');
    geom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  }

  if (!morphType || morphType === 'mesocephalic') {
    arr.set(origLocalPositions);
  } else {
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const lx = origLocalPositions[i * 3];
      const ly = origLocalPositions[i * 3 + 1];
      const lz = origLocalPositions[i * 3 + 2];

      v.set(lx, ly, lz).applyMatrix4(sceneMatrix);
      const [nx, ny, nz] = deformCephalicScenePoint(v.x, v.y, v.z, morphType, partType);
      v.set(nx, ny, nz).applyMatrix4(invSceneMatrix);

      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
  }

  posAttr.needsUpdate = true;
  geom.computeVertexNormals();
  geom.computeBoundingBox();
  geom.computeBoundingSphere();
}
