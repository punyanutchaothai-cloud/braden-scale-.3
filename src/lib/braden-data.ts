export interface BradenOption {
  value: number;
  label: string;
  description: string;
}
export interface BradenCategory {
  id: string;
  title: string;
  description: string;
  options: BradenOption[];
}
export const BRADEN_CATEGORIES: BradenCategory[] = [
  {
    id: "sensory",
    title: "การรับรู้ทางประสาทสัมผัส (Sensory Perception)",
    description: "ความสามารถในการตอบสนองต่อความรู้สึกไม่สบายจากการถูกกดทับ",
    options: [
      { value: 1, label: "จำกัดอย่างสมบูรณ์ (Completely Limited)", description: "ไม่ตอบสนองต่อสิ่งกระตุ้นที่ทำให้เจ็บปวด (ไม่คราง ไม่ขยับหนี หรือไม่ไขว่คว้า) เนื่องจากระดับความรู้สึกตัวลดลงหรือได้รับยาระงับความรู้สึก" },
      { value: 2, label: "จำกัดอย่างมาก (Very Limited)", description: "ตอบสนองเฉพาะสิ่งกระตุ้นที่ทำให้เจ็บปวดเท่านั้น ไม่สามารถบอกความรู้สึกไม่สบายได้นอกจากครางหรือกระสับกระส่าย" },
      { value: 3, label: "จำกัดเล็กน้อย (Slightly Limited)", description: "ตอบสนองต่อเสียงเรียก แต่ไม่สามารถบอกความรู้สึกไม่สบายได้เสมอไป หรือมีปัญหาการรับความรู้สึกที่จำกัดความสามารถในการรับรู้ความเจ็บปวดใน 1 หรือ 2 ส่วนของร่างกาย" },
      { value: 4, label: "ไม่มีความบกพร่อง (No Impairment)", description: "ตอบสนองต่อเสียงเรียกได้ดี ไม่มีปัญหาการรับความรู้สึกที่จะจำกัดความสามารถในการรับรู้หรือบอกความเจ็บปวด" },
    ],
  },
  {
    id: "moisture",
    title: "ความชื้น (Moisture)",
    description: "ระดับที่ผิวหนังต้องสัมผัสกับความเปียกชื้น",
    options: [
      { value: 1, label: "เปียกชื้นตลอดเวลา (Constantly Moist)", description: "ผิวหนังเปียกชื้นเกือบตลอดเวลาจากเหงื่อ ปัสสาวะ ฯลฯ พบความชื้นทุกครั้งที่พลิกตัวผู้ป่วย" },
      { value: 2, label: "เปียกชื้นมาก (Very Moist)", description: "ผิวหนังเปียกชื้นบ่อยแต่ไม่ตลอดเวลา ต้องเปลี่ยนผ้าปูที่นอนอย่างน้อยวันละ 1 ครั้งต่อเวร" },
      { value: 3, label: "เปียกชื้นบางครั้ง (Occasionally Moist)", description: "ผิวหนังเปียกชื้นเป็นบางครั้ง ต้องเปลี่ยนผ้าปูที่นอนเพิ่มพิเศษประมาณวันละ 1 ครั้ง" },
      { value: 4, label: "แห้งหายาก (Rarely Moist)", description: "ผิวหนังแห้งเป็นปกติ เปลี่ยนผ้าปูที่นอนตามกิจวัตรปกติเท่านั้น" },
    ],
  },
  {
    id: "activity",
    title: "กิจกรรม (Activity)",
    description: "ระดับของการทำกิจกรรมทางกาย",
    options: [
      { value: 1, label: "นอนติดเตียงตลอด (Bedfast)", description: "จำกัดอยู่แต่บนเตียงตลอดเวลา" },
      { value: 2, label: "นั่งติดเก้าอี้ตลอด (Chairfast)", description: "ความสามารถในการเดินจำกัดมากหรือไม่สามารถเดินได้เลย ไม่สามารถรับน้ำหนักตัวเองได้ ต้องช่วยพยุงลงเก้าอี้หรือรถเข็น" },
      { value: 3, label: "เดินได้บ้าง (Walks Occasionally)", description: "เดินได้บ้างในระหว่างวันแต่ในระยะทางสั้นๆ โดยอาจต้องมีคนช่วยหรือไม่ต้องก็ได้ ใช้เวลาส่วนใหญ่บนเตียงหรือเก้าอี้" },
      { value: 4, label: "เดินได้บ่อย (Walks Frequently)", description: "เดินนอกห้องได้อย่างน้อยวันละ 2 ครั้ง และเดินในห้องได้อย่างน้อยทุกๆ 2 ชั่วโมง" },
    ],
  },
  {
    id: "mobility",
    title: "การเคลื่อนไหว (Mobility)",
    description: "ความสามารถในการเปลี่ยนและควบคุมตำแหน่งของร่างกาย",
    options: [
      { value: 1, label: "เคลื่อนไหวไม่ได้เลย (Completely Immobile)", description: "ไม่สามารถขยับตัวหรือเปลี่ยนตำแหน่งของร่างกายหรือแขนขาได้เลยแม้เพียงเล็กน้อยโดยไม่มีคนช่วย" },
      { value: 2, label: "ข้อจำกัดอย่างมาก (Very Limited)", description: "สามารถขยับตัวหรือแขนขาได้บ้างเล็กน้อยเป็นบางครั้ง แต่ไม่สามารถเปลี่ยนตำแหน่งร่างกายได้เองบ่อยๆ หรืออย่างมีนัยสำคัญ" },
      { value: 3, label: "ข้อจำกัดเล็กน้อย (Slightly Limited)", description: "สามารถเปลี่ยนตำแหน่งของร่างกายหรือแขนขาได้เองบ่อยๆ แม้จะเป็นการขยับเพียงเล็กน้อย" },
      { value: 4, label: "ไม่มีข้อจำกัด (No Limitation)", description: "สามารถเปลี่ยนตำแหน่งร่างกายได้บ่อยๆ และทำได้เองอย่างสมบูรณ์โดยไม่ต้องมีคนช่วย" },
    ],
  },
  {
    id: "nutrition",
    title: "ภาวะโภชนาการ (Nutrition)",
    description: "รูปแบบการรับประทานอาหารตามปกติ",
    options: [
      { value: 1, label: "แย่มาก (Very Poor)", description: "รับประทานอาหารไม่เคยหมดมื้อ รับประทานได้น้อยกว่า 1/3 ของอาหารที่จัดให้ ดื่มน้ำน้อย หรือ NPO" },
      { value: 2, label: "ไม่เพียงพอ (Probably Inadequate)", description: "รับประทานอาหารหมดเป็นบางมื้อ และโดยทั่วไปรับประทานได้เพียงประมาณ 1/2 ของอาหารที่จัดให้" },
      { value: 3, label: "เพียงพอ (Adequate)", description: "รับประทานอาหารได้มากกว่าครึ่งหนึ่งของเกือบทุกมื้อ รับประทานโปรตีนได้เพียงพอ" },
      { value: 4, label: "ดีเยี่ยม (Excellent)", description: "รับประทานอาหารหมดเกือบทุกมื้อ ไม่เคยปฏิเสธอาหาร รับประทานอาหารว่างระหว่างมื้อเป็นประจำ" },
    ],
  },
  {
    id: "friction",
    title: "แรงเสียดทานและแรงเฉือน (Friction & Shear)",
    description: "การปฏิสัมพันธ์กับพื้นผิวระหว่างการเคลื่อนที่",
    options: [
      { value: 1, label: "มีปัญหา (Problem)", description: "ต้องการความช่วยเหลือปานกลางถึงมากในการเคลื่อนย้าย ผิวหนังถลอกหรือครูดกับผ้าปูที่นอนบ่อย" },
      { value: 2, label: "อาจมีปัญหา (Potential Problem)", description: "เคลื่อนไหวได้เองบ้างอย่างอ่อนแรง หรือต้องการความช่วยเหลือเล็กน้อย ผิวหนังอาจครูดกับผ้าปูที่นอนหรือเก้าอี้บ้าง" },
      { value: 3, label: "ไม่มีปัญหา (No Apparent Problem)", description: "เคลื่อนไหวบนเตียงและเก้าอี้ได้เองอย่างอิสระ มีกำลังกล้ามเนื้อเพียงพอที่จะยกตัวพ้นพื้นผิวขณะเคลื่อนย้าย" },
    ],
  },
];
export const getScoreColor = (value: number) => {
  switch (value) {
    case 1:
      return {
        border: "border-red-500/80 dark:border-red-500/60",
        bg: "bg-red-50/60 dark:bg-red-950/40",
        text: "text-red-700 dark:text-red-300",
        hover: "hover:border-red-300 dark:hover:border-red-700",
        accent: "bg-red-600"
      };
    case 2:
      return {
        border: "border-orange-400/80 dark:border-orange-400/60",
        bg: "bg-orange-50/60 dark:bg-orange-950/40",
        text: "text-orange-700 dark:text-orange-300",
        hover: "hover:border-orange-300 dark:hover:border-orange-700",
        accent: "bg-orange-600"
      };
    case 3:
      return {
        border: "border-amber-400/80 dark:border-amber-400/60",
        bg: "bg-amber-50/60 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        hover: "hover:border-amber-300 dark:hover:border-amber-700",
        accent: "bg-amber-600"
      };
    case 4:
    default:
      return {
        border: "border-emerald-500/80 dark:border-emerald-500/60",
        bg: "bg-emerald-50/60 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
        accent: "bg-emerald-600"
      };
  }
};
export const calculateRiskLevel = (score: number, age?: number) => {
  // Age-based exclusion for children ≤5 years
  if (age !== undefined && age <= 5) {
    return {
      label: "ไม่ประเมิน (อายุ ≤5)",
      color: "text-slate-500 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-900",
      border: "border-slate-300 dark:border-slate-800",
      glow: "",
      ariaLabel: "ไม่ประเมิน Braden Scale ในผู้ป่วยอายุน้อยกว่าหรือเท่ากับ 5 ปี",
      action: "โปรดใช้เครื่องมือประเมินสำหรับเด็ก (เช่น Braden Q) หรือดูแลตามมาตรฐานกุมารเวชกรรม",
      dx: "ไม่ระบุ (กลุ่มอายุนอกเกณฑ์การประเมิน Braden Scale)",
      assess_frequency: "ไม่ระบุ",
      nextIntervalHours: 24,
      nextIntervalText: "ตามดุลยพินิจ",
      care: [
        "ตรวจสอบสภาพผิวหนังตามมาตรฐานกุมารเวชกรรม",
        "ส่งเสริมการเคลื่อนไหวตามวัย",
        "ดูแลโภชนาการให้เหมาะสมกับช่วงอายุ",
        "ใช้อุปกรณ์ป้องกันแรงกดทับที่ออกแบบสำหรับเด็กโดยเฉพาะ"
      ]
    };
  }
  // Clinical Logic Update (New Thresholds)
  if (score <= 9) return {
    label: "เสี่ยงสูงที่สุด (Severe Risk)",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100/95 dark:bg-red-950/80",
    border: "border-red-400 dark:border-red-900",
    glow: "drop-shadow-[0_0_30px_rgba(220,38,38,0.7)]",
    ariaLabel: "ระดับความเสี่ยงสูงที่สุด",
    action: "ต้องการการดูแลอย่างเร่งด่วนและแผนการลดแรงกดทับอย่างเข้มข้นทันที",
    dx: "เสี่ยงต่อการเกิดแผลกดทับอย่างรุนแรง",
    assess_frequency: "ทุกวันทุกเวร",
    nextIntervalHours: 1,
    nextIntervalText: "ทุก 1 ชั่วโมง",
    care: [
      "พลิกตัวทุก 1 ชม. (ตามความเหมาะสมทางคลินิก)",
      "ใช้ที่นอนคุณภาพสูง (High-end Low Air Loss)",
      "เฝ้าระวังผิวหนังใกล้ชิด ตรวจสอบจุดกดทับทุก 1 ชม.",
      "ใช้ foam dressing ในตำแหน่งที่มีความเสี่ยงสูง",
      "ดูแลโภชนาการเข้มข้น (High protein, High calorie)"
    ]
  };
  if (score <= 12) return {
    label: "เสี่ยงสูง (High Risk)",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-100/95 dark:bg-orange-950/80",
    border: "border-orange-400 dark:border-orange-900",
    glow: "drop-shadow-[0_0_30px_rgba(234,88,12,0.6)]",
    ariaLabel: "ระดับความเสี่ยงสูง",
    action: "กำหนดตารางพลิกตัวที่เข้มงวดและใช้อุปกรณ์รองรับเพื่อลดแรงกดทับ",
    dx: "เสี่ยงสูงต่อการเกิดแผลกดทับจากการเคลื่อนไหวไม่ได้",
    assess_frequency: "ทุกวันทุกเวร",
    nextIntervalHours: 2,
    nextIntervalText: "ทุก 2 ชั่วโมง",
    care: [
      "พลิกตัวทุก 1–2 ชม. ตามตารางที่กำหนด",
      "ใช้ที่นอนลมแบบ Alternating pressure mattress",
      "หลีกเลี่ยงแรงเสียดทานขณะเคลื่อนย้าย",
      "ดูแลความชื้นของผิวหนัง (Incontinence care)",
      "Consult นักโภชนาการเพื่อปรับแผนอาหาร"
    ]
  };
  if (score <= 15) return {
    label: "เสี่ยงปานกลาง (Moderate Risk)",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100/95 dark:bg-amber-950/80",
    border: "border-amber-400 dark:border-amber-900",
    glow: "drop-shadow-[0_0_30px_rgba(217,119,6,0.5)]",
    ariaLabel: "ระดับความเสี่ยงปานกลาง",
    action: "เพิ่มการเฝ้าระวังและพิจารณาใช้อุปกรณ์เสริมเพื่อช่วยลดแรงกดทับ",
    dx: "เสี่ยงต่อการเกิดแผลกดทับจากภาวะโภชนาการและ immobility",
    assess_frequency: "ทุกวันทุกเวร",
    nextIntervalHours: 2,
    nextIntervalText: "ทุก 2 ชั่วโมง",
    care: [
      "พลิกตัวทุก 2 ชม. อย่างเคร่งครัด",
      "ใช้ที่นอนลมมาตรฐานเพื่อลดแรงกดทับ",
      "ประเมินสภาพผิวหนังทุกเวร (อย่างน้อยทุก 8 ชม.)",
      "ใช้อุปกรณ์รองปุ่มกระดูก เช่น หมอน หรือเจล",
      "เพิ่มปริมาณโปรตีนในมื้ออาหาร"
    ]
  };
  if (score <= 18) return {
    label: "เสี่ยงต่ำ (Mild Risk)",
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-100/95 dark:bg-yellow-950/80",
    border: "border-yellow-400 dark:border-yellow-900",
    glow: "drop-shadow-[0_0_30px_rgba(202,138,4,0.4)]",
    ariaLabel: "ระดับความเสี่ยงต่ำ",
    action: "รักษาสุขอนามัยของผิวหนังและประเมินซ้ำตามระยะ",
    dx: "เสี่ยงต่อการเกิดแผลกดทับจากการเคลื่อนไหวร่างกายลดลง",
    assess_frequency: "ทุกวันทุกเวร",
    nextIntervalHours: 4,
    nextIntervalText: "ทุก 4 ชั่วโมง",
    care: [
      "พลิกตัวทุก 2–3 ชม. และส่งเสริมการเคลื่อนไหว",
      "ใช้ที่นอนลดแรงกดทับมาตรฐาน",
      "ดูแลผิวหนังให้แห้งและสะอาด (Skin hygiene)",
      "ประเมินภาวะโภชนาการและเสริมสารอาหาร"
    ]
  };
  return {
    label: "ไม่เสี่ยง (No Risk)",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100/95 dark:bg-emerald-950/80",
    border: "border-emerald-400 dark:border-emerald-900",
    glow: "drop-shadow-[0_0_30px_rgba(5,150,105,0.4)]",
    ariaLabel: "ไม่มีความเสี่ยงที่ชัดเจน",
    action: "ดูแลตามมาตรฐานการพยาบาลทั่วไป",
    dx: "ระดับความเสี่ยงปกติ (ติดตามประเมินตามรอบ)",
    assess_frequency: "สัปดาห์ละครั้ง",
    nextIntervalHours: 24,
    nextIntervalText: "รายวัน",
    care: [
      "ประเมินสภาพผิวหนังทุกวัน (Daily assessment)",
      "ส่งเสริมการเคลื่อนไหวร่างกายตามปกติ",
      "ดูแลความสะอาดผิวหนังตามมาตรฐาน",
      "ให้ความรู้เรื่องการป้องกันแผลกดทับเบื้องต้น"
    ]
  };
};