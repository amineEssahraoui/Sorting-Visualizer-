document.addEventListener('DOMContentLoaded', () => {
    const barsContainer = document.getElementById('bars-container');
    const generateRandomButton = document.getElementById('generate-random');
    const customInput = document.getElementById('custom-input');
    const applyCustomButton = document.getElementById('apply-custom');
    const algorithmSelect = document.getElementById('algorithm-select');
    const startSortButton = document.getElementById('start-sort');
    const stopSortButton = document.getElementById('stop-sort');
    const speedSlider = document.getElementById('speed-slider');
    const barCountInput = document.getElementById('bar-count-input');
  
    let bars = [];
    let sorting = false;
    let animationDelay = 50;
    let audioContext;
  
    window.addEventListener('click', () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
    }, { once: true });
  
    function generateBars(count) {
      bars = [];
      barsContainer.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        bars.push(value);
      }
      renderBars(bars);
    }
  
    function renderBars(data) {
      barsContainer.innerHTML = '';
      const containerWidth = barsContainer.offsetWidth;
      const barWidth = containerWidth / data.length - 4;
  
      data.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.background = `linear-gradient(to top, steelblue 0%, steelblue 100%)`;
        barsContainer.appendChild(bar);
      });
    }
  
    function applyCustomValues() {
      const inputValues = customInput.value.split(',').map(Number).filter(num => !isNaN(num));
      if (inputValues.length > 0) {
        bars = inputValues;
        renderBars(bars);
      } else {
        alert('Invalid input. Please enter comma-separated numbers.');
      }
    }
  
    function playNote(frequency) {
      if (!audioContext) return;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
  
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
  
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
  
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  
    function visualizeComparison(index1, index2) {
      const barElements = document.querySelectorAll('.bar');
      if (!barElements[index1] || !barElements[index2]) return Promise.resolve();
      
      barElements[index1].style.background = 'linear-gradient(to top, orange 0%, #ff6b6b 100%)';
      barElements[index2].style.background = 'linear-gradient(to top, orange 0%, #ff6b6b 100%)';
  
      const frequency1 = bars[index1] * 100 + 200;
      const frequency2 = bars[index2] * 100 + 200;
  
      playNote(frequency1);
      playNote(frequency2);
  
      return new Promise(resolve => {
        setTimeout(() => {
          barElements[index1].style.background = 'linear-gradient(to top, steelblue 0%, steelblue 100%)';
          barElements[index2].style.background = 'linear-gradient(to top, steelblue 0%, steelblue 100%)';
          resolve();
        }, animationDelay);
      });
    }
  
    async function visualizeSwap(index1, index2) {
      const barElements = document.querySelectorAll('.bar');
      barElements[index1].style.background = 'linear-gradient(to top, #2ecc71 0%, #27ae60 100%)';
      barElements[index2].style.background = 'linear-gradient(to top, #2ecc71 0%, #27ae60 100%)';
  
      return new Promise(resolve => {
        setTimeout(() => {
          let tempHeight = barElements[index1].style.height;
          barElements[index1].style.height = barElements[index2].style.height;
          barElements[index2].style.height = tempHeight;
  
          barElements[index1].style.background = 'linear-gradient(to top, steelblue 0%, steelblue 100%)';
          barElements[index2].style.background = 'linear-gradient(to top, steelblue 0%, steelblue 100%)';
          resolve();
        }, animationDelay);
      });
    }
  
    async function bubbleSort() {
      sorting = true;
      let n = bars.length;
      for (let i = 0; i < n - 1; i++) {
        if (!sorting) return;
        for (let j = 0; j < n - i - 1; j++) {
          if (!sorting) return;
          await visualizeComparison(j, j + 1);
  
          if (bars[j] > bars[j + 1]) {
            await visualizeSwap(j, j + 1);
            let temp = bars[j];
            bars[j] = bars[j + 1];
            bars[j + 1] = temp;
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      }
      sorting = false;
      playCompletionSound();
    }
  
    async function selectionSort() {
      sorting = true;
      let n = bars.length;
      for (let i = 0; i < n - 1; i++) {
        if (!sorting) return;
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
          if (!sorting) return;
          await visualizeComparison(j, minIndex);
  
          if (bars[j] < bars[minIndex]) {
            minIndex = j;
          }
        }
  
        if (minIndex !== i) {
          await visualizeSwap(i, minIndex);
          let temp = bars[i];
          bars[i] = bars[minIndex];
          bars[minIndex] = temp;
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      sorting = false;
      playCompletionSound();
    }
  
    async function insertionSort() {
      sorting = true;
      let n = bars.length;
      for (let i = 1; i < n; i++) {
        if (!sorting) return;
        let key = bars[i];
        let j = i - 1;
  
        while (j >= 0 && bars[j] > key) {
          if (!sorting) return;
          await visualizeComparison(j, j + 1);
          await visualizeSwap(j, j + 1);
          bars[j + 1] = bars[j];
          j = j - 1;
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        bars[j + 1] = key;
      }
      sorting = false;
      playCompletionSound();
    }
  
    async function quickSort() {
      sorting = true;
      async function partition(low, high) {
        let pivot = bars[high];
        let i = low - 1;
  
        for (let j = low; j <= high - 1; j++) {
          if (!sorting) return;
          await visualizeComparison(j, high);
          if (bars[j] < pivot) {
            i++;
            await visualizeSwap(i, j); 
            [bars[i], bars[j]] = [bars[j], bars[i]];
          }
        }
        await visualizeSwap(i + 1, high);
        [bars[i + 1], bars[high]] = [bars[high], bars[i + 1]];
        return i + 1;
      }
  
      async function quickSortHelper(low, high) {
        if (low < high) {
          let pi = await partition(low, high);
  
          if (pi === undefined) return; 
          await quickSortHelper(low, pi - 1);
          await quickSortHelper(pi + 1, high);
        }
      }
  
      await quickSortHelper(0, bars.length - 1);
      sorting = false;
      playCompletionSound();
    }
  
    async function mergeSort() {
      sorting = true;
      async function merge(arr, l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
  
        let L = new Array(n1);
        let R = new Array(n2);
  
        for (let i = 0; i < n1; i++)
          L[i] = arr[l + i];
        for (let j = 0; j < n2; j++)
          R[j] = arr[m + 1 + j];
  
        let i = 0, j = 0, k = l;
  
        while (i < n1 && j < n2) {
          if (!sorting) return;
          await visualizeComparison(l + i, m + 1 + j);
          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          k++;
        }
        while (i < n1) {
          arr[k] = L[i];
          i++;
          k++;
        }
  
        while (j < n2) {
          arr[k] = R[j];
          j++;
          k++;
        }
        return arr;
      }
  
      async function mergeSortHelper(arr, l, r) {
        if (l >= r) {
          return;
        }
        let m = l + Math.floor((r - l) / 2);
        await mergeSortHelper(arr, l, m);
        await mergeSortHelper(arr, m + 1, r);
        await merge(arr, l, m, r);
        renderBars(arr);
      }
      await mergeSortHelper(bars, 0, bars.length - 1);
      sorting = false;
      playCompletionSound();
    }
  
    function stopSorting() {
      sorting = false;
    }
  
    function startSort() {
      if (sorting) return;
      const selectedAlgorithm = algorithmSelect.value;
  
      switch (selectedAlgorithm) {
        case 'bubble-sort':
          bubbleSort();
          break;
        case 'selection-sort':
          selectionSort();
          break;
        case 'insertion-sort':
          insertionSort();
          break;
        case 'merge-sort':
          mergeSort();
          break;
        case 'quick-sort':
          quickSort();
          break;
        default:
          alert('Algorithme non reconnu.');
      }
    }
  
    function playCompletionSound() {
      if (!audioContext) return;
  
      const now = audioContext.currentTime;
      const duration = 0.5; 
      const sortedBars = [...bars].sort((a, b) => a - b); 
  
      sortedBars.forEach((value, index) => {
        const barElement = document.querySelectorAll('.bar')[bars.indexOf(value)]; 
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
  
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(value * 10 + 200, now + (index * 0.05)); 
  
        gainNode.gain.setValueAtTime(0.1, now + (index * 0.05)); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.05) + duration);
  
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
  
        oscillator.start(now + (index * 0.05));
        oscillator.stop(now + (index * 0.05) + duration);
  
        animateBarColor(barElement, index * 0.05, duration);
      });
    }
  
    function animateBarColor(barElement, delay, duration) {
      setTimeout(() => {
        barElement.style.transition = `background ${duration}s ease-in-out`;
        barElement.style.background = `linear-gradient(to top, orange 0%, steelblue 100%)`;
  
        setTimeout(() => {
          barElement.style.background = `linear-gradient(to top, steelblue 0%, steelblue 100%)`; 
          barElement.style.transition = 'background 0.1s ease-in-out'; 
        }, duration * 1000);
      }, delay * 1000);
    }
  
    generateRandomButton.addEventListener('click', () => {
      const count = parseInt(barCountInput.value, 10) || 20;
      generateBars(count);
    });
    applyCustomButton.addEventListener('click', applyCustomValues);
    startSortButton.addEventListener('click', startSort);
    stopSortButton.addEventListener('click', stopSorting);
    speedSlider.addEventListener('input', () => {
      animationDelay = 100 - speedSlider.value;
    });
  
    generateBars(20);
  });