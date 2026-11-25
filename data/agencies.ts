// Citizen report categories, who actually responds in Nigeria, and safety advice.
// NPFTV is the police's media arm: it receives reports for news and public awareness only.
// Phone numbers: only 112 and FRSC 122 are shown (others "to be confirmed"), per docs/plan-v2.md section 3.

import type { IconName } from "@/components/icon-sprite";

export type ReportCategory = "flood" | "fire" | "road-crash" | "building-collapse" | "power-line" | "unrest" | "crime" | "suspicious" | "community" | "other";

export interface CategoryInfo {
  id: ReportCategory;
  label: string;
  chip: string; // short label for chips
  icon: IconName;
  responders: string[]; // who to contact for actual help
  call: { label: string; tel: string }[];
  safety: string[];
  followUp: string; // one optional follow-up question for the citizen
  keywords: RegExp;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "flood",
    label: "Flooding",
    chip: "Flood",
    icon: "alert",
    responders: ["Emergency services through 112", "The National Emergency Management Agency (NEMA) and your State Emergency Management Agency (SEMA)"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: [
      "Move to higher ground now if water is rising. Don't wait to be told.",
      "Don't walk or drive through moving water. 15 cm of fast water can knock you down.",
      "Switch off electricity at the mains if it's safe to do so.",
      "Keep children and older people away from drains and riverbanks.",
    ],
    followUp: "Roughly how many homes or people are affected?",
    keywords: /\b(flood|flooding|flooded|water (is )?(rising|entering|everywhere)|overflow|submerged|river (burst|overflowed)|rain(fall)? (has )?(washed|cut))/i,
  },
  {
    id: "fire",
    label: "Fire",
    chip: "Fire",
    icon: "alert",
    responders: ["The Fire Service through 112", "The police, for crowd and traffic control"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Get everyone out and stay out.", "Keep well back from the fire and any gas cylinders.", "Don't go back in for belongings.", "Leave roads clear for fire engines."],
    followUp: "What is burning: a house, a market, a vehicle, bush?",
    keywords: /\b(fire|burning|blaze|flames|smoke|on fire|razed|gutted|explosion|exploded)\b/i,
  },
  {
    id: "road-crash",
    label: "Road crash or road blocked",
    chip: "Road crash",
    icon: "truck",
    responders: ["The Federal Road Safety Corps (FRSC) on 122", "Emergency services through 112"],
    call: [
      { label: "Call FRSC 122", tel: "122" },
      { label: "Call 112", tel: "112" },
    ],
    safety: ["Keep well clear of the road and of damaged vehicles.", "Don't move injured people unless they are in danger where they are.", "Warn oncoming traffic only if you can do it safely.", "Don't crowd the scene or block the road for responders."],
    followUp: "Is the road blocked, and in which direction?",
    keywords: /\b(crash|accident|collision|collided|tanker|trailer|overturn(ed)?|somersault(ed)?|road (is )?blocked|hit by a (car|bus|truck))\b/i,
  },
  {
    id: "building-collapse",
    label: "Building collapse",
    chip: "Building collapse",
    icon: "home",
    responders: ["Emergency services through 112", "NEMA and your State Emergency Management Agency"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Keep away from the building: more of it may fall.", "Don't climb on rubble.", "Tell rescuers if you know someone is inside."],
    followUp: "Do people think anyone is trapped inside?",
    keywords: /\b(collapse|collapsed|caved in|building fell|roof fell)\b/i,
  },
  {
    id: "power-line",
    label: "Fallen power line or electrical danger",
    chip: "Power line",
    icon: "alert",
    responders: ["Your electricity distribution company", "Emergency services through 112 if someone is hurt or a fire starts"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Stay at least 10 metres away. Assume the line is live.", "Don't touch anything it is lying on, including water.", "Keep children and animals away."],
    followUp: "Is the line lying on a road, a building or in water?",
    keywords: /\b(power line|electric(al|ity)? (pole|cable|wire)|wire (fell|fallen)|transformer|pole fell|electrocut)/i,
  },
  {
    id: "unrest",
    label: "Unrest, protest or crowd trouble",
    chip: "Unrest",
    icon: "users",
    responders: ["The police through 112 if anyone is in danger", "Your nearest police station"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Move away from the crowd and avoid the area.", "Don't film from close by if it puts you at risk.", "Follow instructions from officers on the scene."],
    followUp: "Is the area safe to pass, or should people avoid it?",
    keywords: /\b(protest|riot|unrest|crowd|clash|clashes|mob|fight(ing)? between|violence)\b/i,
  },
  {
    id: "crime",
    label: "A crime that has already happened",
    chip: "Crime (past)",
    icon: "shield",
    responders: ["Your nearest police station: reporting a crime is free", "112 if anyone is in danger now"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Report it at your nearest police station. NPFTV can't open a case.", "Keep any evidence: photos, receipts, messages.", "Don't confront anyone yourself."],
    followUp: "Has it already been reported at a police station?",
    keywords: /\b(robbed|robbery|stolen|theft|burgl|kidnap|attacked|shot|stabbed|assault(ed)?|break-?in|broke into)\b/i,
  },
  {
    id: "suspicious",
    label: "Something suspicious",
    chip: "Suspicious",
    icon: "eye",
    responders: ["Your nearest police station", "112 if you think someone is in danger"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: ["Don't approach or confront anyone.", "Note what you saw, where and when.", "Tell the police, not social media."],
    followUp: "When did you notice it, and is it still happening?",
    keywords: /\b(suspicious|strange (men|people|vehicle)|loitering|abandoned (bag|vehicle|car)|unknown (men|people))\b/i,
  },
  {
    id: "community",
    label: "Community news or event",
    chip: "Community news",
    icon: "users",
    responders: ["No emergency: NPFTV's newsroom may feature it"],
    call: [],
    safety: [],
    followUp: "When and where is it happening?",
    keywords: /\b(community|festival|event|launch|celebrat|forum|meeting|cleanup|clean-up|graduation|donat)/i,
  },
  {
    id: "other",
    label: "Something else",
    chip: "Something else",
    icon: "info",
    responders: ["112 if anyone is in danger", "Your nearest police station for crime"],
    call: [{ label: "Call 112", tel: "112" }],
    safety: [],
    followUp: "Anything else the newsroom should know?",
    keywords: /$^/,
  },
];

export const categoryInfo = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
