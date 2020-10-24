class Layer {
    _url = '';

    _config = null;

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
    _bounds = [];

    constructor({ bounds }) {
        this._bounds = bounds;
    }
}

export default Layer;

export { Layer, LayerConfig };
