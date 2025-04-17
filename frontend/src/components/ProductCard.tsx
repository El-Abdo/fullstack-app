import { useNavigate } from "react-router-dom";
import { toKebabCase } from "../utils/toKebabCase";
import { Product } from "../types/Product";
import QuickShop from "./QuickShop";

  
  export default function ProductCard({ product }: { product: Product }) {
    const navigate = useNavigate();

    return (
      <div
        className={`p-4 group w-[16rem] sm:w-[18rem] flex flex-col h-full ${
          product.inStock ? 'hover:shadow-lg' : ''
        }`}
        data-testid={`product-${toKebabCase(product.name)}`}
      >
        <div className="my-4 relative w-full h-80">
            <img
              onClick={() => product.inStock && navigate(`/${product.category}/${product.id}`)}
              src={product.gallery[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all cursor-pointer ${
                !product.inStock ? 'filter grayscale brightness-80' : ''
              }`}
            />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <h1 className="text-xl">OUT OF STOCK</h1>
          </div>
          )}

          {product.inStock &&
          <div className="absolute bottom-0 right-4 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-green-400 hover:bg-green-700 rounded-full h-10 w-10 flex items-center justify-center">
            <QuickShop product={product} />
            </div>
          </div>
         }
        </div>
       
        <h2 className="text-lg">{product.name}</h2>
        <p className="text-lg font-semibold">
            {product.price.symbol}{product.price.amount.toFixed(2)} {product.price.currency}
        </p>
      </div>
    );
    
  }
