// Functional API (Python heapq style)
export {
  heapify,
  heapPush,
  heapPop,
  heapReplace,
  heapPushPop,
  heapMerge,
  nSmallest,
  nLargest,
  type Comparator,
} from "./heap.js";

// Class API
export { MinHeap } from "./MinHeap.js";
export { MaxHeap } from "./MaxHeap.js";
export { PriorityQueue, type PriorityItem } from "./PriorityQueue.js";
