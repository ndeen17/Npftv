// "Your rights": plain-language summaries of citizens' rights and police powers in Nigeria.
// DEMO CONTENT. Every page carries a "to be reviewed by NPF Legal" label (docs/plan-v2.md, section 3).
// Section numbers are only given where we are confident of them; otherwise the Act is cited without one.

export interface LawRef {
  source: string;
  detail: string;
}

export interface RightsTopic {
  id: string;
  title: string;
  situation: string; // card text on the hub: "You're stopped at a checkpoint"
  icon: "truck" | "search" | "shield" | "home" | "clock" | "users" | "wallet" | "phone";
  inShort: string[];
  can: string[];
  cannot: string[];
  whatToDo: string[];
  law: LawRef[];
  keywords: string[];
}

export const LEGAL_REVIEW_NOTE = "Demo content. To be reviewed by NPF Legal before publication. This is general information, not legal advice for your case.";

export const rightsTopics: RightsTopic[] = [
  {
    id: "stopped-on-the-road",
    title: "Stopped on the road or at a checkpoint",
    situation: "You're stopped while driving, riding or travelling",
    icon: "truck",
    inShort: [
      "Officers can stop vehicles to check documents and keep roads safe.",
      "They should be in uniform, identifiable and polite.",
      "You never have to pay money at a checkpoint. Police services are free.",
    ],
    can: [
      "Stop your vehicle and ask to see your driver's licence and vehicle papers.",
      "Ask where you are coming from or going to, if there is a reason.",
      "Search a vehicle if they reasonably suspect it is linked to a crime.",
      "Arrest you if they reasonably suspect you have committed an offence.",
    ],
    cannot: [
      "Ask for or accept money, \"settlement\" or \"something for the boys\".",
      "Insult, threaten or harm you.",
      "Take your property without telling you why and recording it.",
      "Hold you at the checkpoint without telling you the reason.",
    ],
    whatToDo: [
      "Stay calm, keep your hands where they can be seen, and switch on your inside light at night.",
      "Ask politely for the officer's name and number (shown on the name tag).",
      "Show your documents if asked.",
      "If someone asks for money, don't pay. Note the officer's name or number, the place, the time and any vehicle number, then make a complaint.",
    ],
    law: [
      { source: "Constitution of Nigeria 1999, s.34", detail: "Right to dignity: no torture or inhuman or degrading treatment." },
      { source: "Constitution of Nigeria 1999, s.41", detail: "Freedom of movement." },
      { source: "Police Act 2020", detail: "Sets out officers' powers and duties, including treating people with respect." },
    ],
    keywords: ["checkpoint", "road", "stopped", "driving", "car", "bribe", "money", "settlement", "papers", "licence"],
  },
  {
    id: "stop-and-search",
    title: "Stopped and searched",
    situation: "An officer wants to search you or your bag",
    icon: "search",
    inShort: [
      "Officers can search you if they have a reasonable suspicion linked to a crime.",
      "A search must be done decently and respectfully.",
      "A woman should only be searched by a woman officer.",
    ],
    can: [
      "Search you, your bag or your vehicle when they reasonably suspect you are carrying something unlawful.",
      "Search you after a lawful arrest.",
      "Keep items that are evidence of a crime, if they record them.",
    ],
    cannot: [
      "Search you to humiliate or punish you.",
      "Have a man search a woman.",
      "Take money or items and keep them without recording them.",
      "Force you to unlock or hand over your phone just because they stopped you.",
    ],
    whatToDo: [
      "Stay calm and don't resist, even if you think the search is unfair.",
      "Ask why you are being searched, and remember the answer.",
      "Ask for a list of anything taken.",
      "Note the officer's name or number and make a complaint if the search was unlawful or abusive.",
    ],
    law: [
      { source: "Administration of Criminal Justice Act 2015", detail: "Rules on searches, including that a woman is searched by a woman, with decency." },
      { source: "Constitution of Nigeria 1999, s.37", detail: "Right to privacy of your home, correspondence and telephone conversations." },
    ],
    keywords: ["search", "searched", "bag", "phone", "frisk", "woman"],
  },
  {
    id: "being-arrested",
    title: "Being arrested",
    situation: "An officer says you are under arrest",
    icon: "shield",
    inShort: [
      "You must be told why you are being arrested.",
      "You have the right to remain silent until you have spoken to a lawyer.",
      "Nobody can be arrested in your place, and nobody can be arrested for a debt.",
    ],
    can: [
      "Arrest you if they reasonably suspect you have committed an offence, or with a warrant.",
      "Use reasonable force only if you resist or try to escape.",
      "Take you to a police station to be questioned.",
    ],
    cannot: [
      "Arrest a relative or friend in place of a suspect.",
      "Arrest you over a debt, a contract or another purely civil dispute.",
      "Torture you or treat you in a cruel or degrading way.",
      "Refuse to tell you the reason for the arrest.",
    ],
    whatToDo: [
      "Don't resist or run, even if you believe the arrest is wrong.",
      "Ask: \"What am I being arrested for?\"",
      "Say you want to speak to a lawyer before you make a statement.",
      "Ask that your family be told where you are being taken.",
      "Remember names, numbers and times. You can complain later.",
    ],
    law: [
      { source: "Constitution of Nigeria 1999, s.35", detail: "Right to personal liberty: to be told the reason for arrest in writing within 24 hours, in a language you understand; the right to remain silent until you have consulted a lawyer." },
      { source: "Constitution of Nigeria 1999, s.36", detail: "Right to a fair hearing; you are presumed innocent until proven guilty." },
      { source: "Administration of Criminal Justice Act 2015", detail: "No arrest in place of a suspect; no arrest for a civil wrong or breach of contract; arrested people must be treated humanely." },
      { source: "Anti-Torture Act 2017", detail: "Torture is a crime, including by public officials." },
    ],
    keywords: ["arrest", "arrested", "custody", "lawyer", "silent", "relative", "in lieu", "debt"],
  },
  {
    id: "at-the-station",
    title: "At the police station",
    situation: "You or someone you know is being held at a station",
    icon: "home",
    inShort: [
      "You can ask for a lawyer, and free legal aid is available.",
      "Your family can be told where you are.",
      "You don't have to sign a statement you don't agree with.",
    ],
    can: [
      "Question you about the offence they suspect.",
      "Take your statement, ideally in the presence of your lawyer or another person you choose.",
      "Hold you for a limited time while they investigate (see \"Held for too long\").",
    ],
    cannot: [
      "Stop you from contacting a lawyer.",
      "Force or trick you into making or signing a statement.",
      "Deny you food, water or medical care.",
      "Ask you or your family for money to release you, to \"open a file\" or to investigate.",
    ],
    whatToDo: [
      "Ask to speak to a lawyer. If you can't afford one, ask for the Legal Aid Council.",
      "Read your statement before signing. If it's wrong, don't sign it; ask for it to be corrected.",
      "Ask a family member to come with the name of the officer in charge of your case.",
      "If anyone asks for money, refuse and make a complaint.",
    ],
    law: [
      { source: "Constitution of Nigeria 1999, s.35", detail: "Right to remain silent and to consult a lawyer of your choice." },
      { source: "Administration of Criminal Justice Act 2015", detail: "How statements are taken, including in the presence of a lawyer or another person you choose, and records of arrests." },
      { source: "Legal Aid Act 2011", detail: "The Legal Aid Council provides free legal help for people who can't afford a lawyer." },
    ],
    keywords: ["station", "cell", "statement", "sign", "family", "legal aid", "lawyer", "detained", "held"],
  },
  {
    id: "bail",
    title: "Bail is free",
    situation: "Someone is asked to pay for police bail",
    icon: "wallet",
    inShort: [
      "Police bail is free. No one should pay money to be released.",
      "You may be asked for a surety: a person who promises you will come back.",
      "Getting bail doesn't mean the case is over.",
    ],
    can: [
      "Release you on bail while they investigate.",
      "Ask for a reasonable surety and for you to report back on a set date.",
      "Refuse bail for some very serious offences, and take you to court instead.",
    ],
    cannot: [
      "Charge money for bail, for the bail form, or for \"processing\".",
      "Keep you because you can't pay.",
      "Ask your surety for money.",
    ],
    whatToDo: [
      "Ask for bail politely, and ask what conditions apply.",
      "If someone asks for money, don't pay. Note their name or number and make a complaint.",
      "Keep the date you must report back, and keep to it.",
    ],
    law: [
      { source: "Police Act 2020", detail: "Police bail is free." },
      { source: "Administration of Criminal Justice Act 2015", detail: "Rules on bail and on how long a suspect can be held before being taken to court." },
    ],
    keywords: ["bail", "pay", "money", "release", "surety", "free"],
  },
  {
    id: "phone-and-home",
    title: "Your phone and your home",
    situation: "Officers want to enter your home or look through your phone",
    icon: "phone",
    inShort: [
      "Your home, letters, phone calls and messages are private by law.",
      "Searching a home usually needs a search warrant.",
      "Officers shouldn't go through your phone just because they stopped you.",
    ],
    can: [
      "Enter and search a home with a search warrant.",
      "Enter without a warrant in limited urgent cases, for example to arrest someone they are chasing or to save life.",
      "Examine a phone as part of a real investigation, lawfully and on record.",
    ],
    cannot: [
      "Search your home without a warrant just because they want to look.",
      "Demand your phone password at a checkpoint or during a casual stop.",
      "Damage or take your property without recording it.",
    ],
    whatToDo: [
      "Ask to see the search warrant, and read the address on it.",
      "Stay calm and don't obstruct the search.",
      "Ask for a list of anything taken and who took it.",
      "If your phone was searched or taken unlawfully, make a complaint.",
    ],
    law: [
      { source: "Constitution of Nigeria 1999, s.37", detail: "Privacy of citizens, their homes, correspondence, telephone conversations and telegraphic communications." },
      { source: "Administration of Criminal Justice Act 2015", detail: "Rules on search warrants and on searching premises." },
    ],
    keywords: ["phone", "home", "house", "warrant", "privacy", "password", "messages"],
  },
  {
    id: "held-too-long",
    title: "Held for too long",
    situation: "Someone has been in police custody for days",
    icon: "clock",
    inShort: [
      "You must be taken to a court within 24 hours if there is a court within 40 kilometres.",
      "Otherwise within 48 hours, or a longer period a court considers reasonable.",
      "If someone is held longer, a lawyer can apply to a High Court to have them freed.",
    ],
    can: [
      "Hold a suspect for a short time to investigate.",
      "Ask a court for an order to keep someone longer, in serious cases.",
    ],
    cannot: [
      "Hold someone for weeks without taking them to court.",
      "Hide where a person is being held from their family or lawyer.",
    ],
    whatToDo: [
      "Find out which station and which officer is handling the case.",
      "Ask the Divisional Police Officer (DPO) why the person is still held.",
      "Contact a lawyer or the Legal Aid Council. They can apply to court to enforce the person's rights.",
      "You can also contact the National Human Rights Commission.",
    ],
    law: [
      { source: "Constitution of Nigeria 1999, s.35", detail: "A person arrested must be brought before a court within a reasonable time: one day if a court is within 40 km, otherwise two days or a longer period the court considers reasonable." },
      { source: "Fundamental Rights (Enforcement Procedure) Rules", detail: "How to apply to a High Court when your fundamental rights are breached." },
    ],
    keywords: ["held", "detained", "custody", "days", "court", "24 hours", "48 hours", "long"],
  },
  {
    id: "women-children",
    title: "Women, children and vulnerable people",
    situation: "The person involved is a woman, a child or vulnerable",
    icon: "users",
    inShort: [
      "A woman should only be searched by a woman officer.",
      "Children must be treated as children: kept apart from adults and their parents told.",
      "Gender-based violence is a crime. You can report it and get help.",
    ],
    can: [
      "Take a child into protective care if they are in danger.",
      "Arrest a child suspect, but only with special care and rules.",
    ],
    cannot: [
      "Hold a child in the same cell as adults.",
      "Question a child without a parent, guardian or other responsible adult.",
      "Refuse to take a report of rape, domestic violence or other gender-based violence.",
    ],
    whatToDo: [
      "Ask for a woman officer if you or a woman with you is to be searched.",
      "For a child, ask that the parents or guardian be contacted at once.",
      "For gender-based violence, you can go to any police station; many states also have sexual assault referral centres.",
      "If you suspect trafficking, the police and NAPTIP (National Agency for the Prohibition of Trafficking in Persons) can help.",
    ],
    law: [
      { source: "Administration of Criminal Justice Act 2015", detail: "A woman is searched by a woman, with decency." },
      { source: "Child's Rights Act 2003", detail: "Protects children's rights, including in contact with the police (applies where adopted by the state)." },
      { source: "Violence Against Persons (Prohibition) Act 2015", detail: "Makes rape, domestic violence and other forms of violence crimes." },
    ],
    keywords: ["woman", "women", "child", "children", "minor", "girl", "rape", "domestic", "violence", "gbv", "trafficking"],
  },
];

export const rightsTopicById = (id: string) => rightsTopics.find((t) => t.id === id);

/** What every officer must do (shown on the hub). */
export const officerDuties = [
  "Identify themselves, by name tag or by telling you their name and number.",
  "Tell you why you are being stopped, searched or arrested.",
  "Treat you with dignity and without discrimination.",
  "Record arrests, searches and anything they take.",
  "Take your report when you come to a station. Reporting a crime is free.",
  "Protect life and property, including yours.",
];

// ---------------------------------------------------------------------------
// How investigations work

export interface Step {
  title: string;
  what: string;
  expect: string;
  youCan: string;
  time: string; // illustrative
}

export const investigationSteps: Step[] = [
  {
    title: "You report the crime",
    what: "You report at a police station (or are interviewed after an incident). An officer records your statement and the details in the station's records.",
    expect: "To be listened to, to have your statement read back to you, and to be told who will handle your case.",
    youCan: "Bring evidence (photos, receipts, names of witnesses). Ask for the name of the officer and how to reach the station.",
    time: "The same day",
  },
  {
    title: "An investigating officer is assigned",
    what: "The case is given to an Investigating Police Officer (IPO) at the division's Criminal Investigation Department (CID).",
    expect: "The IPO may contact you for more information and to take statements from witnesses.",
    youCan: "Write down the IPO's name and the case details. Keep a note of every contact.",
    time: "Usually within a few days",
  },
  {
    title: "The investigation",
    what: "The IPO gathers evidence: statements, visits to the scene, documents, forensic checks. Serious or complex cases can move to the State CID, or to the Force CID at Force Headquarters.",
    expect: "Some cases take weeks or months. You should not be asked to pay for fuel, transport or \"mobilisation\". Police investigations are free.",
    youCan: "Share new information with the IPO. Ask politely for updates.",
    time: "Weeks to months, depending on the case",
  },
  {
    title: "Legal advice",
    what: "For serious offences, the case file goes to the state Director of Public Prosecutions (DPP) or the Attorney-General for advice on whether to charge.",
    expect: "The prosecutor decides if there is enough evidence for a court case.",
    youCan: "Ask the IPO whether the file has been sent for legal advice.",
    time: "Weeks, sometimes longer",
  },
  {
    title: "Charge and court",
    what: "If there is enough evidence, the suspect is charged and the case goes to court. Police or state prosecutors present the case.",
    expect: "You may be asked to give evidence as a witness. You will be told the date.",
    youCan: "Ask for support if you are afraid to testify. Ask about compensation or restitution where the law allows it.",
    time: "Depends on the court",
  },
];

export const victimRights = [
  "To be treated with respect and dignity.",
  "To have your report taken, free of charge.",
  "To be told who is handling your case and how to follow up.",
  "To be protected if you are threatened because you reported.",
  "To ask about compensation or restitution where the law allows it.",
];

export const followUpLadder = [
  { who: "The Investigating Police Officer (IPO)", when: "First: ask for an update on your case." },
  { who: "The Divisional Police Officer (DPO)", when: "If the IPO doesn't respond or the case has stalled." },
  { who: "The Area Commander or the state command's Public Relations Officer", when: "If the division can't help." },
  { who: "A complaint about the officer", when: "If you were asked for money, ignored or mistreated." },
];

// ---------------------------------------------------------------------------
// Complaints about officers

export interface Channel {
  name: string;
  handles: string;
  contact: string;
}

export const complaintChannels: Channel[] = [
  {
    name: "NPF Complaint Response Unit (CRU)",
    handles: "The first stop for most complaints: extortion and bribery, unlawful arrest or detention, rudeness, brutality, refusal to take a report.",
    contact: "Contact details to be confirmed by NPFTV.",
  },
  {
    name: "Police Service Commission",
    handles: "The constitutional body responsible for appointing, promoting and disciplining police officers.",
    contact: "Contact details to be confirmed.",
  },
  {
    name: "National Human Rights Commission (NHRC)",
    handles: "Human rights violations, including by police officers.",
    contact: "Contact details to be confirmed.",
  },
  {
    name: "The courts",
    handles: "A lawyer can apply to a High Court to enforce your fundamental rights and claim damages.",
    contact: "The Legal Aid Council can help if you can't afford a lawyer.",
  },
];

/** How the police complaint process generally works (handled by the police and oversight bodies, not NPFTV). */
export const complaintSteps = [
  { title: "Received", text: "The unit you contact logs your complaint. Ask them for a reference number." },
  { title: "Reviewed", text: "They read it and may contact you for more detail or evidence." },
  { title: "Assigned", text: "It's passed to the people who investigate officer conduct in the right command." },
  { title: "Investigated", text: "Statements are taken, records checked and the officer is asked to respond." },
  { title: "Outcome", text: "You should be told the outcome. Officers found at fault can face discipline." },
];

/** "Prepare your complaint" checklist. The headings are also used by the AI helper. */
export const complaintChecklist = [
  { id: "when", label: "When it happened", hint: "Date and time, as exactly as you can." },
  { id: "where", label: "Where it happened", hint: "State, LGA, and the nearest landmark or junction." },
  { id: "officer", label: "The officer(s)", hint: "Name or number from the name tag, rank, unit, uniform, vehicle number." },
  { id: "what", label: "What happened", hint: "In order, plainly. What was said and done." },
  { id: "evidence", label: "Evidence", hint: "Photos, videos, receipts, bank transfer records, medical reports." },
  { id: "witnesses", label: "Witnesses", hint: "Names and how to reach them, if they agree." },
  { id: "outcome", label: "What you want", hint: "For example: money returned, an apology, the officer investigated." },
] as const;

export type ChecklistId = (typeof complaintChecklist)[number]["id"];
