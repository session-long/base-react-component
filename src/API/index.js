import qs from 'qs';
import axios from 'axios';
import Token from './Token';
import API_CODE from './Code';
import * as CONFIG from '../config';
import { notification as Notification } from 'antd';

/**
 * 缺省的工程地址
 */
const DEFAULT_BASE_URL = "/";

/**
 * 缺省的超时时长
 */
const DEFAULT_TIMEOUT = 3 * 1000

/**
 * 构建Axios实例
 */
const Axios = axios.create({ baseURL: CONFIG.projectBaseUri || DEFAULT_BASE_URL, timeout: DEFAULT_TIMEOUT });

/**
 * 定义Axios实例的请求拦截器
 */
Axios.interceptors.request.use(
    (config) => {
        // loading 动画
        // token 重定向
        // 后端需求是否序列化
        return config;
    },
    (error) => {
        console.log('request:', error);
        // loading 关闭
        // 请求超时
        if (
            error.code === 'ECONNABORTED' &&
            error.message.indexOf('timeout') !== -1
        ) {
            console.log('timeout');
            // return service.request(originalRequest);//例如再重复请求一次
        }
        // 需要重定向到错误页面
        const errorInfo = error.response;
        console.log(errorInfo);
        if (errorInfo) {
            // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
            const errorStatus = errorInfo.status; // 404 403 500 ... 等
            console.log(41, errorStatus);
        }
        return Promise.reject(error);
    }
);

/**
 * 定义Axios实例的响应拦截器
 */
Axios.interceptors.response.use(
    (response) => {
        let data;
        if (response.data === undefined) {
            data = response.request.responseText;
        } else {
            data = response.data;
        }

        // 根据返回的code值来做不同的处理（和后端约定）
        switch (data.code) {
            case API_CODE.SUCCESS:
                break;
            case API_CODE.ERROR:
                // 请求异常逻辑
                Notification.open({
                    key: 'failure',
                    message: '请求失败',
                    description: data.msg,
                });
                break;
            default:
                // 请求异常逻辑
                Notification.open({
                    key: 'work-resumption',
                    message: '发生错误',
                    description: data.msg,
                });
                return Promise.reject();
        }
        return data;
    },
    (error) => {
        // 请求超时
        if (
            error.code === 'ECONNABORTED' &&
            error.message.indexOf('timeout') !== -1
        ) {
            return Promise.reject({
                type: "Error",
                messgae: "请求超时",
                description: '请检查网络或者稍后再试',
            });
        }

        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误';
                    break;
                case 403:
                    error.message = '拒绝访问';
                    break;

                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`;
                    break;

                case 408:
                    error.message = '请求超时';
                    break;

                case 500:
                    error.message = '服务器内部错误';
                    break;
                default:
            }
            Notification.open({
                key: error.response.status,
                message: '发生错误',
                description: error.message,
            });
        }

        return Promise.reject(error);
    }
);

/**
 * 缺省的content type
 */
const DEFAULT_CONTENT_TYPE = {
    JSON: 'application/json;',
    FORM: 'application/x-www-form-urlencoded; charset=UTF-8',
    UPLOAD: 'upload',
};

/**
 * 缺省的Http Method
 */
const DEFAULT_HTTP_METHOD = {
    GET: 'get',
    POST: 'post',
}

class API {
    static CONTENT_TYPE = { ...DEFAULT_CONTENT_TYPE };

    static HTTP_METHOD = { ...DEFAULT_HTTP_METHOD };

    static RESPONSE_CODE = { ...API_CODE };

    static Token = { ...Token };

    static config = (httpMethod, url, params, response) => {
        return new API(httpMethod, url, params, response);
    };

    static get = (url, params, response) => {
        return this.config(this.HTTP_METHOD.GET, url, params, response);
    };

    static post = (url, params, response) => {
        return this.config(this.HTTP_METHOD.POST, url, params, response);
    };

    _content_type = null;

    _http_method = null;

    _url = null;

    _params = null;

    _default_response = null;

    _is_need_token = false;

    // 时间戳
    _t = null;

    constructor(
        httpMethod = null,
        url = null,
        params = null,
        response = null,
        t = new Date().getTime()
    ) {
        this._content_type = DEFAULT_CONTENT_TYPE.FORM;
        this._url = url;
        this._http_method = httpMethod;
        this._params = params;
        this._default_response = response;
        this._t = t;
    }

    get contentType() {
        return this._content_type;
    }

    get url() {
        return this._url;
    }

    get params() {
        return this._params;
    }

    setContentType = (type) => {
        this._content_type = type;
        return this;
    };

    setAuth = () => {
        this._is_need_token = true;
        return this;
    };

    commit = (timeout = DEFAULT_TIMEOUT) => {
        if (this._is_need_token && !Token.getToken()) {
            console.error('令牌不存在或已失效');
            return;
        }

        const Authorization = this._is_need_token
            ? { Authorization: Token.getToken() }
            : {};
        const method = this._http_method;
        const url = this._url;
        const commonData = this.commonData ? { _t: this._t } : {};
        const options = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': this._content_type,
                cetcClientType: 'Web',
                ...Authorization,
            },
            method: method,
            url: url,
        };

        if (
            this._content_type === DEFAULT_CONTENT_TYPE.JSON &&
            method === API.HTTP_METHOD.GET
        ) {
            options.params = { ...commonData, ...this._params };
        } else if (
            this._content_type === DEFAULT_CONTENT_TYPE.JSON &&
            method === API.HTTP_METHOD.POST
        ) {
            options.data = qs.stringify({ ...commonData, ...this._params });
        } else if (
            this._content_type === DEFAULT_CONTENT_TYPE.FORM &&
            method === API.HTTP_METHOD.GET
        ) {
            options.params = { ...commonData, ...this._params };
        } else if (
            this._content_type === DEFAULT_CONTENT_TYPE.FORM &&
            method === API.HTTP_METHOD.POST
        ) {
            options.data = { ...commonData, ...this._params };
        } else {
        }

        return Axios({
            ...options,
        }).then(res => {
            return Promise.resolve(res);
        }).catch(e => {
            const _t = (e && typeof e.type) ? e.type : "";
            switch (_t.toLocaleUpperCase()) {
                case "ERROR":
                    return Promise.resolve({
                        ...e,
                        data: this._default_response,
                    });

                case "FAILURE":
                    return Promise.resolve({
                        ...e,
                        data: this._default_response,
                    });

                default:
                    return Promise.reject(e);
            }

        })
    };
}

export default API;
