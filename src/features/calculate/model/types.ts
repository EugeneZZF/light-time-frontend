import {
  LightingStandard,
  RoomType,
  FixtureType,
  CeilingType,
  WallType,
  FloorType,
} from "@/entities/calculate/model/types";

export interface CalculateLightingInput {
  standard: LightingStandard;
  roomType: RoomType;

  length: number;
  width: number;
  height: number;

  workSurfaceHeight: number;

  fixtureType: FixtureType;
  lumensPerLamp: number;

  ceiling: CeilingType;
  walls: WallType;
  floor: FloorType;
}

export interface CalculateLightingResult {
  lux: number;
  area: number;
  roomIndex: number;
  utilization: number;
  totalLumens: number;
  count: number;
}
