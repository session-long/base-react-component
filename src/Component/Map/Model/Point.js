const sideLength = 256;

class Point {
    _x = null;

    get x() {
        return this._x;
    }

    _y = null;

    get y() {
        return this._y;
    }

    _top = null;

    get top() {
        return this._top ? this._top : this.y * sideLength;
    }

    _left = null;

    get left() {
        return this._left ? this._left : this._x * sideLength;
    }

    constructor(x, y, top, left) {
        this._x = x;
        this._y = y;
        this._top = top;
        this._left = left;
    }

    equals = (other) => {
        if (this.x !== other.x) return false;
        if (this.y !== other.y) return false;
        return true;
    };

    distanceTo = (other) => {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };
}

export default Point;
