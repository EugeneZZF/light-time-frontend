"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { adminRequest } from "@/features/admin/api/client";
import { baseUrl } from "@/entities/category/api/getCategoryes";
import { formatAdminDate } from "@/features/admin/lib/utils";
import { AdminOrder, AdminProduct } from "@/features/admin/model/types";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "./AdminFormPrimitives";
import AdminPageHeader from "./AdminPageHeader";
import AdminSurface from "./AdminSurface";
import Link from "next/link";

const ORDER_STATUS_OPTIONS = [
  { value: "NEW", label: "Новый" },
  { value: "IN_WORK", label: "В работе" },
  { value: "COMPLETED", label: "Завершен" },
  { value: "CANCELLED", label: "Отменен" },
] as const;

type OrderFormState = {
  comment: string;
  customer: string;
  email: string;
  phone: string;
  status: string;
};

const emptyForm: OrderFormState = {
  comment: "",
  customer: "",
  email: "",
  phone: "",
  status: "NEW",
};

function formatMoney(value: string) {
  const numericValue = Number(
    value
      .replace(/\s+/g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.]/g, ""),
  );

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return numericValue.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getStatusLabel(status: string) {
  return (
    ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [form, setForm] = useState<OrderFormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        const leftTime = left.createdAt
          ? new Date(left.createdAt).getTime()
          : 0;
        const rightTime = right.createdAt
          ? new Date(right.createdAt).getTime()
          : 0;

        return rightTime - leftTime;
      }),
    [orders],
  );

  const productsById = useMemo(
    () => new Map(products.map((product) => [Number(product.id), product])),
    [products],
  );

  async function loadOrders() {
    const result = await adminRequest<AdminOrder[]>("orders");
    setOrders(result);
    return result;
  }

  async function loadOrderById(orderId: number) {
    const result = await adminRequest<AdminOrder>(`orders/${orderId}`);
    setSelectedOrderId(orderId);
    setSelectedOrder(result);
    setForm({
      comment: result.comment ?? "",
      customer: result.customer ?? "",
      email: result.email ?? "",
      phone: result.phone ?? "",
      status: result.status ?? "NEW",
    });
    setError("");
    setSuccess("");
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const [ordersResult, productsResult] = await Promise.all([
          adminRequest<AdminOrder[]>("orders"),
          adminRequest<AdminProduct[]>("products"),
        ]);

        if (!isMounted) {
          return;
        }

        const nextOrders = [...ordersResult].sort((left, right) => {
          const leftTime = left.createdAt
            ? new Date(left.createdAt).getTime()
            : 0;
          const rightTime = right.createdAt
            ? new Date(right.createdAt).getTime()
            : 0;

          return rightTime - leftTime;
        });

        setProducts(productsResult);
        setOrders(nextOrders);

        if (nextOrders[0]?.id) {
          const order = await adminRequest<AdminOrder>(
            `orders/${nextOrders[0].id}`,
          );

          if (!isMounted) {
            return;
          }

          setSelectedOrderId(order.id);
          setSelectedOrder(order);
          setForm({
            comment: order.comment ?? "",
            customer: order.customer ?? "",
            email: order.email ?? "",
            phone: order.phone ?? "",
            status: order.status ?? "NEW",
          });
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить заказы.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function submitForm() {
    if (!selectedOrderId) {
      return;
    }

    startTransition(async () => {
      try {
        setError("");
        setSuccess("");

        await adminRequest(`orders/${selectedOrderId}`, {
          method: "PATCH",
          body: {
            status: form.status,
            customer: form.customer,
            phone: form.phone,
            email: form.email,
            comment: form.comment || null,
          },
        });

        const refreshedOrders = await loadOrders();
        const nextSelectedOrder =
          refreshedOrders.find((order) => order.id === selectedOrderId) ?? null;

        if (nextSelectedOrder) {
          await loadOrderById(nextSelectedOrder.id);
        }

        setSuccess("Заказ обновлен.");
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Не удалось обновить заказ.",
        );
      }
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Заказы"
        description="Просматривайте новые заказы, проверяйте состав, контакты клиента и меняйте статус обработки в одной панели."
        action={
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                try {
                  setError("");
                  setSuccess("");
                  const result = await loadOrders();
                  const productsResult =
                    await adminRequest<AdminProduct[]>("products");
                  setProducts(productsResult);

                  if (selectedOrderId) {
                    const exists = result.some(
                      (order) => order.id === selectedOrderId,
                    );

                    if (exists) {
                      await loadOrderById(selectedOrderId);
                    }
                  }
                } catch (refreshError) {
                  setError(
                    refreshError instanceof Error
                      ? refreshError.message
                      : "Не удалось обновить список заказов.",
                  );
                }
              });
            }}
            className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31]"
          >
            Обновить список
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_460px]">
        <AdminSurface>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-[22px] font-bold text-[#173523]">
              Список заказов
            </div>
            <div className="rounded-full border border-[#d7e1d9] bg-[#f8fbf9] px-3 py-1 text-[12px] font-bold text-[#516556]">
              {sortedOrders.length} шт.
            </div>
          </div>

          {sortedOrders.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
              Заказов пока нет.
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedOrders.map((order) => {
                const isActive = order.id === selectedOrderId;

                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await loadOrderById(order.id);
                        } catch (selectError) {
                          setError(
                            selectError instanceof Error
                              ? selectError.message
                              : "Не удалось загрузить заказ.",
                          );
                        }
                      });
                    }}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      isActive
                        ? "border-[#2e7644] bg-[#f3fbf5] shadow-[0_10px_24px_rgba(46,118,68,0.10)]"
                        : "border-[#dfe8e1] bg-[#f9fcfa] hover:border-[#a3bcaa]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-[18px] font-bold text-[#173523]">
                          {order.orderNumber}
                        </div>
                        <div className="mt-1 text-[13px] text-[#607566]">
                          {order.customer || "Без имени"} •{" "}
                          {order.phone || "Без телефона"}
                        </div>
                      </div>

                      <div className="rounded-full border border-[#d7e1d9] bg-white px-3 py-1 text-[11px] font-bold text-[#516556]">
                        {getStatusLabel(order.status)}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#607566]">
                      <span>Сумма: {formatMoney(order.total)} ₽</span>
                      <span>Позиций: {order.items.length}</span>
                      <span>Создан: {formatAdminDate(order.createdAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </AdminSurface>

        <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedOrder
              ? `Заказ ${selectedOrder.orderNumber}`
              : "Детали заказа"}
          </div>

          {!selectedOrder ? (
            <div className="mt-5 rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
              Выберите заказ слева, чтобы посмотреть состав и изменить его
              статус.
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Создан
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#173523]">
                      {formatAdminDate(selectedOrder.createdAt)}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Сумма заказа
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#173523]">
                      {formatMoney(selectedOrder.total)} ₽
                    </div>
                  </div>
                </div>

                <AdminLabel label="Статус">
                  <AdminSelect
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    {!ORDER_STATUS_OPTIONS.some(
                      (option) => option.value === form.status,
                    ) ? (
                      <option value={form.status}>{form.status}</option>
                    ) : null}
                  </AdminSelect>
                </AdminLabel>

                <AdminLabel label="ФИО">
                  <AdminInput
                    value={form.customer}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        customer: event.target.value,
                      }))
                    }
                  />
                </AdminLabel>

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminLabel label="Телефон">
                    <AdminInput
                      value={form.phone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                    />
                  </AdminLabel>

                  <AdminLabel label="Email">
                    <AdminInput
                      value={form.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </AdminLabel>
                </div>

                <AdminLabel label="Комментарий">
                  <AdminTextarea
                    value={form.comment}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        comment: event.target.value,
                      }))
                    }
                    rows={5}
                  />
                </AdminLabel>

                <div className="rounded-[20px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                  <div className="text-[16px] font-bold text-[#173523]">
                    Состав заказа
                  </div>

                  <div className="mt-4 grid gap-3">
                    {selectedOrder.items.map((item) =>
                      (() => {
                        const product = productsById.get(item.productId);
                        const imageUrl = product?.img[0]?.url
                          ? `${baseUrl}${product.img[0].url}`
                          : null;

                        return (
                          <Link
                            href={`/product/${product?.slug}`}
                            key={item.id}
                            className="rounded-[5px] border border-[#e3ece5] bg-white px-3 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#eef4ef]">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={product?.title ?? item.productName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="text-[10px] text-[#7b8f7f]">
                                    Нет фото
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[14px] font-bold text-[#173523]">
                                  {product?.title ?? item.productName}
                                </div>
                                <div className="mt-1 text-[12px] text-[#607566]">
                                  ID: {item.productId}
                                  {product?.sku ? ` • SKU: ${product.sku}` : ""}
                                </div>
                              </div>

                              <div className="shrink-0 text-right text-[12px] text-[#516556]">
                                <div className="font-bold text-[#173523]">
                                  {formatMoney(item.price)} ₽
                                </div>
                                <div className="mt-1">x {item.quantity}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })(),
                    )}
                  </div>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-[16px] border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#8b3131]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="mt-4 rounded-[16px] border border-[#cce4d3] bg-[#f3fbf5] px-4 py-3 text-[14px] text-[#25603a]">
                  {success}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={isPending}
                  className="rounded-[16px] bg-[#173523] px-5 py-3 text-[15px] font-bold text-white transition hover:bg-[#214a31] disabled:opacity-60"
                >
                  {isPending ? "Сохранение..." : "Обновить заказ"}
                </button>
              </div>
            </>
          )}
        </AdminSurface>
      </div>
    </>
  );
}
