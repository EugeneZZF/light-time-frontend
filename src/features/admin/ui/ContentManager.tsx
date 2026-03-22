"use client";

import { adminRequest } from "@/features/admin/api/client";
import { AdminNewsItem, AdminPageItem } from "@/features/admin/model/types";
import { formatAdminDate } from "@/features/admin/lib/utils";
import { useEffect, useState, useTransition } from "react";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormPrimitives";
import AdminPageHeader from "./AdminPageHeader";
import AdminSurface from "./AdminSurface";

type ContentItem = AdminNewsItem | AdminPageItem;

type ContentManagerProps = {
  description: string;
  includePublishedAt?: boolean;
  resourcePath: "news" | "pages";
  title: string;
};

type ContentFormState = {
  content: string;
  publishedAt: string;
  slug: string;
  status: string;
  title: string;
};

const emptyForm: ContentFormState = {
  content: "",
  publishedAt: "",
  slug: "",
  status: "DRAFT",
  title: "",
};

export default function ContentManager({
  description,
  includePublishedAt = false,
  resourcePath,
  title,
}: ContentManagerProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [form, setForm] = useState<ContentFormState>(emptyForm);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function loadItems() {
    const result = await adminRequest<ContentItem[]>(resourcePath);
    setItems(result);
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const result = await adminRequest<ContentItem[]>(resourcePath);

        if (!isMounted) {
          return;
        }

        setItems(result);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : `Failed to load ${resourcePath}.`,
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [resourcePath]);

  function resetForm() {
    setSelectedItem(null);
    setForm(emptyForm);
    setError("");
  }

  function startEdit(item: ContentItem) {
    setSelectedItem(item);
    setForm({
      content: item.content,
      publishedAt:
        "publishedAt" in item && item.publishedAt ? item.publishedAt.slice(0, 16) : "",
      slug: item.slug,
      status: item.status,
      title: item.title,
    });
  }

  function submitForm() {
    startTransition(async () => {
      try {
        const body = {
          slug: form.slug,
          title: form.title,
          content: form.content,
          status: form.status,
          ...(includePublishedAt
            ? {
                publishedAt: form.publishedAt
                  ? new Date(form.publishedAt).toISOString()
                  : null,
              }
            : {}),
        };

        if (selectedItem) {
          await adminRequest(`${resourcePath}/${selectedItem.id}`, {
            method: "PATCH",
            body,
          });
        } else {
          await adminRequest(resourcePath, {
            method: "POST",
            body,
          });
        }

        await loadItems();
        resetForm();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : `Failed to save ${resourcePath}.`,
        );
      }
    });
  }

  function deleteItem() {
    if (!selectedItem) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`${resourcePath}/${selectedItem.id}`, {
          method: "DELETE",
        });
        await loadItems();
        resetForm();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : `Failed to delete ${resourcePath}.`,
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            New entry
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <AdminSurface>
          <div className="grid gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-[20px] border border-[#dfe8e1] bg-[#f9fcfa] p-4 text-left transition hover:border-[#a3bcaa]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-bold text-[#173523]">
                    {item.title}
                  </div>
                  <div className="rounded-full border border-[#d7e1d9] bg-white px-3 py-1 text-[11px] font-bold text-[#516556]">
                    {item.status}
                  </div>
                </div>
                <div className="mt-1 text-[13px] text-[#607566]">{item.slug}</div>
                <div className="mt-2 line-clamp-3 text-[14px] leading-[1.5] text-[#506657]">
                  {item.content}
                </div>
                <div className="mt-3 text-[12px] text-[#7b8e7f]">
                  Updated {formatAdminDate(item.updatedAt)}
                </div>
              </button>
            ))}
          </div>
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedItem ? "Edit entry" : "Create entry"}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <AdminLabel label="Title">
              <AdminInput
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </AdminLabel>

            <AdminLabel label="Slug">
              <AdminInput
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({ ...current, slug: event.target.value }))
                }
              />
            </AdminLabel>

            <AdminLabel label="Status">
              <AdminSelect
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </AdminSelect>
            </AdminLabel>

            {includePublishedAt ? (
              <AdminLabel label="Published at">
                <AdminInput
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      publishedAt: event.target.value,
                    }))
                  }
                />
              </AdminLabel>
            ) : null}

            <AdminLabel label="Content">
              <AdminTextarea
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({ ...current, content: event.target.value }))
                }
                className="min-h-[240px]"
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
              {isPending ? "Saving..." : selectedItem ? "Update" : "Create"}
            </button>

            {selectedItem ? (
              <button
                type="button"
                onClick={deleteItem}
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
