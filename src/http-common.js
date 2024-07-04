import axios from "axios";
import Cookie from 'js-cookie'

const token = Cookie.get("access_token");
export default axios.create({
    baseURL: 'https://admin-api.pipsnews.net',
    headers: {
        "Content-type": "application/json",
        "Authorization": `${token}`
    }
});