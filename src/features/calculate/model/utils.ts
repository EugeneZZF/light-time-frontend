import { FixtureType } from "@/entities/calculate/model/types";

export function getUtilizationFactor(i: number): number {
  if (i < 0.6) return 0.35;
  if (i < 1) return 0.4;
  if (i < 1.5) return 0.45;
  if (i < 2) return 0.5;
  if (i < 3) return 0.55;
  return 0.6;
}

export function adjustByFixtureType(type: FixtureType, base: number): number {
  switch (type) {
    case "track":
      return base - 0.05;
    case "suspended":
      return base - 0.03;
    case "recessed":
      return base + 0.05;
    case "modular":
      return base + 0.03;
    default:
      return base;
  }
}
