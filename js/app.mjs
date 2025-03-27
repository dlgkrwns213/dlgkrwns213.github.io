import { bfs, dfs, dijkstra } from './functions.mjs'; // 경로는 실제 위치에 맞게 수정

const app = Vue.createApp({
  data() {
    return {
      nodes: [],
      lines: [],
      selectedNode: null,
      currentLine: null,
      graphConnections: [],
      inputFields: [],
      userDone: [],  // user 가 한 행동 (행동 취소 지원) 'node' or 'line'
 
      headerHeight: 0, // 헤더 높이 100px로 설정
      startIdx: -1,
      nodeSelecting: [],
      nodeSelected: [],
      isProcessing: false,
      nodeOrders: [],
    };
  },
  methods: {
    handleClick(event) {
      if (this.selectedNode !== null) return;

      const x = event.clientX;
      const y = event.clientY - this.headerHeight; // 헤더 고려

      for (const alreadyNode of this.nodes) {
        let ax = alreadyNode.x;
        let ay = alreadyNode.y;

        if (Math.sqrt((x - ax) * (x - ax) + (y - ay) * (y - ay)) <= 80) {
          alert('Too close');
          return;
        }
      }
      this.addNode(x, y);
      this.nodeOrders.push(NaN);

      if (this.startIdx === -1) {
        this.nodeSelecting = [1];
        this.startIdx = 1;
      }
    },
    addNode(x, y) {
      this.nodes.push({ x, y });
      this.userDone.push('node');
    },
    connectNode(index, event) {
      if (event.ctrlKey) {
        this.startIdx = index+1;
        this.nodeSelecting = [this.startIdx];
        return;
      }
      if (this.selectedNode === null) {
        this.selectedNode = index;
        window.addEventListener('mousemove', this.drawLine);
      } else {
        if (this.selectedNode !== index) {
          this.lines.push({
            x1: this.nodes[this.selectedNode].x,
            y1: this.nodes[this.selectedNode].y,
            x2: this.nodes[index].x,
            y2: this.nodes[index].y,
          });

          let lastLine = this.lines[this.lines.length - 1];
          let xMid = (lastLine.x1 + lastLine.x2) / 2;
          let yMid = (lastLine.y1 + lastLine.y2) / 2;
          this.inputFields.push({x: xMid, y: yMid, value: 1})

          let mn = Math.min(this.selectedNode, index) + 1;
          let mx = Math.max(this.selectedNode, index) + 1;
          this.graphConnections.push([mn, mx, 1]);
          this.userDone.push('line');
        }
        this.selectedNode = null;
        window.removeEventListener('mousemove', this.drawLine);
        this.currentLine = null;
      }
    },
    updateGraphConnection(index) {
      // inputFields에서 값을 가져와서 graphConnections 업데이트
      const inputValue = this.inputFields[index].value;
  
      // graphConnections에서 해당 인덱스의 두 번째 값을 업데이트
      this.graphConnections[index][2] = inputValue;
  
      // 업데이트 후 콘솔로 확인
      console.log("Updated graphConnections:", this.graphConnections);
    },
    drawLine(event) {
      if (this.selectedNode !== null) {
        this.currentLine = {
          x1: this.nodes[this.selectedNode].x,
          y1: this.nodes[this.selectedNode].y,
          x2: event.clientX,
          y2: event.clientY - this.headerHeight, // 헤더 높이 고려
        };
      }
    },
    handleMouseDown(event) {
      if (event.button === 2) {
        event.preventDefault();
        this.selectedNode = null;
        this.currentLine = null;
        window.removeEventListener('mousemove', this.drawLine);
      }
    },
    cancelUserDone() {
      const done = this.userDone.pop();
      if (done === undefined) {
        alert('처음 상태입니다.')
        return;
      }

      if (done === 'node') {
        this.nodes.pop();
        this.nodeOrders.pop();
        if (this.nodeOrders.length === 0) {
          this.nodeSelecting = [];
          this.startIdx = -1;
        }
      } else {
        this.lines.pop();
        this.inputFields.pop();
        this.graphConnections.pop();
      }
    },

    cancelAllUserDone() {
      this.userDone = [];
      this.nodes = [];
      this.nodeOrders = [];
      this.nodeSelecting = [];
      this.startIdx = -1;
      this.lines = [];
      this.inputFields = [];
      this.graphConnections = [];
    },

    // bfs 함수 버튼
    async clickBFSButton(level) {
      if (this.startIdx === -1)
        return;

      this.isProcessing = true;
      this.nodeOrders.fill(NaN);

      const { levels, orderIdx } = bfs(this.nodes, this.graphConnections, this.startIdx);
      if (level)
        await this.colorButton(levels, true);
      else
        await this.colorButton(orderIdx);

      this.isProcessing = false;
    },

    // dfs 함수 버튼
    async clickDFSButton() {
      if (this.startIdx === -1)
        return;

      this.isProcessing = true;
      this.nodeOrders.fill(NaN);

      const dfsNodeOrder = dfs(this.nodes, this.graphConnections, this.startIdx);
      await this.colorButton(dfsNodeOrder);

      this.isProcessing = false;
    },

    async clickDijkstraButton() {
      if (this.startIdx === -1)
        return;

      this.isProcessing = true;
      this.nodeOrders.fill(NaN);

      const dijkstraNodeOrder = dijkstra(this.nodes, this.graphConnections, this.startIdx);
      await this.colorButton(dijkstraNodeOrder);

      this.isProcessing = false;
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async colorButton(Arrays, isMulti = false) {
      console.log(Arrays)
      if (isMulti) {
        for (let idx = 0; idx < Arrays.length; idx++) {
          let now = Arrays[idx]
          console.log(now);
          this.nodeSelecting = [...now];
          this.nodeSelected.push([...now]);

          for (let node of now)
            this.nodeOrders[node-1] = idx+1;
          
          await this.delay(500);
        }
      } else {
        for (let idx = 0; idx < Arrays.length; idx++) {
          // 현재 노드를 nodeSelecting에 설정

          this.nodeSelecting = [Arrays[idx]]; 
          this.nodeSelected.push(Arrays[idx]); // 해당 인덱스를 nodeSelected에 추가
          this.nodeOrders[Arrays[idx]-1] = idx+1;
          // 0.5초(500ms) 대기
          await this.delay(500);
        }
      }

      console.log(this.nodeOrders);
        
      // nodeSelecting 초기화 후 1초 후 nodesSelecting과 nodeSelected 다시 초기화
      this.nodeSelecting = [];
      await this.delay(1000);
      this.nodeSelecting = [this.startIdx]
      this.nodeSelected = [];

    },
  },
  watch: {
    inputFields: {
      handler(newInputFields) {
        // inputFields의 값이 변경될 때마다 graphConnections를 업데이트
        newInputFields.forEach((inputField, index) => {
          // 각 inputField의 value가 변경되면 해당하는 graphConnections의 두 번째 값을 업데이트
          const line = this.graphConnections[index];
          line[2] = inputField.value;
        });
      },
      deep: true, // 배열 내부 객체의 변화를 추적하려면 deep 옵션을 true로 설정
    },
  }
});

app.mount('#app');
