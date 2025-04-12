import { useProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function Clothes() {
  const context = useProductContext();
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  const { products } = context;
  const clothesProducts = products.filter(p => p.category === "clothes");

  return (
    <div className="p-6 grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 justify-items-center">
      {clothesProducts.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
