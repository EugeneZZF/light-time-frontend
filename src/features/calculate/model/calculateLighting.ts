import {
  LUX_STANDARDS,
  REFLECTANCE,
  STANDARD_RESERVE_FACTORS,
} from "@/entities/calculate/model/constants";
import { CalculateLightingInput, CalculateLightingResult } from "./types";
import { getUtilizationFactor, adjustByFixtureType } from "./utils";

export function calculateLighting(
  input: CalculateLightingInput,
): CalculateLightingResult {
  const lux = LUX_STANDARDS[input.standard][input.roomType];

  const area = input.length * input.width;

  const h = input.height - input.workSurfaceHeight;

  const roomIndex = area / (h * (input.length + input.width));

  let utilization = getUtilizationFactor(roomIndex);
  utilization = adjustByFixtureType(input.fixtureType, utilization);
  const averageReflectance =
    (REFLECTANCE.ceiling[input.ceiling] +
      REFLECTANCE.walls[input.walls] +
      REFLECTANCE.floor[input.floor]) /
    3;
  utilization += (averageReflectance - 0.33) * 0.1;
  utilization = Math.min(Math.max(utilization, 0.35), 0.85);

  const maintenance = STANDARD_RESERVE_FACTORS[input.standard];

  const totalLumens = (lux * area * maintenance) / utilization;

  const count = Math.ceil(totalLumens / input.lumensPerLamp);

  return {
    lux,
    area,
    roomIndex,
    utilization,
    totalLumens,
    count,
  };
}
