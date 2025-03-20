<!-- <template>
  <TransitionGroup
    name="dnd-list"
    tag="ul"
    class="dnd-list"
    ref="draggable-list"
  >
    <li
      v-for="(item, index) in value"
      :key="item[keyProperty]"
      ref="draggable-item"
      class="dnd-list__item"
      draggable="true"
      @dragstart="onDragStart($event, index)"
      @dragenter="onDragEnter($event, index)"
      @dragover="onDragOver"
      @dragend="onDragEnd"
      @drag="handleMove"
    >
      <slot name="item" :item="item" />
    </li>
  </TransitionGroup>
  <ul class="dnd-list">
    <li
      v-for="(item, index) in currentValue"
      :key="item[keyProperty]"
      :ref="`item_${index}`"
      class="dnd-list__item"
      @mousedown="onDragStart($event, index)"
      @touchstart="onDragStart($event, index)"
    >
      <slot name="item" :item="item" />
    </li>
  </ul>
</template>

<script>
function throttle(func, delay) {
	let timerFlag = null;
	return function(...args) {
    if (timerFlag === null) {
      func(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
	};
}

export default {
  name: 'dnd-list',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    keyProperty: {
      type: String,
      default: 'key',
    },
  },

  data () {
    return {
      isDragging: false,
      draggedItem: null,
      draggedOffsetX: null,
      draggedOffsetY: null,
      draggedIndex: null,
      draggedInitialIndex: null,
      dragetItemRect: null,
      bindOnMove: this.onMove.bind(this),
      bindOnDragEnd: this.onDragEnd.bind(this),
    };
  },

  computed: {
    currentValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      },
    },
  },

  mounted () {
    console.log('[MONTED]', this.$refs);
  },

  beforeDestroy () {
    this.bindEvents(true);
  },

  methods: {
    onDragStart (event, index) {
      const target = event.target;
      const targetRect = target.getBoundingClientRect();
      const touch = event.touches ? event.touches[0] : event;

      this.isDragging = true;
      this.draggedOffsetX = touch.clientX;
      this.draggedOffsetY = touch.clientY;
      this.draggedIndex = index;
      this.draggedInitialIndex = index;
      this.draggedItem = target.cloneNode(true);

      event.currentTarget.style.visibility = 'hidden';

      Object.assign(this.draggedItem.style, {
        position: 'fixed',
        top: `${targetRect.top}px`,
        left: `${targetRect.left}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        'will-change': 'transform',
        transition: 'transform 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)',
      });

      this.bindEvents();
      document.body.appendChild(this.draggedItem);
    },
    onDragEnd () {
      const copy = [...this.currentValue];
      const [draggetItem] = copy.splice(this.draggedInitialIndex, 1);
      copy.splice(this.draggedIndex, 0, draggetItem);

      this.bindEvents(true);

      requestAnimationFrame(() => {
        this.isDragging = false;
        this.draggingIndex = null;
        this.currentValue = [...copy];
        this.clearItemsTrasform();
        document.body.removeChild(this.draggedItem);
      });
    },
    onMove (event) {
      if (!this.isDragging || !this.draggedItem) return;

      event.preventDefault();

      const touch = event.touches ? event.touches[0] : event;
      const x = touch.clientX - this.draggedOffsetX;
      const y = touch.clientY - this.draggedOffsetY;

      this.draggedItem.style.transform = `translate(${x}px, ${y}px)`;

      const draggedItemRect = this.draggedItem.getBoundingClientRect();
      const draggedCenterY = draggedItemRect.top + draggedItemRect.height / 2;

      const prevIndex = this.draggedIndex - 1;
      const nextIndex = this.draggedIndex + 1;

      const prevItem = prevIndex >= 0 ? this.$refs[`item_${prevIndex}`][0] : null;
      const nextItem = nextIndex < this.currentValue.length ? this.$refs[`item_${nextIndex}`][0] : null;

      if (prevItem) {
        const prevItemRect = prevItem.getBoundingClientRect();
        const prevCenterY = prevItemRect.top + prevItemRect.height / 2;

        if (draggedCenterY < prevCenterY) {
          // this.swapItems(prevIndex);
          this.draggedIndex = prevIndex;
          console.log('[PREV]', prevIndex, prevItem.style.transform);

          prevItem.classList.toggle('dnd-list__item--forward')
          const newTrasform = prevItem.style.transform ? null : `translateY(${prevItemRect.height}px)`;
          prevItem.style.transform = newTrasform;
          console.log('[PREV]', prevIndex, prevItem.style.transform);
        }
      }

      if (nextItem) {
        console.log(nextItem, nextItem.style, nextItem.$el);
        
        const nextItemRect = nextItem.getBoundingClientRect();
        const nextCenterY = nextItemRect.top + nextItemRect.height / 2;

        console.log('[NEXT]', this.draggedIndex, nextIndex);

        if (draggedCenterY > nextCenterY) {
          console.log('[NEXT]', nextIndex, nextItem.style.transform);
          // this.swapItems(nextIndex);
          this.draggedIndex = nextIndex;
          const newTrasform = nextItem.style.transform ? null : `translateY(-${nextItemRect.height}px)`;
          nextItem.style.transform = newTrasform;
          console.log('[NEXT]', nextIndex, nextItem.style.transform);
        }
      }

      // if (prevItemRect && draggedItemRect.top < prevItemRect.top + prevItemRect.height / 2) {
      //   this.draggedIndex = prevIndex;
      //   const newTrasform = prevItem.style.transform ? null : 'translateY(100%)';
      //   prevItem.style.transform = newTrasform;
      //   console.log('[PREV]', prevIndex, newTrasform, prevItem.style.transform);
      // } else if (nextItemRect && draggedItemRect.top + draggedItemRect.height > nextItemRect.top + nextItemRect.height / 2) {
      //   this.draggedIndex = nextIndex;
      //   const newTrasform = nextItem.style.transform ? null : 'translateY(-100%)';
      //   nextItem.style.transform = newTrasform;
      //   console.log('[NEXT]', nextIndex, newTrasform, nextItem.style.transform);
      // }
    },
    swapItems (index) {
      if (index === this.draggedIndex) return;


    },
    bindEvents (remove = false) {
      const method = remove ? 'removeEventListener' : 'addEventListener';
      document[method]('mousemove', this.bindOnMove);
      document[method]('touchmove', this.bindOnMove, { passive: false });
      document[method]('mouseup', this.bindOnDragEnd);
    },
    clearItemsTrasform () {
      for (let i = 0; i < this.currentValue.length; i++) {
        this.$refs[`item_${i}`][0].style.transform = null;
        this.$refs[`item_${i}`][0].style.visibility = 'visible';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style> -->


<template>
  <div class="draggable-list">
    <div
      v-for="(item, index) in items"
      ref="draggable-items"
      :key="item[idProperty] || item"
      class="draggable-item"
      draggable="true"
      :style="{ visability: index === itemDragged ? 'hidden' : undefined }"
      :data-index="index"
    >
      <slot :item="item" />
    </div>
    <div
      v-if="isDragging"
      ref="ghost"
      class="draggable-item draggable-item--shadow"
      draggable="true"
      :style="shadowStyles"
    >
      <slot :item="items[itemDragged]" />
    </div>
  </div>
</template>

<script>
const schd = (fn) => {
  let lastArgs = [];
  let frameId = null;

  const wrapFn = (...args) => {
    lastArgs = args;
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      fn(...lastArgs);
      frameId = null;
    });
  };
  wrapFn.cancel = () => {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = null;
  };
  return wrapFn;
};

export default {
  name: 'dnd-list',
  props: {
    // list: {
    //   type: Array,
    //   default: () => [],
    // },
    transitionDuration: {
      type: String,
      default: '0.2s',
    },
    idProperty: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      dropTimeout: null,
      itemDragged: -1,
      itemDraggedOutOfBounds: -1,
      selectedItem: -1,
      initialX: 0,
      initialY: 0,
      targetX: 0,
      targetY: 0,
      targetTransformX: 0,
      targetTransformY: 0,
      targetHeight: 0,
      targetWidth: 0,
      initialYOffset: 0,
      lastYOffset: 0,
      lastListYOffsset: 0,
      schdOnMouseMove: schd(this.onMouseMove),
      schdOnTouchMove: schd(this.onTouchMove),
      schdOnEnd: schd(this.onEnd),
    };
  },
  computed: {
    shadowStyles() {
      return {
        position: 'fixed',
        top: `${this.targetY}px`,
        left: `${this.targetX}px`,
        width: `${this.targetWidth}px`,
        height: `${this.targetHeight}px`,
        transform: `translate(${this.targetTransformX}px, ${this.targetTransformY}px)`,
        marginTop: 0,
      };
    },
    isDragging() {
      return this.itemDragged > -1;
    },
  },
  mounted() {
    document.addEventListener('touchstart', this.onMouseOrTouchStart, {
      passive: false,
      capture: false,
    });
    document.addEventListener('mousedown', this.onMouseOrTouchStart);
  },
  beforeUnmount() {
    document.removeEventListener('touchstart', this.onMouseOrTouchStart);
    document.removeEventListener('mousedown', this.onMouseOrTouchStart);
  },
  methods: {
    onMouseOrTouchStart(event) {
      console.log('onMouseOrTouchStart', event);
      
      if (this.dropTimeout && this.itemDragged > -1) {
        clearTimeout(this.dropTimeout);
        this.finishDrop();
      }

      const isTouch = this.isTouchEvent(event);
      const targetIndex = this.getTargetIndex(event);
      console.log('onMouseOrTouchStart', targetIndex);

      if (targetIndex < 0) {
        return;
      }

      let draggedItem = this.getTagetElement(targetIndex);
      console.log('onMouseOrTouchStart', draggedItem);

      event.preventDefault();
      this.$emit('beforeDrag');

      if (isTouch) {
        const options = { passive: false };
        document.addEventListener('touchcancel', this.schdOnEnd, options);
        document.addEventListener('touchend', this.schdOnEnd, options);
        document.addEventListener('touchmove', this.schdOnTouchMove, options);
        draggedItem.style.touchAction = 'none';
      } else {
        document.addEventListener('mousemove', this.schdOnMouseMove);
        document.addEventListener('mouseup', this.schdOnEnd);
        const mouseDraggedItem = this.getTagetElement(this.itemDragged);
        if (mouseDraggedItem && mouseDraggedItem.style) mouseDraggedItem.style.touchAction = 'none';
      }

      this.onStart(
        draggedItem,
        isTouch ? event.touches[0].clientX : event.clientX,
        isTouch ? event.touches[0].clientY : event.clientY,
        targetIndex
      );
    },
    onStart(element, clientX, clientY, index) {
      console.log('onStart', element, clientX, clientY, index);

      const targetRect = element.getBoundingClientRect();
      const targetStyles = window.getComputedStyle(element);
      console.log('onStart', targetRect);
      console.log('onStart', {...targetStyles}, targetStyles['margin-left']);

      this.initialYOffset = this.getYOffset();
      this.lastYOffset = window.pageYOffset;
      this.lastListYOffsset = this.$refs.list?.scrollTop || 0;
      this.itemDragged = index;
      this.initialX = clientX;
      this.initialY = clientY;
      this.targetX = targetRect.left - parseInt(targetStyles['marginLeft'], 0);
      this.targetY = targetRect.top - parseInt(targetStyles['marginTop'], 0);
      this.targetWidth = targetRect.width;
      this.targetHeight = targetRect.height;
      console.log('onStart initialX', this.initialX);
      console.log('onStart initialY', this.initialY);
      console.log('onStart targetX', this.targetX);
      console.log('onStart targetY', this.targetY);
      console.log('onStart itemDragged', this.itemDragged);
    },
    onMouseMove(event) {
      console.log('onMouseMove', event);

      event.preventDefault();
      this.onMove(event.clientX, event.clientY);
    },
    onTouchMove(event) {
      console.log('onTouchMove', event);

      event.preventDefault();
      this.onMove(event.touches[0].clientX, event.touches[0].clientY);
    },
    onMove(clientX, clientY) {
      console.log('onMove', clientX, clientY);

      if (this.itemDragged < 0) return;

      this.targetTransformX = clientX - this.initialX;
      this.targetTransformY = clientY - this.initialY;
    },
    updateItemsPosition() {
      const targetRect = this.$refs.ghost.getBoundingClientRect();
      const currentYOffset = this.getYOffset();
      
    },
    isDraggedItemOutOfBounds() {
      const intialRect = this.$refs['draggable-items'][this.itemDragged].getBoundingClientRect();
      const targetRect = this.$refs.ghost.getBoundingClientRect();
      if (Math.abs(intialRect.left - targetRect.left) > targetRect.width) {
        this.itemDraggedOutOfBounds = this.itemDragged;
        return true;
      }
      this.itemDraggedOutOfBounds = -1;
      return false;
    },
    finishDrop() {

    },
    onEnd() {

    },
    createGhostTarget(index) {
      const element = this.getTagetElement(index);
      if (!elenemt) return;
      const element_clone = element.cloneNode(true);
      document.body.appendChild()
    },
    getTargetIndex(event) {
      if (!this.$refs['draggable-items'] || !this.$refs['draggable-items'].length) return -1;
      return this.$refs['draggable-items'].findIndex(
        (item) => item === event.target || item.contains(event.target)
      );
    },
    getTagetElement(index) {
      if (!this.$refs['draggable-items'] || !this.$refs['draggable-items'].length) return null;
      return this.$refs['draggable-items'][index];
    },
    isTouchEvent(event) {
      return (
        (event.touches && event.touches.length) ||
        (event.changedTouches && event.changedTouches.length)
      );
    },
    getYOffset() {
      const listYOffset = this.$refs.list
        ? this.$refs.list.scrollTop
        : 0;
      return window.pageYOffset + listYOffset;
    },
  },
};
</script>

<style scoped>

</style>
