export type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: null | number;
  isActive: boolean;
  sortOrder: number;
  subcategoriesA?: Category[];
  subcategoriesB?: Category[];
  SubcategoriesA?: Category[];
  SubcategoriesB?: Category[];
};
