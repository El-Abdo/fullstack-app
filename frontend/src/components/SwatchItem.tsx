export default function ColorSwatch({hexColor = '#000000', isActive = false, isSelected = false}: { hexColor?: string; isActive?: boolean; isSelected?: boolean; }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          p-1
          ${isSelected ? 'border-2 border-green-600' : ''}
          transition-all
        `}
      >
        <div
          className={`
            ${isActive ? 'w-6 h-6 shadow border border-gray-400 hover:shadow-xl hover:scale-105 hover:cursor-pointer' : 'w-4 h-4 border border-gray-400'}
            transition-transform
          `}
          style={{ backgroundColor: hexColor }}
        />
      </div>
    </div>
  );
}