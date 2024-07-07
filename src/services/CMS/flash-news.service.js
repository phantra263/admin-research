import http from "../../http-common";
import Cookie from 'js-cookie'

const endpoint = "/flash-manager";

const flashNewsCMS = {
    create(data) {
        return http.post(`${endpoint}/add-flash-new`, data);
    },
    delete(data) {
        return http.post(`${endpoint}/delete-flash-new`, data);
    },
    update(data) {
        return http.post(`${endpoint}/update-flash-new`, data);
    }
}

export default flashNewsCMS;
