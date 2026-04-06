"use client";

import { adminRequest, adminUploadFile } from "@/features/admin/api/client";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import {
  AdminBrand,
  AdminCategory,
  AdminProduct,
} from "@/features/admin/model/types";
import {
  findCategoryNameById,
  parseImageLines,
  serializeImages,
} from "@/features/admin/lib/utils";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormPrimitives";
import AdminImagePicker from "./AdminImagePicker";
import AdminPageHeader from "./AdminPageHeader";
import AdminSurface from "./AdminSurface";

const SPECIFICATION_TYPE_OPTIONS = [
  {
    value: "Recessed luminaires",
    label: "Встраиваемые светильники",
  },
  {
    value: "Track luminaires",
    label: "Трековые светильники",
  },
  {
    value: "Modular luminaires",
    label: "Модульные светильники",
  },
  {
    value: "Wall-ceiling luminaires",
    label: "Настенно-потолочные светильники",
  },
  {
    value: "Linear fluorescent luminaires",
    label: "Люминесцентные светильники линейные",
  },
  {
    value: "Suspended luminaires",
    label: "Подвесные светильники",
  },
  {
    value: "Linear LED luminaires",
    label: "Светодиодные светильники линейные",
  },
  {
    value: "Information displays",
    label: "Информационные табло",
  },
] as const;

const CONTROLLED_SPECIFICATION_KEYS = [
  "type",
  "power",
  "luminous",
  "size",
  "baseType",
  "protectionDegree",
  "materials",
  "lightSourceType",
  "reflectorType",
  "packaging",
  "quantity",
] as const;

const NUMERIC_SPECIFICATION_KEYS = ["power", "luminous", "quantity"] as const;

const SPECIFICATION_FIELDS = [
  { key: "type", label: "Тип", inputType: "select" },
  { key: "power", label: "Мощность", inputType: "number" },
  { key: "luminous", label: "Световой поток", inputType: "number" },
  { key: "size", label: "Размер", inputType: "text" },
  { key: "baseType", label: "Тип цоколя", inputType: "text" },
  { key: "protectionDegree", label: "Степень защиты", inputType: "text" },
  { key: "materials", label: "Материалы", inputType: "text" },
  { key: "lightSourceType", label: "Тип источника света", inputType: "text" },
  { key: "reflectorType", label: "Тип отражателя", inputType: "text" },
  { key: "packaging", label: "Упаковка", inputType: "text" },
  { key: "quantity", label: "Количество", inputType: "number" },
] as const;

type ControlledSpecificationKey =
  (typeof CONTROLLED_SPECIFICATION_KEYS)[number];

type SpecificationFieldState = {
  enabled: boolean;
  value: string;
};

type ProductFormState = {
  brandId: string;
  description: string;
  imageLines: string;
  inStock: boolean;
  isActive: boolean;
  mainCategoryId: string;
  newPrice: string;
  price: string;
  sku: string;
  slug: string;
  specifications: Record<ControlledSpecificationKey, SpecificationFieldState>;
  subACategoryId: string;
  subBCategoryId: string;
  title: string;
  useDiscount: boolean;
};

function createEmptySpecifications(): Record<
  ControlledSpecificationKey,
  SpecificationFieldState
> {
  return Object.fromEntries(
    CONTROLLED_SPECIFICATION_KEYS.map((key) => [
      key,
      { enabled: false, value: "" },
    ]),
  ) as Record<ControlledSpecificationKey, SpecificationFieldState>;
}

function getSpecificationFieldState(
  specifications: Record<string, unknown>,
  key: ControlledSpecificationKey,
): SpecificationFieldState {
  const value = specifications[key];

  if (value === null || value === undefined) {
    return { enabled: false, value: "" };
  }

  return {
    enabled: true,
    value: String(value),
  };
}

function toSpecificationRequestValue(
  key: ControlledSpecificationKey,
  field: SpecificationFieldState,
) {
  if (!field.enabled) {
    return null;
  }

  if (
    (NUMERIC_SPECIFICATION_KEYS as readonly string[]).includes(key) &&
    field.value.trim().length > 0
  ) {
    const numericValue = Number(field.value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  return field.value;
}

const emptyForm: ProductFormState = {
  brandId: "",
  description: "",
  imageLines: "",
  inStock: true,
  isActive: true,
  mainCategoryId: "",
  newPrice: "",
  price: "",
  sku: "",
  slug: "",
  specifications: createEmptySpecifications(),
  subACategoryId: "",
  subBCategoryId: "",
  title: "",
  useDiscount: false,
};

export default function ProductsManager() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [extraSpecifications, setExtraSpecifications] = useState<
    Record<string, unknown>
  >({});
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [shakenFieldKey, setShakenFieldKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const mainCategory = useMemo(
    () =>
      categories.find(
        (category) => category.id === Number(form.mainCategoryId),
      ) ?? null,
    [categories, form.mainCategoryId],
  );
  const subAOptions = mainCategory?.subcategoriesA ?? [];
  const subACategory =
    subAOptions.find(
      (category) => category.id === Number(form.subACategoryId),
    ) ?? null;
  const subBOptions = subACategory?.subcategoriesB ?? [];
  const activeBrands = useMemo(
    () => brands.filter((brand) => brand.isActive !== false),
    [brands],
  );
  const selectedBrand =
    activeBrands.find((brand) => brand.id === Number(form.brandId)) ?? null;

  async function loadData() {
    const [productsResult, categoriesResult, brandsResult] = await Promise.all([
      adminRequest<AdminProduct[]>("products"),
      adminRequest<AdminCategory[]>("categories/tree"),
      adminRequest<AdminBrand[]>("brands"),
    ]);

    setProducts(productsResult);
    setCategories(categoriesResult);
    setBrands(brandsResult);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const [productsResult, categoriesResult, brandsResult] =
          await Promise.all([
            adminRequest<AdminProduct[]>("products"),
            adminRequest<AdminCategory[]>("categories/tree"),
            adminRequest<AdminBrand[]>("brands"),
          ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsResult);
        setCategories(categoriesResult);
        setBrands(brandsResult);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить товары.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetForm() {
    setSelectedProduct(null);
    setForm({
      ...emptyForm,
      specifications: createEmptySpecifications(),
    });
    setExtraSpecifications({});
    setPendingImages([]);
    setError("");
  }

  function updateSpecification(
    key: ControlledSpecificationKey,
    patch: Partial<SpecificationFieldState>,
  ) {
    setForm((current) => ({
      ...current,
      specifications: {
        ...current.specifications,
        [key]: {
          ...current.specifications[key],
          ...patch,
        },
      },
    }));
  }

  function startEdit(product: AdminProduct) {
    const controlledKeys = new Set<string>(CONTROLLED_SPECIFICATION_KEYS);
    const productSpecifications = product.specifications ?? {};

    setSelectedProduct(product);
    setForm({
      brandId: product.brand?.id ? String(product.brand.id) : "",
      description: product.description ?? "",
      imageLines: serializeImages(product.img),
      inStock: product.inStock,
      isActive: product.isActive,
      mainCategoryId: product.categories.main?.id
        ? String(product.categories.main.id)
        : "",
      newPrice: product.discount.new_price ?? "",
      price: product.price,
      sku: product.sku,
      slug: product.slug,
      specifications: {
        type: getSpecificationFieldState(productSpecifications, "type"),
        power: getSpecificationFieldState(productSpecifications, "power"),
        luminous: getSpecificationFieldState(productSpecifications, "luminous"),
        size: getSpecificationFieldState(productSpecifications, "size"),
        baseType: getSpecificationFieldState(productSpecifications, "baseType"),
        protectionDegree: getSpecificationFieldState(
          productSpecifications,
          "protectionDegree",
        ),
        materials: getSpecificationFieldState(
          productSpecifications,
          "materials",
        ),
        lightSourceType: getSpecificationFieldState(
          productSpecifications,
          "lightSourceType",
        ),
        reflectorType: getSpecificationFieldState(
          productSpecifications,
          "reflectorType",
        ),
        packaging: getSpecificationFieldState(
          productSpecifications,
          "packaging",
        ),
        quantity: getSpecificationFieldState(productSpecifications, "quantity"),
      },
      subACategoryId: product.categories.subA?.id
        ? String(product.categories.subA.id)
        : "",
      subBCategoryId: product.categories.subB?.id
        ? String(product.categories.subB.id)
        : "",
      title: product.title,
      useDiscount: product.discount.hasDiscount,
    });
    setExtraSpecifications(
      Object.fromEntries(
        Object.entries(productSpecifications).filter(
          ([key]) => !controlledKeys.has(key),
        ),
      ),
    );
    setPendingImages([]);
    setError("");
  }

  function submitForm() {
    startTransition(async () => {
      try {
        const existingImages = parseImageLines(form.imageLines);
        const uploadedImages = await Promise.all(
          pendingImages.map((file) => adminUploadFile(file)),
        );
        const specifications = {
          ...extraSpecifications,
          ...Object.fromEntries(
            CONTROLLED_SPECIFICATION_KEYS.map((key) => [
              key,
              toSpecificationRequestValue(key, form.specifications[key]),
            ]),
          ),
        };
        const mainCategoryRef = findCategoryNameById(
          categories,
          form.mainCategoryId ? Number(form.mainCategoryId) : null,
        );
        const subACategoryRef = findCategoryNameById(
          categories,
          form.subACategoryId ? Number(form.subACategoryId) : null,
        );
        const subBCategoryRef = findCategoryNameById(
          categories,
          form.subBCategoryId ? Number(form.subBCategoryId) : null,
        );
        const brandRef =
          activeBrands.find((brand) => brand.id === Number(form.brandId)) ??
          null;

        const body = {
          title: form.title,
          price: form.price,
          inStock: form.inStock,
          description: form.description || null,
          img: [
            ...existingImages,
            ...uploadedImages.map((image, index) => ({
              url: image.url,
              sortOrder: existingImages.length + index,
            })),
          ],
          specifications,
          discount: {
            hasDiscount: form.useDiscount,
            new_price: form.useDiscount ? form.newPrice || null : null,
          },
          categories: {
            main: mainCategoryRef
              ? {
                  id: mainCategoryRef.id,
                  name: mainCategoryRef.name,
                  slug: mainCategoryRef.slug,
                }
              : null,
            subA: subACategoryRef
              ? {
                  id: subACategoryRef.id,
                  name: subACategoryRef.name,
                  slug: subACategoryRef.slug,
                }
              : null,
            subB: subBCategoryRef
              ? {
                  id: subBCategoryRef.id,
                  name: subBCategoryRef.name,
                  slug: subBCategoryRef.slug,
                }
              : null,
          },
          brand: brandRef
            ? {
                id: brandRef.id,
                name: brandRef.name,
                slug: brandRef.slug,
              }
            : null,
          slug: form.slug,
          sku: form.sku,
          isActive: form.isActive,
        };

        if (selectedProduct) {
          await adminRequest(`products/${selectedProduct.id}`, {
            method: "PATCH",
            body,
          });
        } else {
          await adminRequest("products", {
            method: "POST",
            body,
          });
        }

        await loadData();
        resetForm();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Не удалось сохранить товар.",
        );
      }
    });
  }

  function deleteProduct() {
    if (!selectedProduct) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`products/${selectedProduct.id}`, {
          method: "DELETE",
        });
        await loadData();
        resetForm();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Не удалось удалить товар.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Товары"
        description="Создавайте товары каталога и управляйте категориями, ценами, наличием, брендом и характеристиками из одной панели."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            Новый товар
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_440px]">
        <AdminSurface>
          <div className="grid gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => startEdit(product)}
                className="grid gap-4 rounded-[22px] border border-[#dfe8e1] bg-[#f9fcfa] p-4 text-left transition hover:border-[#a3bcaa] md:grid-cols-[92px_minmax(0,1fr)]"
              >
                <div
                  className="h-[92px] rounded-[18px] bg-[#eef4ef] bg-cover bg-center"
                  style={{
                    backgroundImage: product.img[0]?.url
                      ? `url(${baseUrl}${product.img[0].url})`
                      : undefined,
                  }}
                />
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="text-[18px] font-bold text-[#173523]">
                      {product.title}
                    </div>
                    <div className="rounded-full border border-[#d7e1d9] bg-white px-3 py-1 text-[11px] font-bold text-[#516556]">
                      {product.isActive ? "АКТИВЕН" : "СКРЫТ"}
                    </div>
                  </div>
                  <div className="mt-1 text-[13px] text-[#607566]">
                    {product.sku || "Без SKU"} • {product.slug}
                  </div>
                  <div className="mt-2 text-[14px] text-[#506657]">
                    {product.price} ₽
                    {product.discount.hasDiscount && product.discount.new_price
                      ? ` -> ${product.discount.new_price} ₽`
                      : ""}
                  </div>
                  <div className="mt-2 text-[13px] text-[#6c8170]">
                    {product.categories.main?.name ?? "Без основной категории"}
                  </div>
                  <div className="mt-1 text-[12px] text-[#839686]">
                    {product.brand?.name ?? "Без бренда"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedProduct ? "Редактировать товар" : "Создать товар"}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <AdminLabel label="Название">
              <AdminInput
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </AdminLabel>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminLabel label="SKU">
                <AdminInput
                  value={form.sku}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sku: event.target.value,
                    }))
                  }
                />
              </AdminLabel>

              <AdminLabel label="Slug">
                <AdminInput
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                />
              </AdminLabel>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* <AdminLabel label="Бренд">
                <AdminInput
                  value={selectedBrand?.name ?? ""}
                  readOnly
                  placeholder="Выберите бренд ниже"
                />
              </AdminLabel> */}

              <AdminLabel label="Цена">
                <AdminInput
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                />
              </AdminLabel>

              <AdminLabel label="Цена со скидкой">
                <AdminInput
                  value={form.newPrice}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      newPrice: event.target.value,
                    }))
                  }
                  placeholder="Необязательно"
                />
              </AdminLabel>
            </div>

            <AdminLabel label="Выбранный бренд">
              {selectedBrand ? (
                <div className="grid gap-3 rounded-[20px] border border-[#cfe0d3] bg-[#f6fbf7] p-3 md:grid-cols-[72px_minmax(0,1fr)]">
                  <div
                    className="h-[72px] rounded-[16px] bg-[#e8f0ea] bg-cover bg-center"
                    style={{
                      backgroundImage: selectedBrand.imageUrl
                        ? `url(${baseUrl}${selectedBrand.imageUrl})`
                        : undefined,
                    }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-[#173523]">
                      {selectedBrand.name}
                    </div>
                    <div className="mt-1 text-[12px] text-[#607566]">
                      {selectedBrand.slug}
                    </div>
                    <div className="mt-2 line-clamp-2 text-[13px] text-[#6c8170]">
                      {selectedBrand.description || "Нет описания"}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          brandId: "",
                        }))
                      }
                      className="mt-3 rounded-[12px] border border-[#e5c7c7] bg-white px-3 py-2 text-[12px] font-bold text-[#933d3d] transition hover:bg-[#fff5f5]"
                    >
                      Убрать
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
                  Бренд не выбран
                </div>
              )}
            </AdminLabel>

            <details className="group rounded-[20px] border border-[#dfe8e1] bg-[#f9fcfa]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
                <div>
                  <div className="text-[14px] font-bold text-[#173523]">
                    Выбрать активный бренд
                  </div>
                  <div className="mt-1 text-[12px] text-[#607566]">
                    {selectedBrand
                      ? `Выбрано: ${selectedBrand.name}`
                      : "Бренд не выбран"}
                  </div>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#607566] transition group-open:rotate-180">
                  ^
                </div>
              </summary>

              <div className="border-t border-[#e3ece5] px-4 py-4">
                <div className="grid max-h-[320px] gap-3 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        brandId: "",
                      }))
                    }
                    className={`rounded-[18px] border px-4 py-3 text-left transition ${
                      !form.brandId
                        ? "border-[#2e7644] bg-[#f3fbf5] shadow-[0_10px_24px_rgba(46,118,68,0.10)]"
                        : "border-[#dfe8e1] bg-white hover:border-[#a3bcaa]"
                    }`}
                  >
                    <div className="text-[14px] font-bold text-[#173523]">
                      Без бренда
                    </div>
                    <div className="mt-1 text-[12px] text-[#607566]">
                      Товар будет сохранён без привязанного бренда
                    </div>
                  </button>

                  {activeBrands.map((brand) => {
                    const isSelected = form.brandId === String(brand.id);

                    return (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            brandId: String(brand.id),
                          }))
                        }
                        className={`grid gap-3 rounded-[20px] border p-3 text-left transition md:grid-cols-[72px_minmax(0,1fr)_auto] ${
                          isSelected
                            ? "border-[#2e7644] bg-[#f3fbf5] shadow-[0_10px_24px_rgba(46,118,68,0.10)]"
                            : "border-[#dfe8e1] bg-white hover:border-[#a3bcaa]"
                        }`}
                      >
                        <div
                          className="h-[72px] rounded-[16px] bg-[#eef4ef] bg-cover bg-center"
                          style={{
                            backgroundImage: brand.imageUrl
                              ? `url(${baseUrl}${brand.imageUrl})`
                              : undefined,
                          }}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-[15px] font-bold text-[#173523]">
                            {brand.name}
                          </div>
                          <div className="mt-1 text-[12px] text-[#607566]">
                            {brand.slug}
                          </div>
                          <div className="mt-2 line-clamp-2 text-[13px] text-[#6c8170]">
                            {brand.description || "Нет описания"}
                          </div>
                        </div>
                        <div
                          className={`self-center rounded-full px-3 py-1 text-[11px] font-bold ${
                            isSelected
                              ? "bg-[#1f6d39] text-white"
                              : "border border-[#d7e1d9] bg-white text-[#516556]"
                          }`}
                        >
                          {isSelected ? "Выбрано" : "Выбрать"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </details>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-[16px] border border-[#dbe5dd] bg-[#f8fbf9] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      inStock: event.target.checked,
                    }))
                  }
                />
                <span className="text-[14px] font-bold text-[#23402b]">
                  В наличии
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-[16px] border border-[#dbe5dd] bg-[#f8fbf9] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                />
                <span className="text-[14px] font-bold text-[#23402b]">
                  Активен
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-[16px] border border-[#dbe5dd] bg-[#f8fbf9] px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.useDiscount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      useDiscount: event.target.checked,
                    }))
                  }
                />
                <span className="text-[14px] font-bold text-[#23402b]">
                  Скидка
                </span>
              </label>
            </div>

            <div className="grid gap-4">
              <AdminLabel label="Основная категория">
                <AdminSelect
                  value={form.mainCategoryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      mainCategoryId: event.target.value,
                      subACategoryId: "",
                      subBCategoryId: "",
                    }))
                  }
                >
                  <option value="">Выберите основную категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>

              <AdminLabel label="Подкатегория A">
                <AdminSelect
                  value={form.subACategoryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subACategoryId: event.target.value,
                      subBCategoryId: "",
                    }))
                  }
                >
                  <option value="">Необязательно</option>
                  {subAOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>

              <AdminLabel label="Подкатегория B">
                <AdminSelect
                  value={form.subBCategoryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subBCategoryId: event.target.value,
                    }))
                  }
                >
                  <option value="">Необязательно</option>
                  {subBOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>
            </div>

            <AdminLabel label="Описание">
              <AdminTextarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </AdminLabel>

            <AdminLabel label="Изображения">
              <AdminImagePicker
                value={form.imageLines}
                pendingFiles={pendingImages}
                onPendingFilesChange={setPendingImages}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageLines: event,
                  }))
                }
                placeholder="/uploads/item.webp|0"
              />
            </AdminLabel>

            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold text-[#23402b]">
                Характеристики
              </span>
              <div className="grid gap-4 md:grid-cols-2">
                {SPECIFICATION_FIELDS.map((field) => {
                  const fieldState = form.specifications[field.key];

                  return (
                    <div
                      key={field.key}
                      className="rounded-[16px] border border-[#dbe5dd] bg-[#f8fbf9] p-[10px]"
                    >
                      <label className="mb-3 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={fieldState.enabled}
                          onChange={(event) =>
                            updateSpecification(field.key, {
                              enabled: event.target.checked,
                            })
                          }
                        />
                        <span className="text-[14px] font-bold text-[#23402b]">
                          {field.label}
                        </span>
                      </label>

                      <div
                        className={`${
                          !fieldState.enabled ? "opacity-50" : ""
                        } ${
                          shakenFieldKey === field.key
                            ? "border border-red-500"
                            : "border border-transparent"
                        }`}
                        onClick={
                          !fieldState.enabled
                            ? () => {
                                setShakenFieldKey(field.key);
                                setTimeout(() => setShakenFieldKey(null), 500);
                              }
                            : undefined
                        }
                      >
                        {field.inputType === "select" ? (
                          <AdminSelect
                            className="border-0"
                            value={fieldState.value}
                            disabled={!fieldState.enabled}
                            onChange={(event) =>
                              updateSpecification(field.key, {
                                value: event.target.value,
                              })
                            }
                          >
                            <option value="">Выберите</option>
                            {SPECIFICATION_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </AdminSelect>
                        ) : (
                          <AdminInput
                            className="border-0"
                            type={field.inputType}
                            value={fieldState.value}
                            disabled={!fieldState.enabled}
                            onChange={(event) =>
                              updateSpecification(field.key, {
                                value: event.target.value,
                              })
                            }
                          />
                        )}
                        {shakenFieldKey === field.key && (
                          <span className="animate-shake sr-only">error</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[16px] border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#8b3131]">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={submitForm}
              disabled={isPending}
              className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31] disabled:opacity-60"
            >
              {isPending
                ? "Сохранение..."
                : selectedProduct
                  ? "Обновить"
                  : "Создать"}
            </button>

            {selectedProduct ? (
              <button
                type="button"
                onClick={deleteProduct}
                disabled={isPending}
                className="rounded-[16px] border border-[#e6c6c6] bg-[#fff6f6] px-5 py-3 text-[15px] font-bold text-[#9a3939] transition hover:bg-[#fff0f0] disabled:opacity-60"
              >
                Удалить
              </button>
            ) : null}
          </div>
        </AdminSurface>
      </div>
    </>
  );
}
