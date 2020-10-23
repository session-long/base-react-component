import Tile from './Tile';

class LngLat {

    _lng = null;

    get lng() {
        return this._lng;
    }

    _lat = null;

    get lat() {
        return this._lat;
    }

    constructor(lng, lat) {
        this._lng = lng;
        this._lat = lat;
    }

    toTile = (zoom) => {
        const tileX = this.__to_tile_x(zoom);
        const tileY = this.__to_tile_y(zoom);
        const pixelX = this.__to_pixel_x(zoom);
        const pixelY = this.__to_pixel_y(zoom);
        return new Tile(zoom, tileX, tileY, pixelX, pixelY);
    }

    __to_tile_x = (zoom) => {

    }

    __to_tile_y = (zoom) => {

    }

    __to_pixel_x = (zoom) => {

    }

    __to_pixel_y = (zoom) => {

    }

}

export default LngLat;