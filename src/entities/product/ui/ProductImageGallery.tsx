"use client";

import { useMemo, useState } from "react";

interface ProductImageGalleryProps {
  images: {
    sortOrder: number;
    url: string;
  }[];
  productTitle: string;
}

export default function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const orderedImages = useMemo(
    () => [...images].sort((left, right) => left.sortOrder - right.sortOrder),
    [images],
  );
  const [activeImageUrl, setActiveImageUrl] = useState(
    orderedImages[0]?.url ?? "",
  );

  return (
    <div className="w-[340px] shrink-0">
      <div className="flex h-auto min-h-[336px] w-[336px] items-center justify-center border border-[#d9d9d9] bg-white">
        {activeImageUrl ? (
          <img
            src={activeImageUrl}
            alt={productTitle}
            className="h-auto w-[336px] object-contain"
          />
        ) : (
          <div className="text-[12px] text-[#9a9a9a]">No photo</div>
        )}
      </div>

      {orderedImages.length > 0 ? (
        <div className="mt-[12px] flex flex-wrap gap-[8px]">
          {orderedImages.slice(0, 4).map((image, index) => {
            const isActive = image.url === activeImageUrl;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActiveImageUrl(image.url)}
                className={`flex h-[70px] w-[72px] items-center justify-center border bg-white transition ${
                  isActive
                    ? "border-[#009e39] shadow-[0_0_0_2px_rgba(0,158,57,0.15)]"
                    : "border-[#d9d9d9] hover:border-[#009e39]"
                }`}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={isActive}
              >
                <img
                  src={image.url}
                  alt={`${productTitle} ${index + 1}`}
                  className="h-auto w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
