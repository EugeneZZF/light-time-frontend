export type AdminCategory = {
  createdAt?: string;
  description?: string | null;
  id: number;
  imageUrl?: string | null;
  isActive: boolean;
  name: string;
  parentId: number | null;
  slug: string;
  sortOrder: number;
  subcategoriesA?: AdminCategory[];
  subcategoriesB?: AdminCategory[];
  updatedAt?: string;
};

export type AdminCategoryRef = {
  id: number;
  name: string;
};

export type AdminProductImage = {
  sortOrder: number;
  url: string;
};

export type AdminProduct = {
  categories: {
    main: AdminCategoryRef | null;
    subA: AdminCategoryRef | null;
    subB: AdminCategoryRef | null;
  };
  createdAt?: string;
  description: string | null;
  discount: {
    hasDiscount: boolean;
    new_price: string | null;
  };
  id: string;
  img: AdminProductImage[];
  inStock: boolean;
  isActive: boolean;
  price: string;
  sku: string;
  slug: string;
  specifications: Record<string, unknown>;
  title: string;
  updatedAt?: string;
};

export type AdminBrand = {
  createdAt?: string;
  description?: string | null;
  id: number;
  imageUrl?: string | null;
  isActive?: boolean;
  name: string;
  slug: string;
  updatedAt?: string;
};

export type AdminNewsItem = {
  content: string;
  createdAt?: string;
  id: number;
  publishedAt?: string | null;
  slug: string;
  status: string;
  title: string;
  updatedAt?: string;
};

export type AdminPageItem = {
  content: string;
  createdAt?: string;
  id: number;
  slug: string;
  status: string;
  title: string;
  updatedAt?: string;
};

export type AdminProjectImage = {
  id?: number;
  sortOrder: number;
  url: string;
};

export type AdminProjectEquipment = {
  description?: string | null;
  id?: number;
  imageUrl?: string | null;
  name: string;
  price?: number | string | null;
  productUrl?: string | null;
  sortOrder: number;
};

export type AdminProject = {
  content: string;
  createdAt?: string;
  equipment: AdminProjectEquipment[];
  id: number;
  images: AdminProjectImage[];
  slug: string;
  status: string;
  title: string;
  updatedAt?: string;
};
