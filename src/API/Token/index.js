export default class Token {

    static TOKEN = 'token';

    static getToken = () => {
        return window.localStorage.getItem(this.TOKEN);
    }

    static setToken = (token) => {
        window.localStorage.setItem(this.TOKEN, token);
    }

    static clearToken = () => {
        window.localStorage.removeItem(this.TOKEN);
    }

}