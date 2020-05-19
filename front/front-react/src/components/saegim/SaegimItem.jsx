import React, { Component } from "react";
import {Link} from "react-router-dom";
import DefaultButton from "../common/buttons/DefaultButton";
import Card from "../common/cards/Card";

class SaegimItem extends Component {
  listElement;
  wrapper;
  background;

  dragStartX = 0;
  left = 0;
  dragged = false;

  startTime;
  fpsInterval = 1000/60;

  constructor(props) {
    super(props);

    // this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    // this.onDragStartMouse = this.onDragStartMouse.bind(this);
    this.onDragStartTouch = this.onDragStartTouch.bind(this);
    this.onDragEndMouse = this.onDragEndMouse.bind(this);
    this.onDragEndTouch = this.onDragEndTouch.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.onClicked = this.onClicked.bind(this);

    this.onSwiped = this.onSwiped.bind(this);
  }

  componentDidMount() {
    // window.addEventListener("mouseup", this.onDragEndMouse);
    window.addEventListener("touchend", this.onDragEndTouch);
  }

  componentWillMount() {
    // window.addEventListener("mouseup", this.onDragEndMouse);
    window.addEventListener("touchend", this.onDragEndTouch);
  }

  // onDragStartMouse(e) {
  //   this.onDragStart(e.clientX);
  //   window.addEventListener("mousemove", this.onMouseMove)
  // }

  onDragStartTouch(e) {
    const _touch = e.targetTouches[0];
    this.onDragStart(_touch.clientX);
    window.addEventListener("touchmove", this.onTouchMove);
  }

  onDragStart(clientX) {
    this.dragged = true;
    this.dragStartX = clientX;
    this.listElement.className = "ListItem";
    this.startTime = Date.now();
    requestAnimationFrame(this.updatePosition);
  }

  onDragEndMouse(e) {
    window.removeEventListener("mousemove", this.onMouseMove);
    this.onDragEnd();
  }

  onDragEndTouch(e) {
    window.removeEventListener("touchmove", this.onTouchMove);
    this.onDragEnd();
  }

  onDragEnd() {
    if (this.dragged) {
      this.dragged = false;
      if (Math.abs(this.left) > this.listElement.offsetWidth / 2) {
        this.left = -this.listElement.offsetWidth * 2;
        this.wrapper.style.maxHeight = 0;
        // 없어지게 만들 것
        this.onSwiped();
      } else {
        this.left = 0;
        this.listElement.style.transform = `translateX(${this.left}px)`;
      }
      this.listElement.className = "BouncingListItem";
    }
  }

  // onMouseMove(e) {
  //   const _left = e.clientX - this.dragStartX;
  //   if (_left < 0 ) {
  //     this.left = _left;
  //   }
  // }

  onTouchMove(e) {
    const _touch = e.targetTouches[0];
    const _left = _touch.clientX - this.dragStartX;
    if (_left < 0) {
      this.left = _left;
    }
  }

  updatePosition() {
    if (this.dragged) requestAnimationFrame(this.updatePosition);

    const _now = Date.now();
    const _elapsed = _now - this.startTime;

    if (this.dragged && _elapsed > this.fpsInterval) {
      this.listElement.style.transform = `translateX(${this.left}px)`;

      const _opacity = (Math.abs(this.left) / 100).toFixed(2);
      if (_opacity < 1 && _opacity.toString() !== this.background.style.opacity) {
        this.background.style.opacity = _opacity.toString();
      }
      if (_opacity >= 1) {
        this.background.style.opacity = "1";
      }

      this.startTime = Date.now();
    }
  }

  onClicked() {
    if (this.props.onSwipe) {
      this.props.onSwipe();
    }
  }

  onSwiped() {
    if (this.props.onSwipe) {
      this.props.onSwipe();
    }
  }

  render() {
    const saegim = this.props.children;
    return (
      <div className="Wrapper" ref={div => (this.wrapper = div)}>
        <div className="Background" ref={div => (this.background = div)}>
          {this.props.background ? (this.props.background) : <span style={{display:"none"}}>Swiped</span>}
        </div>
        <div
          onClick={this.onClicked}
          ref={div => (this.listElement = div)}
          // onMouseDown={this.onDragStartMouse}
          onTouchStart={this.onDragStartTouch}
          className="ListItem"
        >
          <Card>
            <div>
              {saegim.id}
            </div>
            <div>
              {saegim.contents}
            </div>
            <Link to={{pathname: `${saegim.id}/`}}>
              <DefaultButton text={'더보기'}/>
            </Link>
          </Card>
        </div>
      </div>
    )
  }
}

export default SaegimItem;