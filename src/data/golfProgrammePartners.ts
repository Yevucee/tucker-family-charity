/**
 * Golf Learnership Programme – lead charitable partners (equal prominence).
 * Add logo paths when available.
 */

export interface GolfProgrammePartner {
  id: string;
  name: string;
  logo: string | null;
}

export const golfProgrammePartners: GolfProgrammePartner[] = [
  { id: "tucker", name: "Tucker Family Foundation", logo: null },
  { id: "afrika-tikkun", name: "Afrika Tikkun", logo: null },
];
