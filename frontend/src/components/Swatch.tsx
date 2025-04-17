export default function ColorSwatch({
  hexColor = '#000000',
  isActive = true
}: {
  hexColor?: string;
  isActive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          w-8 h-8 border 
          ${isActive ? 'shadow border-gray-400 hover:shadow-xl hover:scale-105 hover:cursor-pointer' : 'border-gray-400'}
          transition-transform
        `}
        style={{ backgroundColor: hexColor }}
      />
    </div>
  );
}