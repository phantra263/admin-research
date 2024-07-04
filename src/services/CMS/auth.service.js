import http from "../../http-common";
const endpoint = "/auth/login";

const auth = {
    login(data) {
        return http.post(`${endpoint}`, data);
    },

    logout() {
        return http.delete(`${endpoint}/logout`);
    }
}
export default auth;
