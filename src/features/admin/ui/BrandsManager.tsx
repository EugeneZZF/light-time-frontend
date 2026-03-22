"use client";

import { adminRequest, adminUploadFile } from "@/features/admin/api/client";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import { parseImageLines } from "@/features/admin/lib/utils";
import { AdminBrand } from "@/features/admin/model/types";
import { formatAdminDate } from "@/features/admin/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { AdminInput, AdminLabel, AdminTextarea } from "./AdminFormPrimitives";
import AdminImagePicker from "./AdminImagePicker";
import AdminPageHeader from "./AdminPageHeader";
import AdminSurface from "./AdminSurface";

type BrandFormState = {
  description: string;
  imageLines: string;
  name: string;
  slug: string;
};

const emptyForm: BrandFormState = {
  description: "",
  imageLines: "",
  name: "",
  slug: "",
};

export default function BrandsManager() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [form, setForm] = useState<BrandFormState>(emptyForm);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function loadBrands() {
    const result = await adminRequest<AdminBrand[]>("brands");
    setBrands(result);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const result = await adminRequest<AdminBrand[]>("brands");

        if (!isMounted) {
          return;
        }

        setBrands(result);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : "Failed to load brands.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetForm() {
    setSelectedBrand(null);
    setForm(emptyForm);
    setPendingImages([]);
    setError("");
  }

  function startEdit(brand: AdminBrand) {
    setSelectedBrand(brand);
    setForm({
      description: brand.description ?? "",
      imageLines: brand.imageUrl ? `${brand.imageUrl}|0` : "",
      name: brand.name,
      slug: brand.slug,
    });
    setPendingImages([]);
  }

  function submitForm() {
    startTransition(async () => {
      try {
        const uploadedImage = pendingImages[0]
          ? await adminUploadFile(pendingImages[0])
          : null;
        const existingImageUrl = parseImageLines(form.imageLines)[0]?.url ?? null;
        const body = {
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          imageUrl: uploadedImage?.url ?? existingImageUrl,
        };

        if (selectedBrand) {
          await adminRequest(`brands/${selectedBrand.id}`, {
            method: "PATCH",
            body,
          });
        } else {
          await adminRequest("brands", {
            method: "POST",
            body,
          });
        }

        await loadBrands();
        resetForm();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to save brand.",
        );
      }
    });
  }

  function deleteBrand() {
    if (!selectedBrand) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`brands/${selectedBrand.id}`, { method: "DELETE" });
        await loadBrands();
        resetForm();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete brand.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Brands"
        description="Manage the brand directory used across the catalog and keep slugs or descriptions in sync."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            New brand
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <AdminSurface>
          <div className="grid gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => startEdit(brand)}
                className="grid gap-4 rounded-[20px] border border-[#dfe8e1] bg-[#f9fcfa] p-4 text-left transition hover:border-[#a3bcaa] md:grid-cols-[84px_minmax(0,1fr)]"
              >
                <div
                  className="h-[84px] rounded-[18px] border border-[#dbe6dd] bg-[#eef4ef] bg-cover bg-center"
                  style={{
                    backgroundImage: brand.imageUrl
                      ? `url(${baseUrl}${brand.imageUrl})`
                      : undefined,
                  }}
                />
                <div>
                  <div className="text-[18px] font-bold text-[#173523]">
                    {brand.name}
                  </div>
                  <div className="mt-1 text-[13px] text-[#607566]">
                    {brand.slug}
                  </div>
                  {brand.description ? (
                    <div className="mt-2 text-[14px] text-[#506657]">
                      {brand.description}
                    </div>
                  ) : null}
                  <div className="mt-3 text-[12px] text-[#7b8e7f]">
                    Updated {formatAdminDate(brand.updatedAt)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedBrand ? "Edit brand" : "Create brand"}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <AdminLabel label="Name">
              <AdminInput
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Nordic Aluminium"
              />
            </AdminLabel>

            <AdminLabel label="Slug">
              <AdminInput
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({ ...current, slug: event.target.value }))
                }
                placeholder="nordic-aluminium"
              />
            </AdminLabel>

            <AdminLabel label="Description">
              <AdminTextarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Short brand description"
              />
            </AdminLabel>

            <AdminLabel label="Image">
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
                placeholder="/uploads/brand.webp|0"
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
              {isPending ? "Saving..." : selectedBrand ? "Update" : "Create"}
            </button>

            {selectedBrand ? (
              <button
                type="button"
                onClick={deleteBrand}
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
