import {
  heapify,
  heapPop,
  heapPush,
  heapPushPop,
  heapReplace,
  type Comparator,
} from "./heap.js";

/**
 * Binary min-heap class with a custom comparator.
 *
 * By default items are ordered by their natural `<` / `>` ordering — so
 * numbers/strings/bigints work out of the box. Pass a custom `comparator` to
 * use with objects or to flip to a max-heap.
 *
 * @example
 * const h = new MinHeap<number>();
 * h.push(5, 3, 1, 4, 2);
 * h.pop(); // 1
 * h.peek(); // 2
 *
 * // Object heap with priority field
 * const tasks = new MinHeap<{priority: number; name: string}>(
 *   (a, b) => a.priority - b.priority
 * );
 */
export class MinHeap<T> {
  private _data: T[];
  private _cmp: Comparator<T>;

  constructor(comparator?: Comparator<T>, items?: Iterable<T>) {
    this._cmp = comparator ?? ((a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0));
    this._data = items ? [...items] : [];
    if (this._data.length > 1) heapify(this._data, this._cmp);
  }

  get size(): number { return this._data.length; }
  get isEmpty(): boolean { return this._data.length === 0; }

  /** Return the smallest item without removing it. O(1). */
  peek(): T | undefined { return this._data[0]; }

  /** Push one or more items. O(log n) each. */
  push(...items: T[]): this {
    for (const item of items) heapPush(this._data, item, this._cmp);
    return this;
  }

  /** Remove and return the smallest item. O(log n). Throws if empty. */
  pop(): T { return heapPop(this._data, this._cmp); }

  /** Try to pop — returns `undefined` if empty instead of throwing. */
  tryPop(): T | undefined {
    return this._data.length === 0 ? undefined : heapPop(this._data, this._cmp);
  }

  /**
   * Replace the smallest item with `item` and return the old smallest. O(log n).
   * Throws if empty.
   */
  replace(item: T): T { return heapReplace(this._data, item, this._cmp); }

  /**
   * Push `item` then pop and return the smallest. O(log n).
   * More efficient than `push` + `pop`.
   */
  pushPop(item: T): T { return heapPushPop(this._data, item, this._cmp); }

  /** Pop all items in sorted (ascending) order. Drains the heap. */
  *drain(): Generator<T> {
    while (this._data.length > 0) yield heapPop(this._data, this._cmp);
  }

  /** Return a sorted array of all items without modifying the heap. O(n log n). */
  toSortedArray(): T[] {
    const copy = [...this._data];
    const result: T[] = [];
    while (copy.length > 0) result.push(heapPop(copy, this._cmp));
    return result;
  }

  /** Return a raw copy of the internal heap array (heap-ordered, not sorted). */
  toArray(): T[] { return [...this._data]; }

  [Symbol.iterator](): Iterator<T> { return this.drain(); }

  toString(): string { return `MinHeap(${this._data.length} items)`; }
}
