export function isSelected(attrId: number, itemId: number, selectedAttributes: { id: number; selectedItemId: number }[]): boolean {
    return selectedAttributes.some(attr =>
      attr.id === attrId && attr.selectedItemId === itemId
    );
  }
  