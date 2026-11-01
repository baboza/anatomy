// Curated Wikimedia Commons Veterinary Radiographs (X-Rays), Museum Osteological Specimens,
// Classical Anatomical Plates (Sisson 1910, Ellenberger-Leisering 1908), and Local SVG/PNG Diagrams.
// Strictly focused on Canine Osteology (โครงสร้างกระดูกสุนัข).

export const CANINE_MEDIA_CATALOG = {
  // === LOCAL INSTANT WIKIMEDIA PLATES (copied to /wiki/) ===
  'local-dog-skeleton-diagram': {
    id: 'local-dog-skeleton-diagram',
    type: 'diagram',
    url: '/wiki/dog_skeleton_diagram.png',
    svgUrl: '/wiki/dog_skeleton_diagram_th_en.svg',
    titleTh: 'แผนภาพโครงกระดูกสุนัขทั้งตัวพร้อมคำชี้ตำแหน่ง (Wikimedia Vector)',
    titleEn: 'Complete Labeled Canine Skeleton Diagram',
    captionTh: 'แผนภาพเวกเตอร์แสดงตำแหน่งกระดูกหลักของสุนัขในมุมมองด้านข้างซ้าย (Lateral view) เปรียบเทียบสัดส่วนแกนกลาง ขาหน้า และขาหลัง',
    captionEn: 'Lateral anatomical diagram of the complete dog skeleton labeling major axial and appendicular bones.',
    license: 'CC BY-SA 4.0',
    attribution: 'Wikimedia Commons / Veterinary Osteology Diagram',
    relatedBoneIds: ['skull', 'vertebrae-thoracic', 'ribs', 'scapula', 'humerus', 'os-coxae', 'femur', 'tibia']
  },
  'local-dog-skull-diagram': {
    id: 'local-dog-skull-diagram',
    type: 'diagram',
    url: '/wiki/dog_skull_diagram.png',
    svgUrl: '/wiki/dog_skull_diagram.svg',
    titleTh: 'แผนภาพแยกสีชิ้นกระดูกกะโหลกศีรษะและขากรรไกรสุนัข',
    titleEn: 'Color-Coded Canine Skull & Mandible Osteology Diagram',
    captionTh: 'แผนภาพแยกสีกระดูกกะโหลกสุนัข (Maxilla, Frontal, Nasal, Lacrimal, Zygomatic, Parietal, Occipital, Temporal และ Mandible)',
    captionEn: 'Lateral diagram of the canine skull color-coding individual cranial and facial bones plus the mandible.',
    license: 'CC BY-SA 3.0',
    attribution: 'Przemek Maksim, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'mandible']
  },
  'local-cephalic-3types-dorsal': {
    id: 'local-cephalic-3types-dorsal',
    type: 'diagram',
    url: '/wiki/cephalic_3types_dorsal_3d.png',
    titleTh: 'เปรียบเทียบกะโหลกสุนัขครบทั้ง 3 ประเภท: Brachycephalic · Mesocephalic · Dolichocephalic (Dorsal 3D)',
    titleEn: 'Three Canine Cephalic Types — Dorsal 3D Osteological Comparison',
    captionTh: 'ซ้าย: Brachycephalic (กะโหลกสั้น-กว้าง CI ~87 เช่น Pug, Bulldog) · กลาง: Mesocephalic (กะโหลกสมดุล CI ~58 เช่น Labrador, Beagle) · ขวา: Dolichocephalic (กะโหลกยาว-แคบ CI ~41 เช่น Greyhound, Rough Collie)',
    captionEn: 'Dorsal osteological comparison of Brachycephalic (short, broad skull), Mesocephalic (medium, balanced skull), and Dolichocephalic (long, narrow skull).',
    license: 'CHAi Canine 3D Osteology Studio',
    attribution: '3D CT Morphometric Atlas Render',
    relatedBoneIds: ['skull', 'mandible']
  },
  'local-cephalic-3types-lateral': {
    id: 'local-cephalic-3types-lateral',
    type: 'diagram',
    url: '/wiki/cephalic_3types_lateral_3d.png',
    titleTh: 'เปรียบเทียบมุมดั้งจมูก (Stop) และการสบฟันขากรรไกร 3 รูปทรง (Lateral 3D)',
    titleEn: 'Lateral Profile & Dental Occlusion Across 3 Canine Cephalic Types',
    captionTh: 'ซ้าย: พันธุ์หน้าสั้นดั้งหักชันพร้อมขากรรไกรล่างยื่น (Undershot) · กลาง: พันธุ์หน้าปานกลางสบฟันกรรไกร (Scissor bite) · ขวา: พันธุ์หน้ายาวสันจมูกลาดเรียวยาว (Sighthound profile)',
    captionEn: 'Lateral comparison illustrating deep stop & mandibular prognathism in Brachycephalic, scissor bite in Mesocephalic, and elongated shallow-stop profile in Dolichocephalic.',
    license: 'CHAi Canine 3D Osteology Studio',
    attribution: '3D CT Morphometric Atlas Render',
    relatedBoneIds: ['skull', 'mandible']
  },
  'specimen-selected-skulls-6': {
    id: 'specimen-selected-skulls-6',
    type: 'specimen',
    url: '/wiki/selected_dog_skulls_comparison.jpg',
    titleTh: 'ตัวอย่างกะโหลกสุนัขจริง 6 สายพันธุ์ ไล่ระดับจากหน้าสั้นสุดถึงหน้ายาวสุด (Wikimedia Museum)',
    titleEn: 'Six Canine Skulls Spanning Brachycephalic to Dolichocephalic (Palatal View)',
    captionTh: 'ภาพถ่ายตัวอย่างกะโหลกสุนัขจริงพร้อมไม้บรรทัดเปรียบเทียบสัดส่วนเพดานแข็ง โหนกแก้ม และการเรียงฟัน ตั้งแต่พันธุ์หน้าสั้นจัด (ซ้ายสุด) สู่หน้าปานกลาง และหน้ายาว (ขวาสุด)',
    captionEn: 'Six museum dog skulls photographed in ventral palatal view demonstrating extreme craniofacial variation across breeds.',
    license: 'CC BY-SA 4.0',
    attribution: 'Dmccabe, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'mandible']
  },
  'specimen-pug-skull': {
    id: 'specimen-pug-skull',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Pug_skull.jpg/1280px-Pug_skull.jpg',
    titleTh: 'กะโหลกสุนัขพันธุ์ปั๊กของจริง — ต้นแบบพันธุ์หน้าสั้นจัด (Brachycephalic Pug Skull)',
    titleEn: 'Pug Skull Specimen — Extreme Brachycephalic Morphology (Museum of Osteology)',
    captionTh: 'แสดงกระดูกจมูกและขากรรไกรบนหดสั้นมาก โหนกแก้มกางออกกว้าง เบ้าตาตื้น และขากรรไกรล่างโค้งยื่นล้ำขากรรไกรบน',
    captionEn: 'Macerated Pug skull at the Museum of Osteology (Oklahoma City) illustrating extreme brachycephalic foreshortening and wide zygomatic arches.',
    license: 'CC BY-SA 2.0',
    attribution: 'Chris Dodds, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'mandible']
  },
  'specimen-bulldog-skull': {
    id: 'specimen-bulldog-skull',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Bulldog-skull.JPG/1280px-Bulldog-skull.JPG',
    titleTh: 'กะโหลกสุนัขพันธุ์บูลด็อก (Smithsonian) แสดงภาวะคางยื่น Mandibular Prognathism',
    titleEn: 'English Bulldog Skull — Brachycephalic Cranium & Undershot Jaw (Smithsonian)',
    captionTh: 'ตัวอย่างกะโหลกบูลด็อกจากสถาบันสมิธโซเนียน แสดงความกว้างของกะโหลกและขากรรไกรล่างที่ยื่นยาวพ้นขากรรไกรบนอย่างชัดเจน',
    captionEn: 'Bulldog skull specimen from the Smithsonian Naturalist Center demonstrating brachycephaly and pronounced mandibular prognathism.',
    license: 'CC BY 2.5',
    attribution: 'Smithsonian Naturalist Center, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'mandible']
  },
  'diagram-boxer-craniofacial': {
    id: 'diagram-boxer-craniofacial',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Boxer_Dog_Craniofacial_Angle.jpg',
    titleTh: 'การวัดมุมหักดั้งจมูกและแกนฐานกะโหลกพันธุ์หน้าสั้น (Boxer Craniofacial Angle)',
    titleEn: 'Brachycephalic Craniofacial Angle & Airorhynchy in a Boxer Skull',
    captionTh: 'แสดงเส้นวัดมุมระหว่างแกนฐานกะโหลก (Cranial base) กับเพดานแข็งที่เชิดขึ้นด้านบน (Airorhynchy) ในสุนัขกลุ่ม Brachycephalic',
    captionEn: 'Osteological measurement of craniofacial angle in a Boxer dog skull.',
    license: 'CC BY-SA 3.0',
    attribution: 'Uwe Gille / Cú Faoil, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'mandible']
  },
  'specimen-dingo-skull': {
    id: 'specimen-dingo-skull',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Dingoskull.jpg',
    titleTh: 'กะโหลกตระกูลสุนัขทรงยาว-สมดุล (Lupoid / Dolicho-Mesocephalic Reference)',
    titleEn: 'Canid Skull Lateral Profile Showing Elongated Rostrum & Sagittal Crest',
    captionTh: 'แสดงกระดูกจมูกและขากรรไกรที่เรียวยาว สันกลางกะโหลก (Sagittal crest) ชัดเจน และการสบฟันกรามตัดเนื้ออย่างสมบูรณ์',
    captionEn: 'Lateral view of a canid skull illustrating an unshortened rostrum, prominent sagittal crest, and scissor dentition.',
    license: 'Public Domain',
    attribution: 'Wikimedia Commons Osteology Archive',
    relatedBoneIds: ['skull', 'mandible']
  },
  'diagram-dog-cranium-dorsal-ventral': {
    id: 'diagram-dog-cranium-dorsal-ventral',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Fauna_of_British_India_including_Ceylon_and_Burma_%28Mammalia%29_-_Upper_and_under_surface_of_a_Dog%27s_cranium.png/1280px-Fauna_of_British_India_including_Ceylon_and_Burma_%28Mammalia%29_-_Upper_and_under_surface_of_a_Dog%27s_cranium.png',
    titleTh: 'แผนภาพคลาสสิกเปรียบเทียบกะโหลกสุนัข ด้านบน (Dorsal) และด้านเพดาน (Ventral)',
    titleEn: 'Dorsal & Ventral Surfaces of a Canine Cranium (Blanford)',
    captionTh: 'ภาพพิมพ์เส้นคมชัดแสดงรอยประสานกระดูกจมูก หน้าผาก โหนกแก้ม สันกลางกะโหลก และเพดานปากพร้อมซี่ฟันบน',
    captionEn: 'Classical anatomical engraving of the upper (dorsal) and under (palatal/ventral) surfaces of a dog cranium.',
    license: 'Public Domain',
    attribution: 'W. T. Blanford, Fauna of British India, via Wikimedia Commons',
    relatedBoneIds: ['skull']
  },
  'local-rvc-museum-skeleton': {
    id: 'local-rvc-museum-skeleton',
    type: 'specimen',
    url: '/wiki/rvc_canine_skeleton_museum.png',
    titleTh: 'โครงกระดูกสุนัขจัดแสดง ณ พิพิธภัณฑ์กายวิภาคศาสตร์ Royal Veterinary College',
    titleEn: 'Mounted Canid Skeleton — Royal Veterinary College Anatomy Museum',
    captionTh: 'ตัวอย่างโครงกระดูกจริงที่ประกอบในท่ายืนตามธรรมชาติ แสดงมุมข้อไหล่ ข้อศอก ข้อสะโพก และข้อเข่า',
    captionEn: 'Mounted osteological specimen at the Royal Veterinary College Anatomy Museum demonstrating natural standing joint angulation.',
    license: 'CC BY-SA 4.0',
    attribution: 'Royal Veterinary College Anatomy Museum, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'scapula', 'humerus', 'ribs', 'vertebrae-lumbar', 'os-coxae', 'femur']
  },
  'local-canid-museum-skeleton': {
    id: 'local-canid-museum-skeleton',
    type: 'specimen',
    url: '/wiki/wolf_canid_skeleton_specimen.png',
    titleTh: 'โครงกระดูกตระกูลสุนัข (Canis lupus) พื้นหลังคลินิกความละเอียดสูง',
    titleEn: 'Complete Articulated Canis lupus Osteological Mount',
    captionTh: 'โครงกระดูกเปรียบเทียบตระกูลสุนัข (Canidae) แสดงลักษณะสัตว์เดินด้วยปลายนิ้ว (Digitigrade stance) และซี่โครง 13 คู่',
    captionEn: 'Articulated Canis lupus skeleton illustrating classic digitigrade posture, 13 rib pairs, and deep thoracic cage.',
    license: 'CC BY-SA 4.0',
    attribution: 'Natural History Museum Osteology Collection, via Wikimedia Commons',
    relatedBoneIds: ['ribs', 'vertebrae-thoracic', 'radius', 'tibia', 'metacarpus', 'metatarsus']
  },

  // === CLASSICAL OSTEOLOGICAL ATLAS PLATES (WIKIMEDIA COMMONS) ===
  'wm-dog-skeleton-ellenberger-01': {
    id: 'wm-dog-skeleton-ellenberger-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Ellenberger_Leisering_Anatomy_Atlas_Dog.jpg',
    titleTh: 'แผ่นภาพคลาสสิก Ellenberger-Leisering (1908): โครงกระดูกสุนัขในเงาร่างลำตัว',
    titleEn: 'Ellenberger-Leisering Atlas Plate (1908): Skeleton Within Body Contour',
    captionTh: 'ภาพพิมพ์คลาสสิกแสดงความสัมพันธ์ระหว่างโครงกระดูกสุนัขทุกชิ้นกับขอบเขตผิวกายภายนอก',
    captionEn: 'Plate from the Ellenberger-Leisering atlas (1908) showing the complete skeleton of the dog within the body outline.',
    license: 'Public Domain',
    attribution: 'Wilhelm Ellenberger (1908), via Wikimedia Commons',
    relatedBoneIds: ['skull', 'manubrium', 'sternum', 'vertebra-c7', 'vertebrae-caudal']
  },
  'wm-dog-skeleton-specimen-01': {
    id: 'wm-dog-skeleton-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mutt_dog._%E2%80%9CCanis_lupus_familiaris%E2%80%9D_01.jpg/1280px-Mutt_dog._%E2%80%9CCanis_lupus_familiaris%E2%80%9D_01.jpg',
    titleTh: 'ตัวอย่างโครงกระดูกจริงสุนัขพันธุ์ผสม (FMVZ USP Museum)',
    titleEn: 'Macerated Complete Canine Skeleton (FMVZ USP)',
    captionTh: 'โครงกระดูกสุนัขเตรียมด้วยวิธี Maceration จากพิพิธภัณฑ์กายวิภาคศาสตร์สัตวแพทย์ มหาวิทยาลัยเซาเปาโล',
    captionEn: 'Complete skeleton of a mixed-breed dog prepared by maceration, lateral view (FMVZ USP).',
    license: 'CC BY-SA 4.0',
    attribution: 'Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva',
    relatedBoneIds: ['vertebrae-thoracic', 'ribs', 'sternum', 'manubrium']
  },
  'wm-dog-skull-specimen-lateral-01': {
    id: 'wm-dog-skull-specimen-lateral-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Dog_skull._Canis_lupus_familiaris_08.jpg/1280px-Dog_skull._Canis_lupus_familiaris_08.jpg',
    titleTh: 'กะโหลกศีรษะและขากรรไกรล่างสุนัขจริง มุมมองด้านข้าง (FMVZ USP)',
    titleEn: 'Macerated Canine Skull & Articulated Mandible (Lateral View)',
    captionTh: 'แสดงโค้งโหนกแก้ม (Zygomatic arch), สันกะโหลก (Sagittal crest), เบ้าตา และการสบฟันกรามตัดเนื้อ (Carnassial teeth)',
    captionEn: 'Macerated dog skull with the mandible articulated, showing zygomatic arch, sagittal crest, and dentition.',
    license: 'CC BY-SA 4.0',
    attribution: 'Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva',
    relatedBoneIds: ['skull', 'mandible']
  },
  'wm-dog-skull-base-sisson-01': {
    id: 'wm-dog-skull-base-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_text-book_of_veterinary_anatomy_%28Page_154%29_BHL18587278.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_154%29_BHL18587278.jpg',
    titleTh: 'ฐานกะโหลกศีรษะสุนัขด้านล่าง (Ventral Cranial Base — Sisson 1910)',
    titleEn: 'Ventral Base of Canine Skull & Foramina (Sisson 1910, Fig. 122)',
    captionTh: 'แผนภาพตำราสัตวแพทย์ Sisson แสดง Tympanic bulla, Occipital condyles, Choanae และรูเปิดเส้นประสาทสมองทุกคู่',
    captionEn: 'Ventral view of the dog skull without mandible showing cranial bones and foramina (Sisson, 1910).',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['skull', 'hyoid']
  },
  'wm-dog-mandible-lateral-01': {
    id: 'wm-dog-mandible-lateral-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mandibule_de_CN_1.png/1280px-Mandibule_de_CN_1.png',
    titleTh: 'กระดูกขากรรไกรล่างซีกเดียว มุมมองด้านข้าง (Hemimandible Lateral)',
    titleEn: 'Canine Hemimandible — Lateral View (ULB Osteology)',
    captionTh: 'แสดงแอ่ง Masseteric fossa ขนาดใหญ่, Coronoid process, Condylar process และ Angular process อันเป็นเอกลักษณ์ของสุนัข',
    captionEn: 'Dog hemimandible in lateral view showing coronoid, condylar, and angular processes (ULB collection).',
    license: 'CC BY-SA 4.0',
    attribution: 'Anja / Université libre de Bruxelles, via Wikimedia Commons',
    relatedBoneIds: ['mandible']
  },
  'wm-dog-mandible-medial-01': {
    id: 'wm-dog-mandible-medial-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Mandibule_de_CN_2.png/1280px-Mandibule_de_CN_2.png',
    titleTh: 'กระดูกขากรรไกรล่างซีกเดียว มุมมองด้านใน (Hemimandible Medial)',
    titleEn: 'Canine Hemimandible — Medial View showing Symphysis & Mandibular Foramen',
    captionTh: 'แสดงผิวประสานคาง (Mandibular symphysis) และรูเปิด Mandibular foramen สำหรับเส้นประสาท Inferior alveolar',
    captionEn: 'Dog hemimandible in medial view showing the mandibular symphysis and mandibular foramen.',
    license: 'CC BY-SA 4.0',
    attribution: 'Anja / Université libre de Bruxelles, via Wikimedia Commons',
    relatedBoneIds: ['mandible']
  },
  'wm-dog-skull-cervical-specimen-01': {
    id: 'wm-dog-skull-cervical-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dog_crane_-_left_view.jpg/1280px-Dog_crane_-_left_view.jpg',
    titleTh: 'กะโหลกศีรษะและกระดูกสันหลังส่วนคอ C1–C7 ประกอบต่อเนื่อง',
    titleEn: 'Articulated Canine Skull & Cervical Spine (Left View)',
    captionTh: 'แสดงการต่อเชื่อมระหว่าง Occipital condyles กับ Atlas (C1), Axis (C2) และกระดูกคอ C3–C7',
    captionEn: 'Dog skull with the mandible and cervical spine articulated in left lateral view.',
    license: 'CC BY-SA 4.0',
    attribution: 'Anja, via Wikimedia Commons',
    relatedBoneIds: ['skull', 'atlas', 'axis', 'vertebrae-cervical']
  },
  'wm-dog-vertebrae-sisson-01': {
    id: 'wm-dog-vertebrae-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_text-book_of_veterinary_anatomy_%28Page_152%29_BHL18587276.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_152%29_BHL18587276.jpg',
    titleTh: 'รายละเอียดกระดูกคอ Atlas, Axis, C6 และกระดูกอก T4 (Sisson 1910)',
    titleEn: 'Canine Atlas, Axis, C6 & T4 Vertebrae Osteology (Sisson 1910)',
    captionTh: 'ภาพพิมพ์แยกชิ้นกระดูกสันหลังสุนัข แสดงปีกของ Atlas, เดือย Dens ของ Axis และ Spinous process ที่สูงยาวของ T4',
    captionEn: 'Sisson (1910) Figs. 116-119: canine atlas, axis, sixth cervical vertebra, and fourth thoracic vertebra.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['atlas', 'axis', 'vertebrae-cervical', 'vertebrae-thoracic']
  },
  'wm-dog-atlas-axis-cnh-01': {
    id: 'wm-dog-atlas-axis-cnh-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Cambridge_Natural_History_Mammalia_Fig_191.png',
    titleTh: 'กระดูก Atlas (ด้านท้อง) และ Axis (ด้านข้าง) ของสุนัข',
    titleEn: 'Canine Atlas (Ventral) & Axis (Lateral) with Odontoid Process',
    captionTh: 'แสดงเดือย Odontoid process (Dens) และรู Transverse foramen สำหรับหลอดเลือดแดง Vertebral artery',
    captionEn: 'Atlas of the dog in ventral view (A) and axis in lateral view (B), marking the odontoid process and transverse canal.',
    license: 'Public Domain',
    attribution: 'Frank E. Beddard, Cambridge Natural History, via Wikimedia Commons',
    relatedBoneIds: ['atlas', 'axis']
  },
  'wm-dog-lumbar-sacrum-sisson-01': {
    id: 'wm-dog-lumbar-sacrum-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/A_text-book_of_veterinary_anatomy_%28Page_153%29_BHL18587277.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_153%29_BHL18587277.jpg',
    titleTh: 'กระดูกสันหลังเอว L4 และกระดูกกระเบนเหน็บ Sacrum (Sisson 1910)',
    titleEn: 'Canine Fourth Lumbar Vertebra & Sacrum Dorsal View (Sisson 1910)',
    captionTh: 'แสดง Transverse processes ที่ชี้ไปด้านหน้าเฉียงลงล่างของกระดูกเอว และการเชื่อมรวมกันของ S1–S3 เป็น Os sacrum',
    captionEn: 'Sisson (1910) Figs. 120-121: fourth lumbar vertebra (lateral) and sacrum (dorsal) of the dog.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['vertebrae-lumbar', 'sacrum']
  },
  'wm-dog-scapula-lateral-01': {
    id: 'wm-dog-scapula-lateral-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/202503_Right_canine_scapula_lateral_surface.svg/1280px-202503_Right_canine_scapula_lateral_surface.svg.png',
    titleTh: 'กระดูกสะบักขวาสุนัข ด้านนอก (Lateral Surface of Canine Scapula)',
    titleEn: 'Right Canine Scapula — Lateral Surface (DBCLS)',
    captionTh: 'แสดงสันสะบัก (Spine of scapula) ที่แบ่งแอ่ง Supraspinous และ Infraspinous ในอัตราส่วนเกือบเท่ากัน พร้อมปุ่ม Acromion',
    captionEn: 'Illustration of the right canine scapula (lateral surface) showing the prominent scapular spine and acromion.',
    license: 'CC BY 4.0',
    attribution: 'DataBase Center for Life Science (DBCLS), via Wikimedia Commons',
    relatedBoneIds: ['scapula']
  },
  'wm-dog-scapula-medial-01': {
    id: 'wm-dog-scapula-medial-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/202503_Right_canine_scapula_medial_surface.svg/1280px-202503_Right_canine_scapula_medial_surface.svg.png',
    titleTh: 'กระดูกสะบักขวาสุนัข ด้านในแนบซี่โครง (Medial / Costal Surface)',
    titleEn: 'Right Canine Scapula — Medial Surface (DBCLS)',
    captionTh: 'แสดงพื้นที่ขรุขระ Facies serrata และแอ่ง Subscapular fossa สำหรับยึดขาหน้าเข้ากับลำตัวแบบ Synsarcosis',
    captionEn: 'Illustration of the right canine scapula (medial/costal surface) showing subscapular fossa and facies serrata.',
    license: 'CC BY 4.0',
    attribution: 'DataBase Center for Life Science (DBCLS), via Wikimedia Commons',
    relatedBoneIds: ['scapula']
  },
  'wm-dog-scapula-sisson-01': {
    id: 'wm-dog-scapula-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/A_text-book_of_veterinary_anatomy_%28Page_162%29_BHL18587286.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_162%29_BHL18587286.jpg',
    titleTh: 'แผนภาพกระดูกสะบักสุนัขพร้อมคำชี้ปุ่มกระดูก (Sisson 1910)',
    titleEn: 'Labeled Canine Scapula — Lateral & Costal Views (Sisson 1910)',
    captionTh: 'ระบุตำแหน่ง Supraglenoid tubercle, Coracoid process, Glenoid cavity และ Acromion อย่างละเอียด',
    captionEn: 'Page from Sisson (1910) showing the canine scapula in lateral and costal views with osteological labels.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['scapula']
  },
  'wm-dog-humerus-cranial-01': {
    id: 'wm-dog-humerus-cranial-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/202503_Canine_humerus_cranial_view.svg/1280px-202503_Canine_humerus_cranial_view.svg.png',
    titleTh: 'กระดูกต้นขาหน้า (Humerus) มุมมองด้านหน้า (Cranial View)',
    titleEn: 'Canine Humerus — Cranial View (DBCLS)',
    captionTh: 'แสดง Greater tubercle, Deltoid tuberosity, Humeral condyle และรูทะลุ Supratrochlear foramen เหนือข้อศอก',
    captionEn: 'Illustration of the canine humerus in cranial view highlighting tubercles, shaft, and supratrochlear foramen.',
    license: 'CC BY 4.0',
    attribution: 'DataBase Center for Life Science (DBCLS), via Wikimedia Commons',
    relatedBoneIds: ['humerus']
  },
  'wm-dog-humerus-caudal-01': {
    id: 'wm-dog-humerus-caudal-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/202503_Canine_humerus_caudal_view.svg/1280px-202503_Canine_humerus_caudal_view.svg.png',
    titleTh: 'กระดูกต้นขาหน้า (Humerus) มุมมองด้านหลัง (Caudal View)',
    titleEn: 'Canine Humerus — Caudal View with Olecranon Fossa (DBCLS)',
    captionTh: 'แสดงหัวกระดูก Humeral head และแอ่งลึก Olecranon fossa ที่เชื่อมทะลุเป็น Supratrochlear foramen รับ Anconeal process ของ Ulna',
    captionEn: 'Canine humerus in caudal view showing the humeral head and deep olecranon fossa.',
    license: 'CC BY 4.0',
    attribution: 'DataBase Center for Life Science (DBCLS), via Wikimedia Commons',
    relatedBoneIds: ['humerus', 'ulna']
  },
  'wm-dog-humerus-radius-ulna-sisson-01': {
    id: 'wm-dog-humerus-radius-ulna-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/A_text-book_of_veterinary_anatomy_%28Page_163%29_BHL18587287.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_163%29_BHL18587287.jpg',
    titleTh: 'กระดูก Humerus, Radius และ Ulna พร้อมคำชี้ตำแหน่ง (Sisson 1910)',
    titleEn: 'Labeled Canine Left Humerus, Radius & Ulna (Sisson 1910)',
    captionTh: 'เปรียบเทียบการไขว้ตัวของ Radius และ Ulna รวมถึงปุ่ม Olecranon, Anconeal process และ Medial coronoid process',
    captionEn: 'Sisson (1910) Figs. 130-131: canine left humerus and articulated radius and ulna.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['humerus', 'radius', 'ulna']
  },
  'wm-dog-forelimb-bones-specimen-01': {
    id: 'wm-dog-forelimb-bones-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dog_fore_limb_1.JPG/1280px-Dog_fore_limb_1.JPG',
    titleTh: 'โครงกระดูกขาหน้าสุนัขครบชุด (Moscow State University)',
    titleEn: 'Articulated Canine Thoracic Limb Specimen',
    captionTh: 'ตัวอย่างจริงแสดงการประกอบตั้งแต่สะบัก ต้นขาหน้า ปลายขาหน้า ข้อมือ ฝ่าเท้าหน้า ถึงกระดูกนิ้วเท้าหน้า',
    captionEn: 'Articulated bones of a dog thoracic limb: scapula, humerus, radius, ulna, and manus.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['scapula', 'humerus', 'radius', 'ulna', 'carpus']
  },
  'wm-dog-manus-skeleton-sisson-01': {
    id: 'wm-dog-manus-skeleton-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/A_text-book_of_veterinary_anatomy_%28Page_164%29_BHL18587288.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_164%29_BHL18587288.jpg',
    titleTh: 'แผนภาพกระดูกข้อมือ ฝ่ามือ และนิ้วขาหน้าสุนัข (Sisson 1910)',
    titleEn: 'Distal Thoracic Limb (Carpus, Metacarpus & Phalanges — Sisson 1910)',
    captionTh: 'แสดงการรวมตัวของ Intermedioradial carpal bone และโครงสร้างนิ้วที่ I (Dewclaw) ถึงนิ้วที่ V',
    captionEn: 'Skeleton of the distal thoracic limb of the dog with numbered carpals, metacarpals, and phalanges.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['carpus', 'metacarpus', 'phalanges-thoracic']
  },
  'wm-dog-manus-bones-specimen-01': {
    id: 'wm-dog-manus-bones-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Dog_hand.JPG/1280px-Dog_hand.JPG',
    titleTh: 'ตัวอย่างกระดูกส่วนปลายขาหน้า (Manus) ของจริง',
    titleEn: 'Articulated Canine Manus Specimen (Carpus, Metacarpals & Digits)',
    captionTh: 'ตัวอย่างกระดูกจริงของข้อมือ ฝ่าเท้าหน้า 5 ชิ้น และข้อนิ้วเท้าหน้า',
    captionEn: 'Skeleton of a dog manus with carpal bones, metacarpals, and phalanges articulated.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['carpus', 'metacarpus', 'phalanges-thoracic']
  },
  'wm-dog-ribs-specimen-01': {
    id: 'wm-dog-ribs-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Dog_ribs.JPG/1280px-Dog_ribs.JPG',
    titleTh: 'ชุดกระดูกซี่โครงสุนัขเรียงลำดับ (Articulated Canine Ribs)',
    titleEn: 'Series of Canine Ribs Specimen',
    captionTh: 'เปรียบเทียบความโค้งและความยาวของกระดูกซี่โครงสุนัขซึ่งมีทั้งหมด 13 คู่ (Sternal 9 คู่, Asternal 3 คู่, Floatingคู่ที่ 13)',
    captionEn: 'Articulated series of dog ribs from Moscow State University collection.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['ribs']
  },
  'wm-dog-pelvis-specimen-dorsal-01': {
    id: 'wm-dog-pelvis-specimen-dorsal-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dog_pelvis.JPG/1280px-Dog_pelvis.JPG',
    titleTh: 'กระดูกเชิงกรานและกระเบนเหน็บ มุมมองด้านหลังบน (Dorsal View)',
    titleEn: 'Canine Bony Pelvis & Sacrum — Dorsal View',
    captionTh: 'แสดงปีกกระดูก Ilium, ข้อต่อ Sacroiliac joint, Obturator foramen และ Ischiatic tuberosity',
    captionEn: 'Dog bony pelvis in dorsal view showing iliac wings, sacrum, last lumbar, and first caudal vertebrae.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['os-coxae', 'sacrum']
  },
  'wm-dog-pelvis-specimen-caudal-01': {
    id: 'wm-dog-pelvis-specimen-caudal-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Dog_pelvis.jpg/1280px-Dog_pelvis.jpg',
    titleTh: 'ช่องเชิงกรานสุนัข มุมมองด้านท้าย (Pelvic Canal — Caudal View)',
    titleEn: 'Canine Pelvis & Sacrum — Caudal View of Pelvic Canal (FMVZ USP)',
    captionTh: 'แสดงเส้นผ่านศูนย์กลางช่องเชิงกราน (Pelvic inlet/outlet) และเบ้าข้อสะโพก Acetabulum ทั้งสองข้าง',
    captionEn: 'Macerated dog pelvis and sacrum in caudal view showing the pelvic canal and acetabula.',
    license: 'CC BY-SA 4.0',
    attribution: 'Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva',
    relatedBoneIds: ['os-coxae', 'sacrum']
  },
  'wm-dog-hip-joint-specimen-01': {
    id: 'wm-dog-hip-joint-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Dog_hip_%28coxae%29_joint.jpg/1280px-Dog_hip_%28coxae%29_joint.jpg',
    titleTh: 'ข้อสะโพกสุนัขจริง (Coxofemoral Joint: Acetabulum + Femur)',
    titleEn: 'Canine Coxofemoral (Hip) Joint Specimen (FMVZ USP)',
    captionTh: 'แสดงหัวกระดูกต้นขาหลัง (Femoral head) สวมลึกลงในเบ้า Acetabulum ของกระดูกเชิงกรานอย่างแนบสนิท',
    captionEn: 'Articulated canine femur seated within the acetabulum of the os coxae.',
    license: 'CC BY-SA 4.0',
    attribution: 'Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva',
    relatedBoneIds: ['os-coxae', 'femur']
  },
  'wm-dog-stifle-specimen-01': {
    id: 'wm-dog-stifle-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Knee_joint_of_dog.jpg/1280px-Knee_joint_of_dog.jpg',
    titleTh: 'โครงสร้างข้อเข่าสุนัข (Stifle Joint: Femur, Patella, Tibia & Fibula)',
    titleEn: 'Freeze-Dried Canine Stifle Joint Specimen (FMVZ USP)',
    captionTh: 'แสดงความสัมพันธ์ของปลายล่าง Femur, ลูกสะบ้า (Patella), เอ็นไขว้เข่า และลานกระดูกหน้าแข้ง (Tibial plateau)',
    captionEn: 'Dissected, freeze-dried dog stifle joint showing distal femur, patella, ligaments, tibia, and fibula.',
    license: 'CC BY-SA 4.0',
    attribution: 'Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva',
    relatedBoneIds: ['femur', 'patella', 'tibia', 'fibula']
  },
  'wm-dog-hind-limb-specimen-01': {
    id: 'wm-dog-hind-limb-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Dog_hind_limb_2.JPG/1280px-Dog_hind_limb_2.JPG',
    titleTh: 'โครงกระดูกขาหลังสุนัขครบชุด (Pelvic Limb Specimen)',
    titleEn: 'Articulated Canine Pelvic Limb Skeleton',
    captionTh: 'แสดง Femur, Patella, Tibia, Fibula, Tarsus (ข้อเท้า/Hock), Metatarsus และ Phalanges',
    captionEn: 'Articulated skeleton of a dog pelvic limb: femur, patella, tibia, fibula, tarsus, metatarsus, and phalanges.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['femur', 'tibia', 'fibula', 'tarsus']
  },
  'wm-dog-hind-limb-specimen-02': {
    id: 'wm-dog-hind-limb-specimen-02',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Dog_hind_limb_1.JPG/1280px-Dog_hind_limb_1.JPG',
    titleTh: 'กระดูกขาหลังคู่ซ้าย-ขวาเปรียบเทียบมุมด้านข้าง',
    titleEn: 'Paired Canine Pelvic Limbs — Lateral Osteological View',
    captionTh: 'แสดงความเรียวบางของ Fibula ที่แนบขนานไปกับด้านนอกของ Tibia จนถึง Lateral malleolus',
    captionEn: 'Both pelvic limbs of a dog in lateral view from femur down to the pes.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['fibula', 'tibia', 'tarsus']
  },
  'wm-dog-pes-skeleton-sisson-01': {
    id: 'wm-dog-pes-skeleton-sisson-01',
    type: 'diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/A_text-book_of_veterinary_anatomy_%28Page_167%29_BHL18587291.jpg/1280px-A_text-book_of_veterinary_anatomy_%28Page_167%29_BHL18587291.jpg',
    titleTh: 'แผนภาพกระดูกข้อเท้า (Tarsus), ฝ่าเท้าหลัง และนิ้วเท้าหลัง (Sisson 1910)',
    titleEn: 'Distal Pelvic Limb (Tarsus, Metatarsus & Pes — Sisson 1910)',
    captionTh: 'ระบุ Calcaneus (ปุ่มส้นเท้า Tuber calcanei), Talus, Central tarsal bone และ Metatarsals II–V',
    captionEn: 'Sisson (1910) Fig. 137: skeleton of the distal pelvic limb of the dog with labeled tarsals and metatarsals.',
    license: 'Public Domain',
    attribution: 'Septimus Sisson (1910), via Wikimedia Commons',
    relatedBoneIds: ['tarsus', 'metatarsus', 'phalanges-pelvic']
  },
  'wm-dog-pes-bones-specimen-01': {
    id: 'wm-dog-pes-bones-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dog_foot.JPG/1280px-Dog_foot.JPG',
    titleTh: 'ตัวอย่างกระดูกส่วนปลายขาหลัง (Pes) ของจริง',
    titleEn: 'Articulated Canine Pes Specimen (Tarsus, Metatarsals & Digits)',
    captionTh: 'สังเกตว่าขาหลังสุนัขปกติจะมีกระดูกฝ่าเท้าสมบูรณ์ 4 นิ้วหลัก (Digits II–V)',
    captionEn: 'Skeleton of a dog pes with tarsus, metatarsals, and phalanges articulated.',
    license: 'CC0 1.0',
    attribution: 'Kirill Tsukanov, via Wikimedia Commons',
    relatedBoneIds: ['tarsus', 'metatarsus', 'phalanges-pelvic']
  },
  'wm-dog-os-penis-specimen-01': {
    id: 'wm-dog-os-penis-specimen-01',
    type: 'specimen',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Armand_de_Montlezun_Baculum_Pyr%C3%A9n%C3%A9es.jpg/1280px-Armand_de_Montlezun_Baculum_Pyr%C3%A9n%C3%A9es.jpg',
    titleTh: 'กระดูกองคชาตสุนัข (Os penis / Baculum) แสดงร่องท่อปัสสาวะ',
    titleEn: 'Canine Os Penis (Baculum) Marking the Ventral Urethral Groove',
    captionTh: 'ลูกศรสีแดงชี้ร่อง Sulcus urethralis ด้านท้อง ซึ่งเป็นจุดที่นิ่วในท่อปัสสาวะสุนัขเพศผู้มักไปอุดตัน',
    captionEn: 'Penile bone of a Pyrenean Mountain Dog; red arrow marks the urethral groove (Muséum de Toulouse).',
    license: 'CC BY-SA 4.0',
    attribution: 'Didier Descouens / Muséum de Toulouse, via Wikimedia Commons',
    relatedBoneIds: ['os-penis']
  },

  // === CLINICAL VETERINARY RADIOGRAPHS (X-RAYS) ===
  'wm-dog-hips-normal-vd-01': {
    id: 'wm-dog-hips-normal-vd-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Normal_canine_hips.JPG/1280px-Normal_canine_hips.JPG',
    titleTh: 'ภาพเอกซเรย์ข้อสะโพกสุนัขปกติ ท่ามาตรฐาน VD Extended',
    titleEn: 'Normal Canine Pelvis & Coxofemoral Joints (VD Radiograph)',
    captionTh: 'หัวกระดูกต้นขาหลัง (Femoral heads) ทั้งสองข้างกลมมนและจมอยู่ในเบ้า Acetabulum เกิน 50% ไม่มีกระดูกงอก',
    captionEn: 'Ventrodorsal radiograph of a normal canine pelvis: both femoral heads are deeply seated in the acetabula.',
    license: 'CC BY-SA 3.0',
    attribution: 'Joel Mills, via Wikimedia Commons',
    relatedBoneIds: ['os-coxae', 'femur', 'sacrum']
  },
  'wm-dog-hip-dysplasia-vd-01': {
    id: 'wm-dog-hip-dysplasia-vd-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Bilateral_hip_dysplasia.JPG/1280px-Bilateral_hip_dysplasia.JPG',
    titleTh: 'ภาพเอกซเรย์โรคข้อสะโพกเจริญผิดปกติสองข้าง (Bilateral Hip Dysplasia)',
    titleEn: 'Bilateral Canine Hip Dysplasia in a Labrador Retriever Puppy (VD X-Ray)',
    captionTh: 'เบ้า Acetabulum ตื้นและหัวกระดูก Femur ด้านซ้ายหลุดเคลื่อนกึ่งหนึ่ง (Subluxation) ออกจากเบ้าสะโพกชัดเจน',
    captionEn: 'Ventrodorsal hip radiograph of a Labrador Retriever puppy with bilateral hip dysplasia and femoral head subluxation.',
    license: 'CC BY-SA 3.0',
    attribution: 'Joel Mills, via Wikimedia Commons',
    relatedBoneIds: ['os-coxae', 'femur']
  },
  'wm-dog-hip-dysplasia-norberg-01': {
    id: 'wm-dog-hip-dysplasia-norberg-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Hueftgelenksdysplasie_Norberg.jpg',
    titleTh: 'การวัดมุม Norberg Angle วินิจฉัยข้อสะโพกเสื่อมในสุนัขพันธุ์ Rottweiler',
    titleEn: 'Norberg Angle Radiographic Measurement in Canine Hip Dysplasia',
    captionTh: 'ค่าปกติของมุม Norberg ต้อง ≥ 105° ในภาพนี้วัดได้เพียง 97° และ 95° บ่งชี้ภาวะข้อสะโพกหลวม',
    captionEn: 'VD radiograph of a Rottweiler showing Norberg angles below normal 105° (measured at 97° and 95°).',
    license: 'CC BY-SA 3.0',
    attribution: 'Kalumet, via Wikimedia Commons',
    relatedBoneIds: ['os-coxae', 'femur']
  },
  'wm-dog-pelvis-vd-02': {
    id: 'wm-dog-pelvis-vd-02',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golden_Doodle_dog_hip_xray_posterior_view.jpg/1280px-Golden_Doodle_dog_hip_xray_posterior_view.jpg',
    titleTh: 'ภาพเอกซเรย์เชิงกราน ต้นขาหลัง และลูกสะบ้า ท่าเหยียดขาหลัง (VD)',
    titleEn: 'Extended-Leg VD Pelvis & Stifle Radiograph',
    captionTh: 'เห็น Sacrum, Os coxae, Femur, ลูกสะบ้า (Patella) ที่อยู่กึ่งกลางร่อง Trochlear groove และกระดูก Fabellae คู่หลังเข่า',
    captionEn: 'Extended-leg ventrodorsal radiograph showing sacrum, os coxae, femurs, patellae, fabellae, and proximal tibiae.',
    license: 'CC BY-SA 3.0',
    attribution: 'Gvolk, via Wikimedia Commons',
    relatedBoneIds: ['os-coxae', 'femur', 'patella', 'sacrum']
  },
  'wm-dog-pelvis-lateral-01': {
    id: 'wm-dog-pelvis-lateral-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Golden_Doodle_hip_xray_side_view.jpg/1280px-Golden_Doodle_hip_xray_side_view.jpg',
    titleTh: 'ภาพเอกซเรย์เชิงกรานและข้อเข่า มุมมองด้านข้าง (Lateral View)',
    titleEn: 'Lateral Pelvis, Femur & Stifle Joint Radiograph',
    captionTh: 'แสดงตำแหน่ง Patella ด้านหน้าปลายล่าง Femur, กระดูกงา Sesamoids (Fabellae) ด้านหลังเข่า และ Tibial tuberosity',
    captionEn: 'Lateral radiograph of canine pelvis, femurs, patellae, fabellae, and stifle joints.',
    license: 'CC BY-SA 3.0',
    attribution: 'Gvolk, via Wikimedia Commons',
    relatedBoneIds: ['femur', 'patella', 'tibia']
  },
  'wm-dog-osteosarcoma-femur-lat-01': {
    id: 'wm-dog-osteosarcoma-femur-lat-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Canine_osteosarcoma.JPG/1280px-Canine_osteosarcoma.JPG',
    titleTh: 'ภาพเอกซเรย์มะเร็งกระดูก (Osteosarcoma) บริเวณปลายล่างกระดูก Femur',
    titleEn: 'Distal Femoral Osteosarcoma Radiograph (Osteolysis)',
    captionTh: 'เห็นรอยโรคกระดูกถูกทำลายเป็นเงาดำโปร่งรังสี (Moth-eaten osteolysis) บริเวณ Metaphysis ปลายล่างของ Femur',
    captionEn: 'Lateral radiograph of distal canine femur showing radiolucent cortical/trabecular bone destruction from osteosarcoma.',
    license: 'CC BY-SA 3.0',
    attribution: 'Joel Mills, via Wikimedia Commons',
    relatedBoneIds: ['femur']
  },
  'wm-dog-radius-osteosarcoma-lat-01': {
    id: 'wm-dog-radius-osteosarcoma-lat-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Osteosarcoma_Radius_Canine_Leg.jpg/1280px-Osteosarcoma_Radius_Canine_Leg.jpg',
    titleTh: 'ภาพเอกซเรย์มะเร็งกระดูกปลายล่าง Radius (“ห่างศอก ใกล้ข้อมือ”)',
    titleEn: 'Distal Radial Osteosarcoma Radiograph in a 9-Year-Old Dog',
    captionTh: 'ตำแหน่งพบบ่อยที่สุดของ Osteosarcoma ขาหน้าสุนัขพันธุ์ใหญ่ (Distal radius) เห็นปฏิกิริยาเยื่อหุ้มกระดูกแบบ Sunburst',
    captionEn: 'Lateral forearm radiograph showing classic distal radial osteosarcoma ("away from the elbow, toward the carpus").',
    license: 'CC BY-SA 4.0',
    attribution: 'Bobjgalindo, via Wikimedia Commons',
    relatedBoneIds: ['radius']
  },
  'wm-dog-elbow-dysplasia-01': {
    id: 'wm-dog-elbow-dysplasia-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Elbowdysplasia-dog.jpg',
    titleTh: 'ภาพเอกซเรย์โรคข้อศอกเจริญผิดปกติ (Canine Elbow Dysplasia / FCP)',
    titleEn: 'Canine Elbow Dysplasia Radiograph (Radio-Ulnar Step & FCP)',
    captionTh: 'ลูกศรชี้ความไม่เสมอกันของผิวข้อ Radius-Ulna, การแตกของ Medial coronoid process และหินปูนข้อเสื่อมบน Ulna',
    captionEn: 'Radiograph of canine elbow dysplasia demonstrating radio-ulnar incongruity, fragmented coronoid process, and osteophytes.',
    license: 'CC BY-SA 3.0',
    attribution: 'Uwe Gille, via Wikimedia Commons',
    relatedBoneIds: ['ulna', 'radius', 'humerus']
  },
  'wm-dog-stifle-tplo-lat-01': {
    id: 'wm-dog-stifle-tplo-lat-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Tplo_roentgen_01.jpg',
    titleTh: 'ภาพเอกซเรย์หลังผ่าตัดปรับมุมลานหน้าแข้ง TPLO รักษาเอ็นไขว้หน้าขาด',
    titleEn: 'Post-Operative TPLO Stifle Radiograph (Cranial Cruciate Rupture)',
    captionTh: 'แสดงรอยตัดกระดูกโค้งครึ่งวงกลมที่ต้นกระดูก Tibia และยึดด้วย TPLO Locking Plate เพื่อลดแรงเลื่อนหน้าแข้ง (Cranial tibial thrust)',
    captionEn: 'Lateral stifle radiograph post-Tibial Plateau Leveling Osteotomy (TPLO) stabilization.',
    license: 'CC BY-SA 3.0',
    attribution: 'Dr. Helmut Steger, via Wikimedia Commons',
    relatedBoneIds: ['tibia', 'patella', 'femur']
  },
  'wm-dog-tibia-fibula-fracture-01': {
    id: 'wm-dog-tibia-fibula-fracture-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Fracture_tibia%2Bfibula.jpg/1280px-Fracture_tibia%2Bfibula.jpg',
    titleTh: 'ภาพเอกซเรย์กระดูกหน้าแข้งและกระดูกน่องหัก (Tibia & Fibula Fracture)',
    titleEn: 'Craniocaudal & Lateral Diaphyseal Tibia-Fibula Fracture X-Ray',
    captionTh: 'แสดงการหักกลางลำตัวกระดูก (Diaphysis) ของทั้ง Tibia และ Fibula พร้อมชิ้นกระดูกแตกแยกในลูกสุนัข',
    captionEn: 'Craniocaudal and lateral radiographs of a puppy with comminuted diaphyseal tibia and fibula fracture.',
    license: 'CC BY-SA 2.0',
    attribution: 'Fourrure, via Wikimedia Commons',
    relatedBoneIds: ['tibia', 'fibula', 'tarsus']
  },
  'wm-dog-forepaw-ap-01': {
    id: 'wm-dog-forepaw-ap-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Dogs_paw_y-ray_ap.jpg',
    titleTh: 'ภาพเอกซเรย์อุ้งเท้าหน้า ท่าบน-ล่าง (Dorsopalmar Forepaw X-Ray)',
    titleEn: 'Dorsopalmar Canine Forepaw Radiograph',
    captionTh: 'เห็นปลายล่าง Radius/Ulna, กระดูกข้อมือ Carpus ทั้ง 2 แถว, Metacarpals I–V, Proximal/Middle/Distal phalanges และ Sesamoids',
    captionEn: 'Dorsopalmar radiograph of a 2-year-old dog right forepaw showing carpus, metacarpals, and phalanges.',
    license: 'CC BY 4.0',
    attribution: 'Bahnsen, via Wikimedia Commons',
    relatedBoneIds: ['carpus', 'metacarpus', 'phalanges-thoracic']
  },
  'wm-dog-forepaw-ml-01': {
    id: 'wm-dog-forepaw-ml-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/X-ray_dogs_paw_ml.jpg',
    titleTh: 'ภาพเอกซเรย์อุ้งเท้าหน้า ท่าด้านข้าง (Mediolateral Forepaw X-Ray)',
    titleEn: 'Mediolateral Canine Forepaw Radiograph',
    captionTh: 'แสดง Accessory carpal bone ที่ยื่นออกด้านหลังข้อมือ และมุมการวางตัวแบบ Digitigrade ของกระดูกนิ้วเท้า',
    captionEn: 'Mediolateral radiograph of right forepaw highlighting accessory carpal bone and phalangeal alignment.',
    license: 'CC BY 4.0',
    attribution: 'Bahnsen, via Wikimedia Commons',
    relatedBoneIds: ['phalanges-thoracic', 'carpus']
  },
  'wm-dog-forepaw-dachshund-01': {
    id: 'wm-dog-forepaw-dachshund-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/2020-Xray-frontpaw-dachshund.jpg',
    titleTh: 'ภาพเอกซเรย์ขาหน้าส่วนปลายสุนัขพันธุ์ขาสั้น (Chondrodystrophic Dachshund)',
    titleEn: 'Chondrodystrophic Forepaw & Distal Antebrachium X-Ray (Dachshund)',
    captionTh: 'แสดงลักษณะกระดูกขาสั้นและโค้งตามสายพันธุ์ Chondrodystrophic เปรียบเทียบกับสุนัขขายาวทั่วไป',
    captionEn: 'Radiograph of a Dachshund forepaw showing chondrodystrophic carpal and metacarpal conformation.',
    license: 'CC BY-SA 4.0',
    attribution: 'Ivtorov, via Wikimedia Commons',
    relatedBoneIds: ['metacarpus', 'carpus', 'radius']
  },
  'wm-dog-thorax-vd-01': {
    id: 'wm-dog-thorax-vd-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Radiographie_thoracique_ventro-dorsale.jpg/1280px-Radiographie_thoracique_ventro-dorsale.jpg',
    titleTh: 'ภาพเอกซเรย์ทรวงอกและซี่โครง 13 คู่ ท่านอนหงาย (VD Thoracic X-Ray)',
    titleEn: 'Ventrodorsal Canine Thoracic Cage Radiograph',
    captionTh: 'แสดงแนวกระดูกสันหลังส่วนอก T1–T13 ซ้อนกับกระดูกอก และความสมมาตรของกระดูกซี่โครงซ้าย-ขวา',
    captionEn: 'Ventrodorsal thoracic radiograph of a large-breed dog showing symmetric rib cage and thoracic spine.',
    license: 'CC BY-SA 4.0',
    attribution: 'Ophélie Tissier, via Wikimedia Commons',
    relatedBoneIds: ['ribs', 'vertebrae-thoracic', 'sternum']
  },
  'wm-dog-spine-thoracolumbar-lat-01': {
    id: 'wm-dog-spine-thoracolumbar-lat-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Welsh_corgi_cardigan_idd1_k2.jpg',
    titleTh: 'ภาพเอกซเรย์กระดูกสันหลังส่วนอก-เอว และหินปูนเกาะหมอนรองกระดูก (IVDD)',
    titleEn: 'Thoracolumbar Spine X-Ray with Calcified Intervertebral Discs (Welsh Corgi)',
    captionTh: 'เห็น Anticlinal vertebra (T11) และหมอนรองกระดูกที่มีแคลเซียมสะสมขาวทึบรังสีในช่องว่างระหว่างปล้องกระดูกสันหลัง',
    captionEn: 'Lateral thoracolumbar spine radiograph of a Cardigan Welsh Corgi showing two calcified intervertebral discs.',
    license: 'CC0 1.0',
    attribution: 'Potun muistolle, via Wikimedia Commons',
    relatedBoneIds: ['vertebrae-thoracic', 'vertebra-l1', 'vertebrae-lumbar']
  },
  'wm-dog-lumbosacral-vd-01': {
    id: 'wm-dog-lumbosacral-vd-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Dog_Ltv3.jpg/1280px-Dog_Ltv3.jpg',
    titleTh: 'ภาพเอกซเรย์รอยต่อเอว-กระเบนเหน็บผิดรูป (Lumbosacral Transitional Vertebra)',
    titleEn: 'Asymmetrical Lumbosacral Transitional Vertebra (LTV) VD Radiograph',
    captionTh: 'ปล้องกระดูกเอวสุดท้ายมี Transverse process ข้างหนึ่งเชื่อมติดกับปีกเชิงกรานแบบไม่สมมาตร เพิ่มความเสี่ยง Cauda equina syndrome',
    captionEn: 'Ventrodorsal radiograph showing an asymmetrical lumbosacral transitional vertebra in a Welsh Corgi.',
    license: 'CC BY 4.0',
    attribution: 'Potun muistolle, via Wikimedia Commons',
    relatedBoneIds: ['vertebrae-lumbar', 'sacrum', 'os-coxae']
  },
  'wm-dog-urethral-calculi-os-penis-01': {
    id: 'wm-dog-urethral-calculi-os-penis-01',
    type: 'radiograph',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Inraurethral_urolithiasis_dog.jpg/1280px-Inraurethral_urolithiasis_dog.jpg',
    titleTh: 'ภาพเอกซเรย์นิ่วอุดตันท่อปัสสาวะที่ฐานกระดูกองคชาต (Os penis Calculi)',
    titleEn: 'Urethral Calculi Obstructed Immediately Proximal to Canine Os Penis',
    captionTh: 'ความสำคัญทางคลินิกอันดับหนึ่งของ Os penis: ท่อปัสสาวะไม่สามารถขยายตัวผ่านร่องกระดูกได้ ทำให้นิ่ว 3 ก้อนค้างที่ฐานกระดูกพอดี',
    captionEn: 'Radiograph of a male dog showing three radiopaque calculi lodged immediately caudal/proximal to the os penis.',
    license: 'CC BY-SA 4.0',
    attribution: 'Kalumet, via Wikimedia Commons',
    relatedBoneIds: ['os-penis']
  },

  // === BONE MICRO-OSTEOLOGY (HISTOLOGY) ===
  'wm-bone-compact-ground-01': {
    id: 'wm-bone-compact-ground-01',
    type: 'histology',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Compact_bone_histology_2014.jpg/1280px-Compact_bone_histology_2014.jpg',
    titleTh: 'จุลกายวิภาคศาสตร์เนื้อกระดูกทึบ (Compact Cortical Bone Osteons)',
    titleEn: 'Ground Section of Mammalian Compact Cortical Bone (Osteons / Haversian System)',
    captionTh: 'โครงสร้างระดับจุลภาคของผนังกระดูก: วง Lamellae ล้อมรอบ Haversian canal, ช่อง Osteocyte lacunae และ Volkmann canal',
    captionEn: 'Ground section of compact bone showing Haversian canals, osteocyte lacunae, canaliculi, and Volkmann canal.',
    license: 'CC BY-SA 4.0',
    attribution: 'Athikhun.suw, via Wikimedia Commons',
    relatedBoneIds: ['femur', 'humerus', 'tibia']
  },
  'wm-bone-compact-he-01': {
    id: 'wm-bone-compact-he-01',
    type: 'histology',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Osso_por_Descalcifica%C3%A7%C3%A3o2_%E2%80%93_HE_%E2%80%93_100x.JPG',
    titleTh: 'เนื้อเยื่อกระดูกย้อมสี H&E กำลังขยาย 100x (Decalcified Bone Histology)',
    titleEn: 'Decalcified Compact Bone H&E Stain (100x)',
    captionTh: 'แสดง 1) Volkmann canal, 2) Haversian canal, 3) Concentric lamellae และ 4) เซลล์กระดูก Osteocytes ใน Lacunae',
    captionEn: 'Decalcified compact bone stained with H&E (100x) labeling Haversian and Volkmann canals.',
    license: 'CC BY-SA 4.0',
    attribution: 'Guido Fregapani, via Wikimedia Commons',
    relatedBoneIds: ['femur']
  }
};

// Connected Learning Journeys (บทเรียนเชื่อมโยง 3 มิติ แบบ CHAi Atlas)
export const CONNECTED_JOURNEYS = [
  {
    id: 'pelvic-propulsion-hip',
    titleTh: 'กลศาสตร์แรงขับเคลื่อนขาหลัง & ข้อสะโพก',
    titleEn: 'Pelvic Propulsion Chain & Hip Dysplasia',
    duration: '5 ขั้นตอน',
    badgeColor: '#2563eb',
    summaryTh: 'สำรวจเส้นทางส่งถ่ายแรงถีบตัวจากขาหลังผ่านข้อเข่า ข้อสะโพก และกระดูกกระเบนเหน็บเข้าสู่ลำตัว พร้อมจุดเกิดโรคออร์โธปิดิกส์สำคัญ',
    steps: [
      {
        boneId: 'tibia',
        cameraPreset: 'left',
        titleTh: '1. แรงส่งจากลานหน้าแข้ง (Tibial Plateau)',
        noteTh: 'ขาหลังทำหน้าที่เป็นเครื่องยนต์ขับเคลื่อนหลัก ลานกระดูก Tibial plateau มีความลาดเอียงตามธรรมชาติ หากเอ็นไขว้หน้าขาด กระดูก Tibia จะไถลไปด้านหน้าทุกครั้งที่ลงน้ำหนัก'
      },
      {
        boneId: 'patella',
        cameraPreset: 'front',
        titleTh: '2. รอกทดแรงลูกสะบ้า (Patellar Pulley)',
        noteTh: 'Patella เคลื่อนตัวในร่อง Trochlear groove ของ Femur ช่วยเพิ่มประสิทธิภาพแรงเหยียดเข่า ในสุนัขพันธุ์เล็กร่องนี้มักตื้น ทำให้สะบ้าหลุดเข้าด้านใน (MPL)'
      },
      {
        boneId: 'femur',
        cameraPreset: 'left',
        titleTh: '3. เสาหลักรับแรงบิด (Os femoris)',
        noteTh: 'กระดูกต้นขาหลังเป็นกระดูกยาวที่แข็งแรงที่สุด คอกระดูก (Femoral neck) ทำมุมเฉียงเข้าสู่เบ้าสะโพกเพื่อกระจายแรงกระแทกขณะวิ่งและกระโดด'
      },
      {
        boneId: 'os-coxae',
        cameraPreset: 'top',
        titleTh: '4. เบ้าข้อสะโพก (Acetabulum & Os coxae)',
        noteTh: 'Ilium, Ischium และ Pubis เชื่อมรวมกันที่เบ้า Acetabulum หากเบ้าตื้นหรือหลวมจะเกิดภาวะ Hip Dysplasia และข้อสะโพกเสื่อมตามมา'
      },
      {
        boneId: 'sacrum',
        cameraPreset: 'top',
        titleTh: '5. สะพานเชื่อมสู่แกนลำตัว (Sacroiliac Joint)',
        noteTh: 'แรงขับเคลื่อนทั้งหมดจากขาหลังถูกส่งผ่านข้อต่อ Sacroiliac เข้าสู่ Os sacrum (S1–S3) เพื่อดันกระดูกสันหลังและลำตัวสุนัขพุ่งไปข้างหน้า'
      }
    ]
  },
  {
    id: 'forelimb-synsarcosis',
    titleTh: 'ขาหน้ารับน้ำหนัก 60% โดยไร้กระดูกไหปลาร้า',
    titleEn: 'Clavicle-Free Thoracic Suspension & Elbow Joint',
    duration: '5 ขั้นตอน',
    badgeColor: '#059669',
    summaryTh: 'ทำไมสุนัขจึงกระโดดลงพื้นได้นุ่มนวลและก้าวยาวได้มาก? คำตอบอยู่ที่การไม่มีข้อต่อกระดูกไหปลาร้าและโครงสร้างข้อศอกแบบล็อกตัว',
    steps: [
      {
        boneId: 'scapula',
        cameraPreset: 'left',
        titleTh: '1. สะบักลอยตัวแนบซี่โครง (Synsarcosis)',
        noteTh: 'สุนัขไม่มีกระดูกไหปลาร้าเชื่อมต่อสะบักกับกระดูกอก สะบักจึงแกว่งตัวไป-กลับบนผนังซี่โครงได้อย่างอิสระ ช่วยซับแรงกระแทกและเพิ่มระยะก้าวขาหน้า'
      },
      {
        boneId: 'humerus',
        cameraPreset: 'left',
        titleTh: '2. ต้นขาหน้าและรูทะลุเหนือข้อศอก (Supratrochlear Foramen)',
        noteTh: 'ปลายล่างของ Humerus มีรูทะลุ Supratrochlear foramen ซึ่งเป็นเอกลักษณ์ของสุนัข รองรับจงอย Anconeal process ขณะเหยียดข้อศอกสุด'
      },
      {
        boneId: 'radius',
        cameraPreset: 'front',
        titleTh: '3. เสาหลักรับน้ำหนักขาหน้า (Radius)',
        noteTh: 'ขาหน้าสุนัขรับน้ำหนักตัวถึง 60%! โดยหัวกระดูก Radius รับน้ำหนักเกือบทั้งหมดที่ถ่ายลงมาจาก Humerus สู่ข้อมือ'
      },
      {
        boneId: 'ulna',
        cameraPreset: 'left',
        titleTh: '4. คันโยกข้อศอก (Olecranon & Coronoid Process)',
        noteTh: 'Ulna มีปุ่มศอก Olecranon เป็นคานงัดเหยียดขา หาก Radius และ Ulna ยาวไม่สัมพันธ์กันขณะโต จะเกิดโรคข้อศอกเจริญผิดปกติ (Elbow Dysplasia)'
      },
      {
        boneId: 'carpus',
        cameraPreset: 'front',
        titleTh: '5. ข้อมือและท่ายืนปลายนิ้ว (Digitigrade Manus)',
        noteTh: 'กระดูกข้อมือ 7 ชิ้น (รวม Intermedioradial carpal bone) ทำงานร่วมกับฝ่าเท้าที่ตั้งขึ้น ทำให้สุนัขยืนและวิ่งด้วยนิ้วเท้าอย่างปราดเปรียว'
      }
    ]
  },
  {
    id: 'spine-biomechanics-ivdd',
    titleTh: 'ชีวกลศาสตร์กระดูกสันหลัง 50 ปล้อง & IVDD',
    titleEn: 'Axial Spine Regions (C7 · T13 · L7 · S3 · Cd19)',
    duration: '5 ขั้นตอน',
    badgeColor: '#d97706',
    summaryTh: 'เจาะลึกสูตรกระดูกสันหลังสุนัขตั้งแต่จุดหมุนกะโหลก C1–C2 จุดเปลี่ยนทิศทาง T11 ไปจนถึงรอยต่ออก-เอวที่เกิดหมอนรองกระดูกทับเส้นประสาทบ่อยที่สุด',
    steps: [
      {
        boneId: 'atlas',
        cameraPreset: 'left',
        titleTh: '1. ข้อต่อพยักหน้า (Atlas C1 — Yes Joint)',
        noteTh: 'กระดูกคอชิ้นแรกไม่มีตัวกระดูก (Body) และไม่มี Spinous process แต่แผ่เป็นปีกกว้าง (Wings of atlas) ที่คลำได้ชัดเจนใต้ฐานหู'
      },
      {
        boneId: 'axis',
        cameraPreset: 'left',
        titleTh: '2. แกนหมุนส่ายหน้า (Axis C2 — No Joint)',
        noteTh: 'มีเดือยกระดูก Dens ยื่นสอดเข้าไปในวงแหวน Atlas ในสุนัขพันธุ์ทอย เดือยนี้อาจไม่สร้างหรือหักง่าย เกิดภาวะ Atlantoaxial Instability'
      },
      {
        boneId: 'vertebrae-thoracic',
        cameraPreset: 'left',
        titleTh: '3. กระดูกสันหลังอก T1–T13 และปล้อง T11 (Anticlinal)',
        noteTh: 'T1–T10 มี Spinous process สูงเอียงไปด้านท้าย ส่วน T11 ตั้งฉากเป็นจุดเปลี่ยนแนวแรง (Anticlinal vertebra) ก่อนเข้าสู่ช่วงเอว'
      },
      {
        boneId: 'vertebra-l1',
        cameraPreset: 'left',
        titleTh: '4. รอยต่ออก-เอว T13–L1 จุดเสี่ยงสูงสุดของ IVDD',
        noteTh: 'T1–T10 มีเอ็น Intercapital ligament ช่วยกันหมอนรองกระดูกปลิ้น แต่ตั้งแต่ T11–L2 ไม่มีเอ็นนี้ จึงเป็นตำแหน่งที่สุนัขหลังยาวเป็นอัมพาตขาหลังบ่อยที่สุด'
      },
      {
        boneId: 'vertebrae-lumbar',
        cameraPreset: 'top',
        titleTh: '5. กระดูกเอว 7 ปล้อง (L1–L7)',
        noteTh: 'สุนัขมีกระดูกเอว 7 ปล้อง (มากกว่ามนุษย์ที่มี 5 ปล้อง) พร้อมปีก Transverse processes ชี้ไปด้านหน้าเฉียงลงล่าง เพิ่มความยืดหยุ่นขณะควบวิ่ง'
      }
    ]
  },
  {
    id: 'skull-jaw-hyoid',
    titleTh: 'กะโหลกศีรษะ ฟันกรามตัดเนื้อ & โครงกระดูกโคนลิ้น',
    titleEn: 'Cranium, Carnassial Mandible & Hyoid Apparatus',
    duration: '4 ขั้นตอน',
    badgeColor: '#7c3aed',
    summaryTh: 'สำรวจสถาปัตยกรรมกะโหลกสัตว์กินเนื้อ ข้อต่อขากรรไกรแบบบานพับตัดกรรไกร และชุดกระดูกแขวนลอยโคนลิ้น',
    steps: [
      {
        boneId: 'skull',
        cameraPreset: 'front',
        titleTh: '1. กะโหลกศีรษะและโค้งโหนกแก้ม (Cranium & Zygomatic Arch)',
        noteTh: 'รูปทรงกะโหลกสุนัขมีความหลากหลายสูงที่สุดในสัตว์เลี้ยงลูกด้วยนม (Dolicho-, Meso-, Brachycephalic) โดยมีช่องว่างกว้างใต้โหนกแก้มให้กล้ามเนื้อบดเคี้ยวลอดผ่าน'
      },
      {
        boneId: 'mandible',
        cameraPreset: 'left',
        titleTh: '2. ขากรรไกรล่างและฟันกรามตัดเนื้อ (Mandible & Carnassials)',
        noteTh: 'ฟันกรามน้อยบนซี่ที่ 4 (Upper P4) สบเฉือนกับฟันกรามล่างซี่ที่ 1 (Lower M1) เหมือนใบมีดกรรไกร และคางซ้าย-ขวายึดกันด้วย Fibrocartilage symphysis ตลอดชีวิต'
      },
      {
        boneId: 'hyoid',
        cameraPreset: 'left',
        titleTh: '3. ชุดกระดูกโคนลิ้น (Apparatus hyoideus)',
        noteTh: 'โครงกระดูกชิ้นเล็กๆ ที่แขวนกล่องเสียงและโคนลิ้นไว้กับฐานกะโหลกบริเวณ Tympanic bulla ช่วยในการกลืนอาหารและการเห่าหอน'
      },
      {
        boneId: 'ribs',
        cameraPreset: 'left',
        titleTh: '4. เกราะทรวงอก 13 คู่ (Costae & Sternum)',
        noteTh: 'จากลำคอต่อเนื่องสู่ช่องอกที่ลึกแคบแบบสุนัข ประกอบด้วยซี่โครงแท้ 9 คู่ ซี่โครงไม่แท้ 3 คู่ และซี่โครงลอยคู่ที่ 13'
      }
    ]
  }
];
