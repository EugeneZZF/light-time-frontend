"use client";

import { baseUrl } from "@/entities/category/api/getCategoryes";
import { adminRequest, adminUploadFile } from "@/features/admin/api/client";
import {
  flattenCategoryTree,
  formatAdminDate,
  parseImageLines,
} from "@/features/admin/lib/utils";
import { AdminCategory } from "@/features/admin/model/types";
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

type CategoryFormState = {
  description: string;
  imageLines: string;
  isActive: boolean;
  name: string;
  parentId: string;
  slug: string;
  sortOrder: string;
};

const emptyForm: CategoryFormState = {
  description: "",
  imageLines: "",
  isActive: true,
  name: "",
  parentId: "",
  slug: "",
  sortOrder: "0",
};

function CategoryTree({
  items,
  onEdit,
}: {
  items: AdminCategory[];
  onEdit: (item: AdminCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-[22px] border border-[#dfe8e1] bg-[#f9fcfa] p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-4">
              <div
                className="h-[72px] w-[72px] shrink-0 rounded-[18px] border border-[#dbe6dd] bg-[#eef4ef] bg-cover bg-center"
                style={{
                  backgroundImage: item.imageUrl
                    ? `url(${baseUrl}${item.imageUrl})`
                    : undefined,
                }}
              />
              <div>
                <div className="text-[18px] font-bold text-[#173523]">
                  {item.name}
                </div>
                <div className="mt-1 text-[13px] text-[#607566]">
                  {item.slug} • сортировка {item.sortOrder} •{" "}
                  {item.isActive ? "активна" : "скрыта"}
                </div>
                {item.description ? (
                  <div className="mt-2 max-w-[780px] text-[14px] leading-[1.5] text-[#506657]">
                    {item.description}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-[14px] border border-[#cfddd2] bg-white px-4 py-2 text-[14px] font-bold text-[#1a3a27] transition hover:border-[#8eb39a] hover:bg-[#f4faf5]"
            >
              Редактировать
            </button>
          </div>

          {(item.subcategoriesA ?? []).length > 0 ? (
            <div className="mt-4 border-l border-[#dbe7df] pl-4">
              <CategoryTree items={item.subcategoriesA ?? []} onEdit={onEdit} />
            </div>
          ) : null}

          {(item.subcategoriesB ?? []).length > 0 ? (
            <div className="mt-4 border-l border-[#dbe7df] pl-4">
              <CategoryTree items={item.subcategoriesB ?? []} onEdit={onEdit} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(
    null,
  );
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const flatCategories = useMemo(
    () => flattenCategoryTree(categories),
    [categories],
  );

  async function loadCategories() {
    const result = await adminRequest<AdminCategory[]>("categories/tree");
    setCategories(result);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const result = await adminRequest<AdminCategory[]>("categories/tree");

        if (!isMounted) {
          return;
        }

        setCategories(result);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить категории.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetForm() {
    setSelectedCategory(null);
    setForm(emptyForm);
    setPendingImages([]);
    setError("");
  }

  function startEdit(category: AdminCategory) {
    setSelectedCategory(category);
    setForm({
      description: category.description ?? "",
      imageLines: category.imageUrl ? `${category.imageUrl}|0` : "",
      isActive: category.isActive,
      name: category.name,
      parentId: category.parentId ? String(category.parentId) : "",
      slug: category.slug,
      sortOrder: String(category.sortOrder ?? 0),
    });
    setPendingImages([]);
    setError("");
  }

  function submitForm() {
    startTransition(async () => {
      try {
        setError("");

        const uploadedImage = pendingImages[0]
          ? await adminUploadFile(pendingImages[0])
          : null;
        const existingImageUrl = parseImageLines(form.imageLines)[0]?.url ?? null;

        const body = {
          name: form.name,
          slug: form.slug,
          imageUrl: uploadedImage?.url ?? existingImageUrl,
          description: form.description || null,
          parentId: form.parentId ? Number(form.parentId) : null,
          sortOrder: Number(form.sortOrder || 0),
          isActive: form.isActive,
        };

        if (selectedCategory) {
          await adminRequest(`categories/${selectedCategory.id}`, {
            method: "PATCH",
            body,
          });
        } else if (body.parentId) {
          await adminRequest(`categories/${body.parentId}/subcategories`, {
            method: "POST",
            body,
          });
        } else {
          await adminRequest("categories", {
            method: "POST",
            body,
          });
        }

        await loadCategories();
        resetForm();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Не удалось сохранить категорию.",
        );
      }
    });
  }

  function deleteCategory() {
    if (!selectedCategory) {
      return;
    }

    startTransition(async () => {
      try {
        setError("");
        await adminRequest(`categories/${selectedCategory.id}`, {
          method: "DELETE",
        });
        await loadCategories();
        resetForm();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Не удалось удалить категорию.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Категории"
        description="Просматривайте полное дерево категорий, создавайте новые ветки и управляйте сортировкой и видимостью на каждом уровне."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            Новая категория
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <AdminSurface>
          {categories.length === 0 ? (
            <div className="text-[15px] text-[#617765]">Категорий пока нет.</div>
          ) : (
            <CategoryTree items={categories} onEdit={startEdit} />
          )}
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedCategory
              ? "Редактировать категорию"
              : "Создать категорию"}
          </div>
          <div className="mt-2 text-[14px] text-[#647a68]">
            {selectedCategory
              ? `Последнее обновление ${formatAdminDate(selectedCategory.updatedAt)}`
              : "Выберите родительскую категорию, чтобы создать вложенный уровень."}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <AdminLabel label="Название">
              <AdminInput
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Трековые системы"
              />
            </AdminLabel>

            <AdminLabel label="Slug">
              <AdminInput
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({ ...current, slug: event.target.value }))
                }
                placeholder="track-systems"
              />
            </AdminLabel>

            <AdminLabel label="Родительская категория">
              <AdminSelect
                value={form.parentId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    parentId: event.target.value,
                  }))
                }
              >
                <option value="">Корневая категория</option>
                {flatCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {"-- ".repeat(item.level)}
                    {item.name}
                  </option>
                ))}
              </AdminSelect>
            </AdminLabel>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminLabel label="Порядок сортировки">
                <AdminInput
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sortOrder: event.target.value,
                    }))
                  }
                />
              </AdminLabel>

              <label className="flex items-end gap-3 rounded-[16px] border border-[#dbe5dd] bg-[#f8fbf9] px-4 py-3">
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
                  Активная категория
                </span>
              </label>
            </div>

            <AdminLabel label="Изображение">
              <AdminImagePicker
                value={form.imageLines}
                pendingFiles={pendingImages}
                onPendingFilesChange={(files) => setPendingImages(files.slice(-1))}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    imageLines: value,
                  }))
                }
                placeholder="/uploads/category.webp|0"
              />
            </AdminLabel>

            <AdminLabel label="Описание">
              <AdminTextarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Краткое описание категории"
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
              {isPending
                ? "Сохранение..."
                : selectedCategory
                  ? "Обновить"
                  : "Создать"}
            </button>

            {selectedCategory ? (
              <button
                type="button"
                onClick={deleteCategory}
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
