// "use client";

import BigCardCatalogCategory from "@/entities/catalog/ui/BigCardCatalogProduct";

// import { useSearchParams } from "next/navigation";
interface CatalogProps {
  searchParams: {
    categorySlug?: string;
  };
}

export default async function Catalog() {
  // const searchParams = useSearchParams();
  // const activeCategorySlug = searchParams.get("categorySlug");

  // const category = getCategory

  // const item = {
  //   id: 5,
  //   name: "Внутреннее освещение",
  //   slug: "vnutrennee-osveschenie",
  //   imageUrl: "/uploads/cc9f4c68-d8d5-4be5-9127-83cbb8baab7e.jpg",
  //   description:
  //     "описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории описание Категории ",
  //   parentId: null,
  //   isActive: true,
  //   sortOrder: 1,
  //   subcategoriesA: [
  //     {
  //       id: 6,
  //       name: "Интерьерные светильники",
  //       slug: "interernye-svetilniki",
  //       imageUrl: null,
  //       description: null,
  //       parentId: 5,
  //       isActive: true,
  //       sortOrder: 0,
  //       subcategoriesB: [],
  //     },
  //     {
  //       id: 7,
  //       name: "Встраиваемые светильники",
  //       slug: "vstraivaemye-svetilniki",
  //       imageUrl: null,
  //       description: null,
  //       parentId: 5,
  //       isActive: true,
  //       sortOrder: 1,
  //       subcategoriesB: [
  //         "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //         "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //         "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //         "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //         "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //       ],
  //     },
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //     "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.",
  //   ],
  // };

  // const product = {
  //   id: "7",
  //   sku: "new_prjduct",
  //   slug: "new-prjduct",
  //   title: "Новый продукт",
  //   price: "5555",
  //   inStock: true,
  //   description: "Описание очень детальноеуцйуцй ",
  //   img: [
  //     {
  //       url: "/uploads/b2523b95-1276-4fa6-b237-f46af568d8e0.png",
  //       sortOrder: 0,
  //     },
  //   ],
  //   specifications: {},
  //   discount: {
  //     hasDiscount: false,
  //     new_price: null,
  //   },
  //   categories: {
  //     main: {
  //       id: 5,
  //       name: "Внутреннее освещение",
  //       imageUrl: "/uploads/cc9f4c68-d8d5-4be5-9127-83cbb8baab7e.jpg",
  //       description: "описание Категории",
  //     },
  //     subA: {
  //       id: 6,
  //       name: "Интерьерные светильники",
  //       imageUrl: null,
  //       description: null,
  //     },
  //     subB: null,
  //   },
  //   isActive: true,
  //   createdAt: "2026-03-22T22:21:24.343Z",
  //   updatedAt: "2026-03-22T22:21:24.343Z",
  // };

  return (
    <div className="w-full grid grid-cols-2">
      <BigCardCatalogCategory item={item}></BigCardCatalogCategory>
      <h1>catalogs</h1>

      {/* <BigCardCatalog></BigCardCatalog> */}
    </div>
  );
}
