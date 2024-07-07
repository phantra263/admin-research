import http from "../../http-common";
const endpoint = "/ads-manager";
import Cookie from 'js-cookie'

const token = Cookie.get("access_token");
const headerFormData = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Token': `${token}`
    }
}
const bannerCMS = {
    getAll() {
        return http.get(`${endpoint}/mrpipsnews-ads`);
    },
    delete(data) {
        return http.post(`${endpoint}/delete-ads-flash`, data, headerFormData);
    },
    create(data) {
        return http.post(`${endpoint}/add-ads-flash`, data);
    },
    update(data) {
        return http.post(`${endpoint}/edit-ads-flash`, data);
    }
}

export default bannerCMS;
