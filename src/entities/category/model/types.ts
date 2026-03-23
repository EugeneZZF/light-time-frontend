export type Category = {
  description?: string | null;
  id: number;
  imageUrl?: string | null;
  name: string;
  slug: string;
  parentId: null | number;
  isActive: boolean;
  sortOrder: number;
  // imageUrl: string;
  // description?: string;
  subcategoriesA?: Category[];
  subcategoriesB?: Category[];
  SubcategoriesA?: Category[];
  SubcategoriesB?: Category[];
};
