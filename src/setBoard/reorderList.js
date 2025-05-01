export function reorderList(list1, list2) {
  // Create a Map to store indices of elements in list2
  const orderMap = new Map(list2.map((item, index) => [item, index]));

  // Sort list1 based on the order in list2
  const sortedList = [...list1].sort((a, b) => {
    const indexA = orderMap.has(a) ? orderMap.get(a) : Infinity;
    const indexB = orderMap.has(b) ? orderMap.get(b) : Infinity;
    return indexA - indexB;
  });

  // Add items from list2 that are not in list1
  const result = [
    ...sortedList,
    ...list2.filter((item) => !list1.includes(item)),
  ];

  return result;
}
