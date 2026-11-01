// Complete Veterinary Osteology Dataset for CHAi Canine 3D Atlas (Canis lupus familiaris)
// Covers all 31 NAV (Nomina Anatomica Veterinaria) Osteological Structures = 115 Segmented 3D Bone Meshes

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const SKELETON_HIERARCHY = [
  {
    id: 'axial_head',
    nameTh: 'กะโหลกศีรษะและโคนลิ้น',
    nameEn: 'Skull, Mandible & Hyoid',
    nameLatin: 'Skeleton axiale · Caput',
    badgeColor: '#2563eb',
    boneIds: ['skull', 'mandible', 'hyoid']
  },
  {
    id: 'axial_spine',
    nameTh: 'แนวกระดูกสันหลัง (50 ปล้อง)',
    nameEn: 'Vertebral Column',
    nameLatin: 'Columna vertebralis',
    badgeColor: '#d97706',
    boneIds: [
      'atlas',
      'axis',
      'vertebrae-cervical',
      'vertebra-c7',
      'vertebrae-thoracic',
      'vertebra-l1',
      'vertebrae-lumbar',
      'sacrum',
      'vertebrae-caudal'
    ]
  },
  {
    id: 'axial_thorax',
    nameTh: 'โครงกระดูกทรวงอก (34 ชิ้น)',
    nameEn: 'Thoracic Cage (Ribs & Sternum)',
    nameLatin: 'Skeleton thoracis',
    badgeColor: '#0891b2',
    boneIds: ['ribs', 'manubrium', 'sternum']
  },
  {
    id: 'appendicular_fore',
    nameTh: 'รยางค์ขาหน้าซ้าย-ขวา (14 ชุดชิ้น)',
    nameEn: 'Thoracic Limb (Forelimb)',
    nameLatin: 'Ossa membri thoracici',
    badgeColor: '#059669',
    boneIds: [
      'scapula',
      'humerus',
      'radius',
      'ulna',
      'carpus',
      'metacarpus',
      'phalanges-thoracic'
    ]
  },
  {
    id: 'appendicular_hind',
    nameTh: 'รยางค์ขาหลังและเชิงกราน (16 ชุดชิ้น)',
    nameEn: 'Pelvic Limb (Hindlimb)',
    nameLatin: 'Ossa membri pelvini',
    badgeColor: '#7c3aed',
    boneIds: [
      'os-coxae',
      'femur',
      'patella',
      'tibia',
      'fibula',
      'tarsus',
      'metatarsus',
      'phalanges-pelvic'
    ]
  },
  {
    id: 'visceral_skeleton',
    nameTh: 'กระดูกอวัยวะภายใน (Visceral)',
    nameEn: 'Splanchnic / Visceral Bone',
    nameLatin: 'Ossa splanchnica',
    badgeColor: '#e11d48',
    boneIds: ['os-penis']
  }
];

export const CANINE_BONES = [
  // ==================== 1. SKULL, MANDIBLE & HYOID ====================
  {
    id: 'skull',
    navId: 'dog.skeletal.skull',
    nameTh: 'กะโหลกศีรษะ',
    nameEn: 'Cranium (Skull)',
    nameLatin: 'Cranium (Neurocranium & Viscerocranium)',
    category: 'axial',
    groupId: 'axial_head',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Veterinary Osteology CT/Photogrammetry Scan',
    color: '#3b82f6',
    meshes: ['dog_skeletal_skull'],
    summaryTh: 'โครงสร้างกระดูกหุ้มสมอง โพรงจมูก เบ้าตา และขากรรไกรบน แบ่งรูปทรงมาตรฐานสัตวแพทย์ครบทั้ง 3 ประเภท: หน้าสั้น-กะโหลกสั้นกว้าง (Brachycephalic), หน้าปานกลางสมดุล (Mesocephalic) และหน้ายาว-กะโหลกยาวแคบ (Dolichocephalic)',
    descriptionTh: 'กะโหลกศีรษะสุนัขประกอบด้วยกระดูกแบนและกระดูกรูปร่างซับซ้อนกว่า 30 ชิ้นเชื่อมกันด้วยรอยประสาน (Sutures) แบ่งเป็นส่วนหุ้มสมอง (Neurocranium) และส่วนใบหน้า-จมูก (Splanchnocranium) จุดเด่นเฉพาะของสุนัขคือเบ้าตาด้านนอกไม่ปิดด้วยกระดูกสมบูรณ์ (Incomplete bony orbit) แต่เชื่อมด้วยเอ็น Orbital ligament และมีความหลากหลายของดัชนีกะโหลก (Cephalic Index = ความกว้างโหนกแก้ม ÷ ความยาวกะโหลก × 100) สูงที่สุดในสัตว์เลี้ยงลูกด้วยนม แบ่งเป็น 3 ประเภทหลัก ได้แก่ 1) Brachycephalic กะโหลกสั้น-กว้าง (CI ~80–100+ เช่น Pug, Bulldog) 2) Mesocephalic กะโหลกสมดุลปานกลาง (CI ~50–65 เช่น Labrador, Beagle) และ 3) Dolichocephalic กะโหลกยาว-แคบ (CI < 50 เช่น Greyhound, Rough Collie, Afghan Hound)',
    landmarks: [
      'External sagittal crest (สันกลางกะโหลกด้านบน — เด่นชัดมากใน Dolichocephalic)',
      'Zygomatic arch (โค้งกระดูกโหนกแก้ม — กางออกกว้างใน Brachycephalic และเพรียวแคบใน Dolichocephalic)',
      'Nasofrontal Stop (มุมหักดั้งจมูก — หักมุมลึกชันในพันธุ์หน้าสั้น และลาดเรียบในพันธุ์หน้ายาว)',
      'Occipital condyles & Foramen magnum (ปุ่มท้ายทอยต่อกับ Atlas C1 และรูไขสันหลัง)',
      'Tympanic bulla (กระเปาะกระดูกหูชั้นกลาง)',
      'Infraorbital foramen & Upper carnassial tooth P4 (รูประสาทใต้ตาและฟันกรามน้อยบนตัดเนื้อซี่ที่ 4)'
    ],
    articulations: [
      'ข้อต่อขากรรไกร (Temporomandibular joint - TMJ) กับ Mandible',
      'ข้อต่อท้ายทอย-คอชิ้นแรก (Atlanto-occipital joint) กับ Atlas (C1)',
      'รอยต่อกระดูกอ่อน Tympanohyoid กับชุดกระดูกโคนลิ้น (Hyoid)'
    ],
    clinicalNotes: 'พันธุ์หน้าสั้น (Brachycephalic: Pug, English/French Bulldog, Pekingese) มีกระดูกขากรรไกรบนหดสั้นแต่เนื้อเยื่ออ่อนเท่าเดิม ก่อให้เกิดกลุ่มอาการทางเดินหายใจอุดกั้น (BOAS), เบ้าตาตื้น และขากรรไกรล่างยื่น (Undershot) ส่วนพันธุ์หน้ายาว (Dolichocephalic: Greyhound, Collie, Borzoi) มีโพรงจมูกยาวเสี่ยงต่อเชื้อราในโพรงจมูก (Nasal Aspergillosis)',
    wordRoots: [
      { root: 'Brachy-cephalic', origin: 'Greek (brachys + kephalē)', meaningTh: 'กะโหลกสั้นและกว้าง (พันธุ์หน้าสั้น CI ≥ 80)', meaningEn: 'Short, broad skull (e.g., Pug, Bulldog)' },
      { root: 'Meso-cephalic', origin: 'Greek (mesos + kephalē)', meaningTh: 'กะโหลกขนาดปานกลางสมดุล (พันธุ์มาตรฐาน CI 50–65)', meaningEn: 'Medium, balanced skull (e.g., Labrador, Beagle)' },
      { root: 'Dolicho-cephalic', origin: 'Greek (dolikhos + kephalē)', meaningTh: 'กะโหลกยาวและแคบ (พันธุ์หน้ายาว CI < 50)', meaningEn: 'Long, narrow skull (e.g., Greyhound, Collie)' }
    ],
    mediaIds: [
      'local-cephalic-3types-dorsal',
      'local-cephalic-3types-lateral',
      'specimen-selected-skulls-6',
      'specimen-pug-skull',
      'specimen-bulldog-skull',
      'diagram-boxer-craniofacial',
      'local-dog-skull-diagram',
      'wm-dog-skull-specimen-lateral-01',
      'diagram-dog-cranium-dorsal-ventral',
      'wm-dog-skull-base-sisson-01',
      'wm-dog-skull-cervical-specimen-01'
    ],
    relatedIds: ['mandible', 'hyoid', 'atlas']
  },
  {
    id: 'mandible',
    navId: 'dog.skeletal.mandible',
    nameTh: 'กระดูกขากรรไกรล่าง',
    nameEn: 'Mandible (Lower Jaw)',
    nameLatin: 'Mandibula',
    category: 'axial',
    groupId: 'axial_head',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Veterinary Osteology Scan',
    color: '#60a5fa',
    meshes: ['dog_skeletal_mandible'],
    summaryTh: 'กระดูกขากรรไกรล่างคู่ซ้าย-ขวาที่เชื่อมกันด้านหน้าด้วยกระดูกอ่อนเส้นใย (Mandibular symphysis) ไม่เชื่อมเป็นเนื้อเดียวตลอดชีวิต',
    descriptionTh: 'ประกอบด้วยขากรรไกรล่างซ้ายและขวา (Hemimandibles) แบ่งเป็นส่วนแนวนอนที่ฝังรากฟันล่าง (Body) และส่วนตั้งฉากด้านท้าย (Ramus) ด้านข้างของ Ramus มีแอ่งลึก Masseteric fossa และที่มุมล่างด้านท้ายมีปุ่มยื่น Angular process ซึ่งเป็นลักษณะเฉพาะของสัตว์กินเนื้อตระกูลสุนัข',
    landmarks: [
      'Mandibular symphysis (แนวประสานคางด้วย Fibrocartilage)',
      'Coronoid process (จงอยด้านบนสุด ยื่นเข้าใต้ Zygomatic arch)',
      'Condylar process (หัวข้อต่อขากรรไกรรูปทรงกระบอกตามขวาง)',
      'Angular process (ปุ่มมุมคางด้านล่างท้าย)',
      'Masseteric fossa (แอ่งลึกด้านนอกของขาตั้งขากรรไกร)',
      'Mental foramina & Lower carnassial M1 (รูประสาทคางและฟันกรามล่างซี่ที่ 1)'
    ],
    articulations: [
      'ข้อต่อ Temporomandibular joint (TMJ) กับกระดูกขมับของกะโหลกศีรษะ',
      'แนวประสานคาง Mandibular symphysis ระหว่างซีกซ้ายและซีกขวา'
    ],
    clinicalNotes: 'เพราะ Mandibular symphysis ของสุนัขไม่เชื่อมเป็นกระดูกแข็ง เมื่อถูกรถชนหรือตกจากที่สูงจึงเกิดคางแยก (Symphyseal separation) ได้บ่อย ซึ่งรักษาได้ด้วยการมัดลวด Cerclage wire และในสุนัขแก่ที่มีโรคปริทันต์รุนแรงบริเวณฟัน M1 อาจเกิดขากรรไกรหักเองได้ (Pathologic fracture)',
    wordRoots: [
      { root: 'Mandere', origin: 'Latin', meaningTh: 'เคี้ยว / บดอาหาร', meaningEn: 'To chew' },
      { root: 'Symphysis', origin: 'Greek', meaningTh: 'การเติบโตเชื่อมเข้าหากันด้วยกระดูกอ่อน', meaningEn: 'Growing together' }
    ],
    mediaIds: [
      'local-cephalic-3types-lateral',
      'specimen-bulldog-skull',
      'local-dog-skull-diagram',
      'wm-dog-mandible-lateral-01',
      'wm-dog-mandible-medial-01',
      'wm-dog-skull-specimen-lateral-01'
    ],
    relatedIds: ['skull', 'hyoid']
  },
  {
    id: 'hyoid',
    navId: 'dog.skeletal.hyoid',
    nameTh: 'ชุดกระดูกโคนลิ้น',
    nameEn: 'Hyoid Apparatus',
    nameLatin: 'Apparatus hyoideus',
    category: 'axial',
    groupId: 'axial_head',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: 'VetAgro Sup Veterinary Anatomy 3D Scan',
    color: '#93c5fd',
    meshes: ['dog_skeletal_hyoid'],
    summaryTh: 'ชุดกระดูกเล็กๆ รูปตัวยูที่ทำหน้าที่เป็นสลิงแขวนโคนลิ้นและกล่องเสียงไว้กับฐานกะโหลกศีรษะ',
    descriptionTh: 'แตกต่างจากมนุษย์ที่มีกระดูก Hyoid ชิ้นเดียวลอยตัว ของสุนัขเป็นชุดกระดูกต่อกันหลายท่อน (Stylohyoid, Epihyoid, Ceratohyoid, Basihyoid และ Thyrohyoid) ทำหน้าที่พยุงโคนลิ้น คอหอย และกล่องเสียงให้เคลื่อนไหวประสานกันขณะกลืนอาหาร หอบระบายความร้อน และส่งเสียงเห่า',
    landmarks: [
      'Basihyoid (คานกระดูกแนวขวางกลางโคนลิ้น)',
      'Stylohyoid & Epihyoid (ก้านกระดูกคู่บนที่ยึดกับฐานกะโหลก)',
      'Ceratohyoid (ท่อนเชื่อมเข้าสู่แกนกลาง)',
      'Thyrohyoid (ก้านคู่ท้ายที่ไปยึดกระดูกอ่อนกล่องเสียง Thyroid cartilage)'
    ],
    articulations: [
      'ยึดกับ Mastoid/Tympanic region ของกะโหลกผ่าน Tympanohyoid cartilage',
      'ยึดกับกระดูกอ่อนกล่องเสียง (Thyroid cartilage of larynx)'
    ],
    clinicalNotes: 'ใช้เป็นจุดอ้างอิงสำคัญในภาพเอกซเรย์ลำคอด้านข้างเพื่อประเมินภาวะกล่องเสียงบวม มะเร็งต่อมทอนซิล/คอหอย หรือการบาดเจ็บจากการถูกกระชากปลอกคออย่างรุนแรง',
    wordRoots: [
      { root: 'Hyo-eidēs', origin: 'Greek (υ)', meaningTh: 'รูปร่างคล้ายอักษรกรีก อิปไซลอน (รูปตัวยู)', meaningEn: 'Shaped like the letter upsilon (U-shaped)' }
    ],
    mediaIds: ['wm-dog-skull-base-sisson-01', 'wm-dog-skull-cervical-specimen-01'],
    relatedIds: ['skull', 'mandible', 'atlas']
  },

  // ==================== 2. VERTEBRAL COLUMN ====================
  {
    id: 'atlas',
    navId: 'dog.skeletal.atlas',
    nameTh: 'กระดูกสันหลังคอชิ้นที่ 1 (แอตลาส)',
    nameEn: 'Atlas (C1 Vertebra)',
    nameLatin: 'Atlas (Vertebra cervicalis I)',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan',
    color: '#f59e0b',
    meshes: ['dog_skeletal_atlas'],
    summaryTh: 'กระดูกคอชิ้นแรกทรงวงแหวนที่มีปีกกว้าง (Wings of Atlas) รองรับการพยักหน้าขึ้น-ลง (“Yes Joint”)',
    descriptionTh: 'เป็นปล้องกระดูกสันหลังที่มีรูปร่างพิเศษที่สุด คือไม่มีตัวกระดูก (Vertebral body) และไม่มี Spinous process แต่ประกอบด้วยโค้งบน (Dorsal arch) และโค้งล่าง (Ventral arch) ล้อมรอบช่องไขสันหลังขนาดใหญ่ พร้อม Transverse processes ที่แผ่แบนเป็นปีกกว้าง (Alae atlantis) ซึ่งคลำพบได้ชัดเจนใต้หูทั้งสองข้าง',
    landmarks: [
      'Wings of the atlas / Alae atlantis (ปีกกระดูกแอตลาสซ้าย-ขวา)',
      'Dorsal & Ventral arches (โค้งกระดูกด้านบนและด้านล่าง)',
      'Fovea dentis (แอ่งรับเดือย Dens ของกระดูก Axis)',
      'Lateral vertebral foramen & Transverse foramen (รูทางผ่านเส้นประสาท C1 และหลอดเลือด)'
    ],
    articulations: [
      'ด้านหน้า: ข้อต่อ Atlanto-occipital joint กับกะโหลกศีรษะ (พยักหน้า)',
      'ด้านท้าย: ข้อต่อ Atlantoaxial joint กับกระดูก Axis C2 (หันซ้าย-ขวา)'
    ],
    clinicalNotes: 'ปีกของ Atlas เป็นจุดอ้างอิงทางคลินิกในการวัดแนวสมมาตรคอ และการเจาะเก็บน้ำไขสันหลังระดับ Cisterna magna (Atlanto-occipital CSF tap)',
    wordRoots: [
      { root: 'Atlas', origin: 'Greek Mythology', meaningTh: 'เทพไททันผู้แบกท้องฟ้า (เปรียบเสมือนแบกกะโหลกศีรษะ)', meaningEn: 'Titan who held up the celestial sphere' }
    ],
    mediaIds: ['wm-dog-atlas-axis-cnh-01', 'wm-dog-vertebrae-sisson-01', 'wm-dog-skull-cervical-specimen-01'],
    relatedIds: ['skull', 'axis', 'vertebrae-cervical']
  },
  {
    id: 'axis',
    navId: 'dog.skeletal.axis',
    nameTh: 'กระดูกสันหลังคอชิ้นที่ 2 (แอกซิส)',
    nameEn: 'Axis (C2 Vertebra)',
    nameLatin: 'Axis (Vertebra cervicalis II)',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'modeled',
    sourceCredit: 'High-Detail Anatomical Mesh',
    color: '#fbbf24',
    meshes: ['dog_skeletal_axis'],
    summaryTh: 'ปล้องกระดูกคอที่ยาวที่สุด มีเดือยกระดูก Dens เป็นแกนหมุนให้ศีรษะหันซ้าย-ขวา (“No Joint”)',
    descriptionTh: 'โดดเด่นด้วยเดือยกระดูกทรงกระบอกเรียวยาวด้านหน้า (Dens หรือ Odontoid process) ที่สอดเข้าไปวางบนพื้นล่างของวงแหวน Atlas ยึดตรึงด้วย Transverse ligament และ Apical/Alar ligaments ด้านบนมีสันกระดูก Spinous process ยาวเป็นแผ่นคล้ายครีบใบมีดยื่นคลุมไปด้านหน้าและด้านท้าย',
    landmarks: [
      'Dens / Odontoid process (เดือยแกนหมุนด้านหน้า)',
      'Elongated blade-like spinous process (สันกระดูกด้านบนทรงครีบยาว)',
      'Cranial articular surface (ผิวข้อต่อด้านหน้ากว้างสำหรับรับ Atlas)',
      'Transverse canal (ช่องตามยาวสำหรับหลอดเลือด Vertebral artery)'
    ],
    articulations: [
      'ด้านหน้า: ข้อต่อหมุน Atlantoaxial pivot joint กับ Atlas (C1)',
      'ด้านท้าย: ข้อต่อและหมอนรองกระดูก C2–C3 กับกระดูกคอชิ้นที่ 3'
    ],
    clinicalNotes: 'โรคข้อต่อคอ C1–C2 ไม่มั่นคง (Atlantoaxial Instability / Subluxation) พบบ่อยในพันธุ์ Toy เช่น Yorkshire Terrier, Chihuahua, Pomeranian จากภาวะ Dens ไม่เจริญ (Aplasia/Hypoplasia) ทำให้เดือยกดทับไขสันหลังส่วนต้นอย่างเฉียบพลัน',
    wordRoots: [
      { root: 'Axis', origin: 'Latin', meaningTh: 'เพลาหมุน / แกนกลางล้อรถ', meaningEn: 'Axle / pivot around which rotation occurs' },
      { root: 'Odont-oid', origin: 'Greek', meaningTh: 'รูปร่างคล้ายซี่ฟัน (หมายถึงเดือย Dens)', meaningEn: 'Tooth-like process' }
    ],
    mediaIds: ['wm-dog-atlas-axis-cnh-01', 'wm-dog-vertebrae-sisson-01'],
    relatedIds: ['atlas', 'vertebrae-cervical', 'skull']
  },
  {
    id: 'vertebrae-cervical',
    navId: 'dog.skeletal.vertebrae-cervical',
    nameTh: 'กระดูกสันหลังส่วนคอชิ้นที่ 3–6 (C3–C6)',
    nameEn: 'Cervical Vertebrae C3–C6',
    nameLatin: 'Vertebrae cervicales III–VI',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'modeled',
    sourceCredit: 'Segmented Cervical Series C3–C6',
    color: '#eab308',
    meshes: [
      'dog_skeletal_vertebrae-cervical_c3',
      'dog_skeletal_vertebrae-cervical_c4',
      'dog_skeletal_vertebrae-cervical_c5',
      'dog_skeletal_vertebrae-cervical_c6'
    ],
    summaryTh: 'ชุดกระดูกคอตอนกลาง 4 ปล้องที่ให้ความยืดหยุ่นสูง โดยปล้อง C6 มีแผ่นกระดูกด้านล่างขนาดใหญ่เป็นจุดสังเกตในการผ่าตัด',
    descriptionTh: 'สัตว์เลี้ยงลูกด้วยนมเกือบทุกชนิดรวมถึงสุนัขมีกระดูกคอทั้งหมด 7 ชิ้น ปล้อง C3 ถึง C6 มีตัวกระดูกค่อนข้างยาว มีรู Transverse foramen ที่ฐานปีกด้านข้างทุกปล้อง และมีข้อต่อ Facet joints กว้าง ลักษณะเด่นสำคัญคือปล้อง C6 มีแผ่นกระดูก Ventral lamina แผ่ลงด้านล่างขนาดใหญ่ ใช้คลำหาตำแหน่งขณะผ่าตัดช่องคอและกระดูกสันหลังคอ',
    landmarks: [
      'Transverse foramina (ช่องหลอดเลือดแดง Vertebral artery ตลอด C3–C6)',
      'Ventral lamina of C6 (แผ่นกระดูกยื่นลงล่างขนาดใหญ่ของปล้อง C6)',
      'Cranial & Caudal articular processes (ข้อต่อประกบด้านบนซ้าย-ขวา)',
      'Spinous processes (ยอดแหลมที่ค่อยๆ สูงขึ้นจาก C3 ไป C6)'
    ],
    articulations: [
      'ด้านหน้าต่อกับ Axis (C2)',
      'ด้านท้ายต่อกับกระดูกคอชิ้นที่ 7 (C7) ผ่านหมอนรองกระดูกและข้อต่อ Zygapophyseal'
    ],
    clinicalNotes: 'ตำแหน่งหมอนรองกระดูกคอเคลื่อนทับไขสันหลัง (Cervical IVDD) มักพบที่ช่อง C2–C3 และ C3–C4 ทำให้สุนัขเกร็งคอ ปวดรุนแรง ไม่ยอมก้มกินน้ำ ส่วนพันธุ์ใหญ่อย่าง Doberman มักเกิดภาวะ Wobbler syndrome ที่ C5–C7',
    wordRoots: [
      { root: 'Cervix / Cervic-', origin: 'Latin', meaningTh: 'ลำคอ', meaningEn: 'Neck' },
      { root: 'Vertebra', origin: 'Latin (vertere)', meaningTh: 'ข้อปล้องที่ใช้บิดหมุนตัว', meaningEn: 'Joint / something that turns' }
    ],
    mediaIds: ['wm-dog-vertebrae-sisson-01', 'wm-dog-skull-cervical-specimen-01'],
    relatedIds: ['axis', 'vertebra-c7', 'atlas']
  },
  {
    id: 'vertebra-c7',
    navId: 'dog.skeletal.vertebra-c7',
    nameTh: 'กระดูกสันหลังส่วนคอชิ้นที่ 7 (C7)',
    nameEn: 'Seventh Cervical Vertebra (C7)',
    nameLatin: 'Vertebra cervicalis VII',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan',
    color: '#ca8a04',
    meshes: ['dog_skeletal_vertebra-c7'],
    summaryTh: 'กระดูกคอปล้องสุดท้ายก่อนเข้าสู่ช่องอก มียอด Spinous process สูงเด่นและไม่มีรู Transverse foramen',
    descriptionTh: 'เป็นปล้องเปลี่ยนผ่านระหว่างคอกับทรวงอก (Cervicothoracic junction) แยกแยะจากกระดูกคอชิ้นอื่นได้ชัดเจนเพราะตัวกระดูกสั้นกว่า มียอด Spinous process สูงแหลม ไม่มีรู Transverse foramen ที่ปีกด้านข้าง และที่ขอบท้ายของตัวกระดูกมีแอ่ง Caudal costal fovea สำหรับรับหัวกระดูกซี่โครงคู่ที่ 1',
    landmarks: [
      'Prominent spinous process (ยอดกระดูกสันหลังสูงเด่นก่อนเข้าสู่ T1)',
      'Absence of transverse foramen (ไม่มีรูหลอดเลือดที่ปีกด้านข้าง)',
      'Caudal costal foveae (แอ่งรับหัวซี่โครงคู่ที่ 1 ด้านท้าย)'
    ],
    articulations: [
      'ด้านหน้าต่อกับปล้อง C6',
      'ด้านท้ายต่อกับกระดูกอกชิ้นแรก (T1) และหัวซี่โครงคู่ที่ 1'
    ],
    clinicalNotes: 'รอยต่อ C6–C7 เป็นตำแหน่งสำคัญที่สุดของโรค Cervical Spondylomyelopathy (Wobbler Syndrome) ในสุนัขพันธุ์ใหญ่ และอยู่ใกล้ข่ายประสาทขาหน้า (Brachial plexus C6–T2)',
    wordRoots: [
      { root: 'Cervicalis VII', origin: 'Latin', meaningTh: 'ปล้องกระดูกคอลำดับที่เจ็ด', meaningEn: 'Seventh vertebra of the neck' }
    ],
    mediaIds: ['wm-dog-skeleton-specimen-01', 'wm-dog-skeleton-ellenberger-01'],
    relatedIds: ['vertebrae-cervical', 'vertebrae-thoracic', 'ribs']
  },
  {
    id: 'vertebrae-thoracic',
    navId: 'dog.skeletal.vertebrae-thoracic',
    nameTh: 'กระดูกสันหลังส่วนอก 13 ปล้อง (T1–T13)',
    nameEn: 'Thoracic Vertebrae (T1–T13)',
    nameLatin: 'Vertebrae thoracicae (T1–T13)',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'modeled',
    sourceCredit: 'Segmented 13-Piece Thoracic Column (T1–T13)',
    color: '#ea580c',
    meshes: range(1, 13).map(n => `dog_skeletal_vertebrae-thoracic_t${n}`),
    summaryTh: 'กระดูกสันหลังช่วงอก 13 ปล้องที่ยึดกับซี่โครง 13 คู่ โดยมีปล้อง T11 เป็นจุดเปลี่ยนทิศทางยอดกระดูก (Anticlinal vertebra)',
    descriptionTh: 'สุนัขมีกระดูกสันหลังส่วนอก 13 ปล้อง (มากกว่ามนุษย์ที่มี 12 ปล้อง) ปล้อง T1–T9 มียอด Spinous process สูงยาวมากและเอนลาดไปด้านท้ายเพื่อเป็นจุดยึดเอ็น Nuchal ligament และกล้ามเนื้อพยุงคอ เมื่อถึงปล้อง T11 ยอดกระดูกจะตั้งฉากตรง (Anticlinal vertebra) ส่วนปล้อง T12–T13 จะเริ่มเอนมาด้านหน้าคล้ายกระดูกเอว',
    landmarks: [
      'Tall cranial thoracic spinous processes T1–T8 (สร้างแนวโหนกไหล่ Withers)',
      'Anticlinal vertebra T11 (ปล้องที่ยอด Spinous process ตั้งฉาก 90°)',
      'Cranial & Caudal costal foveae (แอ่งรับหัวซี่โครง)',
      'Transverse costal foveae (ผิวข้อต่อรับปุ่ม Tubercle ของซี่โครง)',
      'Accessory processes on caudal thoracic vertebrae (ปุ่มเสริมด้านท้าย T10–T13)'
    ],
    articulations: [
      'ด้านหน้าต่อกับกระดูกคอ C7',
      'ด้านข้างทุกปล้องต่อกับหัวและปุ่มกระดูกซี่โครงคู่ที่ 1–13',
      'ด้านท้ายต่อกับกระดูกสันหลังเอวชิ้นแรก (L1)'
    ],
    clinicalNotes: 'ตั้งแต่ T1–T10 มีเอ็น Intercapital ligament พาดเชื่อมหัวซี่โครงซ้าย-ขวาอยู่บนหมอนรองกระดูก จึงไม่ค่อยเกิดหมอนรองกระดูกปลิ้น แต่ตั้งแต่ช่อง T11–T12 และ T12–T13 ไม่มีเอ็นนี้ จึงเป็นจุดเกิดโรค IVDD Hansen Type I บ่อยที่สุดในสุนัขพันธุ์ Dachshund, Corgi และ French Bulldog',
    wordRoots: [
      { root: 'Thorax', origin: 'Greek', meaningTh: 'เกราะหน้าอก / ทรวงอก', meaningEn: 'Breastplate / chest' },
      { root: 'Anti-clinal', origin: 'Greek', meaningTh: 'เอียงสลับทิศทางเข้าหากัน (ปล้อง T11)', meaningEn: 'Leaning in opposite directions' }
    ],
    mediaIds: [
      'wm-dog-spine-thoracolumbar-lat-01',
      'wm-dog-vertebrae-sisson-01',
      'wm-dog-thorax-vd-01',
      'local-dog-skeleton-diagram'
    ],
    relatedIds: ['vertebra-c7', 'ribs', 'vertebra-l1']
  },
  {
    id: 'vertebra-l1',
    navId: 'dog.skeletal.vertebra-l1',
    nameTh: 'กระดูกสันหลังส่วนเอวชิ้นที่ 1 (L1)',
    nameEn: 'First Lumbar Vertebra (L1)',
    nameLatin: 'Vertebra lumbalis I',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan',
    color: '#d97706',
    meshes: ['dog_skeletal_vertebra-l1'],
    summaryTh: 'ปล้องแรกของกระดูกเอวถัดจากซี่โครงคู่ที่ 13 จุดอ้างอิงสำคัญของการผ่าตัด Hemilaminectomy รอยต่ออก-เอว (T13–L1)',
    descriptionTh: 'เป็นจุดเริ่มต้นของช่วงเอวที่ไม่มีซี่โครงเกาะ มีปีกด้านข้าง (Transverse processes) แบนสั้นกว่าปล้องเอวถัดไปแต่ชี้เฉียงไปด้านหน้าและลงล่าง (Cranioventral) ต่างจากปล้อง T13 ที่มีซี่โครงลอยคู่สุดท้ายเกาะอยู่',
    landmarks: [
      'Cranioventrally directed transverse process (ปีกกระดูกเอวคู่แรกที่ชี้ไปข้างหน้า)',
      'Mammillary process (ปุ่มกระดูกด้านบนของ Cranial articular process)',
      'Accessory process (เดือยแหลมด้านท้ายที่คร่อมร่องเส้นประสาทไขสันหลัง)'
    ],
    articulations: [
      'ด้านหน้าต่อกับกระดูกอกปล้องสุดท้าย T13 (Thoracolumbar junction)',
      'ด้านท้ายต่อกับกระดูกเอวปล้องที่ 2 (L2)'
    ],
    clinicalNotes: 'รอยต่อ T13–L1 เป็นจุดที่เกิดหมอนรองกระดูกเคลื่อนทับไขสันหลังเฉียบพลันสูงเป็นอันดับ 1 ในสุนัข สัตวแพทย์ศัลยกรรมใช้ความแตกต่างระหว่างซี่โครงคู่ที่ 13 กับ Transverse process ของ L1 เพื่อระบุปล้องก่อนกรอกระดูกเปิดช่องไขสันหลัง (Hemilaminectomy)',
    wordRoots: [
      { root: 'Lumbus', origin: 'Latin', meaningTh: 'บั้นเอว', meaningEn: 'Loin' }
    ],
    mediaIds: ['wm-dog-spine-thoracolumbar-lat-01', 'wm-dog-lumbar-sacrum-sisson-01'],
    relatedIds: ['vertebrae-thoracic', 'vertebrae-lumbar', 'ribs']
  },
  {
    id: 'vertebrae-lumbar',
    navId: 'dog.skeletal.vertebrae-lumbar',
    nameTh: 'กระดูกสันหลังส่วนเอวชิ้นที่ 2–7 (L2–L7)',
    nameEn: 'Lumbar Vertebrae L2–L7',
    nameLatin: 'Vertebrae lumbales II–VII',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'modeled',
    sourceCredit: 'Segmented Lumbar Series L2–L7',
    color: '#b45309',
    meshes: range(2, 7).map(n => `dog_skeletal_vertebrae-lumbar_l${n}`),
    summaryTh: 'กระดูกเอวขนาดใหญ่ 6 ปล้องถัดจาก L1 (รวมสุนัขมีกระดูกเอว 7 ปล้อง) มีปีกด้านข้างชี้ไปทางหัวเพื่อส่งแรงควบวิ่ง',
    descriptionTh: 'สุนัขมีกระดูกเอวรวม 7 ปล้อง (L1–L7) ซึ่งเป็นตัวกระดูกที่ใหญ่และยาวเพื่อรองรับหลังคาช่องท้องโดยไม่มีซี่โครงช่วย ลักษณะชี้ขาดทางสัตวแพทย์คือ Transverse processes ทุกคู่จะยื่นยาวเฉียงไปทางด้านหน้าและลงล่าง (เหมือนเขากวางพุ่งไปทางหัว) ช่วยเป็นคานงัดให้กล้ามเนื้อหลังดีดตัวขณะวิ่งความเร็วสูง',
    landmarks: [
      'Long cranioventral transverse processes (ปีกกระดูกเอวยาวชี้เฉียงไปด้านหน้า)',
      'Blunt cranial-leaning spinous processes (ยอดกระดูกสันหลังป้านเอนไปข้างหน้าเล็กน้อย)',
      'Lumbosacral intervertebral space L7–S1 (ช่องว่างข้อต่อเอว-กระเบนเหน็บที่กว้างที่สุด)'
    ],
    articulations: [
      'ด้านหน้าต่อกับกระดูกเอว L1',
      'ด้านท้ายสุด (L7) ต่อกับกระดูกกระเบนเหน็บ (Sacrum) ที่ข้อต่อ Lumbosacral joint'
    ],
    clinicalNotes: 'ช่องระหว่าง L5–L6 หรือ L7–S1 เป็นตำแหน่งมาตรฐานสำหรับการเจาะน้ำไขสันหลังส่วนเอวและการฉีดยาชาบล็อกประสาทไขสันหลัง (Lumbosacral epidural anesthesia) ส่วนสุนัขใช้งานพันธุ์ใหญ่มักพบโรคโพรงประสาท L7–S1 ตีบแคบ (DLSS / Cauda Equina Syndrome)',
    wordRoots: [
      { root: 'Lumbalis', origin: 'Latin', meaningTh: 'เกี่ยวกับบริเวณบั้นเอว', meaningEn: 'Pertaining to the loins' }
    ],
    mediaIds: [
      'wm-dog-lumbar-sacrum-sisson-01',
      'wm-dog-lumbosacral-vd-01',
      'wm-dog-spine-thoracolumbar-lat-01'
    ],
    relatedIds: ['vertebra-l1', 'sacrum', 'os-coxae']
  },
  {
    id: 'sacrum',
    navId: 'dog.skeletal.sacrum',
    nameTh: 'กระดูกกระเบนเหน็บ (S1–S3 รวมชิ้น)',
    nameEn: 'Sacrum (Fused S1–S3)',
    nameLatin: 'Os sacrum',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: 'Greyhound Pelvic CT Osteological Scan',
    color: '#9333ea',
    meshes: ['dog_skeletal_sacrum'],
    summaryTh: 'กระดูกสันหลังส่วนกระเบนเหน็บ 3 ปล้อง (S1–S3) ที่หลอมรวมเป็นชิ้นเดียวทรงสี่เหลี่ยมคางหมู เชื่อมแกนหลังเข้ากับเชิงกราน',
    descriptionTh: 'ในสุนัขโตเต็มวัย กระดูกสันหลัง Sacral 3 ปล้องจะเชื่อมรวมเป็นชิ้นเดียว (ต่างจากมนุษย์ที่มี 5 ปล้อง) ยอดด้านบนหลอมเป็นสัน Median sacral crest ด้านข้างแผ่เป็นปีกกระดูก (Sacral wings) ที่มีผิวขรุขระรูปใบหู (Auricular surface) สำหรับยึดติดอย่างแข็งแรงกับกระดูกเชิงกราน Ilium เพื่อรับแรงถีบตัวทั้งหมดจากขาหลัง',
    landmarks: [
      'Sacral wings & Auricular surfaces (ปีกกระเบนเหน็บและผิวข้อต่อ Sacroiliac)',
      'Promontory of sacrum (ขอบหน้าด้านล่างที่เป็นเพดานทางเข้าช่องเชิงกราน)',
      'Median sacral crest (สันกลางจากยอด S1–S3 ที่เชื่อมกัน)',
      'Dorsal & Pelvic sacral foramina (รูเปิดเส้นประสาทกระเบนเหน็บด้านบนและด้านล่าง)'
    ],
    articulations: [
      'ด้านหน้าต่อกับกระดูกเอว L7 (Lumbosacral joint)',
      'ด้านข้างซ้าย-ขวาต่อกับปีก Ilium ของ Os coxae (Sacroiliac joints)',
      'ด้านท้ายต่อกับกระดูกหางปล้องแรก (Cd1)'
    ],
    clinicalNotes: 'ภาวะข้อต่อ Sacroiliac เคลื่อนหลุด (Sacroiliac luxation) พบบ่อยเมื่อสุนัขถูกรถชนด้านท้าย ต้องยึดด้วยสกรู Lag screw ทะลุจากปีก Ilium เข้าสู่ตัวกระดูก S1 อย่างแม่นยำโดยไม่ให้ทะลุเข้าช่องไขสันหลัง',
    wordRoots: [
      { root: 'Sacrum', origin: 'Latin (os sacrum)', meaningTh: 'กระดูกศักดิ์สิทธิ์ (เป็นชิ้นสุดท้ายที่สลายตัวช้าที่สุด)', meaningEn: 'Sacred bone' }
    ],
    mediaIds: [
      'wm-dog-pelvis-specimen-dorsal-01',
      'wm-dog-pelvis-specimen-caudal-01',
      'wm-dog-lumbar-sacrum-sisson-01',
      'wm-dog-lumbosacral-vd-01'
    ],
    relatedIds: ['vertebrae-lumbar', 'os-coxae', 'vertebrae-caudal']
  },
  {
    id: 'vertebrae-caudal',
    navId: 'dog.skeletal.vertebrae-caudal',
    nameTh: 'กระดูกสันหลังส่วนหาง (Cd1–Cd19)',
    nameEn: 'Caudal / Coccygeal Vertebrae (Cd1–Cd19)',
    nameLatin: 'Vertebrae caudales (Coccygeae)',
    category: 'axial',
    groupId: 'axial_spine',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: 'High-Resolution CT Segmented Tail Series (Cd1–Cd19)',
    color: '#c084fc',
    meshes: range(1, 19).map(n => `dog_skeletal_vertebrae-caudal_cd${n}`),
    summaryTh: 'ชุดกระดูกหางเรียงต่อกัน 19 ปล้อง (โดยเฉลี่ยสุนัขมี 18–23 ปล้อง) ทำหน้าที่ทรงตัวขณะเลี้ยวกลางอากาศและสื่อสารอารมณ์',
    descriptionTh: 'ปล้องโคนหางช่วงแรก (Cd1–Cd5) ยังคงมีโค้งกระดูกหุ้มเส้นประสาทและมีกระดูกรูปตัววีขนาดเล็กด้านล่างเรียกว่า Hemal arches (Chevron bones) ช่วยปกป้องหลอดเลือดแดงกลางหาง (Median caudal artery) เมื่อไล่ไปทางปลายหางปล้องกระดูกจะค่อยๆ ลดรูปลงเหลือเพียงแท่งทรงกระบอกเรียวยาว',
    landmarks: [
      'Proximal neural arches Cd1–Cd5 (โค้งกระดูกส่วนโคนหาง)',
      'Hemal processes / arches (ปุ่มปกป้องหลอดเลือดด้านท้องของโคนหางที่ใช้วัดความดัน/เจาะเลือดได้)',
      'Distal rod-like vertebral bodies (ท่อนกระดูกปลายหางทรงแท่งเรียว)'
    ],
    articulations: [
      'ปล้องแรก Cd1 ต่อกับปลายท้ายของกระดูกกระเบนเหน็บ (Sacrum)',
      'แต่ละปล้องยึดต่อกันด้วยหมอนรองกระดูกที่ยืดหยุ่นสูง'
    ],
    clinicalNotes: 'บาดแผลหางถูกดึงกระชากหรือประตูหนีบทำให้กระดูกหางเคลื่อนหรือกลุ่มประสาท Cauda equina เสียหาย ส่งผลให้หางตกและกลั้นปัสสาวะไม่ได้ นอกจากนี้สุนัขบางสายพันธุ์มีพันธุกรรมหางสั้นหรือหางม้วน (Hemivertebrae ของปล้องหาง)',
    wordRoots: [
      { root: 'Cauda', origin: 'Latin', meaningTh: 'หาง', meaningEn: 'Tail' }
    ],
    mediaIds: ['wm-dog-pelvis-specimen-dorsal-01', 'wm-dog-skeleton-specimen-01', 'wm-dog-skeleton-ellenberger-01'],
    relatedIds: ['sacrum', 'os-coxae']
  },

  // ==================== 3. THORACIC CAGE ====================
  {
    id: 'ribs',
    navId: 'dog.skeletal.ribs',
    nameTh: 'กระดูกซี่โครง 13 คู่ (26 ชิ้น)',
    nameEn: 'Ribs (Pairs 1–13, Left & Right)',
    nameLatin: 'Costae (I–XIII)',
    category: 'axial',
    groupId: 'axial_thorax',
    laterality: 'paired',
    fidelity: 'modeled',
    sourceCredit: 'Individually Segmented 26-Rib Cage (1L–13R)',
    color: '#06b6d4',
    meshes: range(1, 13).flatMap(n => [`dog_skeletal_ribs_${n}_L`, `dog_skeletal_ribs_${n}_R`]),
    summaryTh: 'เกราะซี่โครง 13 คู่ (26 ชิ้นแยกอิสระ) แบ่งเป็นซี่โครงแท้ 9 คู่ ซี่โครงไม่แท้ 3 คู่ และซี่โครงลอยคู่ที่ 13',
    descriptionTh: 'สุนัขมีกระดูกซี่โครง 13 คู่ แต่ละซี่ประกอบด้วยส่วนกระดูกด้านบน (Os costale) ต่อกับกระดูกอ่อนซี่โครงด้านล่าง (Costal cartilage) คู่ที่ 1–9 เชื่อมเข้ากับกระดูกอกโดยตรง (Sternal ribs) คู่ที่ 10–12 เชื่อมต่อกันเป็นขอบชายโครง (Costal arch / Asternal ribs) และคู่ที่ 13 ลอยอิสระในผนังกล้ามเนื้อท้อง (Floating rib) ช่องอกสุนัขแคบด้านข้างแต่ลึกในแนวบน-ล่างเพื่อให้สะบักแกว่งตัวแนบข้างได้สะดวก',
    landmarks: [
      'Head & Neck of rib (หัวและคอซี่โครงที่เกาะกับตัวกระดูกสันหลังอก)',
      'Tubercle of rib (ปุ่มซี่โครงที่ต่อกับ Transverse process)',
      'Costochondral junction (รอยต่อระหว่างกระดูกซี่โครงกับกระดูกอ่อนซี่โครง)',
      'Costal arch ribs 10–12 & Floating rib 13 (ขอบชายโครงและซี่โครงลอยคู่สุดท้าย)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Costovertebral และ Costotransverse กับกระดูกสันหลัง C7 และ T1–T13',
      'ด้านล่าง: เชื่อมผ่านกระดูกอ่อนซี่โครงเข้าสู่ Manubrium และ Sternebrae'
    ],
    clinicalNotes: 'ตำแหน่งฟังเสียงหัวใจสุนัข (Mitral/Pulmonic/Aortic valves) อ้างอิงตามช่องซี่โครงที่ 3–6 ด้านซ้าย ส่วนการผ่าตัดเปิดช่องอกด้านข้าง (Lateral thoracotomy) เพื่อทำหัตถการหัวใจมักเข้าทางช่องซี่โครงที่ 4 หรือ 5 หากซี่โครงหักหลายซี่ติดกัน 2 ตำแหน่งจะเกิดภาวะอกรวน (Flail chest)',
    wordRoots: [
      { root: 'Costa', origin: 'Latin', meaningTh: 'ซี่โครง / ด้านข้างลำตัว', meaningEn: 'Rib / side' }
    ],
    mediaIds: [
      'wm-dog-ribs-specimen-01',
      'wm-dog-thorax-vd-01',
      'local-dog-skeleton-diagram',
      'local-canid-museum-skeleton'
    ],
    relatedIds: ['vertebrae-thoracic', 'manubrium', 'sternum', 'scapula']
  },
  {
    id: 'manubrium',
    navId: 'dog.skeletal.manubrium',
    nameTh: 'ด้ามกระดูกอก (ท่อนหน้าสุด)',
    nameEn: 'Manubrium of Sternum',
    nameLatin: 'Manubrium sterni',
    category: 'axial',
    groupId: 'axial_thorax',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: 'LMU VetAnat Munich 3D Osteology Scan',
    color: '#22d3ee',
    meshes: ['dog_skeletal_manubrium'],
    summaryTh: 'ปล้องแรกสุดของกระดูกอกสุนัข มีปลายแหลมยื่นพ้นช่องทางเข้าทรวงอกไปด้านหน้า คลำได้ชัดเจนที่ฐานคอ',
    descriptionTh: 'Manubrium เป็นท่อนแรกและยาวแข็งแรงที่สุดของกระดูกอก มีปลายด้านหน้ายื่นแหลมคล้ายหัวเรือออกมานอกทางเข้าช่องอก (Thoracic inlet) เป็นจุดรับกระดูกอ่อนซี่โครงคู่ที่ 1 และเป็นจุดเกาะต้นของกล้ามเนื้อคอและหน้าอกสำคัญ',
    landmarks: [
      'Cranial pointed extremity (ปลายแหลมด้านหน้าของกระดูกอกที่คลำได้ชัดเจน)',
      'First costal facets (แอ่งรับกระดูกอ่อนซี่โครงคู่ที่ 1 ซ้าย-ขวา)'
    ],
    articulations: [
      'ด้านข้างต่อกับกระดูกอ่อนซี่โครงคู่ที่ 1',
      'ด้านท้ายต่อกับกระดูกอกปล้องที่ 2 (Sternebra S2) ด้วยกระดูกอ่อน Intersternebral cartilage'
    ],
    clinicalNotes: 'ในการผ่าตัดเปิดกระดูกอกแนวกลาง (Median sternotomy) ศัลยแพทย์สัตวแพทย์มักเว้นส่วนปลาย Manubrium หรือ Xiphoid อย่างน้อยหนึ่งด้านไว้ไม่ให้ตัดขาดทั้งหมด เพื่อช่วยรักษาความมั่นคงของกรงทรวงอกหลังมัดลวดปิดอก',
    wordRoots: [
      { root: 'Manubrium', origin: 'Latin (manus = มือ)', meaningTh: 'ด้ามจับ (เปรียบเสมือนด้ามมีดสั้นของกระดูกอก)', meaningEn: 'Handle / hilt' }
    ],
    mediaIds: ['wm-dog-skeleton-specimen-01', 'wm-dog-skeleton-ellenberger-01'],
    relatedIds: ['sternum', 'ribs', 'vertebra-c7']
  },
  {
    id: 'sternum',
    navId: 'dog.skeletal.sternum',
    nameTh: 'ตัวกระดูกอกและลิ้นปี่ (S2–S7 & Xiphoid)',
    nameEn: 'Body of Sternum & Xiphoid Process',
    nameLatin: 'Corpus sterni (Sternebrae II–VII) et Processus xiphoideus',
    category: 'axial',
    groupId: 'axial_thorax',
    laterality: 'single',
    fidelity: 'modeled',
    sourceCredit: 'LMU VetAnat Segmented Sternebrae Series',
    color: '#0891b2',
    meshes: [
      'dog_skeletal_sternum_s2',
      'dog_skeletal_sternum_s3',
      'dog_skeletal_sternum_s4',
      'dog_skeletal_sternum_s5',
      'dog_skeletal_sternum_s6',
      'dog_skeletal_sternum_s7',
      'dog_skeletal_sternum_xiphoid'
    ],
    summaryTh: 'ท่อนกระดูกอกเรียงตัวกันเป็นปล้องๆ (Sternebrae) ไม่หลอมเป็นแผ่นแบนเหมือนมนุษย์ ปิดท้ายด้วยกระดูกลิ้นปี่ Xiphoid',
    descriptionTh: 'กระดูกอกของสุนัขทั้งหมดประกอบด้วย 8 ท่อน (Manubrium + Sternebrae S2–S7 + Xiphoid process) แต่ละท่อนมีทรงกระบอกสี่เหลี่ยมคั่นด้วยกระดูกอ่อน Intersternebral cartilages ทำให้ทรวงอกยืดหยุ่นขณะหายใจและวิ่ง ส่วนท่อนท้ายสุดคือ Xiphoid process แผ่แบนยื่นเข้าไปในแนวกล้ามเนื้อหน้าท้อง มีแผ่นกระดูกอ่อน Xiphoid cartilage ต่อปลาย',
    landmarks: [
      'Sternebrae S2–S7 (ท่อนตัวกระดูกอกเรียงเป็นปล้อง)',
      'Intersternebral synchondroses (ข้อต่อกระดูกอ่อนรับปลายซี่โครงคู่ที่ 2–9)',
      'Xiphoid process (กระดูกลิ้นปี่ จุดเริ่มต้นกรีดแผลผ่าตัดเปิดช่องท้องแนว Linea alba)'
    ],
    articulations: [
      'ด้านหน้าต่อกับ Manubrium sterni',
      'ด้านข้างรับกระดูกอ่อนซี่โครงแท้คู่ที่ 2–9'
    ],
    clinicalNotes: 'ความผิดปกติแต่กำเนิดที่พบได้คือภาวะอกบุ๋ม (Pectus excavatum) ซึ่งตัวกระดูกอกและ Xiphoid ยุบตัวกดทับหัวใจและปอด แก้ไขในลูกสุนัขได้ด้วยการดามเฝือกภายนอกดึงกระดูกอกลงมา',
    wordRoots: [
      { root: 'Sternon', origin: 'Greek', meaningTh: 'แผ่นอก', meaningEn: 'Chest / breastbone' },
      { root: 'Xiphos', origin: 'Greek', meaningTh: 'ใบดาบตรง (รูปร่างของลิ้นปี่)', meaningEn: 'Straight sword' }
    ],
    mediaIds: ['wm-dog-thorax-vd-01', 'wm-dog-skeleton-specimen-01', 'wm-dog-skeleton-ellenberger-01'],
    relatedIds: ['manubrium', 'ribs']
  },

  // ==================== 4. THORACIC LIMB (FORELIMB) ====================
  {
    id: 'scapula',
    navId: 'dog.skeletal.scapula',
    nameTh: 'กระดูกสะบัก (ซ้าย-ขวา)',
    nameEn: 'Scapula (Shoulder Blade)',
    nameLatin: 'Scapula',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#10b981',
    meshes: ['dog_skeletal_scapula_L', 'dog_skeletal_scapula_R'],
    summaryTh: 'กระดูกแบนสามเหลี่ยมแนบข้างทรวงอก ยึดกับลำตัวด้วยกล้ามเนื้อล้วนๆ (Synsarcosis) โดยไม่มีข้อต่อกระดูกไหปลาร้า',
    descriptionTh: 'กระดูกสะบักวางเฉียงทำมุมประมาณ 45° บนผนังซี่โครงคู่ที่ 1–5 ด้านนอกมีสันกระดูกสูงชัดเจน (Spine of scapula) ซึ่งแบ่งแอ่ง Supraspinous fossa และ Infraspinous fossa ออกในขนาดใกล้เคียงกัน 1:1 (ต่างจากมนุษย์ที่แอ่งบนเล็กกว่ามาก) ปลายล่างของสันยื่นเป็นปุ่ม Acromion และ Hamate process ที่คลำได้ชัดเจนที่หัวไหล่',
    landmarks: [
      'Spine of scapula (สันกระดูกสะบักด้านนอก แบ่งแอ่งบน-ล่างเท่ากัน)',
      'Supraspinous & Infraspinous fossae (แอ่งเหนือสันและใต้สันสะบัก)',
      'Acromion / Hamate process (ปุ่มปลายสันสะบักเหนือข้อไหล่)',
      'Glenoid cavity (เบ้าข้อไหล่ตื้นสำหรับรับหัวกระดูก Humerus)',
      'Supraglenoid tubercle (ปุ่มหน้าเบ้าไหล่ จุดเกาะต้นเอ็น Biceps brachii)'
    ],
    articulations: [
      'ปลายล่าง: ข้อไหล่ (Glenohumeral / Shoulder joint) กับหัวกระดูก Humerus',
      'ด้านใน: ยึดกับลำตัวแบบไร้ข้อต่อกระดูก (Synsarcosis) ผ่านกล้ามเนื้อ Serratus ventralis'
    ],
    clinicalNotes: 'เนื่องจากสุนัขไม่มีกระดูกไหปลาร้าที่สมบูรณ์ (เหลือเพียงเศษแถบเอ็นเล็กๆ ในกล้ามเนื้อ) สะบักจึงซับแรงกระแทกจากการกระโดดลงพื้นได้ยอดเยี่ยม โรคที่สำคัญบริเวณนี้คือกระดูกอ่อนหัวไหล่ลอกหลุด (Shoulder OCD) และเอ็นหัวไหล่อักเสบ',
    wordRoots: [
      { root: 'Scapula', origin: 'Latin', meaningTh: 'ใบพลั่วขุดดิน / แผ่นสะบัก', meaningEn: 'Shoulder blade / small shovel' }
    ],
    mediaIds: [
      'wm-dog-scapula-lateral-01',
      'wm-dog-scapula-medial-01',
      'wm-dog-scapula-sisson-01',
      'wm-dog-forelimb-bones-specimen-01'
    ],
    relatedIds: ['humerus', 'ribs', 'vertebra-c7']
  },
  {
    id: 'humerus',
    navId: 'dog.skeletal.humerus',
    nameTh: 'กระดูกต้นขาหน้า (ซ้าย-ขวา)',
    nameEn: 'Humerus (Arm Bone)',
    nameLatin: 'Humerus',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#059669',
    meshes: ['dog_skeletal_humerus_L', 'dog_skeletal_humerus_R'],
    summaryTh: 'กระดูกยาวท่อนบนของขาหน้ารูปตัว S อ่อนๆ มีรูทะลุเหนือข้อศอก (Supratrochlear foramen) อันเป็นเอกลักษณ์ของสุนัข',
    descriptionTh: 'เชื่อมระหว่างข้อไหล่ที่อยู่ระดับอกด้านหน้าลงไปหาข้อศอกด้านหลัง ลำตัวกระดูกบิดเกลียวมีร่องสำหรับเส้นประสาท Radial nerve พาดอ้อม จุดชี้บ่งกระดูก Humerus ของสุนัขแท้ๆ คือที่ปลายล่างเหนือลูกกลิ้งข้อศอกจะมีรูทะลุถึงกันระหว่างด้านหน้าและด้านหลัง เรียกว่า Supratrochlear foramen (ไม่มีโครงสร้างเนื้อเยื่อสำคัญลอดผ่าน แต่ช่วยให้ Anconeal process ของ Ulna ล็อกตัวได้ลึกเมื่อเหยียดขาเต็มที่)',
    landmarks: [
      'Head of humerus (หัวกระดูกกลมมนหันไปด้านท้ายเข้าเบ้าสะบัก)',
      'Greater & Lesser tubercles (ปุ่มกระดูกใหญ่ด้านนอกและปุ่มเล็กด้านใน)',
      'Deltoid tuberosity & Brachialis groove (สันเกาะกล้ามเนื้อและร่องเกลียวเส้นประสาท Radial)',
      'Supratrochlear foramen (รูทะลุเหนือลูกกลิ้งข้อศอก เอกลักษณ์เฉพาะสุนัข)',
      'Humeral condyle: Capitulum & Trochlea + Medial/Lateral epicondyles'
    ],
    articulations: [
      'ด้านบน: ข้อไหล่ (Shoulder joint) กับ Glenoid cavity ของสะบัก',
      'ด้านล่าง: ข้อศอก (Cubital / Elbow joint) กับหัวกระดูก Radius และร่องของ Ulna'
    ],
    clinicalNotes: 'ส่วนต้นของ Humerus (Proximal humerus — “ห่างจากศอก”) เป็นตำแหน่งยอดฮิตของมะเร็งกระดูก Osteosarcoma ในสุนัขพันธุ์ใหญ่ ส่วนปลายล่างในลูกสุนัขพันธุ์ Spaniel / French Bulldog เสี่ยงเกิดรอยหักผ่าข้อศอก (Humeral condylar Y/T fracture)',
    wordRoots: [
      { root: 'Umerus / Humerus', origin: 'Latin', meaningTh: 'ต้นแขน / ไหล่', meaningEn: 'Upper arm / shoulder' },
      { root: 'Supra-trochlear', origin: 'Latin', meaningTh: 'อยู่เหนือรอกลูกกลิ้งข้อศอก', meaningEn: 'Above the pulley (trochlea)' }
    ],
    mediaIds: [
      'wm-dog-humerus-cranial-01',
      'wm-dog-humerus-caudal-01',
      'wm-dog-humerus-radius-ulna-sisson-01',
      'wm-dog-forelimb-bones-specimen-01'
    ],
    relatedIds: ['scapula', 'radius', 'ulna']
  },
  {
    id: 'radius',
    navId: 'dog.skeletal.radius',
    nameTh: 'กระดูกปลายขาหน้าชิ้นใน / เรเดียส',
    nameEn: 'Radius (Primary Weight-Bearing Forearm Bone)',
    nameLatin: 'Radius',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#34d399',
    meshes: ['dog_skeletal_radius_L', 'dog_skeletal_radius_R'],
    summaryTh: 'เสาหลักรับน้ำหนักตัวเกือบทั้งหมดของปลายขาหน้าสุนัข ทอดพาดจากด้านหน้า-นอกที่ข้อศอกลงสู่ด้านในที่ข้อมือ',
    descriptionTh: 'ในสัตว์สี่เท้าที่วิ่งเร็วอย่างสุนัข กระดูก Radius ได้พัฒนาเป็นแกนรับน้ำหนักหลักของปลายขาหน้า (Antebrachium) โดยไขว้หน้ากระดูก Ulna และบิดหมุนหงายฝ่ามือ (Supination) ได้จำกัดมากเมื่อเทียบกับมนุษย์และแมว เพื่อแลกกับความมั่นคงสูงสุดในการวิ่งความเร็วสูง',
    landmarks: [
      'Head of radius / Fovea capitis (หัวกระดูกด้านบนรับน้ำหนักตรงจาก Humerus)',
      'Cranial bowed diaphysis (ลำตัวกระดูกแบนหน้า-หลัง โค้งไปด้านหน้าเล็กน้อย)',
      'Medial styloid process (ปลายแหลมด้านในข้อมือ)',
      'Carpal articular surface (ผิวข้อต่อกว้างด้านล่างต่อกับข้อมือ)'
    ],
    articulations: [
      'ด้านบน: ข้อศอกกับ Humerus และข้อต่อ Proximal radioulnar กับ Ulna',
      'ด้านล่าง: ข้อต่อ Antebrachiocarpal กับ Intermedioradial carpal bone และปลายล่าง Ulna'
    ],
    clinicalNotes: 'ในสุนัขพันธุ์ Toy (Pomeranian, Poodle, Italian Greyhound) กระดูก Radius-Ulna ส่วนปลายที่เรียวบางมากมีเลือดมาเลี้ยงน้อย หากกระโดดลงจากโซฟาแล้วหักมักเกิดภาวะกระดูกไม่ติด (Non-union) ต้องดามด้วย Bone plate แทนการใส่เฝือกธรรมดา และปลายล่าง Radius ในพันธุ์ใหญ่เป็นจุดพบบ่อยที่สุดของ Osteosarcoma',
    wordRoots: [
      { root: 'Radius', origin: 'Latin', meaningTh: 'ซี่ล้อรถ / รัศมีลำแสง', meaningEn: 'Spoke of a wheel / ray' }
    ],
    mediaIds: [
      'wm-dog-radius-osteosarcoma-lat-01',
      'wm-dog-humerus-radius-ulna-sisson-01',
      'wm-dog-forelimb-bones-specimen-01'
    ],
    relatedIds: ['ulna', 'humerus', 'carpus']
  },
  {
    id: 'ulna',
    navId: 'dog.skeletal.ulna',
    nameTh: 'กระดูกปลายขาหน้าชิ้นนอก / อัลนา (ปุ่มศอก)',
    nameEn: 'Ulna (Olecranon & Elbow Stabilizer)',
    nameLatin: 'Ulna',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#6ee7b7',
    meshes: ['dog_skeletal_ulna_L', 'dog_skeletal_ulna_R'],
    summaryTh: 'กระดูกที่ยาวที่สุดของขาหน้า มียอดปุ่มศอก (Olecranon) เป็นคานงัดเหยียดขา และแอ่งพระจันทร์เสี้ยวล็อกข้อศอก',
    descriptionTh: 'ส่วนต้นของ Ulna มีขนาดใหญ่และสำคัญต่อกลศาสตร์ข้อศอกอย่างยิ่ง ประกอบด้วยปุ่มศอก (Olecranon tuber) สำหรับยึดกล้ามเนื้อ Triceps brachii, แอ่งเว้าครึ่งวงกลม Trochlear notch ที่โอบลูกกลิ้ง Humerus, จงอยบน Anconeal process และบ่ารับน้ำหนักด้านใน Medial coronoid process ส่วนปลายล่างเรียวเล็กลงไปจบเป็นปุ่มข้างข้อมือด้านนอก',
    landmarks: [
      'Olecranon tuber (ปุ่มยอดข้อศอก คานงัดหลักในการเหยียดขาหน้า)',
      'Trochlear / Semilunar notch (แอ่งเว้ารูปพระจันทร์เสี้ยวโอบข้อศอก)',
      'Anconeal process (จงอยแหลมบนที่สอดเข้าแอ่ง Olecranon fossa ของ Humerus)',
      'Medial & Lateral coronoid processes (บ่ารับน้ำหนักข้อศอกด้านในและด้านนอก)',
      'Lateral styloid process (ปลายแหลมด้านนอกข้อมือ รูปกรวยเจริญจาก Distal ulnar physis)'
    ],
    articulations: [
      'ด้านบน: ข้อศอก (Humeroulnar) และข้อต่อ Proximal radioulnar',
      'ด้านล่าง: ต่อกับ Ulnar carpal bone และ Accessory carpal bone'
    ],
    clinicalNotes: 'กลุ่มโรคข้อศอกเจริญผิดปกติ (Canine Elbow Dysplasia) ในพันธุ์ Labrador, Golden, Shepherd เกิดที่ Ulna เป็นหลัก ได้แก่ 1) Fragmented Medial Coronoid Process (FCP) และ 2) Ununited Anconeal Process (UAP) นอกจากนี้แผ่นเจริญเติบโตปลายล่าง Ulna รูปกรวยบาดเจ็บง่าย ทำให้อัลนาหยุดยาวและดึงขาหน้าโก่งออกนอก (Valgus deformity)',
    wordRoots: [
      { root: 'Ulna', origin: 'Latin', meaningTh: 'ข้อศอก / ท่อนแขน', meaningEn: 'Elbow / forearm' },
      { root: 'Olekranon', origin: 'Greek (ōlenē + kranion)', meaningTh: 'ยอดหัวของข้อศอก', meaningEn: 'Head / point of the elbow' }
    ],
    mediaIds: [
      'wm-dog-elbow-dysplasia-01',
      'wm-dog-humerus-radius-ulna-sisson-01',
      'wm-dog-forelimb-bones-specimen-01'
    ],
    relatedIds: ['radius', 'humerus', 'carpus']
  },
  {
    id: 'carpus',
    navId: 'dog.skeletal.carpus',
    nameTh: 'กลุ่มกระดูกข้อมือ (7 ชิ้น/ข้าง)',
    nameEn: 'Carpal Bones (Carpus / Wrist)',
    nameLatin: 'Ossa carpi',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Scan the World Canine Foreleg CT/Scan',
    color: '#14b8a6',
    meshes: ['dog_skeletal_carpus_L', 'dog_skeletal_carpus_R'],
    summaryTh: 'กลุ่มกระดูกสั้นข้อมือ 7 ชิ้นเรียง 2 แถว โดดเด่นด้วย Intermedioradial carpal bone และปุ่ม Accessory carpal ด้านหลัง',
    descriptionTh: 'ในสุนัข กระดูกข้อมือแถวบนมี 3 ชิ้น (จากที่สัตว์เลี้ยงลูกด้วยนมดั้งเดิมมี 4 ชิ้น) เนื่องจาก Radial และ Intermediate carpal bones หลอมรวมกันเป็นชิ้นใหญ่ชื่อ Intermedioradial carpal bone ร่วมกับ Ulnar carpal และ Accessory carpal bone ที่ยื่นออกทางด้านหลังข้อมือ ส่วนแถวล่างมี 4 ชิ้นเรียงจากด้านในไปด้านนอกคือ Carpal bones I, II, III และ IV',
    landmarks: [
      'Intermedioradial carpal bone (กระดูกข้อมือชิ้นใหญ่ที่สุดด้านหน้า-ใน)',
      'Ulnar carpal bone (กระดูกข้อมือแถวบนด้านนอก)',
      'Accessory carpal bone (ปุ่มกระดูกยื่นด้านหลังข้อมือ รองรับแผ่น Carpal pad)',
      'Distal row: First, Second, Third & Fourth carpal bones (แถวล่าง 4 ชิ้น)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Antebrachiocarpal (เคลื่อนไหวพับข้อมือมากที่สุด ~70–80%) กับ Radius/Ulna',
      'ด้านล่าง: ข้อต่อ Carpometacarpal กับฐานกระดูกฝ่าเท้าหน้า I–V'
    ],
    clinicalNotes: 'หากสุนัขกระโดดลงจากที่สูงรุนแรง เอ็นด้านฝ่ามืออาจฉีกขาดเกิดภาวะข้อมือแอ่นทรุดติดพื้น (Carpal hyperextension injury) ต้องผ่าตัดเชื่อมข้อข้อมือ (Pancarpal arthrodesis) ส่วนสุนัขแข่ง Greyhound มักพบ Accessory carpal bone แตก',
    wordRoots: [
      { root: 'Karpos', origin: 'Greek', meaningTh: 'ข้อมือ / จุดหมุนมือ', meaningEn: 'Wrist' }
    ],
    mediaIds: [
      'wm-dog-forepaw-ap-01',
      'wm-dog-manus-skeleton-sisson-01',
      'wm-dog-manus-bones-specimen-01'
    ],
    relatedIds: ['radius', 'ulna', 'metacarpus']
  },
  {
    id: 'metacarpus',
    navId: 'dog.skeletal.metacarpus',
    nameTh: 'กระดูกฝ่าเท้าหน้า 5 นิ้ว (I–V)',
    nameEn: 'Metacarpal Bones (I–V)',
    nameLatin: 'Ossa metacarpalia I–V',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Scan the World Canine Foreleg Scan',
    color: '#0d9488',
    meshes: ['dog_skeletal_metacarpus_L', 'dog_skeletal_metacarpus_R'],
    summaryTh: 'กระดูกฝ่าเท้าหน้า 5 ท่อน โดยท่อนที่ 3 และ 4 ยาวที่สุดรับน้ำหนักหลัก ส่วนท่อนที่ 1 สั้นเป็นฐานนิ้วติ่ง (Dewclaw)',
    descriptionTh: 'เนื่องจากสุนัขเป็นสัตว์เดินด้วยนิ้วเท้า (Digitigrade) กระดูกฝ่าเท้าหน้าจึงไม่ได้วางราบกับพื้นเหมือนฝ่ามือคน แต่ยกตั้งเฉียงขึ้นเป็นส่วนหนึ่งของลำขาส่วนล่าง มีครบ 5 ชิ้น (Metacarpals I–V) โดยชิ้นที่ I ด้านในสุดมีขนาดเล็กและสั้นไม่แตะพื้น ส่วนชิ้นที่ III และ IV ยาวและแข็งแรงที่สุด ตามด้วยชิ้นที่ II และ V',
    landmarks: [
      'First metacarpal bone MC I (กระดูกฝ่าเท้าของนิ้วติ่งหน้า Dewclaw)',
      'Primary weight-bearing MC III & MC IV (คู่แกนกลางรับน้ำหนักหลัก)',
      'Abaxial weight-bearing MC II & MC V (คู่ขนาบข้าง)',
      'Distal sagittal ridges & Palmar sesamoid facets (สันรอกปลายล่างต่อกับนิ้วและกระดูกงา)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Carpometacarpal กับกระดูกข้อมือแถวล่าง I–IV',
      'ด้านล่าง: ข้อต่อ Metacarpophalangeal กับข้อนิ้วท่อนต้น I–V และ Proximal sesamoids'
    ],
    clinicalNotes: 'กระดูกฝ่าเท้าหักมักเกิดจากการถูกรถทับอุ้งเท้าหรือตกร่องตะแกรง ถ้านิ้วหลัก MC III และ MC IV หักพร้อมกันทั้งสองชิ้นต้องผ่าตัดดามเหล็กหรือสอดลวด K-wire เพื่อไม่ให้อุ้งเท้าทรุดผิดรูป',
    wordRoots: [
      { root: 'Meta-karpos', origin: 'Greek', meaningTh: 'ส่วนที่อยู่ถัดออกไปจากข้อมือ', meaningEn: 'Beyond / after the wrist' }
    ],
    mediaIds: [
      'wm-dog-forepaw-ap-01',
      'wm-dog-forepaw-dachshund-01',
      'wm-dog-manus-skeleton-sisson-01',
      'wm-dog-manus-bones-specimen-01'
    ],
    relatedIds: ['carpus', 'phalanges-thoracic']
  },
  {
    id: 'phalanges-thoracic',
    navId: 'dog.skeletal.phalanges-thoracic',
    nameTh: 'กระดูกนิ้วเท้าหน้าและกระดูกเล็บ',
    nameEn: 'Thoracic Phalanges (Forepaw Digits)',
    nameLatin: 'Ossa digitorum manus',
    category: 'appendicular_fore',
    groupId: 'appendicular_fore',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Scan the World Canine Foreleg Scan',
    color: '#0f766e',
    meshes: ['dog_skeletal_phalanges-thoracic_L', 'dog_skeletal_phalanges-thoracic_R'],
    summaryTh: 'กระดูกนิ้วเท้าหน้าที่สัมผัสดินรับน้ำหนักจริง นิ้วหลัก II–V มีนิ้วละ 3 ข้อ ส่วนนิ้วติ่งที่ I มี 2 ข้อ พร้อมปลอกกระดูกสวมเล็บ',
    descriptionTh: 'นิ้วเท้าหลักที่แตะพื้นรับน้ำหนักคือนิ้วที่ II, III, IV และ V แต่ละนิ้วประกอบด้วยข้อต้น (Proximal phalanx / P1), ข้อกลาง (Middle phalanx / P2) และข้อปลาย (Distal phalanx / P3) ส่วนนิ้วที่ I (Dewclaw ด้านใน) มีเพียง P1 และ P3 ข้อปลายสุด P3 มีจะงอยกระดูก Ungual crest และ Ungual process เป็นแกนให้ปลอกเล็บเคราติน (Claw) สวมหุ้มอยู่',
    landmarks: [
      'Proximal, Middle & Distal phalanges P1, P2, P3 (กระดูกนิ้วท่อนต้น กลาง และปลาย)',
      'Dewclaw Digit I (นิ้วติ่งด้านในที่มีเพียง 2 ท่อน)',
      'Ungual crest & Ungual process of P3 (ร่องโคนเล็บและแกนกระดูกปลายนิ้วในเล็บ)',
      'Paired palmar proximal sesamoid bones (กระดูกงาคู่ใต้ข้อต่อโคนนิ้ว)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Metacarpophalangeal กับปลายกระดูกฝ่าเท้าหน้า',
      'ระหว่างข้อนิ้ว: Proximal & Distal interphalangeal joints'
    ],
    clinicalNotes: 'เนื้องอกบริเวณโคนเล็บ (เช่น Subungual squamous cell carcinoma หรือ Melanoma) มักทำลายกระดูกปลายนิ้ว P3 เห็นชัดเจนในฟิล์มเอกซเรย์อุ้งเท้า จำเป็นต้องตัดนิ้วระดับ P1/P2 เพื่อควบคุมโรค',
    wordRoots: [
      { root: 'Phalanx', origin: 'Greek', meaningTh: 'แถวทหารกรีกที่ยืนเรียงกันเป็นแนวรบ (เปรียบกับข้อนิ้ว)', meaningEn: 'Line of soldiers in battle formation' }
    ],
    mediaIds: [
      'wm-dog-forepaw-ap-01',
      'wm-dog-forepaw-ml-01',
      'wm-dog-manus-skeleton-sisson-01',
      'wm-dog-manus-bones-specimen-01'
    ],
    relatedIds: ['metacarpus', 'carpus']
  },

  // ==================== 5. PELVIC LIMB (HINDLIMB) ====================
  {
    id: 'os-coxae',
    navId: 'dog.skeletal.os-coxae',
    nameTh: 'กระดูกเชิงกราน (ซ้าย-ขวา)',
    nameEn: 'Os Coxae (Hip Bone / Pelvis)',
    nameLatin: 'Os coxae (Ilium, Ischium, Pubis & Os acetabuli)',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#8b5cf6',
    meshes: ['dog_skeletal_os-coxae_L', 'dog_skeletal_os-coxae_R'],
    summaryTh: 'วงแหวนกระดูกเชิงกรานซ้าย-ขวา เกิดจากการหลอมรวมของ Ilium, Ischium, Pubis และ Acetabular bone สร้างเบ้าข้อสะโพก',
    descriptionTh: 'กระดูกเชิงกรานแต่ละข้างเกิดจากกระดูก 4 ชิ้น (Ilium ด้านหน้าบน, Ischium ด้านท้ายล่าง, Pubis ด้านหน้าล่าง และ Os acetabuli ชิ้นเล็กก้นเบ้า) เชื่อมสนิทกันตรงเบ้าข้อสะโพก (Acetabulum) เมื่ออายุประมาณ 4–6 เดือน ซีกซ้ายและซีกขวามาประกบกันด้านท้องเป็น Pelvic symphysis ก่อรูปเป็นช่องเชิงกราน (Pelvic canal) และทำหน้าที่ถ่ายทอดแรงถีบขาหลังเข้าสู่กระดูกสันหลัง',
    landmarks: [
      'Wing of ilium & Iliac crest (ปีกสะโพกด้านหน้า คลำได้ข้างเอว)',
      'Acetabulum & Lunate surface (เบ้าข้อสะโพกรูปถ้วยลึกและผิวกระดูกอ่อนรูปจันทร์เสี้ยว)',
      'Obturator foramen (ช่องเปิดรูปไข่ขนาดใหญ่ที่พื้นเชิงกราน ลดน้ำหนักกระดูก)',
      'Ischiatic tuberosity (ปุ่มกระดูกก้นกบด้านท้ายสุด)',
      'Pelvic symphysis: Pubic + Ischiatic symphysis (แนวประสานพื้นเชิงกราน)'
    ],
    articulations: [
      'ด้านในหน้า: ข้อต่อ Sacroiliac joint กับกระดูกกระเบนเหน็บ (Sacrum)',
      'ด้านนอก: ข้อสะโพก (Coxofemoral joint) กับหัวกระดูก Femur',
      'ด้านล่างกลาง: แนวประสาน Pelvic symphysis ระหว่างซีกซ้ายและขวา'
    ],
    clinicalNotes: 'กระดูกเชิงกรานมีลักษณะเป็นกล่องวงแหวน (Box-like structure) หากถูกรถชนจึงมักหักอย่างน้อย 2–3 ตำแหน่งพร้อมกัน หากชิ้นหักบีบช่องเชิงกรานแคบลงเกิน 45% จะทำให้สุนัขเบ่งอุจจาระไม่ออกเรื้อรัง (Obstipation/Megacolon) และคลอดลูกเองไม่ได้ โรคทางพันธุกรรมที่พบบ่อยที่สุดคือข้อสะโพกเจริญผิดปกติ (Canine Hip Dysplasia)',
    wordRoots: [
      { root: 'Coxa', origin: 'Latin', meaningTh: 'สะโพก', meaningEn: 'Hip' },
      { root: 'Acetabulum', origin: 'Latin', meaningTh: 'ถ้วยใส่น้ำส้มสายชูทรงลึกของโรมัน (เบ้าสะโพก)', meaningEn: 'Little vinegar cup' }
    ],
    mediaIds: [
      'wm-dog-hips-normal-vd-01',
      'wm-dog-hip-dysplasia-vd-01',
      'wm-dog-hip-dysplasia-norberg-01',
      'wm-dog-pelvis-specimen-dorsal-01',
      'wm-dog-pelvis-specimen-caudal-01',
      'wm-dog-hip-joint-specimen-01'
    ],
    relatedIds: ['sacrum', 'femur', 'os-penis']
  },
  {
    id: 'femur',
    navId: 'dog.skeletal.femur',
    nameTh: 'กระดูกต้นขาหลัง (ซ้าย-ขวา)',
    nameEn: 'Femur (Thigh Bone)',
    nameLatin: 'Os femoris',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#7c3aed',
    meshes: ['dog_skeletal_femur_L', 'dog_skeletal_femur_R'],
    summaryTh: 'กระดูกท่อนยาวที่หนาหนักและแข็งแรงที่สุดในร่างกายสุนัข รับแรงอัดและแรงบิดมหาศาลจากกล้ามเนื้อต้นขา',
    descriptionTh: 'ส่วนต้นมีหัวกระดูกทรงกลม (Femoral head) พร้อมหลุม Fovea capitis ยึดเอ็น Ligament of head of femur ต่อด้วยคอกระดูก (Neck) และปุ่มใหญ่ด้านนอก Greater trochanter สำหรับกล้ามเนื้อสะโพก (Gluteals) ส่วนปลายล่างขยายกว้างเป็นรอกด้านหน้า (Trochlea) สำหรับลูกสะบ้า และปุ่มคู่ด้านท้าย (Medial & Lateral condyles) ซึ่งด้านหลังเหนือก้อน Condyles ของสุนัขจะมีกระดูกงาคู่หนึ่งชื่อ Fabellae เกาะอยู่ในเอ็นกล้ามเนื้อน่อง',
    landmarks: [
      'Femoral head & Fovea capitis (หัวกระดูกกลมเข้าเบ้าสะโพก)',
      'Femoral neck (คอกระดูกต้นขาหลัง)',
      'Greater, Lesser & Third trochanters (ปุ่มเกาะกล้ามเนื้อสะโพก)',
      'Trochlear groove & ridges (ร่องรอกด้านหน้าเข่ารองรับลูกสะบ้า Patella)',
      'Medial & Lateral condyles + Intercondylar fossa (ปุ่มข้อเข่าและแอ่งเอ็นไขว้หน้า-หลัง)'
    ],
    articulations: [
      'ด้านบน: ข้อสะโพก (Coxofemoral ball-and-socket joint) กับเบ้า Acetabulum',
      'ด้านล่างหน้า: ข้อต่อ Femoropatellar กับลูกสะบ้า (Patella)',
      'ด้านล่างท้าย: ข้อเข่า (Femorotibial joint) กับลานกระดูก Tibia โดยคั่นด้วยหมอนรองข้อเข่า (Menisci)'
    ],
    clinicalNotes: 'ในสุนัขพันธุ์เล็กอายุน้อยพบโรคหัวกระดูก Femur ขาดเลือดไปเลี้ยงจนยุบตัว (Legg-Calvé-Perthes disease) รักษาด้วยการผ่าตัดตัดหัวกระดูกออก (FHO) ส่วนสุนัขพันธุ์ใหญ่มักพบข้อสะโพกเสื่อม กระดูกต้นขาหักจากอุบัติเหตุ และมะเร็งกระดูกส่วนปลายล่าง (Distal femur)',
    wordRoots: [
      { root: 'Femur / Femoris', origin: 'Latin', meaningTh: 'ต้นขา', meaningEn: 'Thigh' },
      { root: 'Trochanter', origin: 'Greek (trekhein = วิ่ง)', meaningTh: 'ปุ่มหมุนสำหรับนักวิ่ง', meaningEn: 'Runner / prominence on proximal femur' }
    ],
    mediaIds: [
      'wm-dog-hip-joint-specimen-01',
      'wm-dog-hind-limb-specimen-01',
      'wm-dog-hips-normal-vd-01',
      'wm-dog-osteosarcoma-femur-lat-01',
      'wm-dog-pelvis-lateral-01',
      'wm-bone-compact-ground-01'
    ],
    relatedIds: ['os-coxae', 'patella', 'tibia']
  },
  {
    id: 'patella',
    navId: 'dog.skeletal.patella',
    nameTh: 'กระดูกสะบ้า (ซ้าย-ขวา)',
    nameEn: 'Patella (Kneecap)',
    nameLatin: 'Patella',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Greyhound Pelvic Limb CT Scan',
    color: '#a855f7',
    meshes: ['dog_skeletal_patella_L', 'dog_skeletal_patella_R'],
    summaryTh: 'กระดูกงา (Sesamoid bone) ชิ้นใหญ่ที่สุดในร่างกาย ฝังในเอ็นกล้ามเนื้อ Quadriceps ทำหน้าที่เป็นรอกทดแรงเหยียดข้อเข่า',
    descriptionTh: 'มีรูปทรงรีคล้ายเมล็ดอัลมอนด์ ฐานกว้างอยู่ด้านบน (Base) และปลายมนชี้ลงล่าง (Apex) ผิวด้านหลังเรียบคลุมด้วยกระดูกอ่อนหนาเพื่อลื่นไถลขึ้น-ลงอยู่ในร่อง Trochlear groove ของปลายล่างกระดูก Femur ช่วยเปลี่ยนมุมดึงของเอ็น Patellar ligament ก่อนไปเกาะที่สันหน้าแข้ง (Tibial tuberosity)',
    landmarks: [
      'Base of patella (ฐานบนรับเอ็นกล้ามเนื้อต้นขาหน้า Quadriceps femoris)',
      'Apex of patella (ยอดปลายล่างส่งต่อเป็น Patellar ligament)',
      'Articular surface (ผิวข้อต่อด้านในเรียบลื่นรับกับร่อง Trochlea)'
    ],
    articulations: [
      'ผิวด้านหลัง: ข้อต่อ Femoropatellar joint กับร่อง Trochlea ของกระดูก Femur'
    ],
    clinicalNotes: 'โรคสะบ้าเคลื่อนหลุด (Patellar Luxation แบ่งความรุนแรงเป็น Grade 1–4) เป็นโรคออร์โธปิดิกส์อันดับต้นๆ ในสุนัขพันธุ์เล็ก เช่น Pomeranian, Chihuahua, Yorkshire Terrier, Poodle โดยมากกว่า 80% หลุดเข้าด้านใน (Medial Patellar Luxation) ทำให้สุนัขเดินยกขาหลังเต้น 2–3 ก้าวแล้ววางลง',
    wordRoots: [
      { root: 'Patella', origin: 'Latin (diminutive of patina)', meaningTh: 'จานใบเล็ก / ถาดกลมขนาดเล็ก', meaningEn: 'Small shallow dish / pan' }
    ],
    mediaIds: [
      'wm-dog-stifle-specimen-01',
      'wm-dog-pelvis-vd-02',
      'wm-dog-pelvis-lateral-01',
      'wm-dog-stifle-tplo-lat-01'
    ],
    relatedIds: ['femur', 'tibia']
  },
  {
    id: 'tibia',
    navId: 'dog.skeletal.tibia',
    nameTh: 'กระดูกหน้าแข้ง (ซ้าย-ขวา)',
    nameEn: 'Tibia (Shinbone)',
    nameLatin: 'Tibia',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#6366f1',
    meshes: ['dog_skeletal_tibia_L', 'dog_skeletal_tibia_R'],
    summaryTh: 'กระดูกท่อนหลักรับน้ำหนักของขาหลังส่วนล่าง มีลานหัวเข่า (Tibial plateau) ที่ใช้คำนวณมุมผ่าตัด TPLO',
    descriptionTh: 'มีลำตัวรูปทรงปริซึมสามเหลี่ยมด้านบนและกลมรีด้านล่าง ด้านบนกว้างเป็นลานข้อเข่า (Tibial plateau) ที่ลาดเอียงไปทางด้านท้ายตามธรรมชาติ ด้านหน้ามีสันนูนสูง Tibial tuberosity และ Tibial crest ที่คลำได้ใต้ผิวหนังโดยไม่มีกล้ามเนื้อคลุมด้านใน ปลายล่างมีร่องเกลียว Cochlea tibiae ล็อกกับกระดูกข้อเท้า Talus และมีตาตุ่มใน (Medial malleolus)',
    landmarks: [
      'Tibial plateau: Medial & Lateral condyles (ลานกระดูกหน้าแข้งรองรับข้อเข่า)',
      'Tibial tuberosity & Cranial border / crest (ปุ่มและสันหน้าแข้งจุดเกาะเอ็นลูกสะบ้า)',
      'Extensor groove (ร่องด้านหน้า-นอกสำหรับเอ็น Long digital extensor ลอดผ่าน)',
      'Cochlea tibiae & Medial malleolus (ร่องรับข้อเท้าและตาตุ่มด้านใน)'
    ],
    articulations: [
      'ด้านบน: ข้อเข่า (Femorotibial joint) กับ Femur และข้อต่อกับหัว Fibula',
      'ด้านล่าง: ข้อเท้าบน (Tarsocrural joint) กับรอกของกระดูก Talus'
    ],
    clinicalNotes: 'ภาวะเอ็นไขว้หน้าข้อเข่าขาด (Cranial Cruciate Ligament Disease - CCLD) เป็นสาเหตุอันดับ 1 ของอาการขากะเพกขาหลังในสุนัข การผ่าตัดมาตรฐานยุคใหม่คือ TPLO (การเลื่อยปรับมุมเอียงลาน Tibial plateau ให้เหลือ ~5°) หรือ TTA เพื่อกำจัดแรงไถลหน้าแข้งขณะเหยียดลงน้ำหนัก',
    wordRoots: [
      { root: 'Tibia', origin: 'Latin', meaningTh: 'ขลุ่ยกระดูกโบราณ / หน้าแข้ง', meaningEn: 'Flute / shinbone' }
    ],
    mediaIds: [
      'wm-dog-stifle-tplo-lat-01',
      'wm-dog-stifle-specimen-01',
      'wm-dog-tibia-fibula-fracture-01',
      'wm-dog-hind-limb-specimen-01'
    ],
    relatedIds: ['femur', 'patella', 'fibula', 'tarsus']
  },
  {
    id: 'fibula',
    navId: 'dog.skeletal.fibula',
    nameTh: 'กระดูกน่อง (ซ้าย-ขวา)',
    nameEn: 'Fibula (Lateral Splint Bone of Crus)',
    nameLatin: 'Fibula',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Scan (Left & Right)',
    color: '#818cf8',
    meshes: ['dog_skeletal_fibula_L', 'dog_skeletal_fibula_R'],
    summaryTh: 'กระดูกแท่งเรียวยาวทอดตัวตลอดด้านนอกของกระดูกหน้าแข้ง ทำหน้าที่ยึดกล้ามเนื้อและสร้างตาตุ่มนอกประคองข้อเท้า',
    descriptionTh: 'แตกต่างจากสัตว์กีบที่กระดูก Fibula ลดรูปหายไปเกือบหมด สุนัขยังคงมีกระดูก Fibula ยาวสมบูรณ์ตั้งแต่ใต้ข้อเข่าจรดข้อเท้า แต่มีความบางเรียวมาก รับน้ำหนักตรงน้อยมาก ช่วงครึ่งบนมีช่องว่างแคบๆ กับ Tibia ส่วนครึ่งล่างแนบชิดกับ Tibia และจบลงเป็นตาตุ่มนอก (Lateral malleolus) ซึ่งทำหน้าที่สำคัญมากในการประคองข้อเท้าไม่ให้พลิกออกด้านข้าง',
    landmarks: [
      'Head of fibula (หัวกระดูกน่องด้านนอกใต้ข้อเข่า จุดเกาะ Lateral collateral ligament)',
      'Slender shaft of fibula (ก้านกระดูกน่องเรียวยาว)',
      'Lateral malleolus (ตาตุ่มด้านนอก ประกบล็อกด้านข้างของกระดูกข้อเท้า Talus)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Proximal tibiofibular กับขอบนอกด้านท้ายของ Tibia',
      'ด้านล่าง: ข้อต่อ Distal tibiofibular และประกบด้านข้างกับ Talus / Calcaneus'
    ],
    clinicalNotes: 'เมื่อกระดูกหน้าแข้ง Tibia หัก มักพบ Fibula หักร่วมด้วยเสมอ แต่หากตาตุ่มนอก (Lateral malleolus) หักแยกเดี่ยวๆ จะทำให้ข้อเท้าสุนัขหลวมพลิกทันที ต้องผ่าตัดยึดด้วยลวด Pin & Tension band หรือสกรูเพื่อคืนความมั่นคงให้ข้อเท้า',
    wordRoots: [
      { root: 'Fibula', origin: 'Latin', meaningTh: 'เข็มกลัดเสื้อคลุมโรมัน (เพราะวางประกบคู่กับหน้าแข้งเหมือนเข็มกลัด)', meaningEn: 'Clasp / brooch pin' }
    ],
    mediaIds: [
      'wm-dog-hind-limb-specimen-02',
      'wm-dog-tibia-fibula-fracture-01',
      'wm-dog-stifle-specimen-01'
    ],
    relatedIds: ['tibia', 'tarsus', 'femur']
  },
  {
    id: 'tarsus',
    navId: 'dog.skeletal.tarsus',
    nameTh: 'กลุ่มกระดูกข้อเท้า / ฮ็อก (7 ชิ้น/ข้าง)',
    nameEn: 'Tarsal Bones (Tarsus / Hock)',
    nameLatin: 'Ossa tarsi (Talus, Calcaneus, Os tarsi centrale & Tarsalia I–IV)',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Greyhound Pelvic Limb CT Scan',
    color: '#4f46e5',
    meshes: ['dog_skeletal_tarsus_L', 'dog_skeletal_tarsus_R'],
    summaryTh: 'กลุ่มกระดูกข้อเท้าหลัง 7 ชิ้นที่ยกตัวลอยพ้นพื้น มีปุ่มส้นเท้า Calcaneus เป็นคานงัดรับเอ็นร้อยหวาย',
    descriptionTh: 'เพราะสุนัขเดินด้วยปลายนิ้ว ส้นเท้า (Hock / Tarsus) ของสุนัขจึงยกสูงขึ้นเหนือพื้น (คนมักเข้าใจผิดว่าเป็นหัวเข่ากลับด้าน!) ประกอบด้วยกระดูก 7 ชิ้นเรียง 3 ชั้น ได้แก่ แถวบน: Talus (มีรอกเกลียวรับหน้าแข้ง) และ Calcaneus (กระดูกส้นเท้ายื่นยาวขึ้นด้านบนหลัง), แถวกลาง: Central tarsal bone, และแถวล่าง: Tarsal bones I, II, III และ IV (ชิ้นที่ IV สูงใหญ่เท่ากับสองแถวรวมกัน)',
    landmarks: [
      'Calcaneus & Tuber calcanei (กระดูกส้นเท้าและยอดปุ่มส้นเท้าจุดเกาะเอ็นร้อยหวาย)',
      'Talus & Trochlea tali (กระดูกข้อเท้าชิ้นในที่มีรอกเกลียวโค้ง)',
      'Central tarsal bone (กระดูกข้อเท้าชิ้นกลางด้านใน)',
      'Fourth tarsal bone (กระดูกข้อเท้าชิ้นที่ 4 ด้านนอกที่สูงเชื่อมแถวบนถึงฝ่าเท้า)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Tarsocrural joint กับปลายล่างของ Tibia และ Fibula',
      'ด้านล่าง: ข้อต่อ Tarsometatarsal joints กับฐานกระดูกฝ่าเท้าหลัง'
    ],
    clinicalNotes: 'หากเอ็นร้อยหวาย (Common calcaneal tendon) ขาด สุนัขจะเดินส้นเท้าแตะพื้นแบบหมี (Plantigrade stance) ส่วนในสุนัขแข่งวิ่งเลี้ยวซ้ายด้วยความเร็วสูงมักเกิด Central tarsal bone แตกยุบตัว',
    wordRoots: [
      { root: 'Tarsos', origin: 'Greek', meaningTh: 'แผงสานแบน / ข้อเท้า', meaningEn: 'Flat basketwork / ankle-instep' },
      { root: 'Calcaneus', origin: 'Latin (calx)', meaningTh: 'ส้นเท้า', meaningEn: 'Heel' }
    ],
    mediaIds: [
      'wm-dog-pes-skeleton-sisson-01',
      'wm-dog-pes-bones-specimen-01',
      'wm-dog-hind-limb-specimen-01'
    ],
    relatedIds: ['tibia', 'fibula', 'metatarsus']
  },
  {
    id: 'metatarsus',
    navId: 'dog.skeletal.metatarsus',
    nameTh: 'กระดูกฝ่าเท้าหลัง (II–V)',
    nameEn: 'Metatarsal Bones (Hindpaw)',
    nameLatin: 'Ossa metatarsalia',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Greyhound Pelvic Limb CT Scan',
    color: '#4338ca',
    meshes: ['dog_skeletal_metatarsus_L', 'dog_skeletal_metatarsus_R'],
    summaryTh: 'กระดูกฝ่าเท้าหลังที่ยาวกว่าฝ่าเท้าหน้า โดยปกติสุนัขมีฝ่าเท้าหลังสมบูรณ์ 4 ท่อนหลัก (II–V) และลดรูปนิ้วโป้งหลัง',
    descriptionTh: 'มีลักษณะคล้ายกระดูกฝ่าเท้าหน้าแต่มีความยาวกว่าและหน้าตัดค่อนข้างเป็นสี่เหลี่ยมเพื่อส่งแรงดีดตัว ในสุนัขทั่วไปจะมี Metatarsal สมบูรณ์ 4 ท่อนคือท่อนที่ II, III, IV และ V ส่วนท่อนที่ I ด้านในมักลดรูปเหลือเพียงติ่งกระดูกเล็กๆ หรือหายไป (ยกเว้นบางสายพันธุ์ เช่น Great Pyrenees หรือ Briard ที่มาตรฐานสายพันธุ์กำหนดให้มีนิ้วติ่งขาหลังคู่)',
    landmarks: [
      'Full metatarsal bones MT II, MT III, MT IV, MT V (กระดูกฝ่าเท้าหลังหลัก 4 ท่อน)',
      'Vestigial first metatarsal MT I (ร่องรอยกระดูกฝ่าเท้านิ้วที่ 1 ด้านใน)',
      'Distal trochlear heads (หัวกระดูกส่วนปลายสำหรับต่อข้อนิ้วเท้าหลัง)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Tarsometatarsal กับกระดูกข้อเท้าแถวล่าง I–IV',
      'ด้านล่าง: ข้อต่อ Metatarsophalangeal กับข้อนิ้วเท้าหลังท่อนต้น'
    ],
    clinicalNotes: 'ความยาวที่มากกว่าของกระดูก Metatarsus ช่วยเพิ่มความยาวคานดีดตัวของขาหลัง เมื่อเปรียบเทียบฟิล์มเอกซเรย์อุ้งเท้าหน้ากับอุ้งเท้าหลัง สามารถแยกขาหลังได้ทันทีจากการมีกระดูกฝ่าเท้ายาวเรียว 4 แท่งหลักแทนที่จะมีนิ้วติ่งที่ 5 ชัดเจนเหมือนขาหน้า',
    wordRoots: [
      { root: 'Meta-tarsos', origin: 'Greek', meaningTh: 'ส่วนที่อยู่ถัดออกไปจากข้อเท้า', meaningEn: 'Beyond the ankle / tarsus' }
    ],
    mediaIds: [
      'wm-dog-pes-skeleton-sisson-01',
      'wm-dog-pes-bones-specimen-01'
    ],
    relatedIds: ['tarsus', 'phalanges-pelvic']
  },
  {
    id: 'phalanges-pelvic',
    navId: 'dog.skeletal.phalanges-pelvic',
    nameTh: 'กระดูกนิ้วเท้าหลังและกระดูกเล็บ',
    nameEn: 'Pelvic Phalanges (Hindpaw Digits)',
    nameLatin: 'Ossa digitorum pedis',
    category: 'appendicular_hind',
    groupId: 'appendicular_hind',
    laterality: 'paired',
    fidelity: 'scan',
    sourceCredit: 'Greyhound Pelvic Limb CT Scan',
    color: '#3730a3',
    meshes: ['dog_skeletal_phalanges-pelvic_L', 'dog_skeletal_phalanges-pelvic_R'],
    summaryTh: 'กระดูกนิ้วเท้าหลังหลัก 4 นิ้ว (II–V) นิ้วละ 3 ข้อ (P1, P2, P3) ที่จิกพื้นส่งแรงพุ่งทะยานไปด้านหน้า',
    descriptionTh: 'โครงสร้างแต่ละนิ้วของขาหลังเหมือนกับขาหน้าทุกประการ คือประกอบด้วยกระดูกนิ้วท่อนต้น (P1), ท่อนกลาง (P2) และท่อนปลายทรงกรวยโค้ง (P3 / Ungual bone) ที่สวมอยู่ในปลอกเล็บ ร่วมกับกระดูกงา (Sesamoids) ด้านฝ่าเท้าและด้านหลังข้อนิ้ว ปกติขาหลังสุนัขไม่มีนิ้วติ่ง (Hind dewclaw) หากมีมักยึดติดเพียงผิวหนังโดยไม่มีข้อต่อกระดูกสมบูรณ์ จึงมักเกี่ยวสิ่งของฉีกขาดได้ง่าย',
    landmarks: [
      'Digits II–V: Proximal, Middle & Distal phalanges (ข้อนิ้วเท้าหลัง 4 นิ้วหลัก)',
      'Ungual process & crest (แกนกระดูกเล็บของข้อปลาย P3)',
      'Plantar & Dorsal sesamoid bones (กระดูกงาประคองเอ็นงอและเหยียดนิ้ว)'
    ],
    articulations: [
      'ด้านบน: ข้อต่อ Metatarsophalangeal กับปลายกระดูกฝ่าเท้าหลัง II–V',
      'ระหว่างข้อนิ้ว: Proximal & Distal interphalangeal joints'
    ],
    clinicalNotes: 'ในนักกีฬาสุนัข (Agility / Flyball) อาจเกิดข้อนิ้วเท้าเคลื่อนหลุดหรือเอ็นข้างข้อนิ้วฉีกขาด (Collateral ligament rupture of interphalangeal joint) ทำให้เห็นนิ้วเท้ากางผิดรูปเวลากดน้ำหนัก',
    wordRoots: [
      { root: 'Digitus pedis', origin: 'Latin', meaningTh: 'นิ้วของเท้าหลัง', meaningEn: 'Digit / toe of the hindfoot' }
    ],
    mediaIds: [
      'wm-dog-pes-skeleton-sisson-01',
      'wm-dog-pes-bones-specimen-01'
    ],
    relatedIds: ['metatarsus', 'tarsus']
  },

  // ==================== 6. VISCERAL / SPLANCHNIC SKELETON ====================
  {
    id: 'os-penis',
    navId: 'dog.skeletal.os-penis',
    nameTh: 'กระดูกองคชาต (บาคูลัม — สุนัขเพศผู้)',
    nameEn: 'Os Penis / Baculum (Visceral Bone)',
    nameLatin: 'Os penis (Baculum)',
    category: 'visceral',
    groupId: 'visceral_skeleton',
    laterality: 'single',
    fidelity: 'scan',
    sourceCredit: '3D Osteological Specimen Scan',
    color: '#e11d48',
    meshes: ['dog_skeletal_os-penis'],
    summaryTh: 'กระดูกนอกระบบข้อต่อ (Heterotopic / Visceral bone) ในสุนัขเพศผู้ มีร่องท่อปัสสาวะด้านล่างที่เป็นจุดติดค้างของนิ่วบ่อยที่สุด!',
    descriptionTh: 'สัตว์กินเนื้อตระกูลสุนัขเพศผู้มีกระดูกแท่งเรียวยาวพัฒนาขึ้นในเนื้อเยื่อแกนกลางขององคชาต (Glans penis) โดยไม่ได้ต่อกับกระดูกเชิงกรานหรือข้อต่อใดๆ เลย จึงจัดเป็นกระดูกอวัยวะภายใน (Visceral / Splanchnic skeleton) ตลอดพื้นด้านท้องของกระดูกชิ้นนี้มีร่องลึก (Urethral groove / Sulcus urethralis) ห่อหุ้มท่อปัสสาวะส่วนปลายเอาไว้',
    landmarks: [
      'Ventral urethral groove / Sulcus urethralis (ร่องยาวด้านล่างสำหรับท่อปัสสาวะ)',
      'Broad caudal base (ฐานด้านท้ายที่ต่อกับ Corpus cavernosum)',
      'Fibrocartilaginous cranial apex (ปลายเรียวด้านหน้าที่มีกระดูกอ่อนต่อปลาย)'
    ],
    articulations: [
      'ไม่มีข้อต่อกับโครงกระดูกอื่น (ฝังอยู่ในเนื้อเยื่ออวัยวะสืบพันธุ์เพศผู้ใต้เชิงกราน)'
    ],
    clinicalNotes: 'มีความสำคัญทางคลินิกและรังสีวิทยาอย่างสูงมาก! 1) ก้อนนิ่วที่หลุดจากกระเพาะปัสสาวะสุนัขเพศผู้เกือบทุกรายจะไปติดค้างอยู่ที่ขอบฐานด้านท้ายของ Os penis พอดี เพราะท่อปัสสาวะขยายตัวผ่านร่องกระดูกแข็งไม่ได้ ต้องสวนดันนิ่วกลับหรือผ่าตัด Scrotal urethrostomy 2) ในฟิล์มเอกซเรย์ช่องท้องต้องระวังไม่สับสนเงา Os penis ว่าเป็นนิ่วหรือสิ่งแปลกปลอม',
    wordRoots: [
      { root: 'Baculum', origin: 'Latin', meaningTh: 'ไม้เท้าขนาดเล็ก / แท่งกระดูก', meaningEn: 'Little staff / walking stick' },
      { root: 'Splanchnon', origin: 'Greek', meaningTh: 'อวัยวะภายใน (กระดูกที่เกิดในเนื้อเยื่ออวัยวะ)', meaningEn: 'Viscera / internal organ' }
    ],
    mediaIds: [
      'wm-dog-os-penis-specimen-01',
      'wm-dog-urethral-calculi-os-penis-01'
    ],
    relatedIds: ['os-coxae']
  }
];

// Helper to generate human-friendly Thai + English labels for every one of the 115 sub-meshes
export function getSubPieceInfo(meshName, bone) {
  if (meshName.endsWith('_L')) {
    const ribMatch = meshName.match(/_ribs_(\d+)_L$/);
    if (ribMatch) {
      const num = Number(ribMatch[1]);
      const typeTh = num <= 9 ? 'ซี่โครงแท้' : num <= 12 ? 'ซี่โครงชายโครง' : 'ซี่โครงลอย';
      return {
        meshName,
        shortLabel: `R${num}-L`,
        labelTh: `ซี่โครงคู่ที่ ${num} ซ้าย (${typeTh})`,
        labelEn: `Left Rib ${num}`,
        side: 'L'
      };
    }
    return {
      meshName,
      shortLabel: 'ซ้าย (L)',
      labelTh: `${bone.nameTh.replace(' (ซ้าย-ขวา)', '')} ข้างซ้าย`,
      labelEn: `Left ${bone.nameEn.split(' (')[0]}`,
      side: 'L'
    };
  }
  if (meshName.endsWith('_R')) {
    const ribMatch = meshName.match(/_ribs_(\d+)_R$/);
    if (ribMatch) {
      const num = Number(ribMatch[1]);
      const typeTh = num <= 9 ? 'ซี่โครงแท้' : num <= 12 ? 'ซี่โครงชายโครง' : 'ซี่โครงลอย';
      return {
        meshName,
        shortLabel: `R${num}-R`,
        labelTh: `ซี่โครงคู่ที่ ${num} ขวา (${typeTh})`,
        labelEn: `Right Rib ${num}`,
        side: 'R'
      };
    }
    return {
      meshName,
      shortLabel: 'ขวา (R)',
      labelTh: `${bone.nameTh.replace(' (ซ้าย-ขวา)', '')} ข้างขวา`,
      labelEn: `Right ${bone.nameEn.split(' (')[0]}`,
      side: 'R'
    };
  }

  const cervMatch = meshName.match(/_c(\d+)$/);
  if (cervMatch) {
    const n = cervMatch[1];
    return {
      meshName,
      shortLabel: `C${n}`,
      labelTh: `กระดูกสันหลังส่วนคอปล้อง C${n}`,
      labelEn: `Cervical Vertebra C${n}`,
      side: 'M'
    };
  }

  const thorMatch = meshName.match(/_t(\d+)$/);
  if (thorMatch) {
    const n = thorMatch[1];
    const extra = n === '11' ? ' (Anticlinal)' : '';
    return {
      meshName,
      shortLabel: `T${n}`,
      labelTh: `กระดูกสันหลังส่วนอกปล้อง T${n}${extra}`,
      labelEn: `Thoracic Vertebra T${n}${extra}`,
      side: 'M'
    };
  }

  const lumbMatch = meshName.match(/_l(\d+)$/);
  if (lumbMatch) {
    const n = lumbMatch[1];
    return {
      meshName,
      shortLabel: `L${n}`,
      labelTh: `กระดูกสันหลังส่วนเอวปล้อง L${n}`,
      labelEn: `Lumbar Vertebra L${n}`,
      side: 'M'
    };
  }

  const caudMatch = meshName.match(/_cd(\d+)$/);
  if (caudMatch) {
    const n = caudMatch[1];
    return {
      meshName,
      shortLabel: `Cd${n}`,
      labelTh: `กระดูกสันหลังส่วนหางปล้อง Cd${n}`,
      labelEn: `Caudal Vertebra Cd${n}`,
      side: 'M'
    };
  }

  const sternMatch = meshName.match(/_sternum_(s\d+|xiphoid)$/);
  if (sternMatch) {
    const token = sternMatch[1];
    if (token === 'xiphoid') {
      return {
        meshName,
        shortLabel: 'Xiphoid',
        labelTh: 'กระดูกลิ้นปี่ (Xiphoid process)',
        labelEn: 'Xiphoid Process',
        side: 'M'
      };
    }
    const idx = token.toUpperCase();
    return {
      meshName,
      shortLabel: idx,
      labelTh: `ปล้องกระดูกอก Sternebra ${idx}`,
      labelEn: `Sternebra ${idx}`,
      side: 'M'
    };
  }

  return {
    meshName,
    shortLabel: bone.nameEn.split(' ')[0],
    labelTh: bone.nameTh,
    labelEn: bone.nameEn,
    side: 'M'
  };
}

// Precompute fast O(1) lookup maps for all 115 GLB meshes and 31 structures
export const BONE_BY_ID = Object.fromEntries(CANINE_BONES.map(b => [b.id, b]));

export const MESH_TO_BONE_MAP = (() => {
  const map = {};
  for (const bone of CANINE_BONES) {
    bone.subPieces = bone.meshes.map(m => getSubPieceInfo(m, bone));
    for (const sp of bone.subPieces) {
      map[sp.meshName] = {
        boneId: bone.id,
        bone,
        ...sp
      };
    }
  }
  return map;
})();

export const TOTAL_MODELED_MESH_COUNT = Object.keys(MESH_TO_BONE_MAP).length; // 115

// Clinical Orthopedic & Skeletal Pathologies with Real Wikimedia X-Ray References
export const VET_PATHOLOGIES = [
  {
    id: 'hip_dysplasia',
    nameTh: 'โรคข้อสะโพกเจริญผิดปกติและเสื่อม (Canine Hip Dysplasia)',
    nameEn: 'Canine Hip Dysplasia (CHD)',
    affectedBones: ['os-coxae', 'femur'],
    severity: 'พบบ่อยมากในสุนัขพันธุ์ใหญ่',
    descriptionTh: 'ความหลวมผิดปกติของข้อสะโพกทำให้เบ้า Acetabulum ตื้นและหัวกระดูก Femur เคลื่อนหลุดกึ่งหนึ่ง (Subluxation) มุม Norberg ต่ำกว่า 105° ก่อให้เกิดหินปูนข้อเสื่อมและเจ็บสะโพกเรื้อรัง',
    radiographicSigns: 'มุม Norberg < 105°, เบ้าสะโพกตื้นแบน, คอกระดูก Femur หนาตัว (Morgan line) และเห็นกระดูกงอกรอบขอบเบ้าสะโพก',
    mediaId: 'wm-dog-hip-dysplasia-vd-01'
  },
  {
    id: 'ccl_rupture',
    nameTh: 'โรคเอ็นไขว้หน้าข้อเข่าฉีกขาด & การผ่าตัด TPLO',
    nameEn: 'Cranial Cruciate Ligament Disease (CCLD / TPLO)',
    affectedBones: ['tibia', 'femur', 'patella'],
    severity: 'สาเหตุอันดับ 1 ของขากะเพกขาหลัง',
    descriptionTh: 'เอ็นไขว้หน้าเสื่อมและขาดทำให้กระดูกหน้าแข้ง (Tibia) เลื่อนไถลไปด้านหน้าทุกครั้งที่สุนัขลงน้ำหนัก (Cranial tibial thrust) มักแก้ไขด้วยการผ่าตัดเลื่อยปรับมุมลานหน้าแข้ง (TPLO)',
    radiographicSigns: 'เงาไขมันใต้สะบ้าถูกดันไปด้านหน้า (Fat pad sign) จากน้ำในข้อเข่าเพิ่ม, กระดูก Tibia เคลื่อนหน้า และหินปูนเกาะปลายล่างลูกสะบ้า',
    mediaId: 'wm-dog-stifle-tplo-lat-01'
  },
  {
    id: 'patellar_luxation',
    nameTh: 'โรคสะบ้าเคลื่อนหลุด (Medial / Lateral Patellar Luxation)',
    nameEn: 'Patellar Luxation (Grade I–IV)',
    affectedBones: ['patella', 'femur', 'tibia'],
    severity: 'พบบ่อยที่สุดในพันธุ์เล็ก (Toy/Small Breeds)',
    descriptionTh: 'ลูกสะบ้าหลุดออกจากร่อง Trochlear groove ของกระดูกต้นขาหลัง (ส่วนใหญ่มากกว่า 80% หลุดเข้าด้านใน) สัมพันธ์กับร่องกระดูกตื้นและสันหน้าแข้ง Tibial tuberosity บิดเข้าใน',
    radiographicSigns: 'ในท่าเอกซเรย์ Skyline หรือ VD Extended จะเห็นเงาลูกสะบ้าหลุดพ้นขอบร่อง Trochlear ridge ออกมาด้านในหรือด้านนอก',
    mediaId: 'wm-dog-pelvis-vd-02'
  },
  {
    id: 'elbow_dysplasia',
    nameTh: 'โรคข้อศอกเจริญผิดปกติ (Canine Elbow Dysplasia — FCP / UAP)',
    nameEn: 'Canine Elbow Dysplasia',
    affectedBones: ['ulna', 'radius', 'humerus'],
    severity: 'พบบ่อยในสุนัขพันธุ์ใหญ่กำลังโต',
    descriptionTh: 'เกิดจากความไม่สอดคล้องของผิวข้อระหว่าง Humerus, Radius และ Ulna ส่งผลให้ปุ่ม Medial coronoid process แตกหลุด (FCP) หรือจงอย Anconeal process ไม่เชื่อมติด (UAP)',
    radiographicSigns: 'เห็นระดับผิวข้อ Radius-Ulna ไม่เท่ากัน (Step defect), Subtrochlear sclerosis ของ Ulna และกระดูกงอกบน Anconeal process',
    mediaId: 'wm-dog-elbow-dysplasia-01'
  },
  {
    id: 'osteosarcoma',
    nameTh: 'มะเร็งกระดูกรยางค์ (Appendicular Osteosarcoma)',
    nameEn: 'Appendicular Osteosarcoma (OSA)',
    affectedBones: ['radius', 'humerus', 'femur', 'tibia'],
    severity: 'รุนแรงมาก (เนื้องอกปฐมภูมิอันดับ 1 ของกระดูกสุนัข)',
    descriptionTh: 'เนื้องอกร้ายแรงของเซลล์สร้างกระดูก มักจำง่ายด้วยหลัก “ห่างจากข้อศอก ใกล้หัวเข่า” ได้แก่ ปลายล่าง Radius, ส่วนต้น Humerus, ปลายล่าง Femur และส่วนต้น Tibia',
    radiographicSigns: 'กระดูกถูกทำลายแหว่งพรุนคล้ายแมลงแทะ (Moth-eaten lysis) ร่วมกับการสร้างกระดูกใหม่แบบรัศมีดวงอาทิตย์ (Sunburst) และ Codman triangle',
    mediaId: 'wm-dog-radius-osteosarcoma-lat-01'
  },
  {
    id: 'ivdd_thoracolumbar',
    nameTh: 'โรคหมอนรองกระดูกเคลื่อนทับไขสันหลัง (IVDD)',
    nameEn: 'Intervertebral Disc Disease (Thoracolumbar & Cervical)',
    affectedBones: ['vertebrae-thoracic', 'vertebra-l1', 'vertebrae-lumbar', 'vertebrae-cervical'],
    severity: 'ภาวะฉุกเฉินระบบประสาท-กระดูกสันหลัง',
    descriptionTh: 'หมอนรองกระดูกเสื่อมและมีแคลเซียมเกาะจนปลิ้นกดทับไขสันหลัง พบบ่อยที่สุดบริเวณรอยต่ออก-เอว (T11–L2) เพราะไม่มีเอ็น Intercapital ligament ช่วยพยุง',
    radiographicSigns: 'ช่องว่างระหว่างปล้องกระดูกสันหลังแคบลงเป็นรูปลิ่ม เห็นเงาทึบรังสีของหมอนรองกระดูกที่มีหินปูนสะสม (Calcified disc) ดันเข้าช่องไขสันหลัง',
    mediaId: 'wm-dog-spine-thoracolumbar-lat-01'
  },
  {
    id: 'atlantoaxial_instability',
    nameTh: 'ภาวะข้อต่อคอชิ้นที่ 1–2 เคลื่อนหลุด (Atlantoaxial Instability)',
    nameEn: 'Atlantoaxial Subluxation / Instability',
    affectedBones: ['atlas', 'axis', 'skull'],
    severity: 'อันตรายเฉียบพลันในสุนัขพันธุ์ Toy',
    descriptionTh: 'เดือยกระดูก Dens ของปล้อง Axis (C2) ไม่เจริญแต่กำเนิดหรือเอ็นยึดฉีกขาด ทำให้ตัวกระดูก C2 กระดกขึ้นกดก้านสมองและไขสันหลังส่วนคอ',
    radiographicSigns: 'ช่องว่างด้านหลังระหว่างโค้งบนของ Atlas (C1) และสัน Spinous process ของ Axis (C2) ถ่างกว้างผิดปกติ และไม่เห็นเงาเดือย Dens',
    mediaId: 'wm-dog-atlas-axis-cnh-01'
  },
  {
    id: 'lumbosacral_stenosis',
    nameTh: 'โรคโพรงประสาทเอว-กระเบนเหน็บตีบแคบ (Cauda Equina / DLSS)',
    nameEn: 'Degenerative Lumbosacral Stenosis & Transitional Vertebra',
    affectedBones: ['vertebrae-lumbar', 'sacrum', 'os-coxae'],
    severity: 'พบบ่อยในสุนัขทำงานพันธุ์ใหญ่และสุนัขสูงวัย',
    descriptionTh: 'การเสื่อมหรือการมีปล้องกระดูกเปลี่ยนผ่านผิดรูป (Lumbosacral Transitional Vertebra) ที่รอยต่อ L7–S1 กดทับกลุ่มรากประสาท Cauda equina ทำให้เจ็บโคนหางและลุกยืนลำบาก',
    radiographicSigns: 'กระดูกงอกเชื่อมด้านท้อง Spondylosis ที่ L7–S1, การทรุดเหลื่อมของ Sacrum หรือปีก L7 เชื่อมติดเชิงกรานข้างเดียว',
    mediaId: 'wm-dog-lumbosacral-vd-01'
  },
  {
    id: 'os_penis_calculi',
    nameTh: 'นิ่วอุดตันท่อปัสสาวะส่วนฐานกระดูกองคชาต (Urethral Obstruction)',
    nameEn: 'Urethral Calculi Obstruction at Base of Os Penis',
    affectedBones: ['os-penis', 'os-coxae'],
    severity: 'ภาวะฉุกเฉินระบบทางเดินปัสสาวะในสุนัขเพศผู้',
    descriptionTh: 'ท่อปัสสาวะส่วนที่วิ่งเข้าสู่ร่อง Urethral groove ของกระดูก Os penis ไม่สามารถยืดขยายผ่านผนังกระดูกแข็งได้ ทำให้นิ่วจากกระเพาะปัสสาวะมาค้างอุดตันตรงขอบท้ายกระดูกชิ้นนี้เสมอ',
    radiographicSigns: 'เห็นก้อนนิ่วทึบรังสีเรียงตัวอยู่ด้านท้ายติดกับฐานของกระดูก Os penis ในภาพเอกซเรย์ด้านข้างที่ดึงขาหลังไปด้านหน้า',
    mediaId: 'wm-dog-urethral-calculi-os-penis-01'
  },
  {
    id: 'brachycephalic_skull',
    nameTh: 'โครงสร้างกะโหลกสั้นผิดสัดส่วน (Brachycephalic Conformation & BOAS)',
    nameEn: 'Brachycephalic Skull & Mandibular Prognathism',
    affectedBones: ['skull', 'mandible'],
    severity: 'ลักษณะทางสายพันธุ์ที่ส่งผลต่อการหายใจและฟัน',
    descriptionTh: 'การคัดเลือกสายพันธุ์ (เช่น Pug, English/French Bulldog, Pekingese) ทำให้กระดูกขากรรไกรบน (Maxilla) และกระดูกจมูกหดสั้นลงอย่างมาก (Cephalic Index ≥ 80) ส่งผลให้เบ้าตาตื้น ฟันล่างยื่นครอบฟันบน (Undershot jaw) ฟันซ้อนเก และโพรงจมูกตีบแคบ',
    radiographicSigns: 'กะโหลกทรงกลมกว้าง ดัชนีกะโหลกสูง โพรงอากาศ Frontal sinus เล็กหรือหายไป และรากฟันกรามน้อยบิดขวางในขากรรไกรบน',
    mediaId: 'specimen-pug-skull'
  }
];
