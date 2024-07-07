import axios from "axios";
import Cookie from 'js-cookie';

// Hàm để tạo và cấu hình axios instance
const createAxiosInstance = () => {
    const token = Cookie.get("access_token");
    const instance = axios.create({
        baseURL: 'https://admin-api.pipsnews.net',
        headers: {
            "Content-type": "application/json",
            "Token": token
        }
    });

    // Tạo một interceptor để cập nhật header Token mỗi khi gửi yêu cầu
    instance.interceptors.request.use((config) => {
        const token = Cookie.get("access_token");
        if (token) {
            config.headers['Token'] = token;
        }
        return config;
    });

    return instance;
};

export default createAxiosInstance();
