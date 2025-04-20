export function isSelected(attrId: number, itemId: number, selectedAttributes: { id: number; selectedItemId: number | null }[]): boolean {
    return selectedAttributes.some(attr =>
      attr.id === attrId && attr.selectedItemId === itemId
    );
  }
  