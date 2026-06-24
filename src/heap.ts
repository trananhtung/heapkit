export type Comparator<T> = (a: T, b: T) => number;

const defaultComparator = <T>(a: T, b: T): number =>
  a < b ? -1 : a > b ? 1 : 0;

function siftUp<T>(arr: T[], i: number, cmp: Comparator<T>): void {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (cmp(arr[i]!, arr[parent]!) < 0) {
      [arr[i], arr[parent]] = [arr[parent]!, arr[i]!];
      i = parent;
    } else break;
  }
}

function siftDown<T>(arr: T[], i: number, n: number, cmp: Comparator<T>): void {
  while (true) {
    let smallest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < n && cmp(arr[l]!, arr[smallest]!) < 0) smallest = l;
    if (r < n && cmp(arr[r]!, arr[smallest]!) < 0) smallest = r;
    if (smallest === i) break;
    [arr[i], arr[smallest]] = [arr[smallest]!, arr[i]!];
    i = smallest;
  }
}

/**
 * Functional API — mutates the array in-place, matching Python `heapq` style.
 * The heap invariant is: arr[i] <= arr[2*i+1] and arr[i] <= arr[2*i+2]
 * (using the provided comparator).
 */

/** Transform an arbitrary array into a valid heap in O(n). */
export function heapify<T>(arr: T[], cmp: Comparator<T> = defaultComparator): void {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, n, cmp);
  }
}

/** Push an item onto the heap. O(log n). */
export function heapPush<T>(arr: T[], item: T, cmp: Comparator<T> = defaultComparator): void {
  arr.push(item);
  siftUp(arr, arr.length - 1, cmp);
}

/**
 * Pop and return the smallest item. O(log n).
 * Throws if the heap is empty.
 */
export function heapPop<T>(arr: T[], cmp: Comparator<T> = defaultComparator): T {
  if (arr.length === 0) throw new RangeError("heapPop: heap is empty");
  const top = arr[0]!;
  const last = arr.pop()!;
  if (arr.length > 0) {
    arr[0] = last;
    siftDown(arr, 0, arr.length, cmp);
  }
  return top;
}

/**
 * Replace the smallest item with `item` and return the old smallest. O(log n).
 * More efficient than `heapPop` + `heapPush` because it avoids one sift-up.
 * Equivalent to Python `heapq.heapreplace`.
 */
export function heapReplace<T>(arr: T[], item: T, cmp: Comparator<T> = defaultComparator): T {
  if (arr.length === 0) throw new RangeError("heapReplace: heap is empty");
  const top = arr[0]!;
  arr[0] = item;
  siftDown(arr, 0, arr.length, cmp);
  return top;
}

/**
 * Push `item` then pop and return the smallest item. O(log n).
 * Equivalent to Python `heapq.heappushpop` — more efficient than two ops.
 */
export function heapPushPop<T>(arr: T[], item: T, cmp: Comparator<T> = defaultComparator): T {
  if (arr.length > 0 && cmp(arr[0]!, item) < 0) {
    return heapReplace(arr, item, cmp);
  }
  return item;
}

/**
 * Return the n smallest items from `iterable` in ascending order. O(n log k).
 * Equivalent to Python `heapq.nsmallest(n, iterable, key?)`.
 */
export function nSmallest<T>(n: number, iterable: Iterable<T>, cmp: Comparator<T> = defaultComparator): T[] {
  if (n <= 0) return [];
  // Use a max-heap of size n to track the n smallest items.
  const maxCmp: Comparator<T> = (a, b) => cmp(b, a);
  const heap: T[] = [];
  for (const item of iterable) {
    if (heap.length < n) {
      heapPush(heap, item, maxCmp);
    } else if (cmp(item, heap[0]!) < 0) {
      heapReplace(heap, item, maxCmp);
    }
  }
  // Sort ascending for output
  return heap.sort(cmp);
}

/**
 * Return the n largest items from `iterable` in descending order. O(n log k).
 * Equivalent to Python `heapq.nlargest(n, iterable, key?)`.
 */
export function nLargest<T>(n: number, iterable: Iterable<T>, cmp: Comparator<T> = defaultComparator): T[] {
  if (n <= 0) return [];
  // Use a min-heap of size n to track the n largest items.
  const heap: T[] = [];
  for (const item of iterable) {
    if (heap.length < n) {
      heapPush(heap, item, cmp);
    } else if (cmp(item, heap[0]!) > 0) {
      heapReplace(heap, item, cmp);
    }
  }
  // Sort descending for output
  return heap.sort((a, b) => cmp(b, a));
}

/**
 * Merge multiple sorted iterables into a single sorted output. O(N log k)
 * where N is total items and k is the number of iterables.
 * Equivalent to Python `heapq.merge(*iterables)`.
 */
export function* heapMerge<T>(
  iterables: Iterable<T>[],
  cmp: Comparator<T> = defaultComparator
): Generator<T> {
  type Entry = { val: T; iter: Iterator<T>; idx: number };
  const entryCmp = (a: Entry, b: Entry): number => {
    const c = cmp(a.val, b.val);
    return c !== 0 ? c : a.idx - b.idx; // stable by source index
  };

  const heap: Entry[] = [];
  for (let idx = 0; idx < iterables.length; idx++) {
    const iter = iterables[idx]![Symbol.iterator]();
    const next = iter.next();
    if (!next.done) {
      heapPush(heap, { val: next.value, iter, idx }, entryCmp);
    }
  }

  while (heap.length > 0) {
    const entry = heapPop(heap, entryCmp);
    yield entry.val;
    const next = entry.iter.next();
    if (!next.done) {
      heapPush(heap, { val: next.value, iter: entry.iter, idx: entry.idx }, entryCmp);
    }
  }
}
