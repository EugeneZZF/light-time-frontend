import { LightingStandard, RoomType } from "./types";

export const LUX_STANDARDS: Record<
  LightingStandard,
  Record<RoomType, number>
> = {
  SNIP: {
    work_office: 300, // Рабочий кабинет
    office: 300, // Офис
    computer_room: 300, // Помещение с ПК
    classroom: 300,
    bank_operating_room: 300,
    reading_room: 300,
    design_office: 500,
    conference_room: 200,
    sports_hall: 200,
    exhibition_hall: 200,
    retail_sales_area: 800,
    dining_room: 200,
    hair_salon: 400,
    doctor_office: 300,
    garage: 200,
    warehouse_receiving: 200,
    warehouse_storage: 50,
    lobby: 150,
    corridor: 50,
    stairs: 100,
    attic: 5,
  },

  EU: {
    work_office: 500,
    office: 500,
    computer_room: 300,
    classroom: 500,
    bank_operating_room: 500,
    reading_room: 500,
    design_office: 750,
    conference_room: 500,
    exhibition_hall: 300,
    retail_sales_area: 1000,
    dining_room: 300,
    doctor_office: 500,
    garage: 200,
    warehouse_receiving: 100,
    warehouse_storage: 10,
    lobby: 200,
    corridor: 100,
    stairs: 150,
    attic: 5,
  },
};

export const REFLECTANCE = {
  ceiling: {
    white: 0.7,
    light: 0.5,
    dark: 0.3,
  },
  walls: {
    light: 0.5,
    dark: 0.3,
  },
  floor: {
    dark: 0.2,
    black: 0.1,
  },
};

export const STANDARD_RESERVE_FACTORS: Record<LightingStandard, number> = {
  SNIP: 1,
  EU: 1,
};
