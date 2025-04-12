import React, { createContext, useContext, useEffect, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  gallery: string[];
  price: string;
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

type ProductContextType = {
  products: Product[];
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://scanditest.alwaysdata.net/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          {
            products {
              id
              name
              description
              brand
              category
              gallery
              price
              inStock
              attributes {
                name
                type
                items {
                  displayValue
                  value
                }
              }
            }
          }
        `,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.data.products);
        setLoading(false);
      });
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);