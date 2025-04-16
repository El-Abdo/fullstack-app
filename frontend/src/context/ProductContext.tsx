import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/Product';

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
              price {
                currency
                amount
                symbol
            }
              inStock
              attributes {
                id
                name
                type
                items {
                  id
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