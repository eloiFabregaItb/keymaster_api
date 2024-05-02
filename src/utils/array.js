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



export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}