export default class ResponseDefine {

    _code;

    get code() {
        return this._code;
    }

    __handle;

    get handle() {
        return this.handle;
    }

    constructor(code, fn) {
        this._code = code;
        this.__handle = fn;
    }

    equal = (code) => {
        if (code === this._code) return true;
        return false;
    }

    run = (args) => {
        if (this.__handle) this.__handle(args);
    }

}