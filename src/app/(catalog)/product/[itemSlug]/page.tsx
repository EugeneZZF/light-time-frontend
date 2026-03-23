import { notFound } from "next/navigation";
import { getProductBySlug } from "@/entities/product/api/getProductBySlug";
import ProductPurchasePanel from "@/entities/product/ui/ProductPurchasePanel";

type ItemPageProps = {
  params: Promise<{
    itemSlug: string;
  }>;
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

export default async function ItemPage({ params }: ItemPageProps) {
  const { itemSlug } = await params;
  const item = await getProductBySlug(itemSlug);

  if (!item) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const mainImage = item.img[0]?.url ? `${baseUrl}${item.img[0].url}` : "";
  const price = getVisiblePrice(
    item.price,
    item.discount.new_price,
    item.discount.hasDiscount,
  );
  const specs = normalizeSpecifications(item.specifications);

  return (
    <section className="ml-[20px] pr-[20px] pb-[40px]">
      <div className="flex items-start gap-[38px]">
        <div className="w-[340px] shrink-0">
          <div className="flex h-auto w-[336px] items-center justify-center border border-[#d9d9d9] bg-white">
            {mainImage ? (
              <img
                src={mainImage}
                alt={item.title}
                className="h-auto w-[336px] object-contain"
              />
            ) : (
              <div className="text-[12px] text-[#9a9a9a]">No photo</div>
            )}
          </div>

          {item.img.length > 0 ? (
            <div className="mt-[12px] flex gap-[8px]">
              {item.img.slice(0, 4).map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="flex h-[70px] w-[72px] items-center justify-center border border-[#d9d9d9] bg-white"
                >
                  <img
                    src={`${baseUrl}${image.url}`}
                    alt={`${item.title} ${index + 1}`}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1 pt-[1px]">
          <ProductPurchasePanel
            inStock={item.inStock}
            price={formatPrice(price)}
          />

          {specs.length > 0 ? (
            <div className="mt-[24px] max-w-[380px]">
              <h2 className="text-[18px] font-bold text-black">
                Характеристики
              </h2>
              <div className="mt-[10px] flex flex-col gap-[10px]">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-end gap-[8px] text-[14px] leading-none text-black"
                  >
                    <span className="whitespace-nowrap text-[#5c5c5c]">
                      {key}
                    </span>
                    <span className="mb-[3px] h-px flex-1 border-b border-dotted border-[#bcbcbc]" />
                    <span className="whitespace-nowrap">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-[28px] max-w-[460px]">
            <h2 className="text-[18px] font-bold text-black">Описание</h2>
            <div className="mt-[10px] whitespace-pre-line text-[15px] leading-[1.15] text-black">
              {item.description || "Описание скоро появится."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
