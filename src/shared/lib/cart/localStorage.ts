export type CartItem = {
  id: string;
  quantity: number;
};

const CART_STORAGE_KEY = "cart-items";
const CART_UPDATED_EVENT = "cart-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const { id, quantity } = item as Partial<CartItem>;

      if (typeof id !== "string" || id.trim().length === 0) {
        return null;
      }

      const normalizedQuantity = Number(quantity);

      if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
        return null;
      }

      return {
        id,
        quantity: Math.floor(normalizedQuantity),
      };
    })
    .filter((item): item is CartItem => item !== null);
}

export function getCartItems(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    return normalizeCartItems(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(productId: string, quantity = 1) {
  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  const currentItems = getCartItems();
  const existingItem = currentItems.find((item) => item.id === productId);

  if (existingItem) {
    saveCartItems(
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + normalizedQuantity }
          : item,
      ),
    );

    return;
  }

  saveCartItems([
    ...currentItems,
    {
      id: productId,
      quantity: normalizedQuantity,
    },
  ]);
}

export function removeCartItem(productId: string) {
  saveCartItems(getCartItems().filter((item) => item.id !== productId));
}

export function clearCart() {
  saveCartItems([]);
}

export function subscribeToCartUpdates(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(CART_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
  };
}
