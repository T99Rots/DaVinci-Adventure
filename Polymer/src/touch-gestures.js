class CustomEventTarget extends window.Event {
  constructor(type) {
    super(type);
    this._listeners = {};
  }

  on(eventName, listener) {
    if(!this._listeners[eventName]) this._listeners[eventName] = new Map();
    this._listeners[eventName].set(listener);
  }

  once(eventName, listener) {
    if(!this._listeners[eventName]) this._listeners[eventName] = new Map();
    this._listeners[eventName].set(listener, true);
  }

  dispatch(event) {
    if(typeof event.type !== 'string') return;
    if(!this._listeners[event.type]) return;
    this._listeners[event.type].forEach((once, listener) => {
      if(once) this._listeners[event.type].delete(listener);
      listener(event);
    });
    if(this._listeners[event.type].size < 1) delete this._listeners[event.type];
  }

  removeListener(eventName, listener) {
    this._listeners[eventName].delete(listener);
    if(this._listeners[eventName].size < 1) delete this._listeners[eventName];
  }
}

class SwipeEvent extends CustomEventTarget {
  constructor({
    type,
    start,
    maxSimultaneousTouchCount,
    individualTouchCount,
    currentTouchCount,
    startX,
    startY,
    movedX,
    movedY
  }) {
    super(type);
    this.swipeStart = start;
    this.maxSimultaneousTouchCount = maxSimultaneousTouchCount;
    this.individualTouchCount = individualTouchCount;
    this.currentTouchCount = currentTouchCount;
    this.startX = startX;
    this.startY = startY;
    this.movedX = movedX;
    this.movedY = movedY;
  }
}

class SwipeUpdateEvent extends window.Event {
  constructor({
    maxSimultaneousTouchCount,
    individualTouchCount,
    currentTouchCount,
    movedX,
    movedY,
    movedXFromLastUpdate,
    movedYFromLastUpdate
  }) {
    super('update');
    this.maxSimultaneousTouchCount = maxSimultaneousTouchCount;
    this.individualTouchCount = individualTouchCount;
    this.currentTouchCount = currentTouchCount;
    this.movedXFromLastUpdate = movedXFromLastUpdate;
    this.movedYFromLastUpdate = movedYFromLastUpdate;
    this.movedX = movedX;
    this.movedY = movedY;
  }
}

class SwipeEndEvent extends window.Event {
  constructor({
    start,
    end,
    maxSimultaneousTouchCount,
    individualTouchCount,
    startX,
    startY,
    movedX,
    movedY
  }) {
    super('end');
    this.swipeStart = start;
    this.swipeEnd = end;
    this.swipeDuration = end - start;
    this.maxSimultaneousTouchCount = maxSimultaneousTouchCount;
    this.individualTouchCount = individualTouchCount;
    this.startX = startX;
    this.startY = startY;
    this.movedX = movedX;
    this.movedY = movedY;
    this.endX = startX + movedX;
    this.endY = startY + movedY;
  }
}

class TabEvent extends window.Event {
  constructor({
    start,
    end,
    maxSimultaneousTouchCount,
    individualTouchCount,
    clientX,
    clientY,
    screenX,
    screenY
  }) {
    super('tab');
    this.tabStart = start;
    this.tabEnd = end;
    this.duration = end - start;
    this.maxSimultaneousTouchCount = maxSimultaneousTouchCount;
    this.individualTouchCount = individualTouchCount;
    this.clientX = clientX;
    this.clientY = clientY;
    this.screenX = screenX;
    this.screenY = screenY;
  }
}

class DoubleTabEvent extends window.Event {
  constructor({
    firstTabStart,
    firstTabEnd,
    lastTabStart,
    lastTabEnd,
    clientX,
    clientY,
    screenX,
    screenY
  }) {
    super('double-tab');
    this.firstTabStart = firstTabStart;
    this.firstTabEnd = firstTabEnd;
    this.firstTouchDuration = firstTabEnd - firstTabStart;
    this.lastTabStart = lastTabStart;
    this.lastTabEnd = lastTabEnd;
    this.lastTouchDuration = lastTabEnd - lastTabStart;
    this.duration = lastTabEnd - firstTabStart;
    this.clientX = clientX;
    this.clientY = clientY;
    this.screenX = screenX;
    this.screenY = screenY;
  }
}

export const attachGestureObserver = (element, {
  swipeRegisterThreshold = 20,
  doubleClickInterval = 300
} = {}) => {
  let activeTouchGesture = null;
  let lastTab = null;

  const touchStartHandler = e => {
    // e.preventDefault();
    for(const changedTouch of e.changedTouches) {
      if(activeTouchGesture === null) {
        const startTime = Date.now();
        activeTouchGesture = {
          touches: new Map([[changedTouch.identifier, {
            startX: changedTouch.clientX,
            startY: changedTouch.clientY,
            movedX: 0,
            movedY: 0,
            startTime
          }]]),
          screenStartX: changedTouch.screenX,
          screenStartY: changedTouch.screenY,
          startX: changedTouch.clientX,
          startY: changedTouch.clientY,
          startTime,
          identified: false,
          maxSimultaneousTouchCount: 1,
          individualTouchCount: 1,
          type: null,
          movedXAverage: 0,
          movedYAverage: 0,
        }
      } else {
        activeTouchGesture.touches.set(changedTouch.identifier, {
          startX: changedTouch.clientX,
          startY: changedTouch.clientY,
          movedX: 0,
          movedY: 0
        });
        if(activeTouchGesture.touches.size > activeTouchGesture.maxSimultaneousTouchCount) {
          activeTouchGesture.maxSimultaneousTouchCount = activeTouchGesture.touches.size;
        }
        activeTouchGesture.individualTouchCount++;
      }
    }
  }

  const touchEndHandler = e => {
    // e.preventDefault();
    for(const changedTouch of e.changedTouches) {
      activeTouchGesture.touches.delete(changedTouch.identifier);
      if(activeTouchGesture.touches.size < 1) {
        if(!activeTouchGesture.identified) {
          //dispatch the tab event
          console.log(activeTouchGesture);
          element.dispatchEvent(new TabEvent({
            start: activeTouchGesture.startTime,
            end: Date.now(),
            maxSimultaneousTouchCount: activeTouchGesture.maxSimultaneousTouchCount,
            individualTouchCount: activeTouchGesture.individualTouchCount,
            clientX: activeTouchGesture.startX,
            clientY: activeTouchGesture.startY,
            screenX: activeTouchGesture.screenStartX,
            screenY: activeTouchGesture.screenStartY
          }));
          
          // look if there was a tab within the double tab interval limit, if so
          // dispatch the double tab event
          if(lastTab !== null && lastTab.time > Date.now() - doubleClickInterval) {
            element.dispatchEvent(new DoubleTabEvent({
              firstTabStart: lastTab.startTime,
              firstTabEnd: lastTab.time,
              lastTabStart: activeTouchGesture.startTime,
              lastTabEnd: Date.now(),
              clientX: activeTouchGesture.startX,
              clientY: activeTouchGesture.startY,
              screenX: activeTouchGesture.screenStartX,
              screenY: activeTouchGesture.screenStartY
            }));
          }

          // set the last tab to this tab
          lastTab = {
            time: Date.now(),
            startTime: activeTouchGesture.startTime
          }
        } else {
          activeTouchGesture.instance.dispatch(new SwipeEndEvent({
            start: activeTouchGesture.startTime,
            end: Date.now(),
            maxSimultaneousTouchCount: activeTouchGesture.maxSimultaneousTouchCount,
            individualTouchCount: activeTouchGesture.individualTouchCount,
            startX: activeTouchGesture.startX,
            startY: activeTouchGesture.startY,
            movedX: activeTouchGesture.movedXAverage,
            movedY: activeTouchGesture.movedYAverage
          }))
        }
        activeTouchGesture = null;
      }
    }
  }

  const touchMoveHandler = e => {
    e.preventDefault();
    const activeTouches = activeTouchGesture.touches.size;
    for(const changedTouch of e.changedTouches) {
      const thisTouch = activeTouchGesture.touches.get(changedTouch.identifier);
      const oldMovedX = thisTouch.movedX;
      const oldMovedY = thisTouch.movedY;
      thisTouch.movedX = changedTouch.clientX - thisTouch.startX;
      thisTouch.movedY = changedTouch.clientY - thisTouch.startY;
      const movedXDifference = thisTouch.movedX - oldMovedX;
      const movedYDifference = thisTouch.movedY - oldMovedY;
      const lastMovedXAverage = activeTouchGesture.movedXAverage;
      const lastMovedYAverage = activeTouchGesture.movedYAverage;
      activeTouchGesture.lastMovedXAverage = lastMovedXAverage;
      activeTouchGesture.lastMovedYAverage = lastMovedYAverage;
      activeTouchGesture.movedXAverage+= movedXDifference / activeTouches;
      activeTouchGesture.movedYAverage+= movedYDifference / activeTouches;
    }
    if(
      !activeTouchGesture.identified
      && (
        Math.abs(activeTouchGesture.movedXAverage) > swipeRegisterThreshold
        || Math.abs(activeTouchGesture.movedYAverage) > swipeRegisterThreshold
      )
    ) {
      activeTouchGesture.identified = true;
      if(Math.abs(activeTouchGesture.movedXAverage) > Math.abs(activeTouchGesture.movedYAverage)) {
        activeTouchGesture.type = 'horizontal-swipe';
      } else {
        activeTouchGesture.type = 'vertical-swipe';
      }
      const instance = new SwipeEvent({
        type: activeTouchGesture.type,
        start: activeTouchGesture.startTime,
        maxSimultaneousTouchCount: activeTouchGesture.maxSimultaneousTouchCount,
        individualTouchCount: activeTouchGesture.individualTouchCount,
        currentTouchCount: activeTouchGesture.touches.size,
        startX: activeTouchGesture.startX,
        startY: activeTouchGesture.startY,
        movedX: activeTouchGesture.movedXAverage,
        movedY: activeTouchGesture.movedYAverage
      });
      activeTouchGesture.instance = instance;
      element.dispatchEvent(instance);
    }
    if(activeTouchGesture.identified) {
      activeTouchGesture.instance.dispatch(new SwipeUpdateEvent({
        maxSimultaneousTouchCount: activeTouchGesture.maxSimultaneousTouchCount,
        individualTouchCount: activeTouchGesture.individualTouchCount,
        currentTouchCount: activeTouchGesture.touches.size,
        movedX: activeTouchGesture.movedXAverage,
        movedY: activeTouchGesture.movedYAverage,
        movedXFromLastUpdate: activeTouchGesture.movedXAverage - activeTouchGesture.lastMovedXAverage,
        movedYFromLastUpdate: activeTouchGesture.movedYAverage - activeTouchGesture.lastMovedYAverage
      }));
    }
  }

  element.addEventListener('touchstart', touchStartHandler);
  element.addEventListener('touchend', touchEndHandler);
  element.addEventListener('touchmove', touchMoveHandler);
  return () => {
    element.removeEventListener('touchstart', touchStartHandler);
    element.removeEventListener('touchend', touchEndHandler);
    element.removeEventListener('touchmove', touchMoveHandler);
    activeTouchGesture = null;
  }
}