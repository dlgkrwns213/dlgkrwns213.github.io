class MinHeap {
  constructor() {
      this.heap = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // 배열을 비교하는 함수 (첫 번째 요소부터 비교)
  compareArrays(arr1, arr2) {
      for (let i = 0; i < arr1.length && i < arr2.length; i++) {
          if (arr1[i] < arr2[i]) return -1;
          if (arr1[i] > arr2[i]) return 1;
      }
      return 0; // 같으면 0 반환
  }

  push(value) {
      this.heap.push(value);
      this.heapifyUp();
  }

  heapifyUp() {
      let index = this.heap.length - 1;
      while (index > 0 && this.compareArrays(this.heap[index], this.heap[this.getParentIndex(index)]) < 0) {
          this.swap(index, this.getParentIndex(index));
          index = this.getParentIndex(index);
      }
  }

  pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
      return min;
  }

  heapifyDown() {
      let index = 0;
      while (this.getLeftChildIndex(index) < this.heap.length) {
          let smallerChildIndex = this.getLeftChildIndex(index);
          let rightChildIndex = this.getRightChildIndex(index);

          // 오른쪽 자식이 더 작으면
          if (rightChildIndex < this.heap.length && this.compareArrays(this.heap[rightChildIndex], this.heap[smallerChildIndex]) < 0) {
              smallerChildIndex = rightChildIndex;
          }

          // 부모가 더 작으면 종료
          if (this.compareArrays(this.heap[index], this.heap[smallerChildIndex]) <= 0) break;

          this.swap(index, smallerChildIndex);
          index = smallerChildIndex;
      }
  }

  peek() {
      return this.heap.length === 0 ? null : this.heap[0];
  }

  size() {
      return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

export default MinHeap;
