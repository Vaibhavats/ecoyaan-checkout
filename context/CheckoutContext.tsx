"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import defaultCart from "@/data/cartData.json";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tag: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
}

interface CheckoutContextType {
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  addresses: Address[];
  selectedAddressId: string | null;
  paymentMethod: string;
  addAddress: (address: Omit<Address, "id">) => string;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  setPaymentMethod: (method: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const STORAGE_KEY = "ecoyaan_checkout_v2";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(defaultCart as CartItem[]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethodState, setPaymentMethodState] = useState("cod");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Array.isArray(data.cartItems) && data.cartItems.length > 0)
          setCartItems(data.cartItems);
        if (Array.isArray(data.addresses)) setAddresses(data.addresses);
        if (data.selectedAddressId) setSelectedAddressId(data.selectedAddressId);
        if (data.paymentMethod) setPaymentMethodState(data.paymentMethod);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cartItems,
          addresses,
          selectedAddressId,
          paymentMethod: paymentMethodState,
        })
      );
    } catch {}
  }, [cartItems, addresses, selectedAddressId, paymentMethodState, hydrated]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addAddress = (addr: Omit<Address, "id">) => {
    const id = `addr_${Date.now()}`;
    setAddresses((prev) => [...prev, { ...addr, id }]);
    setSelectedAddressId(id);
    return id;
  };

  const updateAddress = (id: string, addr: Omit<Address, "id">) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...addr, id } : a)));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) setSelectedAddressId(null);
  };

  const selectAddress = (id: string) => setSelectedAddressId(id);
  const setPaymentMethod = (method: string) => setPaymentMethodState(method);

  return (
    <CheckoutContext.Provider
      value={{
        cartItems,
        updateQuantity,
        addresses,
        selectedAddressId,
        paymentMethod: paymentMethodState,
        addAddress,
        updateAddress,
        removeAddress,
        selectAddress,
        setPaymentMethod,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
