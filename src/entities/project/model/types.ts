import { Image } from "@/entities/images/model/types";

export type Project = {
  content: string;
  createdAt: string;
  images: Image[];
  equipment: any[];
  id: number;
  slug: string;
  status: string;
  title: string;
  updatedAt: string;
};
