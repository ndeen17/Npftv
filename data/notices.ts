// Missing and wanted persons notices. ALL FICTIONAL. No photos: silhouettes only (docs/plan-v2.md, Phase 3).
// NPFTV is the police's media arm: notices are ISSUED by police commands and PUBLISHED by NPFTV.
// NPFTV does not collect tips; people with information contact the issuing command, their nearest station or 112.

export type NoticeKind = "missing" | "wanted";
export type NoticeStatus = "pending" | "published" | "found" | "withdrawn";

export interface Notice {
  id: string;
  kind: NoticeKind;
  name: string;
  alias?: string;
  age: number;
  sex: "Male" | "Female";
  state: string; // state command id, e.g. "LA"
  lastSeenPlace: string;
  lastSeenDate: string; // YYYY-MM-DD
  height?: string;
  build?: string;
  clothing?: string;
  description: string;
  offence?: string; // wanted only
  caseRef?: string; // wanted only
  issuedBy: string; // e.g. "Lagos State Police Command"
  issuedOn: string; // YYYY-MM-DD
  status: NoticeStatus;
  closedOn?: string; // found or withdrawn date
  approvalId?: string; // links to an ApprovalItem
  alertId?: string; // publishing this notice also publishes this alert (and vice versa)
}

export const seedNotices: Notice[] = [
  // Waiting for approval: the "Missing person notice, Lagos" from the demo's approvals and presenter panel.
  {
    id: "missing-lagos-coker",
    kind: "missing",
    name: "Babatunde Coker",
    age: 67,
    sex: "Male",
    state: "LA",
    lastSeenPlace: "Bode Thomas Street, Surulere, Lagos",
    lastSeenDate: "2026-11-22",
    height: "About 5 ft 8 in (1.73 m)",
    build: "Slim, grey beard",
    clothing: "White agbada and a brown cap",
    description: "Mr Coker left home on Sunday afternoon to visit a friend and did not arrive. He sometimes becomes confused and may not know where he is.",
    issuedBy: "Lagos State Police Command",
    issuedOn: "2026-11-23",
    status: "pending",
    approvalId: "ap-missing-lagos",
    alertId: "alert-missing-lagos",
  },
  {
    id: "missing-enugu-okonkwo",
    kind: "missing",
    name: "Chidi Okonkwo",
    age: 34,
    sex: "Male",
    state: "EN",
    lastSeenPlace: "Ogbete Main Market, Enugu",
    lastSeenDate: "2026-11-18",
    height: "About 6 ft (1.83 m)",
    build: "Medium build",
    clothing: "Blue kaftan and black sandals",
    description: "Mr Okonkwo, a trader, closed his shop on Wednesday evening and has not been seen since. His phone is switched off.",
    issuedBy: "Enugu State Police Command",
    issuedOn: "2026-11-20",
    status: "published",
  },
  {
    id: "missing-kaduna-bello",
    kind: "missing",
    name: "Fatima Bello",
    age: 22,
    sex: "Female",
    state: "KD",
    lastSeenPlace: "Kawo motor park, Kaduna",
    lastSeenDate: "2026-11-20",
    height: "About 5 ft 4 in (1.63 m)",
    build: "Slim",
    clothing: "Green hijab and a black abaya",
    description: "Ms Bello was travelling to Zaria to see her family and did not arrive. She was carrying a red travel bag.",
    issuedBy: "Kaduna State Police Command",
    issuedOn: "2026-11-21",
    status: "published",
  },
  {
    id: "missing-oyo-adeyemi",
    kind: "missing",
    name: "Grace Adeyemi",
    age: 71,
    sex: "Female",
    state: "OY",
    lastSeenPlace: "Bodija Market, Ibadan",
    lastSeenDate: "2026-11-21",
    height: "About 5 ft 2 in (1.57 m)",
    build: "Small build, uses a walking stick",
    clothing: "Yellow and blue ankara wrapper",
    description: "Mrs Adeyemi lives with dementia and may be confused. She speaks Yoruba and some English.",
    issuedBy: "Oyo State Police Command",
    issuedOn: "2026-11-22",
    status: "published",
  },
  {
    id: "missing-crossriver-effiong",
    kind: "missing",
    name: "Emmanuel Effiong",
    age: 45,
    sex: "Male",
    state: "CR",
    lastSeenPlace: "Marina Resort area, Calabar",
    lastSeenDate: "2026-11-15",
    height: "About 5 ft 10 in (1.78 m)",
    build: "Heavy build",
    clothing: "Grey shirt and black trousers",
    description: "Mr Effiong, a teacher, went for an evening walk and has not returned.",
    issuedBy: "Cross River State Police Command",
    issuedOn: "2026-11-17",
    status: "published",
  },
  {
    id: "missing-kano-sule",
    kind: "missing",
    name: "Ibrahim Sule",
    age: 29,
    sex: "Male",
    state: "KN",
    lastSeenPlace: "Sabon Gari, Kano",
    lastSeenDate: "2026-11-14",
    description: "Mr Sule has been found safe and is back with his family. Thank you to everyone who shared this notice.",
    issuedBy: "Kano State Police Command",
    issuedOn: "2026-11-16",
    status: "found",
    closedOn: "2026-11-21",
  },

  // Wanted: only people formally declared wanted by a police command. Fictional.
  {
    id: "wanted-rivers-amadi",
    kind: "wanted",
    name: "Kelechi Amadi",
    alias: "Small",
    age: 31,
    sex: "Male",
    state: "RI",
    lastSeenPlace: "Rumuokoro, Port Harcourt",
    lastSeenDate: "2026-11-10",
    height: "About 5 ft 6 in (1.68 m)",
    build: "Slim, scar on the left cheek",
    description: "Declared wanted in connection with a series of armed robberies on the East-West Road.",
    offence: "Armed robbery",
    caseRef: "RVSCID/0412/2026",
    issuedBy: "Rivers State Police Command",
    issuedOn: "2026-11-12",
    status: "published",
  },
  {
    id: "wanted-fct-garba",
    kind: "wanted",
    name: "Shehu Garba",
    alias: "Baba Ali",
    age: 40,
    sex: "Male",
    state: "FC",
    lastSeenPlace: "Kubwa, Abuja",
    lastSeenDate: "2026-11-05",
    height: "About 6 ft 1 in (1.85 m)",
    build: "Heavy build",
    description: "Declared wanted in connection with kidnapping for ransom.",
    offence: "Kidnapping",
    caseRef: "FCTCID/0977/2026",
    issuedBy: "FCT Police Command",
    issuedOn: "2026-11-08",
    status: "published",
  },
  {
    id: "wanted-lagos-akinwale",
    kind: "wanted",
    name: "Femi Akinwale",
    alias: "Daddy",
    age: 27,
    sex: "Male",
    state: "LA",
    lastSeenPlace: "Ikeja, Lagos",
    lastSeenDate: "2026-11-01",
    height: "About 5 ft 9 in (1.75 m)",
    build: "Medium build, wears glasses",
    description: "Declared wanted in connection with a fake investment scheme that took money from more than 200 people.",
    offence: "Fraud (fake investment scheme)",
    caseRef: "LSCID/1180/2026",
    issuedBy: "Lagos State Police Command",
    issuedOn: "2026-11-03",
    status: "published",
  },
];

export const commandName = (stateId: string, stateName: string) => (stateId === "FC" ? "FCT Police Command" : `${stateName} State Police Command`);
