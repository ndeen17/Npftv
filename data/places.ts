import type { StateCommand } from "@/lib/types";

// Tile-map layout (column, row) from design/src/erp.html. Story counts are November figures from docs/mock-data.md.
const raw: [id: string, name: string, capital: string, stories: number, col: number, row: number, zone: string][] = [
  ["SO", "Sokoto", "Sokoto", 12, 2, 1, "North West"],
  ["ZA", "Zamfara", "Gusau", 7, 3, 1, "North West"],
  ["KT", "Katsina", "Katsina", 13, 4, 1, "North West"],
  ["KN", "Kano", "Kano", 19, 5, 1, "North West"],
  ["JI", "Jigawa", "Dutse", 8, 6, 1, "North West"],
  ["YO", "Yobe", "Damaturu", 3, 7, 1, "North East"],
  ["BO", "Borno", "Maiduguri", 12, 8, 1, "North East"],
  ["KE", "Kebbi", "Birnin Kebbi", 7, 2, 2, "North West"],
  ["KD", "Kaduna", "Kaduna", 27, 4, 2, "North West"],
  ["BA", "Bauchi", "Bauchi", 11, 6, 2, "North East"],
  ["GO", "Gombe", "Gombe", 8, 7, 2, "North East"],
  ["AD", "Adamawa", "Yola", 7, 8, 2, "North East"],
  ["KW", "Kwara", "Ilorin", 8, 2, 3, "North Central"],
  ["NI", "Niger", "Minna", 9, 3, 3, "North Central"],
  ["FC", "Federal Capital Territory", "Abuja", 31, 4, 3, "North Central"],
  ["NA", "Nasarawa", "Lafia", 8, 5, 3, "North Central"],
  ["PL", "Plateau", "Jos", 12, 6, 3, "North Central"],
  ["TA", "Taraba", "Jalingo", 4, 7, 3, "North East"],
  ["OY", "Oyo", "Ibadan", 13, 1, 4, "South West"],
  ["OS", "Osun", "Osogbo", 7, 2, 4, "South West"],
  ["EK", "Ekiti", "Ado-Ekiti", 4, 3, 4, "South West"],
  ["KO", "Kogi", "Lokoja", 7, 4, 4, "North Central"],
  ["BE", "Benue", "Makurdi", 11, 5, 4, "North Central"],
  ["OG", "Ogun", "Abeokuta", 12, 1, 5, "South West"],
  ["ON", "Ondo", "Akure", 8, 2, 5, "South West"],
  ["ED", "Edo", "Benin City", 11, 3, 5, "South South"],
  ["EN", "Enugu", "Enugu", 11, 4, 5, "South East"],
  ["EB", "Ebonyi", "Abakaliki", 5, 5, 5, "South East"],
  ["CR", "Cross River", "Calabar", 7, 6, 5, "South South"],
  ["LA", "Lagos", "Ikeja", 34, 1, 6, "South West"],
  ["DE", "Delta", "Asaba", 12, 3, 6, "South South"],
  ["AN", "Anambra", "Awka", 11, 4, 6, "South East"],
  ["AB", "Abia", "Umuahia", 7, 5, 6, "South East"],
  ["AK", "Akwa Ibom", "Uyo", 8, 6, 6, "South South"],
  ["IM", "Imo", "Owerri", 6, 4, 7, "South East"],
  ["BY", "Bayelsa", "Yenagoa", 6, 3, 8, "South South"],
  ["RI", "Rivers", "Port Harcourt", 26, 4, 8, "South South"],
];

export const states: StateCommand[] = raw.map(([id, name, capital, stories, col, row, zone]) => ({
  id,
  name,
  capital,
  stories,
  col,
  row,
  zone,
}));

export const stateById = (id?: string) => states.find((s) => s.id === id);
export const stateBySlug = (slug: string) => states.find((s) => stateSlug(s) === slug);
export const stateSlug = (s: StateCommand) => (s.id === "FC" ? "fct" : s.name.toLowerCase().replace(/\s+/g, "-"));

/** Map shade tier: l4 = 20+, l3 = 10 to 19, l2 = 6 to 9, "" = 5 or fewer. */
export function tier(stories: number): "l4" | "l3" | "l2" | "" {
  if (stories >= 20) return "l4";
  if (stories >= 10) return "l3";
  if (stories >= 6) return "l2";
  return "";
}

/** Headline figures from docs/mock-data.md. */
export const CORRESPONDENT_TOTAL = 412;
export const CORRESPONDENT_DESKS = 37;
