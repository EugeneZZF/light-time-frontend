"use client";

import { adminRequest, adminUploadFile } from "@/features/admin/api/client";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import { AdminCategory, AdminProduct } from "@/features/admin/model/types";
import {
  findCategoryNameById,
  parseImageLines,
  parseJsonText,
  serializeImages,
  stringifyPretty,
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

type ProductFormState = {
  description: string;
  imageLines: string;
  inStock: boolean;
  isActive: boolean;
  mainCategoryId: string;
  newPrice: string;
  price: string;
  sku: string;
  slug: string;
  specificationsText: string;
  subACategoryId: string;
  subBCategoryId: string;
  title: string;
  useDiscount: boolean;
};

const emptyForm: ProductFormState = {
  description: "",
  imageLines: "",
  inStock: true,
  isActive: true,
  mainCategoryId: "",
  newPrice: "",
  price: "",
  sku: "",
  slug: "",
  specificationsText: "{}",
  subACategoryId: "",
  subBCategoryId: "",
  title: "",
  useDiscount: false,
};

export default function ProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [error, setError] = useState("");
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

  async function loadData() {
    const [productsResult, categoriesResult] = await Promise.all([
      adminRequest<AdminProduct[]>("products"),
      adminRequest<AdminCategory[]>("categories/tree"),
    ]);

    setProducts(productsResult);
    setCategories(categoriesResult);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          adminRequest<AdminProduct[]>("products"),
          adminRequest<AdminCategory[]>("categories/tree"),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsResult);
        setCategories(categoriesResult);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load products.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetForm() {
    setSelectedProduct(null);
    setForm(emptyForm);
    setPendingImages([]);
    setError("");
  }

  function startEdit(product: AdminProduct) {
    setSelectedProduct(product);
    setForm({
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
      specificationsText: stringifyPretty(product.specifications),
      subACategoryId: product.categories.subA?.id
        ? String(product.categories.subA.id)
        : "",
      subBCategoryId: product.categories.subB?.id
        ? String(product.categories.subB.id)
        : "",
      title: product.title,
      useDiscount: product.discount.hasDiscount,
    });
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
        const specifications = parseJsonText<Record<string, unknown>>(
          form.specificationsText,
          {},
        );
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
              ? { id: mainCategoryRef.id, name: mainCategoryRef.name }
              : null,
            subA: subACategoryRef
              ? { id: subACategoryRef.id, name: subACategoryRef.name }
              : null,
            subB: subBCategoryRef
              ? { id: subBCategoryRef.id, name: subBCategoryRef.name }
              : null,
          },
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
            : "Failed to save product.",
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
            : "Failed to delete product.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Create catalog products, control category placement, pricing, stock and specifications from one editing panel."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            New product
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
                onClick={() => {
                  startEdit(product);
                  console.log(product, baseUrl);
                }}
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
                      {product.isActive ? "ACTIVE" : "HIDDEN"}
                    </div>
                  </div>
                  <div className="mt-1 text-[13px] text-[#607566]">
                    {product.sku || "No SKU"} • {product.slug}
                  </div>
                  <div className="mt-2 text-[14px] text-[#506657]">
                    {product.price} ₽
                    {product.discount.hasDiscount && product.discount.new_price
                      ? ` -> ${product.discount.new_price} ₽`
                      : ""}
                  </div>
                  <div className="mt-2 text-[13px] text-[#6c8170]">
                    {product.categories.main?.name ?? "No main category"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedProduct ? "Edit product" : "Create product"}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <AdminLabel label="Title">
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
              <AdminLabel label="Price">
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

              <AdminLabel label="Discount price">
                <AdminInput
                  value={form.newPrice}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      newPrice: event.target.value,
                    }))
                  }
                  placeholder="Optional"
                />
              </AdminLabel>
            </div>

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
                  In stock
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
                  Active
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
                  Discount
                </span>
              </label>
            </div>

            <div className="grid gap-4">
              <AdminLabel label="Main category">
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
                  <option value="">Select main category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>

              <AdminLabel label="Subcategory A">
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
                  <option value="">Optional</option>
                  {subAOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>

              <AdminLabel label="Subcategory B">
                <AdminSelect
                  value={form.subBCategoryId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subBCategoryId: event.target.value,
                    }))
                  }
                >
                  <option value="">Optional</option>
                  {subBOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </AdminSelect>
              </AdminLabel>
            </div>

            <AdminLabel label="Description">
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

            <AdminLabel label="Images">
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

            <AdminLabel label="Specifications JSON">
              <AdminTextarea
                value={form.specificationsText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    specificationsText: event.target.value,
                  }))
                }
                className="min-h-[180px] font-mono text-[13px]"
              />
            </AdminLabel>
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
              {isPending ? "Saving..." : selectedProduct ? "Update" : "Create"}
            </button>

            {selectedProduct ? (
              <button
                type="button"
                onClick={deleteProduct}
                disabled={isPending}
                className="rounded-[16px] border border-[#e6c6c6] bg-[#fff6f6] px-5 py-3 text-[15px] font-bold text-[#9a3939] transition hover:bg-[#fff0f0] disabled:opacity-60"
              >
                Delete
              </button>
            ) : null}
          </div>
        </AdminSurface>
      </div>
    </>
  );
}
