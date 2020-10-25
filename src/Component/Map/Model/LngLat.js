import Tile from './Tile';
import config from '../config';

const sideLength = 256;

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

    clone = () => {
        return new LngLat(this.lng, this.lat);
    };

    copy = (other) => {
        this._lng = other.lng;
        this._lat = other.lat;
    };

    distinctTo = (other, zoom) => {
        const current = this.toTile(zoom);
        const target = other.toTile(zoom);
        const offsetX = target.fullPixelX - current.fullPixelX;
        const offsetY = target.fullPixelY - current.fullPixelY;
        return {
            offsetX: offsetX,
            offsetY: offsetY,
        };
    };

    toTile = (zoom) => {
        const tileX = this.__to_tile_x(zoom);
        const tileY = this.__to_tile_y(zoom);
        const pixelX = this.__to_pixel_x(zoom);
        const pixelY = this.__to_pixel_y(zoom);
        return new Tile(
            zoom,
            Math.floor(tileX),
            Math.floor(tileY),
            pixelX,
            pixelY
        );
    };

    __to_tile_x = (zoom) => {
        return ((this.lng + 180) / 360) * Math.pow(2, zoom);
    };

    __to_real_y = (zoom) => {
        return (
            (1 / 2 -
                Math.log(
                    Math.tan(this.lat * (Math.PI / 180)) +
                        1 / Math.cos(this.lat * (Math.PI / 180))
                ) /
                    (2 * Math.PI)) *
            Math.pow(2, zoom)
        );
    };

    __to_tile_y = (zoom) => {
        const v = this.__to_real_y(zoom);
        return Math.ceil(v);
    };

    __to_pixel_x = (zoom) => {
        return (
            (((this.lng + 180) * Math.pow(2, zoom) * sideLength) / 360) %
            sideLength
        );
    };

    __to_pixel_y = (zoom) => {
        return (
            (this.__to_real_y(zoom) - this.__to_tile_y(zoom)) * config.length
        );
    };
}

export default LngLat;
