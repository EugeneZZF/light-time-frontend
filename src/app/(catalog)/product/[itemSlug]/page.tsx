import { notFound } from "next/navigation";
import { getProductBySlug } from "@/entities/product/api/getProductBySlug";
import { getAllProducts } from "@/entities/product/api/getProductQuery";
import { Product } from "@/entities/product/model/types";
import ProductImageGallery from "@/entities/product/ui/ProductImageGallery";
import ProductPurchasePanel from "@/entities/product/ui/ProductPurchasePanel";
import ShortCardProduct from "@/entities/product/ui/ShortCardProduct";

type ItemPageProps = {
  params: Promise<{
    itemSlug: string;
  }>;
};

const SPECIFICATION_LABELS: Record<string, string> = {
  baseType: "Тип цоколя",
  beamAngleDeg: "Угол освещения (°)",
  climateZone: "Климатическая зона",
  color: "Цвет",
  colorRenderingIndexRa: "Индекс цветопередачи (Ra)",
  colorTemperatureK: "Цветовая температура, K",
  current: "Ток",
  size: "Размеры, мм",
  housingColor: "Цвет корпуса",
  housingMaterial: "Материал корпуса",
  ingressProtection: "Класс защиты",
  inputVoltage: "Входное напряжение",
  lightColor: "Цветность",
  lightSourceType: "Тип источника света",
  luminous: "Световой поток, Лм",
  materials: "Материалы",
  operatingTemperatureRange: "Диапазон рабочих температур",
  outputVoltage: "Выходное напряжение",
  packaging: "Упаковка",
  power: "Мощность, Вт",
  productMaterial: "Материал изделия",
  protectionClass: "Степень защиты",
  serviceLifeHours: "Время работы, ч",
  voltageV: "Напряжение, В",
  weightKg: "Вес, кг",
};

function formatPrice(value: string) {
  const numericPrice = Number(
    value
      .replace(/\s+/g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.]/g, ""),
  );

  if (!Number.isFinite(numericPrice)) {
    return value;
  }

  return numericPrice.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getVisiblePrice(
  price: string,
  discountPrice: string | null,
  hasDiscount: boolean,
) {
  if (hasDiscount && discountPrice) {
    return discountPrice;
  }

  return price;
}

function normalizeSpecifications(specifications: Record<string, unknown>) {
  return Object.entries(specifications).filter(([, value]) => {
    if (value === null || value === undefined) {
      return false;
    }

    return String(value).trim().length > 0;
  });
}

function getSpecificationLabel(key: string) {
  return SPECIFICATION_LABELS[key] ?? key;
}

function getRelatedCategoryFilter(product: Product) {
  if (product.categories.subB?.id) {
    return (candidate: Product) =>
      candidate.categories.subB?.id === product.categories.subB?.id;
  }

  if (product.categories.subA?.id) {
    return (candidate: Product) =>
      candidate.categories.subA?.id === product.categories.subA?.id;
  }

  if (product.categories.main?.id) {
    return (candidate: Product) =>
      candidate.categories.main?.id === product.categories.main?.id;
  }

  return () => false;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { itemSlug } = await params;
  const item = await getProductBySlug(itemSlug);

  if (!item) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  // const price = getVisiblePrice(
  //   item.price,
  //   item.discount.new_price,
  //   item.discount.hasDiscount,
  // );
  const specs = normalizeSpecifications(item.specifications);
  const productImages = item.img.map((image) => ({
    sortOrder: image.sortOrder,
    url: `${baseUrl}${image.url}`,
  }));
  const relatedCategoryFilter = getRelatedCategoryFilter(item);
  const relatedProducts = (await getAllProducts())
    .filter((product) => product.slug !== item.slug)
    .filter(relatedCategoryFilter)
    .slice(0, 4);

  return (
    <section className="ml-[20px] pr-[20px] pb-[40px]">
      <div className="flex items-start gap-[38px]">
        <ProductImageGallery
          key={item.slug}
          images={productImages}
          productTitle={item.title}
        />

        <div className="flex-1 pt-[1px]">
          <ProductPurchasePanel
            productSlug={item.slug}
            inStock={item.inStock}
            price={formatPrice(item.price)}
            hasDiscount={item.discount.hasDiscount}
            new_price={
              item.discount.new_price ? formatPrice(item.discount.new_price) : null
            }
          />

          {specs.length > 0 ? (
            <div className="mt-[24px] max-w-[380px]">
              <h2 className="text-[16px] font-bold text-black">
                Характеристики
              </h2>
              <div className="mt-[10px] flex flex-col gap-[10px]">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-end gap-[8px] text-[14px] leading-none text-black"
                  >
                    <span className="whitespace-nowrap text-[#5c5c5c]">
                      {getSpecificationLabel(key)}
                    </span>
                    <span className="mb-[3px] h-px flex-1 border-b border-dotted border-[#bcbcbc]" />
                    <span className="whitespace-nowrap text-[14px] text-[#000000]">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-[28px] max-w-[460px]">
            <h2 className="text-[16px] font-bold text-black">Описание</h2>
            <div className="mt-[10px] whitespace-pre-line text-[14px] leading-[1.15] text-black">
              {item.description || "Описание скоро появится."}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-[34px]">
          <h2 className="text-[24px] ml-[20px] font-bold leading-none text-[#009e39]">
            Обратите внимание
          </h2>
          <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-[18px]">
            {relatedProducts.map((product) => (
              <ShortCardProduct key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-[34px] ml-[20px] max-w-[980px]">
        <h2 className="text-[22px] font-bold leading-none text-[#009e39]">
          Заказ и доставка
        </h2>
        <p className="mt-[18px] text-[15px] leading-[1.2] text-black">
          Цены указанные на сайте действительны при заказе от 5 000 рублей.
          Приносим извинения за возможные неудобства.
        </p>
      </section>
    </section>
  );
}
