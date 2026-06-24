import { MinHeap } from "./MinHeap.js";
import type { Comparator } from "./heap.js";

/**
 * Binary max-heap — a MinHeap with the comparator inverted.
 *
 * @example
 * const h = new MaxHeap<number>();
 * h.push(1, 5, 3, 2, 4);
 * h.pop();  // 5
 * h.peek(); // 4
 */
export class MaxHeap<T> extends MinHeap<T> {
  constructor(comparator?: Comparator<T>, items?: Iterable<T>) {
    const nat: Comparator<T> = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const inv: Comparator<T> = (a, b) => nat(b, a);
    super(inv, items);
  }

  override toString(): string {
    return `MaxHeap(${this.size} items)`;
  }
}
