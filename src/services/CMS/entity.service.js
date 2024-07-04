import http from "../../http-common";
import Cookie from 'js-cookie'

const endpoint = "/cms/entities";
const token = Cookie.get("access_token");

const headerFormData = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
    }
}

const entityCMS = {
    getAll(params) {
        return http.get(endpoint, { params });
    },
    create(data) {
        return http.post(endpoint, data, headerFormData);
    },
    delete(id) {
        return http.delete(`${endpoint}/${id}`);
    },
    // update error
    // update(id, data) {
    //     let headers = {};
    //     if (data instanceof FormData) {
    //         // If data is a FormData object
    //         const thumbnail = data.get('thumbnail');
    //         if (thumbnail) {
    //             headers = headerFormData;
    //         }
    //     }
    //     return http.put(`${endpoint}/${id}`, data, headers);
    // }
    update(id, data) {
        return http.post(`/cms/update-entities/${id}`, data, headerFormData);
    }
}

export default entityCMS;
