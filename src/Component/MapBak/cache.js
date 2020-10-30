class Cache {
    static instance = null;

    static init() {
        if (!this.instance) this.instance = new Cache();
        return this.instance;
    }

    _data = {};

    getItem = (key) => {
        return this._data[key];
    };

    setItem = (key, value) => {
        this._data[key] = value;
    };

    clear = () => {
        this._data = {};
    };
}

export default Cache.init();
