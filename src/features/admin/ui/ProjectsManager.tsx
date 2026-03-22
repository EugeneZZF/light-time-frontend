"use client";

import { adminRequest, adminUploadFile } from "@/features/admin/api/client";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import { AdminProduct, AdminProject } from "@/features/admin/model/types";
import {
  parseProjectEquipmentLines,
  parseProjectImages,
  serializeProjectEquipment,
  serializeProjectImages,
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

type ProjectFormState = {
  content: string;
  equipmentLines: string;
  imageLines: string;
  slug: string;
  status: string;
  title: string;
};

const emptyForm: ProjectFormState = {
  content: "",
  equipmentLines: "",
  imageLines: "",
  slug: "",
  status: "DRAFT",
  title: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(
    null,
  );
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(
    [],
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedEquipmentProducts = useMemo(
    () =>
      selectedEquipmentIds
        .map((productId) =>
          products.find((product) => product.id === productId),
        )
        .filter((product): product is AdminProduct => Boolean(product)),
    [products, selectedEquipmentIds],
  );

  function buildProductLink(slug: string) {
    return `/product/${slug}`;
  }

  function buildEquipmentFromProducts(selectedProducts: AdminProduct[]) {
    return selectedProducts.map((product, index) => ({
      name: product.title,
      description: product.description || null,
      imageUrl: product.img[0]?.url ?? null,
      productUrl: buildProductLink(product.slug),
      price:
        product.discount.hasDiscount && product.discount.new_price
          ? product.discount.new_price
          : product.price,
      sortOrder: index,
    }));
  }

  function mapEquipmentToSelectedProducts(project: AdminProject) {
    const matchedIds: string[] = [];
    const unmatchedEquipment = project.equipment.filter((item) => {
      const product = products.find((candidate) => {
        const productLink = buildProductLink(candidate.slug);

        return (
          item.productUrl === productLink ||
          item.productUrl?.endsWith(productLink) ||
          (item.name === candidate.title &&
            item.imageUrl === (candidate.img[0]?.url ?? null))
        );
      });

      if (!product) {
        return true;
      }

      matchedIds.push(product.id);
      return false;
    });

    return {
      matchedIds,
      unmatchedEquipment,
    };
  }

  async function loadData() {
    const [projectsResult, productsResult] = await Promise.all([
      adminRequest<AdminProject[]>("projects"),
      adminRequest<AdminProduct[]>("products"),
    ]);

    setProjects(projectsResult);
    setProducts(productsResult);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const [projectsResult, productsResult] = await Promise.all([
          adminRequest<AdminProject[]>("projects"),
          adminRequest<AdminProduct[]>("products"),
        ]);

        if (!isMounted) {
          return;
        }

        setProjects(projectsResult);
        setProducts(productsResult);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load projects.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function resetForm() {
    setSelectedProject(null);
    setForm(emptyForm);
    setPendingImages([]);
    setSelectedEquipmentIds([]);
    setError("");
  }

  function startEdit(project: AdminProject) {
    const { matchedIds, unmatchedEquipment } =
      mapEquipmentToSelectedProducts(project);

    setSelectedProject(project);
    setForm({
      content: project.content,
      equipmentLines: serializeProjectEquipment(unmatchedEquipment),
      imageLines: serializeProjectImages(project.images),
      slug: project.slug,
      status: project.status,
      title: project.title,
    });
    setPendingImages([]);
    setSelectedEquipmentIds(matchedIds);
  }

  function toggleEquipmentProduct(productId: string) {
    setSelectedEquipmentIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function submitForm() {
    startTransition(async () => {
      try {
        const existingImages = parseProjectImages(form.imageLines);
        const uploadedImages = await Promise.all(
          pendingImages.map((file) => adminUploadFile(file)),
        );
        const manualEquipment = parseProjectEquipmentLines(form.equipmentLines);
        const productEquipment = buildEquipmentFromProducts(
          selectedEquipmentProducts,
        );
        const body = {
          slug: form.slug,
          title: form.title,
          content: form.content,
          status: form.status,
          images: [
            ...existingImages,
            ...uploadedImages.map((image, index) => ({
              url: image.url,
              sortOrder: existingImages.length + index,
            })),
          ],
          equipment: [
            ...productEquipment,
            ...manualEquipment.map((item, index) => ({
              ...item,
              sortOrder: productEquipment.length + index,
            })),
          ],
        };

        if (selectedProject) {
          await adminRequest(`projects/${selectedProject.id}`, {
            method: "PATCH",
            body,
          });
        } else {
          await adminRequest("projects", {
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
            : "Failed to save project.",
        );
      }
    });
  }

  function deleteProject() {
    if (!selectedProject) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`projects/${selectedProject.id}`, {
          method: "DELETE",
        });
        await loadData();
        resetForm();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete project.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Manage portfolio entries, attach image URLs, and build project equipment from ready catalog products."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            New project
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_440px]">
        <AdminSurface>
          <div className="grid gap-4">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  startEdit(project);
                  console.log(project);
                }}
                className="rounded-[22px] border border-[#dfe8e1] bg-[#f9fcfa] p-4 text-left transition hover:border-[#a3bcaa]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-bold text-[#173523]">
                    {project.title}
                  </div>
                  <div className="rounded-full border border-[#d7e1d9] bg-white px-3 py-1 text-[11px] font-bold text-[#516556]">
                    {project.status}
                  </div>
                </div>
                <div className="mt-1 text-[13px] text-[#607566]">
                  {project.slug}
                </div>
                <div className="mt-2 line-clamp-3 text-[14px] leading-[1.5] text-[#506657]">
                  {project.content}
                </div>
                <div className="mt-3 text-[12px] text-[#7b8e7f]">
                  {project.images.length} images • {project.equipment.length}{" "}
                  equipment entries
                </div>
              </button>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedProject ? "Edit project" : "Create project"}
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

              <AdminLabel label="Status">
                <AdminSelect
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </AdminSelect>
              </AdminLabel>
            </div>

            <AdminLabel label="Content">
              <AdminTextarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                className="min-h-[180px]"
              />
            </AdminLabel>

            <AdminLabel label="Images">
              <AdminImagePicker
                value={form.imageLines}
                pendingFiles={pendingImages}
                onPendingFilesChange={setPendingImages}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    imageLines: value,
                  }))
                }
                placeholder="/uploads/project.webp|0"
              />
            </AdminLabel>

            <AdminLabel label="Selected equipment">
              <div className="grid gap-3">
                {selectedEquipmentProducts.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedEquipmentProducts.map((product) => (
                      <div
                        key={`selected-${product.id}`}
                        className="grid gap-3 rounded-[20px] border border-[#cfe0d3] bg-[#f6fbf7] p-3 md:grid-cols-[68px_minmax(0,1fr)]"
                      >
                        <div
                          className="h-[68px] rounded-[16px] bg-[#e8f0ea] bg-cover bg-center"
                          style={{
                            backgroundImage: product.img[0]?.url
                              ? `url(${baseUrl}${product.img[0].url})`
                              : undefined,
                          }}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-bold text-[#173523]">
                            {product.title}
                          </div>
                          <div className="mt-1 text-[12px] text-[#607566]">
                            {product.sku || "No SKU"} • {product.slug}
                          </div>
                          <div className="mt-2 text-[13px] text-[#36533e]">
                            {product.discount.hasDiscount &&
                            product.discount.new_price
                              ? product.discount.new_price
                              : product.price}{" "}
                            ₽
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleEquipmentProduct(product.id)}
                            className="mt-3 rounded-[12px] border border-[#e5c7c7] bg-white px-3 py-2 text-[12px] font-bold text-[#933d3d] transition hover:bg-[#fff5f5]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
                    No products selected for equipment yet.
                  </div>
                )}
              </div>
            </AdminLabel>

            <AdminLabel label="Choose products for equipment">
              <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1">
                {products.map((product) => {
                  const isSelected = selectedEquipmentIds.includes(product.id);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleEquipmentProduct(product.id)}
                      className={`grid gap-3 rounded-[20px] border p-3 text-left transition md:grid-cols-[72px_minmax(0,1fr)_auto] ${
                        isSelected
                          ? "border-[#2e7644] bg-[#f3fbf5] shadow-[0_10px_24px_rgba(46,118,68,0.10)]"
                          : "border-[#dfe8e1] bg-[#f9fcfa] hover:border-[#a3bcaa]"
                      }`}
                    >
                      <div
                        className="h-[72px] rounded-[16px] bg-[#eef4ef] bg-cover bg-center"
                        style={{
                          backgroundImage: product.img[0]?.url
                            ? `url(${baseUrl}${product.img[0].url})`
                            : undefined,
                        }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-bold text-[#173523]">
                          {product.title}
                        </div>
                        <div className="mt-1 text-[12px] text-[#607566]">
                          {product.sku || "No SKU"} • {product.slug}
                        </div>
                        <div className="mt-2 text-[13px] text-[#36533e]">
                          {product.discount.hasDiscount &&
                          product.discount.new_price
                            ? product.discount.new_price
                            : product.price}{" "}
                          ₽
                        </div>
                      </div>
                      <div
                        className={`self-center rounded-full px-3 py-1 text-[11px] font-bold ${
                          isSelected
                            ? "bg-[#1f6d39] text-white"
                            : "border border-[#d7e1d9] bg-white text-[#516556]"
                        }`}
                      >
                        {isSelected ? "Selected" : "Add"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </AdminLabel>

            {/* <AdminLabel label="Manual equipment lines">
              <AdminTextarea
                value={form.equipmentLines}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    equipmentLines: event.target.value,
                  }))
                }
                className="min-h-[140px]"
                placeholder="Optional fallback: Name|149.19|https://example.com|/uploads/equipment.webp|Short description"
              />
            </AdminLabel> */}
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
              {isPending ? "Saving..." : selectedProject ? "Update" : "Create"}
            </button>

            {selectedProject ? (
              <button
                type="button"
                onClick={deleteProject}
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
