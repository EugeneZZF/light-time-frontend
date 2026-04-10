import { getBrandBySlug } from "@/entities/brand";
import { getProductsByQuery } from "@/entities/product/api/getProductQuery";
import { CatalogProductContainer } from "@/widgets/catalogProductContainer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

function getBrandImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${baseUrl}${imageUrl}`;
}

type BrandPageProps = {
  params: Promise<{
    brandSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  return {
    title: brand ? `${brand.name} | Light time` : "Каталог светильников",
    description: brand?.description ?? "Каталог светильников",
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandSlug } = await params;
  const [brand, products] = await Promise.all([
    getBrandBySlug(brandSlug),
    getProductsByQuery({ brandSlug }),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div>
      <div className="w-full text-[15px] pb-[40px] ml-[20px]">
        {brand.imageUrl ? (
          <img
            src={getBrandImageUrl(brand.imageUrl)}
            alt={brand.name}
            className="h-auto float-left w-[205px] pr-[20px]"
          />
        ) : null}
        {brand.description ? (
          <p className="mt-6 leading-[1.6] text-[#5f5f5f]">
            {brand.description}
          </p>
        ) : null}
      </div>
      <div className="mt-10">
        <CatalogProductContainer products={products} />
      </div>
    </div>
  );
}
