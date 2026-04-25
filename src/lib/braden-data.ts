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
    title: "Sensory Perception",
    description: "Ability to respond meaningfully to pressure-related discomfort",
    options: [
      { value: 1, label: "Completely Limited", description: "Unresponsive (does not moan, flinch, or grasp) to painful stimuli." },
      { value: 2, label: "Very Limited", description: "Responds only to painful stimuli. Cannot communicate discomfort except by moaning." },
      { value: 3, label: "Slightly Limited", description: "Responds to verbal commands but cannot always communicate discomfort." },
      { value: 4, label: "No Impairment", description: "Responds to verbal commands. Has no sensory deficit which would limit ability to feel pain." },
    ],
  },
  {
    id: "moisture",
    title: "Moisture",
    description: "Degree to which skin is exposed to moisture",
    options: [
      { value: 1, label: "Constantly Moist", description: "Skin is kept moist almost constantly by perspiration, urine, etc." },
      { value: 2, label: "Very Moist", description: "Skin is often, but not always moist. Linen must be changed at least once a shift." },
      { value: 3, label: "Occasionally Moist", description: "Skin is occasionally moist, requiring an extra linen change approximately once a day." },
      { value: 4, label: "Rarely Moist", description: "Skin is usually dry, linen only requires changing at routine intervals." },
    ],
  },
  {
    id: "activity",
    title: "Activity",
    description: "Degree of physical activity",
    options: [
      { value: 1, label: "Bedfast", description: "Confined to bed." },
      { value: 2, label: "Chairfast", description: "Ability to walk severely limited or nonexistent. Cannot bear own weight." },
      { value: 3, label: "Walks Occasionally", description: "Walks occasionally during day, but for very short distances, with or without assistance." },
      { value: 4, label: "Walks Frequently", description: "Walks outside room at least twice a day and inside room at least once every two hours." },
    ],
  },
  {
    id: "mobility",
    title: "Mobility",
    description: "Ability to change and control body position",
    options: [
      { value: 1, label: "Completely Immobile", description: "Does not make even slight changes in body or extremity position without assistance." },
      { value: 2, label: "Very Limited", description: "Makes occasional slight changes in body or extremity position but unable to make frequent or significant changes independently." },
      { value: 3, label: "Slightly Limited", description: "Makes frequent though slight changes in body or extremity position independently." },
      { value: 4, label: "No Limitation", description: "Makes major and frequent changes in position without assistance." },
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition",
    description: "Usual food intake pattern",
    options: [
      { value: 1, label: "Very Poor", description: "Never eats a complete meal. Rarely eats more than 1/3 of any food offered." },
      { value: 2, label: "Probably Inadequate", description: "Rarely eats a complete meal and generally eats only about 1/2 of any food offered." },
      { value: 3, label: "Adequate", description: "Eats over half of most meals. Eats a total of 4 servings of protein per day." },
      { value: 4, label: "Excellent", description: "Eats most of every meal. Never refuses a meal. Occasionally eats between meals." },
    ],
  },
  {
    id: "friction",
    title: "Friction & Shear",
    description: "Interactions with surfaces during movement",
    options: [
      { value: 1, label: "Problem", description: "Requires moderate to maximum assistance in moving. Sliding against sheets is likely." },
      { value: 2, label: "Potential Problem", description: "Moves feebly or requires minimum assistance. Skin probably slides against sheets." },
      { value: 3, label: "No Apparent Problem", description: "Moves in bed and in chair independently and has sufficient muscle strength to lift up completely." },
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
export const calculateRiskLevel = (score: number) => {
  if (score <= 9) return {
    label: "Severe Risk",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100/98 dark:bg-red-950/60",
    border: "border-red-300 dark:border-red-900",
    glow: "drop-shadow-[0_0_30px_rgba(220,38,38,0.7)]",
    ariaLabel: "Severe pressure ulcer risk. Score 9 or less. Requires immediate intensive intervention.",
    action: "Immediate intensive intervention and pressure-relief strategy required."
  };
  if (score <= 12) return {
    label: "High Risk",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100/98 dark:bg-orange-950/60",
    border: "border-orange-300 dark:border-orange-900",
    glow: "drop-shadow-[0_0_30px_rgba(234,88,12,0.6)]",
    ariaLabel: "High pressure ulcer risk. Score 10 to 12. Strict turning schedule and pressure-reducing surface mandatory.",
    action: "Strict turning schedule and pressure-reducing surface mandatory."
  };
  if (score <= 14) return {
    label: "Moderate Risk",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50/98 dark:bg-amber-950/60",
    border: "border-amber-300 dark:border-amber-900",
    glow: "drop-shadow-[0_0_30px_rgba(217,119,6,0.5)]",
    ariaLabel: "Moderate pressure ulcer risk. Score 13 to 14. Increase monitoring and adjunct devices.",
    action: "Increase monitoring and consider adjunct pressure-relief devices."
  };
  if (score <= 18) return {
    label: "Mild Risk",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50/98 dark:bg-yellow-950/60",
    border: "border-yellow-300 dark:border-yellow-900",
    glow: "drop-shadow-[0_0_30px_rgba(202,138,4,0.4)]",
    ariaLabel: "Mild pressure ulcer risk. Score 15 to 18. Maintain skin hygiene and regular reassessment.",
    action: "Maintain skin hygiene and reassess on defined regular intervals."
  };
  return {
    label: "No Risk",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/98 dark:bg-emerald-950/60",
    border: "border-emerald-300 dark:border-emerald-900",
    glow: "drop-shadow-[0_0_30px_rgba(5,150,105,0.4)]",
    ariaLabel: "No apparent pressure ulcer risk. Score 19 to 23. Standard care and periodic reassessment.",
    action: "Reassess if patient's clinical status changes significantly."
  };
};