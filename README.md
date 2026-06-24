# heapkit

<!-- ALL-CONTRIBUTORS-BADGE:START --><!-- ALL-CONTRIBUTORS-BADGE:END -->
[![npm version](https://img.shields.io/npm/v/heapkit.svg)](https://www.npmjs.com/package/heapkit)
[![npm downloads](https://img.shields.io/npm/dm/heapkit.svg)](https://www.npmjs.com/package/heapkit)
[![CI](https://img.shields.io/github/actions/workflow/status/trananhtung/heapkit/ci.yml?branch=main)](https://github.com/trananhtung/heapkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Zero-dependency binary heap and priority queue — TypeScript-first npm equivalent of Python `heapq`, Java `PriorityQueue`, and Go `container/heap`.**

```ts
import { MinHeap, MaxHeap, PriorityQueue, nSmallest, heapMerge } from "heapkit";

// MinHeap — always pop the smallest
const h = new MinHeap<number>();
h.push(5, 3, 1, 4, 2);
h.pop();   // 1
h.pop();   // 2
h.peek();  // 3 (no removal)

// Priority queue — FIFO-stable, lower number = higher urgency
const pq = new PriorityQueue<string>();
pq.enqueue("low task", 10).enqueue("high task", 1).enqueue("mid task", 5);
pq.dequeue(); // "high task"

// nSmallest / nLargest — O(N log k), like Python heapq.nsmallest
nSmallest(3, [5, 1, 8, 3, 9, 2, 7]); // [1, 2, 3]
nLargest(3, [5, 1, 8, 3, 9, 2, 7]);  // [9, 8, 7]
```

## Why heapkit?

Every major language ships a heap in its standard library:
- **Python**: `heapq` (stdlib) — `heappush`, `heappop`, `nsmallest`, `nlargest`, `merge`
- **Java**: `java.util.PriorityQueue`
- **Go**: `container/heap`
- **C#**: `SortedSet<T>`, `PriorityQueue<TElement,TPriority>` (since .NET 6)
- **Ruby**: `Heap` via `algorithms` gem

The best npm alternative (`heap@0.2.7`) was last updated in **2014**, has no TypeScript types, is CommonJS-only, and lacks `nSmallest`/`nLargest`/`heapMerge`. `heapkit` fills the gap.

## Install

```bash
npm install heapkit
```

## Usage

### MinHeap

```ts
import { MinHeap } from "heapkit";

// Default: natural < ordering
const h = new MinHeap<number>();
h.push(5, 3, 1, 4, 2);
h.pop();          // 1
h.peek();         // 2 (unchanged)
h.size;           // 4
h.isEmpty;        // false

// Construct from iterable
const h2 = new MinHeap<number>(undefined, [5, 3, 1, 4, 2]);
h2.peek();        // 1

// Custom comparator — sort by string length
const byLen = new MinHeap<string>((a, b) => a.length - b.length);
byLen.push("banana", "fig", "apple");
byLen.pop();      // "fig"

// Drain in sorted order
for (const n of new MinHeap(undefined, [5,3,1,4,2])) {
  console.log(n); // 1, 2, 3, 4, 5
}

// toSortedArray without modifying heap
h2.toSortedArray();  // [1, 2, 3, 4, 5]
h2.size;             // 5 — still intact

// tryPop — returns undefined when empty instead of throwing
h2.tryPop();   // 1
new MinHeap<number>().tryPop(); // undefined
```

### MaxHeap

```ts
import { MaxHeap } from "heapkit";

const h = new MaxHeap<number>();
h.push(1, 5, 3, 2, 4);
h.pop();   // 5
h.pop();   // 4
h.peek();  // 3

[...new MaxHeap(undefined, [3,1,4,1,5,9])]; // [9,5,4,3,1,1]
```

### PriorityQueue

```ts
import { PriorityQueue } from "heapkit";

// Min-priority (lower number = higher urgency, like Java PriorityQueue)
const pq = new PriorityQueue<string>();
pq.enqueue("low",   10)
  .enqueue("high",   1)
  .enqueue("mid",    5);

pq.peek();           // "high"
pq.peekPriority();   // 1
pq.dequeue();        // "high"
pq.dequeue();        // "mid"
pq.dequeue();        // "low"

// FIFO-stable: equal priorities dequeued in insertion order
pq.enqueue("first", 5).enqueue("second", 5).enqueue("third", 5);
pq.dequeue(); // "first"
pq.dequeue(); // "second"

// Max-priority (higher number = higher urgency)
const maxPQ = PriorityQueue.max<string>();
maxPQ.enqueue("low", 1).enqueue("high", 10).enqueue("mid", 5);
maxPQ.dequeue(); // "high"
```

### Functional API (Python heapq style)

```ts
import { heapify, heapPush, heapPop, heapReplace, heapPushPop } from "heapkit";

// In-place heap operations on raw arrays
const arr = [5, 3, 1, 4, 2];
heapify(arr);       // [1, 3, 2, 4, 5]
heapPush(arr, 0);   // push
heapPop(arr);       // 0 — pop smallest

// heapReplace: pop current root, push new item — O(log n), 1 sift
heapReplace(arr, 10); // returns old root, pushes 10

// heapPushPop: push then pop smallest — often returns the pushed item
heapPushPop(arr, 99); // returns 1 (was smallest), keeps 99 in heap
```

### nSmallest / nLargest

```ts
import { nSmallest, nLargest } from "heapkit";

const data = [5, 1, 8, 3, 9, 2, 7, 4, 6, 0];

nSmallest(3, data); // [0, 1, 2]  — ascending
nLargest(3, data);  // [9, 8, 7]  — descending

// Custom key function via comparator
const words = ["banana", "fig", "apple", "kiwi", "cherry"];
nSmallest(2, words, (a, b) => a.length - b.length);
// ["fig", "kiwi"] — 2 shortest words
```

### heapMerge

```ts
import { heapMerge } from "heapkit";

// Merge multiple pre-sorted iterables into one sorted output — O(N log k)
// Like Python heapq.merge(*iterables)
[...heapMerge([[1, 4, 7], [2, 5, 8], [3, 6, 9]])]
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## API

### Functional API

| Export | Description |
|--------|-------------|
| `heapify(arr, cmp?)` | In-place O(n) heapification. |
| `heapPush(arr, item, cmp?)` | Push item. O(log n). |
| `heapPop(arr, cmp?)` | Pop smallest. O(log n). Throws if empty. |
| `heapReplace(arr, item, cmp?)` | Replace root, return old root. O(log n). |
| `heapPushPop(arr, item, cmp?)` | Push then pop smallest. O(log n). |
| `nSmallest(n, iter, cmp?)` | n smallest items ascending. O(N log k). |
| `nLargest(n, iter, cmp?)` | n largest items descending. O(N log k). |
| `heapMerge(iters, cmp?)` | Merge sorted iterables. O(N log k). |

### MinHeap\<T\>

| Method | Description |
|--------|-------------|
| `new MinHeap(cmp?, items?)` | Constructor. Optional comparator and seed iterable. |
| `.push(...items)` | Add items. O(log n). Chainable. |
| `.pop()` | Remove and return smallest. Throws if empty. |
| `.tryPop()` | Pop or return `undefined`. |
| `.peek()` | Smallest without removal. O(1). |
| `.replace(item)` | Replace root, return old root. |
| `.pushPop(item)` | Push then pop smallest. |
| `.drain()` | Generator — empties heap in sorted order. |
| `.toSortedArray()` | Non-destructive sorted copy. |
| `.toArray()` | Heap-ordered internal array copy. |
| `.size` | Item count. |
| `.isEmpty` | `true` when empty. |

### MaxHeap\<T\>

Extends `MinHeap<T>` with inverted comparator — same API, returns largest first.

### PriorityQueue\<T\>

| Method | Description |
|--------|-------------|
| `new PriorityQueue()` | Min-priority constructor. |
| `PriorityQueue.max()` | Max-priority factory (higher number = first). |
| `.enqueue(value, priority)` | Add with numeric priority. Chainable. |
| `.dequeue()` | Remove and return highest-urgency value. |
| `.tryDequeue()` | Dequeue or `undefined`. |
| `.peek()` | Next value without removal. |
| `.peekPriority()` | Priority of next item. |
| `.drain()` | Generator — all values in priority order. |
| `.size` / `.isEmpty` | Count / emptiness check. |

## vs. alternatives

| Package | TypeScript | ESM | nSmallest/nLargest | heapMerge | PriorityQueue | Last updated |
|---------|-----------|-----|-------------------|-----------|---------------|-------------|
| **heapkit** | ✅ | ✅ | ✅ | ✅ | ✅ stable FIFO | 2026 |
| heap | ❌ | ❌ | ❌ | ❌ | ❌ | 2014 |
| tinyqueue | partial | ✅ | ❌ | ❌ | ✅ | recent |
| @datastructures-js/priority-queue | ✅ | ✅ | ❌ | ❌ | ✅ | recent |

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START --><!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © [trananhtung](https://github.com/trananhtung)
