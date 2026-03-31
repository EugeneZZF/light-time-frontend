export type Product = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  price: string;
  inStock: boolean;
  description: string | null;
  brand: {
    id: number;
    name: string;
    slug: string;
  } | null;
  img: {
    url: string;
    sortOrder: number;
  }[];
  specifications: Record<string, unknown>;
  discount: {
    hasDiscount: boolean;
    new_price: string | null;
  };
  categories: {
    main: {
      id: number;
      name: string;
    } | null;
    subA: {
      id: number;
      name: string;
    } | null;
    subB: {
      id: number;
      name: string;
    } | null;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
