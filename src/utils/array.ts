export function alphabeticalSort(a: string, b: string, order: 'asc' | 'desc' = 'asc') {
  if (order === 'desc') {
    return -1 * a.localeCompare(b)
  }
  return a.localeCompare(b)
}

export function numericalSort(a: number, b: number, order: 'asc' | 'desc' = 'asc') {
  if (order === 'desc') {
    return b - a
  }
  return a - b;
}

export function sortSiblingArrays<T extends any[]>(sortFunction: (a: T[number], b: T[number]) => number, array: T, ...relatedArrays: any[]): any[][] {
  if (relatedArrays.some(arr => arr.length !== array.length)) {
    throw new Error("All arrays must be of equal length");
  }

  const indices = array.map((_, i) => i);
  indices.sort((indexA, indexB) => sortFunction(array[indexA], array[indexB]));

  const newArrays = [new Array(array.length)];

  relatedArrays.forEach(() => {
    newArrays.push(new Array(array.length));
  });


  indices.forEach((oldIndex, newIndex) => {
    newArrays[0][newIndex] = array[oldIndex];
    relatedArrays.forEach((arr, i) => {
      newArrays[i + 1][newIndex] = arr[oldIndex];
    });
  });

  return newArrays;
}

export function slicePagination(page: number, perPage: number) {
  const startsAt = perPage * (page - 1);
  const endsAt = perPage * page;

  return [startsAt, endsAt];
}