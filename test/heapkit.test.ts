import {
  heapify,
  heapPush,
  heapPop,
  heapReplace,
  heapPushPop,
  heapMerge,
  nSmallest,
  nLargest,
  MinHeap,
  MaxHeap,
  PriorityQueue,
} from "../src/index.js";

// ────────────────────────────────────────────────────────────────
// Functional API — heapify
// ────────────────────────────────────────────────────────────────
describe("heapify", () => {
  test("transforms array into valid min-heap", () => {
    const arr = [5, 3, 1, 4, 2];
    heapify(arr);
    expect(arr[0]).toBe(1); // root must be minimum
    // verify heap property
    for (let i = 0; i < arr.length; i++) {
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < arr.length) expect(arr[i]!).toBeLessThanOrEqual(arr[l]!);
      if (r < arr.length) expect(arr[i]!).toBeLessThanOrEqual(arr[r]!);
    }
  });

  test("empty array is a no-op", () => {
    const arr: number[] = [];
    heapify(arr);
    expect(arr).toEqual([]);
  });

  test("single element", () => {
    const arr = [42];
    heapify(arr);
    expect(arr).toEqual([42]);
  });

  test("already sorted array", () => {
    const arr = [1, 2, 3, 4, 5];
    heapify(arr);
    expect(arr[0]).toBe(1);
  });

  test("custom comparator (max-heap)", () => {
    const arr = [1, 5, 3, 2, 4];
    heapify(arr, (a, b) => b - a);
    expect(arr[0]).toBe(5);
  });
});

// ────────────────────────────────────────────────────────────────
// heapPush / heapPop
// ────────────────────────────────────────────────────────────────
describe("heapPush / heapPop", () => {
  test("maintains heap order", () => {
    const arr: number[] = [];
    for (const n of [5, 3, 1, 4, 2]) heapPush(arr, n);
    expect(heapPop(arr)).toBe(1);
    expect(heapPop(arr)).toBe(2);
    expect(heapPop(arr)).toBe(3);
    expect(heapPop(arr)).toBe(4);
    expect(heapPop(arr)).toBe(5);
  });

  test("heapPop on empty throws", () => {
    expect(() => heapPop([])).toThrow(RangeError);
  });

  test("push duplicates", () => {
    const arr: number[] = [];
    heapPush(arr, 2);
    heapPush(arr, 2);
    heapPush(arr, 1);
    expect(heapPop(arr)).toBe(1);
    expect(heapPop(arr)).toBe(2);
    expect(heapPop(arr)).toBe(2);
  });

  test("string comparisons", () => {
    const arr: string[] = [];
    heapPush(arr, "banana");
    heapPush(arr, "apple");
    heapPush(arr, "cherry");
    expect(heapPop(arr)).toBe("apple");
    expect(heapPop(arr)).toBe("banana");
    expect(heapPop(arr)).toBe("cherry");
  });
});

// ────────────────────────────────────────────────────────────────
// heapReplace / heapPushPop
// ────────────────────────────────────────────────────────────────
describe("heapReplace", () => {
  test("replaces root and returns old root", () => {
    const arr = [1, 3, 2];
    heapify(arr);
    const old = heapReplace(arr, 5);
    expect(old).toBe(1);
    expect(arr[0]).toBe(2); // new smallest
  });

  test("throws on empty", () => {
    expect(() => heapReplace([], 1)).toThrow(RangeError);
  });
});

describe("heapPushPop", () => {
  test("returns pushed item when heap is empty", () => {
    expect(heapPushPop([], 7)).toBe(7);
  });

  test("returns heap minimum when it's smaller than pushed item", () => {
    const arr = [1, 3, 2];
    heapify(arr);
    const result = heapPushPop(arr, 10);
    expect(result).toBe(1);
  });

  test("returns pushed item when it's smaller than heap minimum", () => {
    const arr = [5, 8, 7];
    heapify(arr);
    const result = heapPushPop(arr, 3);
    expect(result).toBe(3);
    expect(arr[0]).toBe(5); // heap unchanged
  });
});

// ────────────────────────────────────────────────────────────────
// nSmallest / nLargest
// ────────────────────────────────────────────────────────────────
describe("nSmallest", () => {
  const data = [5, 1, 8, 3, 9, 2, 7, 4, 6, 0];

  test("n=3 returns 3 smallest in ascending order", () => {
    expect(nSmallest(3, data)).toEqual([0, 1, 2]);
  });

  test("n=1 returns [minimum]", () => {
    expect(nSmallest(1, data)).toEqual([0]);
  });

  test("n=0 returns []", () => {
    expect(nSmallest(0, data)).toEqual([]);
  });

  test("n >= length returns all sorted", () => {
    expect(nSmallest(20, [3, 1, 2])).toEqual([1, 2, 3]);
  });

  test("custom comparator", () => {
    const words = ["banana", "fig", "apple", "kiwi", "cherry"];
    const shortest = nSmallest(2, words, (a, b) => a.length - b.length);
    expect(shortest).toEqual(["fig", "kiwi"]);
  });
});

describe("nLargest", () => {
  const data = [5, 1, 8, 3, 9, 2, 7, 4, 6, 0];

  test("n=3 returns 3 largest in descending order", () => {
    expect(nLargest(3, data)).toEqual([9, 8, 7]);
  });

  test("n=1 returns [maximum]", () => {
    expect(nLargest(1, data)).toEqual([9]);
  });

  test("n=0 returns []", () => {
    expect(nLargest(0, data)).toEqual([]);
  });

  test("n >= length returns all sorted descending", () => {
    expect(nLargest(20, [3, 1, 2])).toEqual([3, 2, 1]);
  });
});

// ────────────────────────────────────────────────────────────────
// heapMerge
// ────────────────────────────────────────────────────────────────
describe("heapMerge", () => {
  test("merges two sorted arrays", () => {
    expect([...heapMerge([[1, 3, 5], [2, 4, 6]])]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test("merges three sorted arrays", () => {
    expect([...heapMerge([[1, 4], [2, 5], [3, 6]])]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test("empty iterables skipped", () => {
    expect([...heapMerge([[], [1, 2], [], [3]])]).toEqual([1, 2, 3]);
  });

  test("single sorted iterable passes through", () => {
    expect([...heapMerge([[1, 3, 5]])]).toEqual([1, 3, 5]);
  });

  test("no iterables returns nothing", () => {
    expect([...heapMerge([])]).toEqual([]);
  });

  test("stable: equal values ordered by source index", () => {
    const merged = [...heapMerge([[1, 3], [1, 3], [1, 3]])];
    expect(merged).toEqual([1, 1, 1, 3, 3, 3]);
  });
});

// ────────────────────────────────────────────────────────────────
// MinHeap class
// ────────────────────────────────────────────────────────────────
describe("MinHeap", () => {
  test("push/pop maintains min order", () => {
    const h = new MinHeap<number>();
    h.push(5, 3, 1, 4, 2);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(2);
    expect(h.size).toBe(3);
  });

  test("peek returns min without removing", () => {
    const h = new MinHeap<number>();
    h.push(3, 1, 2);
    expect(h.peek()).toBe(1);
    expect(h.size).toBe(3);
  });

  test("tryPop returns undefined when empty", () => {
    const h = new MinHeap<number>();
    expect(h.tryPop()).toBeUndefined();
    h.push(5);
    expect(h.tryPop()).toBe(5);
    expect(h.tryPop()).toBeUndefined();
  });

  test("pop throws when empty", () => {
    expect(() => new MinHeap<number>().pop()).toThrow(RangeError);
  });

  test("fromIterable constructor", () => {
    const h = new MinHeap<number>(undefined, [5, 3, 1, 4, 2]);
    expect(h.peek()).toBe(1);
    expect(h.size).toBe(5);
  });

  test("toSortedArray returns sorted without modifying heap", () => {
    const h = new MinHeap<number>(undefined, [5, 3, 1, 4, 2]);
    expect(h.toSortedArray()).toEqual([1, 2, 3, 4, 5]);
    expect(h.size).toBe(5); // unchanged
  });

  test("drain iterates in ascending order", () => {
    const h = new MinHeap<number>(undefined, [5, 3, 1, 4, 2]);
    expect([...h.drain()]).toEqual([1, 2, 3, 4, 5]);
    expect(h.isEmpty).toBe(true);
  });

  test("[Symbol.iterator] alias of drain", () => {
    const h = new MinHeap<number>(undefined, [3, 1, 2]);
    expect([...h]).toEqual([1, 2, 3]);
  });

  test("custom comparator — sort by string length", () => {
    const h = new MinHeap<string>((a, b) => a.length - b.length);
    h.push("banana", "fig", "apple", "kiwi");
    expect(h.pop()).toBe("fig");
    expect(h.pop()).toBe("kiwi");
  });

  test("pushPop and replace", () => {
    const h = new MinHeap<number>(undefined, [1, 3, 5]);
    expect(h.pushPop(2)).toBe(1);
    expect(h.replace(10)).toBe(2);
  });

  test("isEmpty", () => {
    const h = new MinHeap<number>();
    expect(h.isEmpty).toBe(true);
    h.push(1);
    expect(h.isEmpty).toBe(false);
  });

  test("chaining push", () => {
    const h = new MinHeap<number>().push(3).push(1).push(2);
    expect(h.pop()).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────────
// MaxHeap class
// ────────────────────────────────────────────────────────────────
describe("MaxHeap", () => {
  test("push/pop maintains max order", () => {
    const h = new MaxHeap<number>();
    h.push(1, 5, 3, 2, 4);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBe(4);
  });

  test("peek returns max", () => {
    const h = new MaxHeap<number>(undefined, [1, 5, 3]);
    expect(h.peek()).toBe(5);
  });

  test("drain descending", () => {
    const h = new MaxHeap<number>(undefined, [3, 1, 4, 1, 5, 9, 2, 6]);
    expect([...h.drain()]).toEqual([9, 6, 5, 4, 3, 2, 1, 1]);
  });

  test("custom comparator reversed → acts as MinHeap", () => {
    const h = new MaxHeap<number>((a, b) => b - a); // double invert = min
    h.push(3, 1, 2);
    expect(h.pop()).toBe(1);
  });
});

// ────────────────────────────────────────────────────────────────
// PriorityQueue class
// ────────────────────────────────────────────────────────────────
describe("PriorityQueue", () => {
  test("dequeues in ascending priority order", () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue("low", 10);
    pq.enqueue("high", 1);
    pq.enqueue("mid", 5);
    expect(pq.dequeue()).toBe("high");
    expect(pq.dequeue()).toBe("mid");
    expect(pq.dequeue()).toBe("low");
  });

  test("FIFO stable for equal priorities", () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue("first", 5);
    pq.enqueue("second", 5);
    pq.enqueue("third", 5);
    expect(pq.dequeue()).toBe("first");
    expect(pq.dequeue()).toBe("second");
    expect(pq.dequeue()).toBe("third");
  });

  test("tryDequeue returns undefined when empty", () => {
    const pq = new PriorityQueue<number>();
    expect(pq.tryDequeue()).toBeUndefined();
    pq.enqueue(42, 1);
    expect(pq.tryDequeue()).toBe(42);
    expect(pq.tryDequeue()).toBeUndefined();
  });

  test("dequeue throws when empty", () => {
    expect(() => new PriorityQueue<number>().dequeue()).toThrow();
  });

  test("peek and peekPriority", () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue("task", 3);
    expect(pq.peek()).toBe("task");
    expect(pq.peekPriority()).toBe(3);
    expect(pq.size).toBe(1);
  });

  test("drain yields all in priority order", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(30, 3).enqueue(10, 1).enqueue(20, 2);
    expect([...pq.drain()]).toEqual([10, 20, 30]);
    expect(pq.isEmpty).toBe(true);
  });

  test("chaining enqueue", () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue("a", 3).enqueue("b", 1).enqueue("c", 2);
    expect(pq.dequeue()).toBe("b");
  });

  test("PriorityQueue.max() dequeues in descending priority order", () => {
    const pq = PriorityQueue.max<string>();
    pq.enqueue("low", 1);
    pq.enqueue("high", 10);
    pq.enqueue("mid", 5);
    expect(pq.dequeue()).toBe("high");
    expect(pq.dequeue()).toBe("mid");
    expect(pq.dequeue()).toBe("low");
  });

  test("size and isEmpty", () => {
    const pq = new PriorityQueue<number>();
    expect(pq.isEmpty).toBe(true);
    pq.enqueue(1, 1);
    expect(pq.size).toBe(1);
    expect(pq.isEmpty).toBe(false);
    pq.dequeue();
    expect(pq.isEmpty).toBe(true);
  });
});
