class Node {
  constructor(object) {
    this.object = object;
    this.bef = null;
    this.next = null;
  }

  getValue() {
    return this.object;
  }

  setValue(value) {
    this.object = value;
  }

  getNext() {
    return this.next;
  }

  setNext(anotherNode) {
    this.next = anotherNode;
  }

  getBefore() {
    return this.bef;
  }

  setBefore(anotherNode) {
    this.bef = anotherNode;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(object) {
    let node = new Node(object);

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.setNext(node);
      node.setBefore(this.tail);
      this.tail = node;
    }

    this.length++;
  }

  pop() {
    if (this.length === 0) {
      throw new Error('No data in Queue');
    }

    let head = this.head;
    this.head = head.getNext();

    if (this.head) {
      this.head.setBefore(null);
    } else {
      this.tail = null;
    }

    head.setNext(null);
    this.length--;

    return head.getValue();
  }

  isEmpty() {
    return this.length === 0;
  }

  size() {
    return this.length;
  }

  toString() {
    let current = this.head;
    let result = [];
    while (current) {
      result.push(current.getValue());
      current = current.getNext();
    }
    return result.join(' -> ');
  }
}

export default Queue;