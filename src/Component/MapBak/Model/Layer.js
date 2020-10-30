class Layer {
    _url = '';

    get url() {
        return this._url;
    }

    _config = null;

    get config() {
        return this._config;
    }

    constructor(url, config) {
        this._url = url;
        this._config = new LayerConfig(config);
    }

    toRealUrl = (z, x, y) => {
        const url = this._url;
        return url.replace('{x}', x).replace('{y}', y).replace('{z}', z);
    };
}

class LayerConfig {
    _bounds = null;

    get bounds() {
        if (!this._bounds) return null;
        if (this._bounds.length === 0) return null;
        return this._bounds;
    }

    constructor({ bounds }) {
        this._bounds = bounds;
    }

    get maxLng() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lng).sort((a, b) => b - a);
        return list[0];
    }

    get maxLat() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lat).sort((a, b) => b - a);
        return list[0];
    }

    get minLng() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lng).sort((a, b) => a - b);
        return list[0];
    }

    get minLat() {
        if (!this.bounds) return null;
        if (this.bounds.length === 0) return null;
        const list = this.bounds.map((item) => item.lat).sort((a, b) => a - b);
        return list[0];
    }
}

export default Layer;

export { Layer, LayerConfig };
