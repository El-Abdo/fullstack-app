import { useProductContext } from "../context/ProductContext";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { toKebabCase } from "../utils/toKebabCase";
import ColorSwatch from "../components/Swatch";

export default function ProductDetails() {
  const context = useProductContext();
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  const { products } = context;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    return <></>;
  } else if (!product.inStock) {
    return <div>Product is out of stock</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* gallery section */}
        <div 
          className="lg:w-1/2 flex flex-col lg:flex-row gap-4"
          data-testid="product-gallery"
        >
          <div className="flex lg:flex-col gap-2 overflow-y-auto max-h-[600px] lg:h-auto lg:max-h-none">
            {product.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                  activeImageIndex === index ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:cursor-pointer"
                />
              </button>
            ))}
          </div>

          {/* main image */}
          <div className="flex-1 relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.gallery[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {product.gallery.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => 
                    (prev - 1 + product.gallery.length) % product.gallery.length
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                  &larr;
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => 
                    (prev + 1) % product.gallery.length
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>
        </div>

        {/* product details */}
        <div className="lg:w-2/6 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="space-y-2">
            {product.attributes?.map(attr => (
                <>
                {attr.type === 'swatch' ? (
                  <div 
                    key={attr.name}
                    data-testid={`product-attribute-${toKebabCase(attr.name)}`}
                  >
                    <h3 className="uppercase font-bold">{attr.name}:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {attr.items.map(item => (
                        <ColorSwatch key={item.value} hexColor={item.value} isActive={true}/>
                      ))}
                    </div>
                  </div>
                ) : (
                <div 
                key={attr.name}
                data-testid={`product-attribute-${toKebabCase(attr.name)}`}
              >
                <h3 className="uppercase font-bold">{attr.name}:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {attr.items.map(item => (
                    <button
                      key={item.value}
                      className="px-3 py-1 border hover:bg-black hover:text-white hover:cursor-pointer transition"
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>)
                }
                </>
              
            ))}
          </div>
          
          <p className="text-2xl font-bold">
            {product.price.symbol}{product.price.amount.toFixed(2)} {product.price.currency}
          </p>
          <button className="w-full bg-green-400 text-white py-3 hover:bg-green-600 transition uppercase" data-testid="add-to-cart">
            add to cart
          </button>

          <div className="prose max-w-none" data-testid="product-description">
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
}