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
      { value: 1, label: "Completely Limited", description: "Unresponsive to painful stimuli, due to diminished level of consciousness or sedation." },
      { value: 2, label: "Very Limited", description: "Responds only to painful stimuli. Cannot communicate discomfort except by moaning." },
      { value: 3, label: "Slightly Limited", description: "Responds to verbal commands but cannot always communicate discomfort or need to be turned." },
      { value: 4, label: "No Impairment", description: "Responds to verbal commands. Has no sensory deficit which would limit ability to feel pain." },
    ],
  },
  {
    id: "moisture",
    title: "Moisture",
    description: "Degree to which skin is exposed to moisture",
    options: [
      { value: 1, label: "Constantly Moist", description: "Skin is kept moist almost constantly by perspiration, urine, etc." },
      { value: 2, label: "Very Moist", description: "Skin is often, but not always, moist. Linen must be changed at least once a shift." },
      { value: 3, label: "Occasionally Moist", description: "Skin is occasionally moist, requiring an extra linen change approximately once a day." },
      { value: 4, label: "Rarely Moist", description: "Skin is usually dry; linen only requires changing at routine intervals." },
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
      { value: 2, label: "Very Limited", description: "Makes occasional slight changes in body or extremity position but unable to make frequent changes." },
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
    description: "Interaction with surfaces",
    options: [
      { value: 1, label: "Problem", description: "Requires moderate to maximum assistance in moving. Complete lifting without sliding is impossible." },
      { value: 2, label: "Potential Problem", description: "Moves feebly or requires minimum assistance. During a move skin probably slides to some extent." },
      { value: 3, label: "No Apparent Problem", description: "Moves in bed and in chair independently and has sufficient muscle strength to lift up completely during move." },
    ],
  },
];
export const calculateRiskLevel = (score: number) => {
  if (score <= 9) return { label: "Severe Risk", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  if (score <= 12) return { label: "High Risk", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
  if (score <= 14) return { label: "Moderate Risk", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  if (score <= 18) return { label: "Mild Risk", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
  return { label: "No Risk", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
};