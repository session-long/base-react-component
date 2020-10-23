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

    isIn = (point, offset) => {
        const { x, y } = point;
        const { x: offsetX, y: offsetY } = offset;
        if ((x + offsetX) < this.topLeftPoint.x) return false;
        if ((y + offsetY) < this.topLeftPoint.y) return false;
        if ((x + offsetX) > this.bottomRightPoint.x) return false;
        if ((y + offsetY) > this.bottomRightPoint.y) return false;
        return true;
    }

}

export default PointBounds;