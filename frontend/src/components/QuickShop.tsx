import { useOrder } from "../context/OrderContext";
import { Product } from "../types/Product";
import Cart from '../assets/cart-shopping-regular.svg';

export default function QuickShop({ product }: { product: Product }) {
  const { addToCart } = useOrder();

  const handleQuickShop = () => {
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price.amount,
      symbol: product.price.symbol,
      productImage: product.gallery[0],
      selectedAttributes: product.attributes.map(attr => ({
        id: attr.id,
        selectedItemId: attr.items[0].id,
      })),
      allAttributes: product.attributes,
    });
  };

  return (
    <div onClick={handleQuickShop} className="relative h-6 w-6 cursor-pointer">
      <div className="relative h-full w-full flex items-center justify-center dark:invert">
        <img src={Cart} alt="Cart" className="h-4 w-4" />
      </div>
    </div>
  );
}
