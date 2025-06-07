import { useProductContext } from "../context/ProductContext";
import { useOrder } from "../context/OrderContext";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { toKebabCase } from "../utils/toKebabCase";
import { isSelected } from "../utils/isSelected";
import ColorSwatch from "../components/SwatchItem";
import TextItem from "../components/TextItem";
import { SelectedAttribute } from "../types/Order";

export default function ProductDetails() {
  const context = useProductContext();
  const { addToCart, isOverlayOpen } = useOrder();

  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  const { products } = context;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id.toString() === id);
  
  const [productAttributes, setProductAttributes] = useState<SelectedAttribute[]>([]);

  useEffect(() => {
    if (product) {
      setProductAttributes(
        product.attributes.map(attr => ({
          id: attr.id,
          selectedItemId: null,
        }))
      );
    }
  }, [product]);
  const allAttributesSelected = productAttributes.length > 0 && 
  productAttributes.every(attr => attr.selectedItemId !== null);

  const handleSelectAttribute = (attrId: number, itemId: number) => {
    setProductAttributes(prev => {
      const exists = prev.find(a => a.id === attrId);
      if (exists) {
        return prev.map(a =>
          a.id === attrId ? { ...a, selectedItemId: itemId } : a
        );
      }
      return [...prev, { id: attrId, selectedItemId: itemId }];
    });
  };
  
  if (!product) {
    return <></>;
  } 
  

  const handleAddToCart = () => {
    if (!allAttributesSelected) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price.amount,
      symbol: product.price.symbol,
      productImage: product.gallery[0],
      selectedAttributes: productAttributes,
      allAttributes: product.attributes,
    });
  };

  return (
    <div className="relative">
      {isOverlayOpen && (<div className="fixed inset-0 bg-black/20 bg-opacity-40 z-10"></div> )}
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white w-8 h-8 flex items-center cursor-pointer justify-center opacity-70"
                  >
                    {'<'}
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => 
                      (prev + 1) % product.gallery.length
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white w-8 h-8 flex items-center cursor-pointer justify-center opacity-70"
                  >
                    {'>'}
                    </button>
                </>
              )}
            </div>
          </div>

          {/* product details */}
          <div className="lg:w-2/6 space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="space-y-2">
              {product.attributes?.map((attr) => (
                  <>
                  {attr.type === 'swatch' ? (
                    <div 
                      key={attr.name}
                    >
                      <h3 className="uppercase font-bold">{attr.name}:</h3>
                      <div className="flex flex-wrap gap-2 mt-1" data-testid={`product-attribute-${toKebabCase(attr.name)}`}>
                        {attr.items.map(item => (
                          <div onClick={() => handleSelectAttribute(attr.id, item.id)} data-testid={`product-attribute-${toKebabCase(attr.name)}-${item.value}`}>
                            <ColorSwatch key={item.value} hexColor={item.value} isActive={true} isSelected={isSelected(attr.id, item.id, productAttributes)}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                  <div 
                  key={attr.name}
                >
                  <h3 className="uppercase font-bold">{attr.name}:</h3>
                  <div className="flex flex-wrap gap-2 mt-1" data-testid={`product-attribute-${toKebabCase(attr.name)}`}>
                    {attr.items.map(item => (
                      <div onClick={() => handleSelectAttribute(attr.id, item.id)} data-testid={`product-attribute-${toKebabCase(attr.name)}-${item.value}`}>
                        <TextItem key={item.value} value={item.value} isActive={true} isSelected={isSelected(attr.id, item.id, productAttributes)}/>
                    </div>
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
            <button onClick={() => product.inStock && handleAddToCart()} data-testid="add-to-cart" disabled={!allAttributesSelected || !product.inStock} className={`w-full text-white py-3 transition uppercase ${allAttributesSelected && product.inStock ? 'bg-green-400 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`} >
              add to cart
            </button>
            <div className="prose max-w-none" data-testid="product-description">
              {parse(product.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}