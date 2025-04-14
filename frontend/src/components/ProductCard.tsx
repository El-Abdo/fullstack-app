import { useNavigate } from "react-router-dom";
import { toKebabCase } from "../utils/toKebabCase";
import { Product } from "../types/Product";

  
  export default function ProductCard({ product }: { product: Product }) {
    const navigate = useNavigate();

    return (
      <div
        onClick={() => product.inStock && navigate(`/product/${product.id}`)}
        className={`p-4 w-[16rem] sm:w-[18rem] flex flex-col h-full ${
          product.inStock ? 'cursor-pointer hover:shadow-lg' : ''
        }`}
        data-testid={`product-${toKebabCase(product.name)}`}
      >
        <div className="my-4 group relative w-full h-80">
            <img
              src={product.gallery[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all ${
                !product.inStock ? 'filter grayscale brightness-80' : ''
              }`}
            />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <h1 className="text-xl">OUT OF STOCK</h1>
          </div>
          )}

          {product.inStock && (<button className="
            absolute bottom-20 left-1/2 -translate-x-1/2 
            bg-black text-white py-2 px-6 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:bg-gray-800
          ">
            Add to Cart
          </button>
          )}
        </div>
       
        <h2 className="text-lg">{product.name}</h2>
        <p className="text-lg font-semibold">
            {product.price.symbol}{product.price.amount.toFixed(2)} {product.price.currency}
        </p>
      </div>
    );
    
  }
