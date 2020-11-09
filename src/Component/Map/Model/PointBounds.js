class PointBounds {
    _top_left = null;

    get topLeftPoint() {
        return this._top_left;
    }

    _bottom_right = null;

    get bottomRightPoint() {
        return this._bottom_right;
    }

    constructor(topLeftPoint, bottomRightPoint) {
        this._top_left = topLeftPoint;
        this._bottom_right = bottomRightPoint;
    }

    isIn = ({ x, y }, { x: translateX, y: translateY }) => {
        if (x < this.topLeftPoint.x - Math.ceil(translateX / 256)) return false;
        if (y < this.topLeftPoint.y - Math.ceil(translateY / 256)) return false;
        if (x > this.bottomRightPoint.x - Math.ceil(translateX / 256)) return false;
        if (y > this.bottomRightPoint.y - Math.ceil(translateY / 256)) return false;
        return true;
    };
}

export default PointBounds;
