import { useProductContext } from "../context/ProductContext";
import { useOrder } from "../context/OrderContext";
import ProductCard from "../components/ProductCard";

export default function Tech() {
  const context = useProductContext();
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  const { products } = context;
  const {isOverlayOpen} = useOrder();
  const techProducts = products.filter(p => p.category === "tech");

  return (
    <div className="relative">
          {isOverlayOpen && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-40 z-10"></div> 
        )}
        <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
          {techProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
    </div>  
  );
}
