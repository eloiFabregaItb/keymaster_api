export function getCommonElements (array1, array2, comparator){
  return array1.filter(item1 => array2.some(item2 => comparator(item1, item2)));
};



export function getNonDuplicatedElements(array1, array2, comparator){
  const mergedArray = [...array1, ...array2];
  return mergedArray.filter(
    (item, index, self) =>
      self.findIndex(other => comparator(item, other)) === index
  );
};