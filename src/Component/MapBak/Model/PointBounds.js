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
        const { left, top } = point;
        const { left: offsetLeft, top: offsetTop } = offset;
        if (left + offsetLeft < this.topLeftPoint.x) return false;
        if (top + offsetTop < this.topLeftPoint.y) return false;
        if (left + offsetLeft > this.bottomRightPoint.x) return false;
        if (top + offsetTop > this.bottomRightPoint.y) return false;
        return true;
    };
}

export default PointBounds;
