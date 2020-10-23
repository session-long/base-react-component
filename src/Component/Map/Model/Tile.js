import LngLat from './LngLat';

class Tile {

    _zoom = null;

    _tile_x = null;

    _tile_y = null;

    _pixel_x = null;

    _pixel_y = null;

    constructor(zoom, tileX, tileY, pixelX, pixelY) {
        this._zoom = zoom;
        this._tile_x = tileX;
        this._tile_y = tileY;
        this._pixel_x = pixelX;
        this._pixel_y = pixelY;
    }

    toLngLat = () => {
        const lng = this.__to_lng();
        const lat = this.__to_lat();
        return new LngLat(lng, lat);
    }

    __to_lng = () => {

    }

    __to_lat = () => {

    }

}

export default Tile;