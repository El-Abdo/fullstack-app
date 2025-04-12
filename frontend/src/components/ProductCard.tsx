type Product = {
    id: string;
    name: string;
    brand: string;
    description: string;
    price: string;
    gallery: string[];
    inStock: boolean;
  };
  
  export default function ProductCard({ product }: { product: Product }) {
    const kebabName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

    return (
      <div
        className="p-4 w-[16rem] sm:w-[18rem] p-2 flex flex-col h-full"
        data-testid={`product-${kebabName}`}
      >
        <div className="my-4 relative w-full h-80">
          {product.gallery.length > 0 && (
            <img
              src={product.gallery[0]}
              alt="Product image"
              className={`w-full h-full object-cover ${
                !product.inStock ? 'filter grayscale brightness-50' : ''
              }`}
            />
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <h1 className="text-xl">OUT OF STOCK</h1>
          </div>
          )}
        </div>
    
        <h2 className="text-lg">{product.name}</h2>
        <p className="font-semibold">{product.price}</p>
      </div>
    );
    
  }