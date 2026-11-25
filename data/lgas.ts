// Local government areas for the states used in the demo. Other states use a free-text LGA field.

export const LGAS: Record<string, string[]> = {
  KO: [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu",
    "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West",
  ],
  LA: [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe",
    "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
  ],
  FC: ["Abaji", "Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  BY: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
};

/** Well-known places that point to an LGA (helps the scripted report helper). */
export const PLACE_HINTS: { re: RegExp; state: string; lga: string }[] = [
  { re: /\b(lokoja|ganaja|adankolo|kpata|felele|lokongoma|zone 8)\b/i, state: "KO", lga: "Lokoja" },
  { re: /\b(ajaokuta)\b/i, state: "KO", lga: "Ajaokuta" },
  { re: /\b(idah)\b/i, state: "KO", lga: "Idah" },
  { re: /\b(yenagoa|swali|amarata)\b/i, state: "BY", lga: "Yenagoa" },
  { re: /\b(surulere|bode thomas)\b/i, state: "LA", lga: "Surulere" },
  { re: /\b(ikeja|allen avenue|computer village)\b/i, state: "LA", lga: "Ikeja" },
  { re: /\b(lekki|ajah|victoria island|ikoyi)\b/i, state: "LA", lga: "Eti-Osa" },
  { re: /\b(kubwa|bwari)\b/i, state: "FC", lga: "Bwari" },
  { re: /\b(wuse|garki|maitama|asokoro|berger|nyanya)\b/i, state: "FC", lga: "Abuja Municipal (AMAC)" },
  { re: /\b(gwagwalada)\b/i, state: "FC", lga: "Gwagwalada" },
];
