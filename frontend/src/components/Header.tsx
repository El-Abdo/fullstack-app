import { useLocation } from 'react-router-dom';
import CartOverlay from './CartOverlay';
import Bag from "../assets/eco-bag.svg";

export default function Header() {
  const activeClasses = "border-b-2 border-green-400 text-green-400 font-['Raleway'] pb-4 px-2";
  const inactiveClasses = "text-gray-600 font-['Raleway'] px-2";

  const location = useLocation();
  const category = location.pathname.split('/')[1];

  const isActive = (path: string) => category === path;

  return (
    <header className="bg-white text-black pt-6 px-12 flex items-center justify-between relative">
      <div className="flex gap-4">
        <a
          href="/all"
          className={isActive('all') ? activeClasses : inactiveClasses}
          data-testid={isActive('all') ? 'active-category-link' : 'category-link'}
        >
          All
        </a>
        <a
          href="/tech"
          className={isActive('tech') ? activeClasses : inactiveClasses}
          data-testid={isActive('tech') ? 'active-category-link' : 'category-link'}
        >
          Tech
        </a>
        <a
          href="/clothes"
          className={isActive('clothes') ? activeClasses : inactiveClasses}
          data-testid={isActive('clothes') ? 'active-category-link' : 'category-link'}
        >
          Clothes
        </a>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 h-6 w-6">
        <img src={Bag} alt="Logo" className="h-full w-full object-contain" />
      </div>

      <div className="ml-auto" data-testid="cart-btn">
        <CartOverlay />
      </div>
    </header>

  );  
}