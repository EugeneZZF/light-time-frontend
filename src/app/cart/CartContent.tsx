"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/entities/product/model/types";
import {
  CartItem,
  clearCart,
  getCartItems,
  removeCartItem,
  subscribeToCartUpdates,
} from "@/shared/lib/cart/localStorage";

type CartProduct = {
  product: Product;
  quantity: number;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProductQueryResponse =
  | Product[]
  | {
      items?: Product[];
      products?: Product[];
    };

function extractProducts(data: ProductQueryResponse): Product[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.products)) {
    return data.products;
  }

  return [];
}

function parsePrice(value: string) {
  return Number(
    value
      .replace(/\s+/g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.]/g, ""),
  );
}

function formatPrice(value: string) {
  const numericPrice = parsePrice(value);

  if (!Number.isFinite(numericPrice)) {
    return value;
  }

  return numericPrice.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getVisiblePrice(product: Product) {
  if (product.discount.hasDiscount && product.discount.new_price) {
    return product.discount.new_price;
  }

  return product.price;
}

function getProductImageUrl(product: Product) {
  const imagePath = product.img[0]?.url;

  if (!imagePath) {
    return "";
  }

  return `${baseUrl}${imagePath}`;
}

async function loadProducts(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return [];
  }

  const response = await fetch(`${baseUrl}/api/catalog/products?limit=1000`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: ProductQueryResponse = await response.json();
  const products = extractProducts(data);

  return cartItems
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
      };
    })
    .filter((item): item is CartProduct => item !== null);
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#24421f]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-xl border border-[#d8e3d2] bg-white px-4 text-[15px] text-[#243021] outline-none transition focus:border-[#009e39] focus:ring-2 focus:ring-[#009e39]/15"
      />
    </label>
  );
}

export default function CartContent() {
  const [items, setItems] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderCompleteOpen, setIsOrderCompleteOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncCart = async () => {
      const cartItems = getCartItems();

      if (cartItems.length === 0) {
        if (!isMounted) {
          return;
        }

        setItems([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const nextItems = await loadProducts(cartItems);

        if (!isMounted) {
          return;
        }

        setItems(nextItems);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Не удалось загрузить товары корзины.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void syncCart();

    const unsubscribe = subscribeToCartUpdates(() => {
      void syncCart();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const totalPrice = items.reduce((sum, item) => {
    const price = parsePrice(getVisiblePrice(item.product));

    if (!Number.isFinite(price)) {
      return sum;
    }

    return sum + price * item.quantity;
  }, 0);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      setSubmitError("Корзина пуста.");
      setSubmitSuccess(null);
      return;
    }

    if (!customer.trim() || !email.trim() || !phone.trim()) {
      setSubmitError("Заполните ФИО, Email и телефон.");
      setSubmitSuccess(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const payload = {
        items: items.map(({ product, quantity }) => ({
          productId: /^\d+$/.test(product.id) ? Number(product.id) : product.id,
          quantity,
        })),
        customer: customer.trim(),
        phone: phone.trim(),
        email: email.trim(),
        comment: comment.trim(),
      };

      const response = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      clearCart();
      setItems([]);
      setCustomer("");
      setEmail("");
      setPhone("");
      setComment("");
      setSubmitSuccess("Заказ оформлен. Мы с Вами свяжемся в ближайшее время.");
      setIsOrderCompleteOpen(true);
    } catch {
      setSubmitError("Не удалось отправить заказ. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="rounded-2xl border border-[#e3eadf] bg-white px-8 py-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-lg text-[#4f5f4c]">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-3xl font-bold text-[#1f2e1d]">Корзина</h1>
        <p className="text-[#5d6d59]">{error}</p>
      </div>
    );
  }

  if (items.length === 0 && !isOrderCompleteOpen) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center gap-5 px-5 text-center">
        <div className="rounded-[28px] border border-[#e0eadb] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9f2_100%)] px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-3xl font-bold text-[#1f2e1d]">Корзина пуста</h1>
          <p className="mt-3 max-w-[420px] text-[16px] leading-6 text-[#5c6a59]">
            Добавьте товары из каталога, и здесь появится список выбранных
            позиций для оформления заказа.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#009234] px-6 text-sm font-semibold text-white transition hover:bg-[#007d2c]"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {isOrderCompleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
          <div className="w-full max-w-[460px] rounded-[28px] bg-white p-8 text-center shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef8e8] text-[30px] text-[#009234]">
              ✓
            </div>
            <h2 className="mt-5 text-[30px] font-bold text-[#1f2e1d]">
              Заказ оформлен
            </h2>
            <p className="mt-3 text-[16px] leading-6 text-[#5d6d59]">
              Мы с Вами свяжемся в ближайшее время
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOrderCompleteOpen(false);
                setSubmitSuccess(null);
              }}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#009234] px-6 text-sm font-semibold text-white transition hover:bg-[#007d2c]"
            >
              Понятно
            </button>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-[1180px] px-5 py-10">
        <div className="rounded-[5px] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.08)] md:p-8">
          <div className="flex flex-col gap-4 border-b border-[#dfe8d9] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#6d8168]">
                Ваш заказ
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#1d2b1b] md:text-[40px]">
                Корзина
              </h1>
              <p className="mt-3 text-[15px] leading-6 text-[#596957]">
                {totalItemsCount} шт. на сумму{" "}
                <span className="font-semibold text-[#009234]">
                  {totalPrice.toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₽
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearCart();
                setItems([]);
              }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#009234]/20 bg-white px-5 text-sm font-medium text-[#009234] transition hover:border-[#009234] hover:bg-[#f2faf4]"
            >
              Очистить корзину
            </button>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_360px]">
            <div className="flex flex-col gap-5">
              {items.map(({ product, quantity }) => {
                const imageUrl = getProductImageUrl(product);
                const unitPrice = getVisiblePrice(product);
                const itemTotal = parsePrice(unitPrice) * quantity;

                return (
                  <article
                    key={product.id}
                    className="group rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_22px_50px_rgba(0,0,0,0.12)] md:p-5"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex h-[170px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#fbfbfb_0%,#eff4ec_100%)] md:w-[220px]"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="max-h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-[#7a8776]">
                            Нет фото
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col justify-between gap-4">
                        <div>
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-[20px] font-semibold leading-7 text-[#1f2e1d] transition hover:text-[#009e39]"
                          >
                            {product.title}
                          </Link>
                          <p className="mt-2 text-sm text-[#677564]">
                            Артикул: {product.sku}
                          </p>
                          <p className="mt-1 text-sm text-[#677564]">
                            Количество: {quantity}
                          </p>
                          <p className="mt-3 text-[15px] leading-6 text-[#556253] line-clamp-2">
                            {product.description ||
                              "Описание товара скоро появится."}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-[#edf1ea] pt-4 sm:flex-row sm:items-end sm:justify-between">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-[#6f7d6c]">
                              Цена за штуку: {formatPrice(unitPrice)} ₽
                            </p>
                            <p className="text-2xl font-bold text-[#009234]">
                              {Number.isFinite(itemTotal)
                                ? itemTotal.toLocaleString("ru-RU", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : formatPrice(unitPrice)}{" "}
                              ₽
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeCartItem(product.id);
                              setItems((current) =>
                                current.filter(
                                  (item) => item.product.id !== product.id,
                                ),
                              );
                            }}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-[#009234]/15 px-5 text-sm font-medium text-[#009234] transition hover:border-[#009234] hover:bg-[#f2faf4]"
                          >
                            Удалить товар
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-[28px] border border-[#e3eadf] bg-white p-6 text-[#1f2e1d] shadow-[0_20px_55px_rgba(17,37,18,0.12)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[#6d8168]">
                Оформление
              </p>
              <h2 className="mt-3 text-[28px] font-bold leading-8 text-black">
                Контактные данные
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-[#5d6d59]">
                Оставьте контакты, чтобы мы могли связаться с вами по заказу.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <InputField
                  label="ФИО"
                  placeholder="Иванов Иван Иванович"
                  value={customer}
                  onChange={setCustomer}
                />
                <InputField
                  label="Email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={setEmail}
                />
                <InputField
                  label="Телефон"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={setPhone}
                />
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#24421f]">
                    Комментарий
                  </span>
                  <textarea
                    placeholder="Комментарий к заказу, пожелания по доставке или удобное время для связи"
                    rows={5}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    className="resize-none rounded-xl border border-[#d8e3d2] bg-white px-4 py-3 text-[15px] text-[#243021] outline-none transition placeholder:text-[#8a9786] focus:border-[#009e39] focus:ring-2 focus:ring-[#009e39]/15"
                  />
                </label>
              </div>

              {submitError ? (
                <p className="mt-4 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#b42318]">
                  {submitError}
                </p>
              ) : null}

              {submitSuccess && !isOrderCompleteOpen ? (
                <p className="mt-4 rounded-xl bg-[#eef8e8] px-4 py-3 text-sm text-[#0f6b2d]">
                  {submitSuccess}
                </p>
              ) : null}

              <div className="mt-6 rounded-[22px] bg-[#f3f7f0] p-4">
                <div className="flex items-center justify-between gap-4 text-sm text-[#62705f]">
                  <span>Товаров</span>
                  <span>{totalItemsCount} шт.</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-sm text-[#62705f]">Итого</span>
                  <span className="text-[32px] font-bold leading-none text-[#009234]">
                    {totalPrice.toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ₽
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-full bg-[#009234] text-[15px] font-semibold text-white transition hover:bg-[#007d2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Отправка..." : "Заказать"}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
