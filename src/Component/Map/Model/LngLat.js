import Tile from './Tile';

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

    __to_tile_y = (zoom) => {
        return Math.abs(
            (1 / 2 -
                Math.log(
                    Math.tan((this.lat * Math.PI) / 180) +
                        1 / Math.cos((this.lat * Math.PI) / 180)
                ) /
                    (2 * Math.PI)) *
                Math.pow(2, zoom)
        );
    };

    __to_pixel_x = (zoom) => {
        return (
            (((this.lng + 180) * Math.pow(2, zoom) * sideLength) / 360) %
            sideLength
        );
    };

    __to_pixel_y = (zoom) => {
        return (
            (1 -
                (Math.log(
                    Math.tan((this.lat * Math.PI) / 180) +
                        1 / Math.cos((this.lat * Math.PI) / 180)
                ) /
                    (2 * Math.PI)) *
                    Math.pow(2, zoom) *
                    256) %
            256
        );
    };
}

export default LngLat;
