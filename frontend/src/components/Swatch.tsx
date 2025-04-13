export default function ColorSwatch({ hexColor = '#000000' }: { hexColor?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-8 h-8 shadow border border-gray-300 hover:shadow-xl hover:scale-105 transition-transform hover:cursor-pointer" 
        style={{ backgroundColor: hexColor }}
      />
    </div>
  );
}