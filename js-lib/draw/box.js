import State from '../state';
import Vector from '../vector';
import DrawFunction from './function';
import { drawLine, drawText } from './utils';
import { ERASE_CHAR } from '../constants';

/**
 * @implements {DrawFunction}
 */
export default class DrawBox {
  /**
   * @param {State} state
   */
  constructor(state) {
    this.state = state;
    /** @type {Vector} */ this.startPosition = null;
    /** @type {Vector} */ this.endPosition = null;
    /** @type {Vector} */ this.sizeTextPosition = null;
    /** @type {string} */ this.sizeInfo = '';
  }

  /** @inheritDoc */
  start(position) {
    this.startPosition = position;
  }

  size(startPosition, position) {
    return new Vector(
      /*x*/ Math.abs(startPosition.x - position.x) + 1,
      /*y*/ Math.abs(startPosition.y - position.y) + 1
    );
  }

  /** @inheritDoc */
  move(position) {
    this.endPosition = position;
    this.state.clearDraw();
    drawLine(this.state, this.startPosition, position, true);
    drawLine(this.state, this.startPosition, position, false);

    // show size info
    let boxSize =  this.size(this.startPosition, position);

    this.sizeTextPosition = new Vector(position.x,
      position.y < this.startPosition.y ?
        position.y - 1 : // text below box
        position.y + 1
    );

    this.sizeInfo = 'Size (x = ' + boxSize.x +', y = ' + boxSize.y +')';
    drawText(this.state, this.sizeTextPosition,
      this.sizeInfo)
  }

  /** @inheritDoc */
  end() {
    // clear info text
    for (let x=0; x< this.sizeInfo.length;x++) {
      this.state.drawValueIncremental(new Vector(this.sizeTextPosition.x + x, this.sizeTextPosition.y), null); // problematic -- also clears line at that location
    }

    this.state.commitDraw();
  }

  /** @inheritDoc */
  getCursor(position) {
    return 'crosshair';
  }

  /** @inheritDoc */
  handleKey(value) {};
}
