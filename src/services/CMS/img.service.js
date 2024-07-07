import http from "../../http-common";
import Cookie from 'js-cookie'

const endpoint = "/static-manager/upload";
const token = Cookie.get("access_token");

const headerFormData = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Token': `${token}`
    }
}

const ImgCMS = {
    uploadImg(data) {
        return http.post(endpoint, data, headerFormData);
    }
}

export default ImgCMS;
