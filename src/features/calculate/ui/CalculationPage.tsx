"use client";

import { LUX_STANDARDS } from "@/entities/calculate/model/constants";
import {
  CeilingType,
  FixtureType,
  FloorType,
  LightingStandard,
  RoomType,
  WallType,
} from "@/entities/calculate/model/types";
import { Category } from "@/entities/category/model/types";
import { Product } from "@/entities/product/model/types";
import { calculateLighting } from "@/features/calculate/model/calculateLighting";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type FixtureOption = {
  label: string;
  productType: string;
  value: FixtureType;
};

type RoomOption = {
  label: string;
  value: RoomType;
};

type CalculationPageProps = {
  categories: Category[];
  products: Product[];
};

const STANDARD_OPTIONS: Array<{
  description?: string;
  label: string;
  value: LightingStandard;
}> = [
  {
    value: "SNIP",
    label: "Российские",
    description: "(СНиП 23-05-95)",
  },
  {
    value: "EU",
    label: "Общеевропейские",
  },
];

const FIXTURE_OPTIONS: FixtureOption[] = [
  {
    value: "recessed",
    label: "Встраиваемые светильники",
    productType: "Recessed luminaires",
  },
  {
    value: "track",
    label: "Трековые светильники",
    productType: "Track luminaires",
  },
  {
    value: "modular",
    label: "Модульные светильники",
    productType: "Modular luminaires",
  },
  {
    value: "wall_ceiling",
    label: "Настенно-потолочные светильники",
    productType: "Wall-ceiling luminaires",
  },
  {
    value: "linear",
    label: "Люминесцентные светильники линейные",
    productType: "Linear fluorescent luminaires",
  },
  {
    value: "suspended",
    label: "Подвесные светильники",
    productType: "Suspended luminaires",
  },
  {
    value: "linear_led",
    label: "Светодиодные светильники линейные",
    productType: "Linear LED luminaires",
  },
  {
    value: "information_display",
    label: "Информационные табло",
    productType: "Information displays",
  },
];

const ROOM_OPTIONS: RoomOption[] = [
  { value: "work_office", label: "Рабочий кабинет" },
  { value: "office", label: "Офис" },
  { value: "computer_room", label: "Помещения для работы с компьютерами" },
  { value: "classroom", label: "Учебные аудитории и классы" },
  { value: "bank_operating_room", label: "Операционный зал банка" },
  { value: "reading_room", label: "Читальный зал" },
  { value: "design_office", label: "Проектные и конструкторские бюро" },
  { value: "conference_room", label: "Конференц-залы и залы заседаний" },
  { value: "exhibition_hall", label: "Выставочный зал" },
  { value: "retail_sales_area", label: "Торговый зал магазина" },
  { value: "dining_room", label: "Обеденные залы и буфеты" },
  { value: "doctor_office", label: "Кабинет врача" },
  { value: "garage", label: "Гараж" },
  { value: "warehouse_receiving", label: "Склад (зона приёма)" },
  { value: "warehouse_storage", label: "Склад (зона хранения)" },
  { value: "lobby", label: "Вестибюль" },
  { value: "corridor", label: "Коридор" },
  { value: "stairs", label: "Лестницы" },
  { value: "attic", label: "Чердак" },
];

function readNumericSpecification(product: Product, key: string) {
  const value = product.specifications[key];

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readStringSpecification(product: Product, key: string) {
  const value = product.specifications[key];
  return typeof value === "string" ? value : null;
}

function getProductType(product: Product) {
  const value = product.specifications.type;
  return typeof value === "string" ? value : "";
}

function getFixtureTypeFromProduct(product: Product | null): FixtureType | null {
  if (!product) {
    return null;
  }

  const productType = getProductType(product);

  return (
    FIXTURE_OPTIONS.find((option) => option.productType === productType)?.value ??
    null
  );
}

function hasLuminousSpecification(product: Product) {
  return readNumericSpecification(product, "luminous") !== null;
}

function getChildCategories(category: Category): Category[] {
  return [
    ...(category.subcategoriesA ?? []),
    ...(category.SubcategoriesA ?? []),
    ...(category.subcategoriesB ?? []),
    ...(category.SubcategoriesB ?? []),
  ];
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(getChildCategories(category)),
  ]);
}

function buildCategoryBranchSlugs(
  category: Category,
  accumulator: Set<string> = new Set(),
): Set<string> {
  accumulator.add(category.slug);

  for (const childCategory of getChildCategories(category)) {
    buildCategoryBranchSlugs(childCategory, accumulator);
  }

  return accumulator;
}

function productBelongsToCategoryBranch(
  product: Product,
  categoryBranchSlugs: Set<string>,
) {
  return [product.categories.main, product.categories.subA, product.categories.subB]
    .filter(
      (
        category,
      ): category is NonNullable<
        Product["categories"]["main"] | Product["categories"]["subA"] | Product["categories"]["subB"]
      > => Boolean(category),
    )
    .some((category) => categoryBranchSlugs.has(category.slug));
}

function getProductImageUrl(product: Product) {
  const imagePath = product.img[0]?.url;

  if (!imagePath) {
    return null;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${apiUrl}${imagePath}`;
}

function formatResultText(count: number, totalLumens: number, area: number) {
  return `Нужно светильников: ${count} шт. Общий световой поток: ${Math.round(
    totalLumens,
  )} лм. Площадь: ${area.toFixed(1)} м².`;
}

const inputClassName =
  "h-[46px] border border-[#d0d0d0] bg-[linear-gradient(to_bottom,#ffffff,#f4f4f4)] px-[12px] text-[14px] text-black shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] outline-none focus:shadow-[inset_0_2px_3px_rgba(0,0,0,0.3),0_1px_20px_rgba(255,242,0,0.5)]";

const selectClassName =
  "h-[46px] border border-[#d5d5d5] bg-[linear-gradient(to_bottom,#ffffff,#f4f4f4)] px-[12px] text-[14px] text-black outline-none";

const unitInputClassName =
  "h-[46px] w-[90px] border border-[#d0d0d0] bg-[linear-gradient(to_bottom,#ffffff,#f4f4f4)] px-[10px] text-[14px] text-black shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] outline-none focus:shadow-[inset_0_2px_3px_rgba(0,0,0,0.3),0_1px_20px_rgba(255,242,0,0.5)]";

export default function CalculationPage({
  categories,
  products,
}: CalculationPageProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [standard, setStandard] = useState<LightingStandard>("EU");
  const [roomType, setRoomType] = useState<RoomType>("work_office");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [workSurfaceHeight, setWorkSurfaceHeight] = useState("0");
  const [ceiling, setCeiling] = useState<CeilingType>("white");
  const [walls, setWalls] = useState<WallType>("light");
  const [floor, setFloor] = useState<FloorType>("dark");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isSubmittingExactCalculation, setIsSubmittingExactCalculation] =
    useState(false);
  const [exactCalculationError, setExactCalculationError] =
    useState<ReactNode | null>(null);
  const [exactCalculationSuccess, setExactCalculationSuccess] = useState<
    string | null
  >(null);
  const [resultText, setResultText] = useState(
    "Осталось указать габариты помещения.",
  );
  const [calculationResult, setCalculationResult] = useState<{
    area: number;
    count: number;
  } | null>(null);

  const categoryOptions = useMemo(
    () =>
      flattenCategories(categories).filter(
        (category, index, allCategories) =>
          category.isActive &&
          allCategories.findIndex((item) => item.slug === category.slug) === index,
      ),
    [categories],
  );

  const selectedCategory = useMemo(
    () =>
      categoryOptions.find((category) => category.slug === selectedCategorySlug) ??
      null,
    [categoryOptions, selectedCategorySlug],
  );

  const categoryBranchSlugs = useMemo(() => {
    if (!selectedCategory) {
      return null;
    }

    return buildCategoryBranchSlugs(selectedCategory);
  }, [selectedCategory]);

  const fixtureProducts = useMemo(() => {
    if (!categoryBranchSlugs) {
      return [];
    }

    return products
      .filter((product) => product.isActive)
      .filter(hasLuminousSpecification)
      .filter((product) =>
        productBelongsToCategoryBranch(product, categoryBranchSlugs),
      );
  }, [categoryBranchSlugs, products]);

  const selectedProduct =
    fixtureProducts.find((product) => product.id === selectedProductId) ??
    fixtureProducts[0] ??
    null;
  const selectedFixtureType = getFixtureTypeFromProduct(selectedProduct);
  const calculationFixtureType = selectedFixtureType ?? "wall_ceiling";

  const currentLux = LUX_STANDARDS[standard][roomType];
  const selectedRoomLabel =
    ROOM_OPTIONS.find((option) => option.value === roomType)?.label ?? "";
  const lumensPerLamp = selectedProduct
    ? (readNumericSpecification(selectedProduct, "luminous") ?? 0)
    : 0;
  const baseType = selectedProduct
    ? readStringSpecification(selectedProduct, "baseType")
    : null;
  const productImageUrl = selectedProduct
    ? getProductImageUrl(selectedProduct)
    : null;
  const numericLength = Number(length.replace(",", "."));
  const numericWidth = Number(width.replace(",", "."));
  const numericHeight = Number(height.replace(",", "."));
  const numericWorkSurfaceHeight = Number(workSurfaceHeight.replace(",", "."));
  const isCalculateReady =
    Boolean(selectedProduct && lumensPerLamp > 0) &&
    Number.isFinite(numericLength) &&
    Number.isFinite(numericWidth) &&
    Number.isFinite(numericHeight) &&
    numericLength > 0 &&
    numericWidth > 0 &&
    numericHeight > 0;
  const isPhoneReady = phone.trim().length > 0;
  const calculateButtonClassName = `h-[47px] w-[163px] rounded-[3px] border text-[18px] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.14)] ${
    isCalculateReady
      ? "border-[#ffb63e] bg-[linear-gradient(#ffd046_0%,_#ff9836_100%)] text-black"
      : "border-[#f2c06f] bg-[linear-gradient(to_bottom,#ffd98d,#ffc86a)] text-[#7d5d22]"
  }`;
  const exactCalculationButtonClassName = `mt-[14px] min-h-[38px] w-full rounded-[3px] border px-[10px] py-[6px] text-center text-[13px] font-bold leading-[1.1] shadow-[0_1px_3px_rgba(0,0,0,0.14)] disabled:cursor-not-allowed disabled:opacity-60 ${
    isPhoneReady
      ? "border-[#ffb63e] bg-[linear-gradient(#ffd046_0%,_#ff9836_100%)] text-black"
      : "border-[#f2c06f] bg-[linear-gradient(to_bottom,#ffd98d,#ffc86a)] text-[#7d5d22]"
  }`;

  function handleFixtureTypeChange(value: string) {
    if (!value) {
      setSelectedCategorySlug("");
      setSelectedProductId("");
      return;
    }

    const nextCategory = categoryOptions.find(
      (category) => category.slug === value,
    );

    const nextProducts = nextCategory
      ? products
          .filter((product) => product.isActive)
          .filter(hasLuminousSpecification)
          .filter((product) =>
            productBelongsToCategoryBranch(
              product,
              buildCategoryBranchSlugs(nextCategory),
            ),
          )
      : [];

    setSelectedCategorySlug(value);
    setSelectedProductId(nextProducts[0]?.id ?? "");
  }

  function handleCalculate() {
    if (
      !selectedProduct ||
      !Number.isFinite(numericLength) ||
      !Number.isFinite(numericWidth) ||
      !Number.isFinite(numericHeight) ||
      numericLength <= 0 ||
      numericWidth <= 0 ||
      numericHeight <= 0
    ) {
      setResultText("Осталось указать габариты помещения.");
      setCalculationResult(null);
      return;
    }

    if (lumensPerLamp <= 0) {
      setResultText("У выбранной модели не указан световой поток.");
      setCalculationResult(null);
      return;
    }

    const result = calculateLighting({
      standard,
      roomType,
      length: numericLength,
      width: numericWidth,
      height: numericHeight,
      workSurfaceHeight: Number.isFinite(numericWorkSurfaceHeight)
        ? numericWorkSurfaceHeight
        : 0,
      fixtureType: calculationFixtureType,
      lumensPerLamp,
      ceiling,
      walls,
      floor,
    });

    setResultText(
      formatResultText(result.count, result.totalLumens, result.area),
    );
    setCalculationResult({
      area: result.area,
      count: result.count,
    });
  }

  async function handleSubmitExactCalculation() {
    if (!phone.trim()) {
      setExactCalculationError("Укажите телефон.");
      setExactCalculationSuccess(null);
      return;
    }

    if (!agreed) {
      setExactCalculationError(
        <>
          Подтвердите согласие с условиями{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0a7fe8] underline z-30"
          >
            пользовательского соглашения
          </a>
          .
        </>,
      );
      setExactCalculationSuccess(null);
      return;
    }

    try {
      setIsSubmittingExactCalculation(true);
      setExactCalculationError(null);
      setExactCalculationSuccess(null);

      const payload = {
        phone: phone.trim(),
        description: [
          "Заявка на точный расчет освещения",
          `Стандарт: ${standard}`,
          `Тип помещения: ${selectedRoomLabel}`,
          `Категория: ${selectedCategory?.name ?? "-"}`,
          `Модель: ${selectedProduct?.title ?? "-"}`,
          `Длина: ${length || "-"}`,
          `Ширина: ${width || "-"}`,
          `Высота: ${height || "-"}`,
          `Высота рабочей поверхности: ${workSurfaceHeight || "-"}`,
          `Потолок: ${ceiling}`,
          `Стены: ${walls}`,
          `Пол: ${floor}`,
          calculationResult
            ? `Расчетное количество светильников: ${calculationResult.count}`
            : null,
          calculationResult
            ? `Расчетная площадь: ${calculationResult.area.toFixed(1)} м2`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/leads/orderCalculation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setExactCalculationSuccess(
        "Заявка отправлена. Мы свяжемся с вами для точного расчета.",
      );
      setExactCalculationError(null);
      setPhone("");
    } catch {
      setExactCalculationError(
        "Не удалось отправить заявку. Попробуйте еще раз.",
      );
      setExactCalculationSuccess(null);
    } finally {
      setIsSubmittingExactCalculation(false);
    }
  }

  return (
    <section className="bg-white px-[14px] pb-[40px] pt-[6px]">
      <div className="mx-auto max-w-[1054px]">
        <h1 className="text-[27px] font-bold leading-none text-[#009c3b]">
          Расчёт освещения
        </h1>

        <div className="mt-[44px] grid gap-x-[38px] gap-y-[30px] lg:grid-cols-[278px_450px_236px]">
          <div>
            <h2 className="text-[22px] font-bold leading-none text-[#009c3b]">
              1. Выберите светильник
            </h2>

            <div className="mt-[34px]">
              <div className="text-[16px] font-bold leading-none text-black">
                Тип
              </div>
              <select
                value={selectedCategorySlug}
                onChange={(event) =>
                  handleFixtureTypeChange(event.target.value)
                }
                className={`${selectClassName} mt-[14px] w-full`}
              >
                <option value="">Выберите</option>
                {categoryOptions.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-[30px]">
              <div className="text-[16px] font-bold leading-none text-black">
                Модель
              </div>
              <select
                value={selectedProduct?.id ?? ""}
                onChange={(event) => setSelectedProductId(event.target.value)}
                className={`${selectClassName} mt-[14px] w-full`}
              >
                {fixtureProducts.length > 0 ? (
                  fixtureProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))
                ) : (
                  <option value="">Выберите тип светильника</option>
                )}
              </select>
            </div>

            <div className="mt-[50px]">
              <div className="flex h-[142px] w-[142px] items-center justify-center border border-[#d5d5d5] bg-white">
                {productImageUrl ? (
                  <Image
                    src={productImageUrl}
                    alt={selectedProduct?.title ?? "Светильник"}
                    width={122}
                    height={122}
                    className="h-[122px] w-[122px] object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="px-[12px] text-center text-[12px] text-[#808080]">
                    Нет изображения
                  </span>
                )}
              </div>

              <div className="mt-[18px] text-[16px] leading-[1.45] text-black">
                {selectedProduct?.brand ? (
                  <div className="flex items-end">
                    <span>Производитель</span>
                    <span className="mx-[4px] flex-1 border-b border-dotted border-[#888]" />
                    <span>{selectedProduct?.brand?.name ?? "null"}</span>
                  </div>
                ) : null}
                <div className="flex items-end">
                  <span>Световой поток, Лм</span>
                  <span className="mx-[4px] flex-1 border-b border-dotted border-[#888]" />
                  <span>{lumensPerLamp || "0"}</span>
                </div>
                {baseType ? (
                  <div className="flex items-end">
                    <span>Цоколь</span>
                    <span className="mx-[4px] flex-1 border-b border-dotted border-[#888]" />
                    <span>{baseType}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[22px] font-bold leading-none text-[#009c3b]">
              2. Опишите помещение
            </h2>

            <div className="mt-[34px]">
              <div className="text-[16px] font-bold leading-none text-black">
                Нормы освещения
              </div>
              <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
                {STANDARD_OPTIONS.map((option) => {
                  const isActive = option.value === standard;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStandard(option.value)}
                      className={`h-[29px] rounded-[4px] px-[10px] text-[14px] leading-none ${
                        isActive
                          ? "bg-[#dddddd] font-bold text-[#444]"
                          : "bg-transparent text-[#0a7fe8]"
                      }`}
                    >
                      {option.label}
                      {option.description ? ` ${option.description}` : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-[30px]">
              <div className="text-[16px] font-bold leading-none text-black">
                Тип помещения
              </div>
              <div className="mt-[14px] grid grid-cols-[1fr_89px] gap-[5px]">
                <select
                  value={roomType}
                  onChange={(event) =>
                    setRoomType(event.target.value as RoomType)
                  }
                  className={selectClassName}
                >
                  {ROOM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex h-[46px] items-center justify-center border border-[#d9d9d9] bg-[#f8f8f8] text-[16px] text-[#9b9b9b] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                  {currentLux} лк
                </div>
              </div>
              <p className="mt-[7px] text-[13px] italic leading-[1.2] text-[#6e6e6e]">
                Справа — норма освещения для выбранного типа
              </p>
            </div>

            <div className="mt-[34px] grid grid-cols-3 gap-x-[34px]">
              <label>
                <div className="text-[18px] font-bold leading-none text-black">
                  Длина
                </div>
                <div className="mt-[14px] flex items-center gap-[6px]">
                  <input
                    value={length}
                    onChange={(event) => setLength(event.target.value)}
                    className={unitInputClassName}
                    inputMode="decimal"
                  />
                  <span className="text-[17px] text-black">м</span>
                </div>
              </label>

              <label>
                <div className="text-[18px] font-bold leading-none text-black">
                  Ширина
                </div>
                <div className="mt-[14px] flex items-center gap-[6px]">
                  <input
                    value={width}
                    onChange={(event) => setWidth(event.target.value)}
                    className={unitInputClassName}
                    inputMode="decimal"
                  />
                  <span className="text-[17px] text-black">м</span>
                </div>
              </label>

              <label>
                <div className="text-[18px] font-bold leading-none text-black">
                  Высота
                </div>
                <div className="mt-[14px] flex items-center gap-[6px]">
                  <input
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    className={unitInputClassName}
                    inputMode="decimal"
                  />
                  <span className="text-[17px] text-black">м</span>
                </div>
              </label>
            </div>

            <div className="mt-[28px] w-[190px]">
              <div className="text-[18px] font-bold leading-[1.1] text-black">
                Высота рабочей поверхности
              </div>
              <div className="mt-[14px] flex items-center gap-[6px]">
                <input
                  value={workSurfaceHeight}
                  onChange={(event) => setWorkSurfaceHeight(event.target.value)}
                  className={`${unitInputClassName} text-right`}
                  inputMode="decimal"
                />
                <span className="text-[17px] text-black">м</span>
              </div>
              <p className="mt-[12px] text-[13px] italic leading-[1.15] text-[#6e6e6e]">
                В офисе — это высота рабочих столов, в цеху — верстаков, и т. д.
                Для пустых помещений, типа вестибюля, оставьте ноль.
              </p>
            </div>

            <div className="mt-[28px]">
              <div className="text-[18px] font-bold leading-none text-black">
                Отделка
              </div>

              <div className="mt-[14px] grid grid-cols-3 gap-x-[34px]">
                <label>
                  <div className="text-[18px] font-bold leading-none text-black">
                    Потолок
                  </div>
                  <select
                    value={ceiling}
                    onChange={(event) =>
                      setCeiling(event.target.value as CeilingType)
                    }
                    className={`${selectClassName} mt-[14px] w-[98px]`}
                  >
                    <option value="white">Белый</option>
                    <option value="light">Светлый</option>
                    <option value="dark">Тёмный</option>
                  </select>
                </label>

                <label>
                  <div className="text-[18px] font-bold leading-none text-black">
                    Стены
                  </div>
                  <select
                    value={walls}
                    onChange={(event) =>
                      setWalls(event.target.value as WallType)
                    }
                    className={`${selectClassName} mt-[14px] w-[98px]`}
                  >
                    <option value="light">Светлые</option>
                    <option value="dark">Тёмные</option>
                  </select>
                </label>

                <label>
                  <div className="text-[18px] font-bold leading-none text-black">
                    Пол
                  </div>
                  <select
                    value={floor}
                    onChange={(event) =>
                      setFloor(event.target.value as FloorType)
                    }
                    className={`${selectClassName} mt-[14px] w-[90px]`}
                  >
                    <option value="dark">Тёмный</option>
                    <option value="black">Чёрный</option>
                  </select>
                </label>
              </div>

              <p className="mt-[10px] max-w-[420px] text-[13px] italic leading-[1.15] text-[#6e6e6e]">
                Важен оттенок, а не сам цвет. Например, небо светло-синее, а
                вода тёмно-синяя.
              </p>
            </div>

            <div className="mt-[28px] border-t border-[#d0d0d0] pt-[22px]">
              <button
                type="button"
                onClick={handleCalculate}
                className={calculateButtonClassName}
              >
                Рассчитать
              </button>

              {calculationResult ? (
                <div className="mt-[18px] h-auto w-full max-w-[468px] bg-[#fefed5] px-[20px] py-[15px] text-[18px] leading-[1.35] text-black">
                  На <span className="font-bold">{selectedRoomLabel}</span>{" "}
                  площадью{" "}
                  <span className="font-bold">
                    {calculationResult.area.toFixed(1)} м2
                  </span>{" "}
                  вам потребуется{" "}
                  <span className="font-bold">{calculationResult.count}</span>{" "}
                  светильников{" "}
                  <span className="font-bold">
                    {selectedProduct?.title ?? ""}
                  </span>
                </div>
              ) : (
                <p className="mt-[18px] text-[16px] leading-[1.15] text-black">
                  {resultText.includes("Осталось") ? "Осталось " : ""}
                  {resultText.includes("Осталось") ? (
                    <span className="text-black">
                      <span className="text-[#0a7fe8] underline">
                        указать габариты помещения.
                      </span>
                    </span>
                  ) : (
                    resultText
                  )}
                </p>
              )}
            </div>
          </div>

          <aside className="h-fit w-full border border-[#e2e2e2] bg-white px-[20px] pb-[18px] pt-[16px] shadow-[0_3px_12px_rgba(0,0,0,0.12)]">
            <p className="text-[14px] leading-[1.05] text-black">
              Это примерный расчёт,
              {/* <br /> */}
              чтобы узнать точное
              {/* <br /> */}
              количество светильников
              {/* <br /> */}и необходимый расходный
              {/* <br /> */}
              материал,
              {/* <br /> */}
              <span className="text-[#0a7fe8] underline">
                оставьте свой телефон
              </span>
              .
            </p>

            <p className="mt-[18px] text-[14px] leading-[1.1] text-black">
              Продавец проведёт точный
              <br />
              расчёт и свяжется с вами.
            </p>

            <div className="mt-[24px] text-[14px] font-bold leading-none text-black">
              Телефон
            </div>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={`${inputClassName} mt-[8px] h-[34px] w-full px-[10px]`}
            />

            <div className="mt-[12px] text-[15px] italic text-[#5f5f5f]">
              +7 098 123-45-67
            </div>

            <label className="mt-[16px] flex items-start gap-[8px] text-[14px] leading-[1.1] text-black">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-[2px] h-[13px] w-[13px] accent-[#a146c8]"
              />
              <span>
                Подтверждаю согласие с
                <br />
                условиями
                <br />
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="text-[#0a7fe8] underline"
                >
                  пользовательского
                  <br />
                  соглашения
                </a>
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmitExactCalculation}
              disabled={!isPhoneReady || isSubmittingExactCalculation}
              className={exactCalculationButtonClassName}
            >
              заказать точный расчёт
            </button>
            {exactCalculationError ? (
              <p className="mt-[10px] text-[13px] leading-[1.2] text-[#b43434]">
                {exactCalculationError}
              </p>
            ) : null}
            {exactCalculationSuccess ? (
              <p className="mt-[10px] text-[13px] leading-[1.2] text-[#1e7a32]">
                {exactCalculationSuccess}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
