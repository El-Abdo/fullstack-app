export type Product = {
    id: number;
    name: string;
    description: string;
    brand: string;
    category: string;
    gallery: string[];
    price: {
      currency: string;
      amount: number;
      symbol: string;
    };
    inStock: boolean;
    attributes: {
      id: number;
      name: string;
      type: string;
      items: {
        id: number;
        displayValue: string;
        value: string;
      }[];
    }[];
  };