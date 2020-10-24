import LngLat from './LngLat';
import config from '../config';

class Tile {
    _zoom = null;

    get zoom() {
        return this._zoom;
    }

    _tile_x = null;

    get tileX() {
        return this._tile_x;
    }

    _tile_y = null;

    get tileY() {
        return this._tile_y;
    }

    _pixel_x = null;

    get pixelX() {
        return this._pixel_x;
    }

    _pixel_y = null;

    get pixelY() {
        return this._pixel_y;
    }

    constructor(zoom, tileX, tileY, pixelX, pixelY) {
        this._zoom = zoom;
        this._tile_x = tileX;
        this._tile_y = tileY;
        this._pixel_x = pixelX;
        this._pixel_y = pixelY;
    }

    move = (x, y) => {
        const offsetTileX = Math.floor(x / config.length);
        const offsetTileY = Math.floor(y / config.length);
        const offsetPixelX = x % config.length;
        const offsetPixelY = y % config.length;
        if (Math.abs(offsetPixelX + this.pixelX) > config.length) {
            this._tile_x += offsetTileX + 1;
            this._pixel_x = (offsetPixelX + this.pixelX) % config.length;
        } else {
            this._tile_x += offsetTileX;
            this._pixel_x = offsetPixelX + this.pixelX;
        }
        if (Math.abs(offsetPixelY + this.pixelY) > config.length) {
            this._tile_y += offsetTileY + 1;
            this._pixel_y = (offsetPixelY + this.pixelY) % config.length;
        } else {
            this._tile_y += offsetTileY;
            this._pixel_y = offsetPixelY + this.pixelY;
        }
    };

    toLngLat = () => {
        const lng = this.__to_lng();
        const lat = this.__to_lat();
        return new LngLat(lng, lat);
    };

    __to_lng = () => {
        return (
            ((this.tileX + this.pixelX / config.length) /
                Math.pow(2, this.zoom)) *
                360 -
            180
        );
    };

    __to_lat = () => {
        return (
            (Math.atan(
                Math.sinh(
                    Math.PI -
                        (2 *
                            Math.PI *
                            (this.tileY + this.pixelY / config.length)) /
                            Math.pow(2, this.zoom)
                )
            ) *
                180) /
            Math.PI
        );
    };
}

export default Tile;
