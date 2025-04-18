export default function TextItem({value, isActive = false, isSelected = false}: {value: string; isActive?: boolean; isSelected?: boolean;}) {
    return (
      <button className={`
        ${isSelected ? 'bg-black text-white' : ''}
        ${isActive ? 'px-3 py-1 border hover:bg-black hover:text-white hover:cursor-pointer transition' : 'px-1 py-1 border border-gray-400 text-xs'}
        transition-transform`}>
      {value}
    </button>
    );
  }