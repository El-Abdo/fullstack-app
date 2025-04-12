import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const activeClasses = "text-green-400 underline";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-100 text-black p-4 flex gap-4">
      <a
        href="/tech"
        className={isActive('/tech') ? activeClasses : inactiveClasses}
        data-testid={isActive('/tech') ? 'active-category-link' : 'category-link'}
      >
        Tech
      </a>

      <a
        href="/clothes"
        className={isActive('/clothes') ? activeClasses : inactiveClasses}
        data-testid={isActive('/clothes') ? 'active-category-link' : 'category-link'}
      >
        Clothes
      </a>
    </header>
  );
}