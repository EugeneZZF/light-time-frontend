import { getProductsByQuery } from "@/entities/product/api/getProductQuery";
import ShortCardProduct from "@/entities/product/ui/ShortCardProduct";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const products = query ? await getProductsByQuery({ q: query }) : [];

  return (
    <section className="pb-[40px] pr-[20px]">
      <div className="ml-[20px]">
        <p className="mt-[10px] text-[15px] text-[#4f4f4f]">
          {query
            ? `Результаты по запросу: "${query}"`
            : "Введите запрос в строке поиска."}
        </p>
      </div>

      {query ? (
        products.length > 0 ? (
          <div className="ml-[20px] mt-[24px] grid grid-cols-3 gap-[18px]">
            {products.map((product) => (
              <ShortCardProduct key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="ml-[20px] mt-[24px] rounded-[18px] border border-dashed border-[#cfd8cf] bg-[#fafcfb] px-[18px] py-[16px] text-[14px] text-[#667566]">
            По вашему запросу ничего не найдено.
          </div>
        )
      ) : (
        <div className="ml-[20px] mt-[24px] rounded-[18px] border border-dashed border-[#cfd8cf] bg-[#fafcfb] px-[18px] py-[16px] text-[14px] text-[#667566]">
          Укажите название или артикул товара.
        </div>
      )}
    </section>
  );
}
