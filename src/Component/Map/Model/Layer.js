class Layer {

    _url = null;

    _config = null;

    constructor(url, config) {
        this._url = url;
        this._config = new LayerConfig(...config);
    }

}

class LayerConfig {

    _bounds = [];

    constructor(bounds) {
        this._bounds = bounds;
    }

}

export default Layer;

export {
    Layer, LayerConfig
}