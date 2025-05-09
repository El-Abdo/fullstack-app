import React, { createContext, useContext, useEffect, useState } from "react";
import { OrderItem, OrderState, SelectedAttribute } from "../types/Order";

interface OrderContextType {
  order: OrderState;
  isOverlayOpen: boolean;
  toggleOverlay: () => void;
  closeOverlay: () => void;
  addToCart: (item: Omit<OrderItem, "quantity">) => void;
  removeFromCart: (index: number) => void;
  increaseQuantity: (index: number) => void;
  submitOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const getStorage = (): OrderState => {
  const stored = localStorage.getItem("order");
  return stored ? JSON.parse(stored) : { items: [], total: 0, symbol: "" };
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<OrderState>(getStorage());
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price) * item.quantity, 0);
  };

  const areAttributesEqual = (a: SelectedAttribute[], b: SelectedAttribute[]) => {
    if (a.length !== b.length) return false;
    return a.every(attr =>
      b.some(other => attr.id === other.id && attr.selectedItemId === other.selectedItemId)
    );
  };
  

  const addToCart = (newItem: Omit<OrderItem, "quantity">) => {
    const existingIndex = order.items.findIndex(
      (item) =>
        item.productId === newItem.productId &&
        areAttributesEqual(item.selectedAttributes, newItem.selectedAttributes)
    );

    let newItems;
    if (existingIndex >= 0) {
      newItems = [...order.items];
      newItems[existingIndex].quantity += 1;
    } else {
      newItems = [...order.items, { ...newItem, quantity: 1 }];
    }

    setOrder({
      items: newItems,
      total: calculateTotal(newItems),
      symbol: newItem.symbol,
    });

    setIsOverlayOpen(true);
  };

  const removeFromCart = (index: number) => {
    const itemquantity = order.items[index].quantity;
    let newItems = [...order.items];;
    if (itemquantity > 1) {        
        newItems[index].quantity -= 1;
    } else if (itemquantity === 1) {
        newItems = order.items.filter((_, i) => i !== index);
    }
    setOrder({ items: newItems, total: calculateTotal(newItems), symbol: order.symbol });
  };

  const increaseQuantity = (index: number) => {
    const newItems = [...order.items];
    newItems[index].quantity += 1;
    setOrder({ items: newItems, total: calculateTotal(newItems), symbol: order.symbol });
  };


  const submitOrder = () => {
    const items = order.items.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      attributes: item.selectedAttributes.map(attr => ({
        attribute_id: attr.id,
        attribute_item_id: attr.selectedItemId
      }))
    }));
  
    fetch('https://scanditest.alwaysdata.net/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateOrder($input: [CreateOrderInput!]!) {
            createOrder(input: $input)
          }
        `,
        variables: {
          input: items 
        }
      }),
    });
  
    setOrder({ items: [], total: 0, symbol: order.symbol });
    localStorage.removeItem('order');
  };
  const toggleOverlay = () => setIsOverlayOpen(prev => !prev);
  const closeOverlay = () => setIsOverlayOpen(false);
  return (
    <OrderContext.Provider value={{ order, addToCart, removeFromCart, increaseQuantity, submitOrder, isOverlayOpen, toggleOverlay, closeOverlay }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within an OrderProvider");
  return context;
};
