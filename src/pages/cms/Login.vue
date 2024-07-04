<template>
    <a-spin :spinning="loading">
        <div class="page-login">

            <div class="wrap-content">
                <h1>Login</h1>
                <a-form :model="formState" :label-col="{ span: 4 }" name="basic" autocomplete="off" @finish="onFinish"
                    class="form-login">
                    <a-form-item label="username" name="username"
                        :rules="[{ required: true, message: 'Please input your username!' }]">
                        <a-input v-model:value="formState.username" />
                    </a-form-item>

                    <a-form-item label="Password" name="password"
                        :rules="[{ required: true, message: 'Please input your password!' }]">
                        <a-input-password v-model:value="formState.password" />
                    </a-form-item>

                    <a-button type="primary" html-type="submit" style="display: table; margin: auto;">Login</a-button>
                </a-form>
            </div>
        </div>
    </a-spin>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Cookie from 'js-cookie';
import { message } from 'ant-design-vue';
import LoginSrv from '../../services/CMS/auth.service';


const loading = ref(false);
const router = useRouter();
const formState = reactive({
    username: '',
    password: ''
});
const onFinish = async (values) => {
    loading.value = true;
    try {
        const res = await LoginSrv.login(values);
        if (res.data.success) {
            message.success('Login success!');
            await Cookie.set("access_token", `Bearer ${res.data.data.token}`);
        }
    } catch (error) {
        message.error('Sai thông tin đăng nhập');
        console.error('Error fetching tag:', error);
    } finally {
        loading.value = false;
        // router.push({ name: 'admin' });
    }
};
</script>

<style scoped lang="scss">
.page-login {
    min-height: 100vh;
    display: flex;
    background-image: url('../assets/tecnology.jpg');
    background-size: cover;

    @media screen and (max-width: 768px) {
        padding: 0 15px;
    }

    .wrap-content {
        max-width: 550px;
        margin: auto;
        width: 100%;
        border: 1px solid #eee;
        padding: 20px;
        border-radius: 10px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

        h1 {
            text-align: center;
            color: #222;
        }
    }

    .form-login {
        width: 100%;

        .ant-form-item {
            margin-bottom: 10px;
        }

        :deep(.ant-form-item-label > label) {
            color: #222;
        }
    }
}
</style>