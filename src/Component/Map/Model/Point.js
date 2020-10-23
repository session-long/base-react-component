class Point {
    _x = null;

    get x() {
        return this._x;
    }

    _y = null;

    get y() {
        return this._y;
    }

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    equals = (other) => {
        if (this.x !== other.x) return false;
        if (this.y !== other.y) return false;
        return true;
    }

    distanceTo = (other) => {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
}

export default Point;