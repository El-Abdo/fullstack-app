export type Product = {
    id: string;
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
      name: string;
      type: string;
      items: {
        displayValue: string;
        value: string;
      }[];
    }[];
  };