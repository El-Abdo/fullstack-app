import { useEffect, useRef } from "react";
import { useOrder } from "../context/OrderContext";
import Cart from "../assets/cart-shopping-regular.svg";
import ColorSwatch from "./SwatchItem";
import TextItem from "./TextItem";
import { toKebabCase } from "../utils/toKebabCase";
import { isSelected } from "../utils/isSelected";

export default function CartOverlay() {
  const { order, increaseQuantity, removeFromCart, submitOrder, isOverlayOpen, closeOverlay, toggleOverlay } = useOrder();
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        closeOverlay();
      }
    };    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });


  const prevItemCountRef = useRef(order.items.length);

  useEffect(() => {
    const prevItemCount = prevItemCountRef.current;
    const currentItemCount = order.items.length;
  
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const prevTotalQuantity = prevItemCountRef.current;
  
    if (currentItemCount > prevItemCount || totalQuantity > prevTotalQuantity) {
      toggleOverlay();
    }
  
    prevItemCountRef.current = totalQuantity;
  }, [order.items , toggleOverlay]);

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className="relative inline-flex" ref={overlayRef}>
      <button
        onClick={toggleOverlay}
        className={`h-6 w-6 transition-opacity duration-300 cursor-pointer ${
          order.items.length === 0 ? "opacity-40" : ""
        }`}
      >

        <img src={Cart} alt="Cart" />
        {totalQuantity > 0 && (
        <div className="absolute -top-2 -right-2 rounded-full bg-black 
          min-w-[1.25rem] h-5 flex items-center justify-center 
          text-xs text-white px-1 font-medium">
          {order.items.reduce((total, item) => total + item.quantity, 0)}
        </div>
      )}

      </button>

      {isOverlayOpen && (
        <div className="absolute top-8 right-0 w-[24rem] bg-white border shadow-lg bg-opacity-40 z-20 p-4" data-testid="cart-overlay">
          <span className="font-semibold">My Bag </span>{totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
          {order.items.map((item, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h2 className="text-md">{item.name}</h2>
                  <div className="text-xs font-semibold" data-testid='cart-item-amount'>
                    {item.symbol}{item.price.toFixed(2)}
                  </div>
                  {item.allAttributes.map(attr => (
                                  <>
                                  {attr.type === 'swatch' ? (
                                    <div 
                                      key={attr.id}
                                      data-testid={`product-attribute-${toKebabCase(attr.name)}`}
                                    >
                                      <span className="text-xs">{attr.name}:</span>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {attr.items.map(item => (
                                          <ColorSwatch key={item.value} hexColor={item.value} isActive={false} isSelected={isSelected(attr.id, item.id, order.items[index].selectedAttributes)}/>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                  <div 
                                  key={attr.name}
                                  data-testid={`product-attribute-${toKebabCase(attr.name)}`}
                                >
                                  <span className="text-xs">{attr.name}:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {attr.items.map(item => (
                                      <TextItem key={item.value} value={item.value} isActive={false} isSelected={isSelected(attr.id, item.id, order.items[index].selectedAttributes)}/>
                                    ))}
                                  </div>
                                </div>)
                                  }
                                  </>
                                
                              ))}
                </div>
                <div className="flex flex-col items-center gap-6 mt-3">
                    <button
                      onClick={() => increaseQuantity(index)} data-testid='cart-item-amount-increase'
                      className="border px-2 py-1 rounded text-xsm cursor-pointer hover:bg-gray-700 hover:text-white"
                    >
                      +
                    </button>
                    <span className="text-xs">{item.quantity}</span>
                    <button data-testid='cart-item-amount-decrease'
                      onClick={() => removeFromCart(index)}
                      className="border px-2 py-1 rounded text-xsm cursor-pointer hover:bg-gray-700 hover:text-white"
                    >
                      -
                    </button>
                  </div>
                  <img src={item.productImage} alt={item.name} className="w-20 h-full object-cover" />
              </div>
            </div>
          ))}

          <div className="flex text-xs font-bold" data-testid='cart-total'>
            Total <span className="ml-auto"> {order.symbol}{order.total.toFixed(2)}</span>
          </div>
          <button onClick={submitOrder} className="w-full bg-green-400 text-white py-3 mt-3 hover:bg-green-600 transition uppercase">
            place order
          </button>
        </div>
      )}
    </div>
  );
}
