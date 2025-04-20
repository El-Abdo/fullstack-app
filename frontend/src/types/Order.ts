  export type SelectedAttribute = {
    id: number;
    selectedItemId: number | null;
  };
  
  export type OrderItem = {
    productId: number;
    name: string;
    productImage: string;
    price: number;
    symbol: string;
    selectedAttributes: SelectedAttribute[];
    allAttributes: {
      id: number;
      name: string;
      type: string;
      items: {
        id: number;
        displayValue: string;
        value: string;
      }[];
    }[];
    quantity: number;
  };
  
  export interface OrderState {
    items: OrderItem[];
    symbol: string;
    total: number;
  }
  