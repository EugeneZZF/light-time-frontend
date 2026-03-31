"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { adminRequest } from "@/features/admin/api/client";
import { formatAdminDate } from "@/features/admin/lib/utils";
import { AdminOrderCalculation } from "@/features/admin/model/types";
import AdminPageHeader from "./AdminPageHeader";
import AdminSurface from "./AdminSurface";

const CALCULATION_STATUS_OPTIONS = [
  { value: "NEW", label: "Новый" },
  { value: "IN_PROGRESS", label: "В процессе" },
  { value: "SENT", label: "Отправлен" },
  { value: "COMPLETED", label: "Завершен" },
  { value: "CANCELLED", label: "Отменен" },
] as const;

function getStatusLabel(status: string) {
  return (
    CALCULATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export default function OrderCalculationsManager() {
  const [calculations, setCalculations] = useState<AdminOrderCalculation[]>([]);
  const [selectedCalculationId, setSelectedCalculationId] = useState<
    number | null
  >(null);
  const [selectedCalculation, setSelectedCalculation] =
    useState<AdminOrderCalculation | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const sortedCalculations = useMemo(
    () =>
      [...calculations].sort((left, right) => {
        const leftTime = left.createdAt
          ? new Date(left.createdAt).getTime()
          : 0;
        const rightTime = right.createdAt
          ? new Date(right.createdAt).getTime()
          : 0;

        return rightTime - leftTime;
      }),
    [calculations],
  );

  async function loadCalculations() {
    const result =
      await adminRequest<AdminOrderCalculation[]>("orderCalculation");
    setCalculations(result);
    return result;
  }

  async function loadCalculationById(calculationId: number) {
    const result = await adminRequest<AdminOrderCalculation>(
      `orderCalculation/${calculationId}`,
    );
    setSelectedCalculationId(calculationId);
    setSelectedCalculation(result);
    setError("");
    setSuccess("");
  }

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const result = await loadCalculations();

        if (!isMounted) {
          return;
        }

        if (result[0]?.id) {
          await loadCalculationById(result[0].id);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить расчёты.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Расчёты"
        description="Просматривайте заказы расчётов от клиентов, контактные данные и предполагаемую стоимость в одной панели."
        action={
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                try {
                  setError("");
                  setSuccess("");
                  const result = await loadCalculations();

                  if (selectedCalculationId) {
                    const exists = result.some(
                      (calc) => calc.id === selectedCalculationId,
                    );

                    if (exists) {
                      await loadCalculationById(selectedCalculationId);
                    }
                  }
                } catch (refreshError) {
                  setError(
                    refreshError instanceof Error
                      ? refreshError.message
                      : "Не удалось обновить список расчётов.",
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
              Список расчётов
            </div>
            <div className="rounded-full border border-[#d7e1d9] bg-[#f8fbf9] px-3 py-1 text-[12px] font-bold text-[#516556]">
              {sortedCalculations.length} шт.
            </div>
          </div>

          {sortedCalculations.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
              Расчётов пока нет.
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedCalculations.map((calculation) => {
                const isActive = calculation.id === selectedCalculationId;

                return (
                  <button
                    key={calculation.id}
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await loadCalculationById(calculation.id);
                        } catch (selectError) {
                          setError(
                            selectError instanceof Error
                              ? selectError.message
                              : "Не удалось загрузить расчёт.",
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
                          {calculation.customerName || "Без имени"}
                        </div>
                        <div className="mt-1 text-[13px] text-[#607566]">
                          {calculation.email || "Без email"} •{" "}
                          {calculation.phone || "Без телефона"}
                        </div>
                      </div>

                      <div className="rounded-full border border-[#d7e1d9] bg-white px-3 py-1 text-[11px] font-bold text-[#516556]">
                        {getStatusLabel(calculation.status)}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#607566]">
                      {calculation.estimatedPrice && (
                        <span>Смета: {calculation.estimatedPrice} ₽</span>
                      )}
                      <span>
                        Создан: {formatAdminDate(calculation.createdAt)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </AdminSurface>

        {/* <AdminSurface>
          <div className="text-[22px] font-bold text-[#173523]">
            {selectedCalculation
              ? `Расчёт от ${selectedCalculation.customerName}`
              : "Детали расчёта"}
          </div>

          {!selectedCalculation ? (
            <div className="mt-5 rounded-[18px] border border-dashed border-[#cdd9cf] bg-[#fafcfb] px-4 py-5 text-[14px] text-[#6d8070]">
              Выберите расчёт слева, чтобы посмотреть детали.
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
                      {formatAdminDate(selectedCalculation.createdAt)}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Статус
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#173523]">
                      {getStatusLabel(selectedCalculation.status)}
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                    Имя клиента
                  </div>
                  <div className="mt-2 text-[15px] font-bold text-[#173523]">
                    {selectedCalculation.customerName || "-"}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Email
                    </div>
                    <div className="mt-2 break-all text-[15px] font-bold text-[#173523]">
                      {selectedCalculation.email || "-"}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Телефон
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#173523]">
                      {selectedCalculation.phone || "-"}
                    </div>
                  </div>
                </div>

                {selectedCalculation.estimatedPrice && (
                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Предполагаемая стоимость
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#173523]">
                      {selectedCalculation.estimatedPrice} ₽
                    </div>
                  </div>
                )}

                {selectedCalculation.description && (
                  <div className="rounded-[18px] border border-[#dfe8e1] bg-[#f9fcfa] p-4">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-[#6c8170]">
                      Описание
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-[14px] text-[#173523]">
                      {selectedCalculation.description}
                    </div>
                  </div>
                )}
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
            </>
          )}
        </AdminSurface> */}
      </div>
    </>
  );
}
