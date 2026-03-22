import {
  AdminCategory,
  AdminProductImage,
  AdminProjectEquipment,
  AdminProjectImage,
} from "../model/types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatAdminDate(value?: string | null) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function flattenCategoryTree(tree: AdminCategory[]) {
  const items: Array<AdminCategory & { level: 0 | 1 | 2 }> = [];

  tree.forEach((mainCategory) => {
    items.push({ ...mainCategory, level: 0 });

    (mainCategory.subcategoriesA ?? []).forEach((subA) => {
      items.push({ ...subA, level: 1 });

      (subA.subcategoriesB ?? []).forEach((subB) => {
        items.push({ ...subB, level: 2 });
      });
    });
  });

  return items;
}

export function findCategoryNameById(
  categories: AdminCategory[],
  id: number | null,
) {
  if (!id) {
    return null;
  }

  return flattenCategoryTree(categories).find((item) => item.id === id) ?? null;
}

export function parseJsonText<T>(value: string, fallback: T) {
  if (!value.trim()) {
    return fallback;
  }

  return JSON.parse(value) as T;
}

export function stringifyPretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function serializeImages(images: Array<{ sortOrder?: number; url: string }>) {
  return images
    .map((image, index) => `${image.url}|${image.sortOrder ?? index}`)
    .join("\n");
}

export function parseImageLines(value: string): AdminProductImage[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, sortOrder] = line.split("|");

      return {
        url: url.trim(),
        sortOrder: Number(sortOrder ?? index),
      };
    });
}

export function parseProjectImages(value: string): AdminProjectImage[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, sortOrder] = line.split("|");

      return {
        url: url.trim(),
        sortOrder: Number(sortOrder ?? index),
      };
    });
}

export function serializeProjectImages(images: AdminProjectImage[]) {
  return images
    .map((image, index) => `${image.url}|${image.sortOrder ?? index}`)
    .join("\n");
}

export function parseProjectEquipmentLines(value: string): AdminProjectEquipment[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, price, productUrl, imageUrl, description] = line.split("|");

      return {
        name: (name ?? "").trim(),
        price: price ? Number(price) : null,
        productUrl: productUrl?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        description: description?.trim() || null,
        sortOrder: index,
      };
    });
}

export function serializeProjectEquipment(
  equipment: AdminProjectEquipment[],
) {
  return equipment
    .map((item) =>
      [
        item.name,
        item.price ?? "",
        item.productUrl ?? "",
        item.imageUrl ?? "",
        item.description ?? "",
      ].join("|"),
    )
    .join("\n");
}
