import { MinHeap } from "./MinHeap.js";

export interface PriorityItem<T> {
  priority: number;
  value: T;
  /** Insertion-order counter for stable FIFO ordering of equal priorities. */
  _seq?: number;
}

/**
 * Stable FIFO priority queue backed by a min-heap.
 *
 * Lower `priority` number = higher urgency (dequeued first), like Java's
 * `PriorityQueue` and Python `heapq` conventions. For max-priority-first, pass
 * negative priorities or use `PriorityQueue.max()`.
 *
 * Items with equal priority are dequeued in **FIFO insertion order** (stable).
 *
 * @example
 * const pq = new PriorityQueue<string>();
 * pq.enqueue("low task",  10);
 * pq.enqueue("high task",  1);
 * pq.enqueue("mid task",   5);
 *
 * pq.dequeue(); // "high task"
 * pq.dequeue(); // "mid task"
 * pq.dequeue(); // "low task"
 */
export class PriorityQueue<T> {
  private _heap: MinHeap<PriorityItem<T>>;
  private _seq = 0;

  constructor() {
    this._heap = new MinHeap<PriorityItem<T>>((a, b) => {
      const d = a.priority - b.priority;
      return d !== 0 ? d : (a._seq ?? 0) - (b._seq ?? 0);
    });
  }

  /** Create a max-priority-first queue (higher number = dequeued first). */
  static max<T>(): PriorityQueue<T> {
    const pq = new PriorityQueue<T>();
    // Replace internal heap with inverted priority comparator
    pq._heap = new MinHeap<PriorityItem<T>>((a, b) => {
      const d = b.priority - a.priority; // inverted
      return d !== 0 ? d : (a._seq ?? 0) - (b._seq ?? 0);
    });
    return pq;
  }

  get size(): number { return this._heap.size; }
  get isEmpty(): boolean { return this._heap.isEmpty; }

  /** Add a value with the given priority. O(log n). */
  enqueue(value: T, priority: number): this {
    this._heap.push({ value, priority, _seq: this._seq++ });
    return this;
  }

  /** Remove and return the highest-urgency value. O(log n). Throws if empty. */
  dequeue(): T {
    return this._heap.pop().value;
  }

  /** Try to dequeue — returns `undefined` if empty. */
  tryDequeue(): T | undefined {
    return this._heap.tryPop()?.value;
  }

  /** Peek at the highest-urgency value without removing. O(1). */
  peek(): T | undefined { return this._heap.peek()?.value; }

  /** Peek at the priority of the next item. O(1). */
  peekPriority(): number | undefined { return this._heap.peek()?.priority; }

  /** Dequeue all values in priority order. Drains the queue. */
  *drain(): Generator<T> {
    while (!this._heap.isEmpty) yield this._heap.pop().value;
  }

  [Symbol.iterator](): Iterator<T> { return this.drain(); }

  toString(): string { return `PriorityQueue(${this.size} items)`; }
}
