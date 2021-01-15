export default class ResponseEntity {

    /**
     * 响应网络状态码
     */
    _http_code;

    get httpCode() {
        return this._http_code;
    }

    /**
     * 响应状态
     */
    _status;

    get status() {
        return this._status;
    }

    /**
     * 消息
     */
    _message;

    get message() {
        return this._message;
    }

    /**
     * 详细信息
     */
    _description;

    get description() {
        return this._description;
    }

    /**
     * 响应类型
     */
    _type;

    get type() {
        return this._type;
    }

    /**
     * 响应数据
     */
    _data;

    get data() {
        return this._data;
    }

    constructor({ httpCode, status, message, description, type, data }) {
        this._http_code = httpCode;
        this._status = status;
        this._message = message;
        this._description = description;
        this._type = type;
        this._data = data;
    }

}