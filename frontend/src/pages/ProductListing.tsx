import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useOrder } from "../context/OrderContext";
import { useParams } from 'react-router-dom';

export default function ProductListing() {
  const context = useProductContext();
  const {isOverlayOpen} = useOrder();
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  const { category } = useParams<{ category: string }>();
  const { products } = context;
  let filteredProducts;
  if (category === 'all') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(p => p.category === category);
  }
  return (
    <div className="relative">
          {isOverlayOpen && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-40 z-10"></div> 
        )}
        <h2 className="font-['Raleway'] uppercase py-6 px-12 text-2xl">{category}</h2>
        <div className="py-6 px-12 grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 justify-items-center">
          {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
    </div>
    
  );
}
