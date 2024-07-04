<template>
    <a-layout style="overflow-x: hidden" class="layout-cms">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="custom-sider"
            :class="{ collapsed: !collapsed, uncollapsed: collapsed }">
            <div class="logo">LOGO</div>
            <a-menu theme="dark" mode="inline">
                <router-link class="ant-menu-item" exact exactActiveClass="ant-menu-item-selected" to="/">
                    <ScheduleOutlined />
                    <span>Entities</span>
                </router-link>
                <router-link class="ant-menu-item" exact exactActiveClass="ant-menu-item-selected" to="/banner">
                    <PictureOutlined />
                    <span>Banner</span>
                </router-link>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <div class="wrap-header">
                    <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

                    <div class="account">
                        <span class="name">{{ currentUser.username }}</span>

                        <a-avatar style="background-color: #87d068; cursor: pointer;">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                        <span style="cursor: pointer; margin-left: 10px" @click="handleLogout"><logout-outlined
                                style="font-size: 12px; margin-right: 4px;" />Logout</span>
                    </div>
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '5px 5px', padding: '15px', background: '#fff', minHeight: '280px' }">
                <RouterView />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script setup>
import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    InsertRowAboveOutlined,
    TagsOutlined,
    ScheduleOutlined,
    TagOutlined,
    PictureOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import Cookie from 'js-cookie';
import { useRoute, useRouter } from 'vue-router';
import LoginSrv from '../services/CMS/auth.service';


const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const accesstoken = Cookie.get("access_token");
const currentUser = ref(accesstoken ? accesstoken : '');

const handleLogout = async () => {
    try {
        const res = await LoginSrv.logout();
        if (res.data) {
            await Cookie.remove("access_token");
            router.push({ name: 'login' });
        }
    } catch (error) {
        console.error('Error logout:', error);
    }
}
</script>
<style scoped lang="scss">
.ant-layout.ant-layout-has-sider {
    min-height: 100vh;
}

.custom-sider {
    @media screen and (max-width: 600px) {
        // display: none;
    }

    &.collapsed {
        @media screen and (max-width: 600px) {
            display: none;
        }
    }

    &.uncollaspsed {
        @media screen and (max-width: 600px) {
            display: block;
        }
    }
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #Fff;
    font-weight: bold;
}

.site-layout .site-layout-background {
    background: #fff;
}

.wrap-header {
    display: flex;
    justify-content: space-between;

    .account {
        margin-right: 15px;

        .name {
            margin-right: 5px;
            font-weight: bold;
        }
    }
}
</style>