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

    get fullPixelX() {
        return this._tile_x * config.length + this._pixel_x;
    }

    get fullPixelY() {
        return this._tile_y * config.length + this._pixel_y;
    }

    constructor(zoom, tileX, tileY, pixelX, pixelY) {
        this._zoom = zoom;
        this._tile_x = tileX;
        this._tile_y = tileY;
        this._pixel_x = pixelX;
        this._pixel_y = pixelY;
    }

    clone = () => {
        return new Tile(
            this._zoom,
            this.tileX,
            this.tileY,
            this.pixelX,
            this.pixelY
        );
    };

    move = (x, y) => {
        const fullX = this.fullPixelX + x;
        const fullY = this.fullPixelY + y;
        this._tile_x = Math.floor(fullX / config.length);
        this._pixel_x = fullX % config.length;
        this._tile_y = Math.ceil(fullY / config.length);
        this._pixel_y = (fullY % config.length) - config.length;
        return this;
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
            Math.atan(
                Math.sinh(
                    Math.PI -
                        (2 *
                            Math.PI *
                            (this.tileY + this.pixelY / config.length)) /
                            Math.pow(2, this.zoom)
                )
            ) *
            (180 / Math.PI)
        );
    };
}

export default Tile;
