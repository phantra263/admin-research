import http from "../../http-common";
import Cookie from 'js-cookie'
const endpoint = "/cms/banners";

const token = Cookie.get("access_token");

const headerFormData = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
    }
}
const bannerCMS = {
    getAll() {
        return http.get(endpoint);
    },
    delete(id) {
        return http.delete(`${endpoint}/${id}`);
    },
    update(data) {
        return http.post(`${endpoint}`, data, headerFormData);
    }
}

export default bannerCMS;
