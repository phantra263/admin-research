import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import Antd from "ant-design-vue"
import { message } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


// helper
import { formatDate } from './util/helpers';

const app = createApp(App);

app.use(Antd);
app.use(router);
app.component('QuillEditor', QuillEditor)
app.mount('#app');

// Define the filter globally
app.config.globalProperties.$filters = {
    formatDate
};

app.config.globalProperties.$message = message;
