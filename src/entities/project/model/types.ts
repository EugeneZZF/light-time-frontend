import { Image } from "@/entities/images/model/types";

export type ProjectEquipment = {
  id?: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  productUrl?: string | null;
  price?: number | string | null;
  sortOrder: number;
};

export type Project = {
  content: string;
  createdAt: string;
  description?: string;
  images: Image[];
  equipment: ProjectEquipment[];
  id: number;
  slug: string;
  status: string;
  title: string;
  updatedAt: string;
};
