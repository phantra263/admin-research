<template>
    <!-- Table post type -->
    <h2>Quản lý banner:</h2>
    <div class="control-header">
        <span>Tổng số: <a-badge :count="total" /></span>
        <a-button type="primary" @click="openModal">Add</a-button>
    </div>
    <a-spin :spinning="loading">
        <TableCMS :columns="columnsBanner" :scroll="1000" :data="listBanner" @update="handleUpdate"
            @delete="handleDelete" />
    </a-spin>
    <!-- Modal -->
    <ModalCMS :showModal="showModal" @close-modal="handleCloseModal" :titleModal="'Infor banner'">
        <a-spin :spinning="loading">
            <a-form ref="formRef" :model="formState" name="basic" layout="vertical" autocomplete="off"
                @finish="onFinish">
                <!-- <a-form-item label="Type banner" name="type"
                    :rules="[{ required: true, message: 'Please input type banner' }]">
                    <a-select v-model:value="formState.type">
                        <a-select-option :value="index + 1" v-for="item, index in 5">{{ index + 1 }}</a-select-option>
                    </a-select>
                </a-form-item> -->

                <a-form-item label="Title" name="title">
                    <a-input v-model:value="formState.title" />
                </a-form-item>
                <a-form-item label="Link banner" name="url">
                    <a-input v-model:value="formState.url" />
                </a-form-item>
                <a-form-item label="Content" name="content">
                    <QuillEditor theme="snow" contentType="html" toolbar="minimal"
                        v-model:content="formState.content" />
                </a-form-item>
                <div>
                    <a-form-item name="banner" label="Banner" class="custom-upload">
                        <a-upload v-model:fileList="formState.banner" :before-upload="handleBeforeUpload" :maxCount="1"
                            accept=".jpg,.png,.gif" name="logo" list-type="picture">
                            <a-button>
                                <template #icon>
                                    <UploadOutlined />
                                </template>
                                Click to upload
                            </a-button>
                        </a-upload>
                    </a-form-item>
                    <div class="img-thumbnail" v-if="formState.imgServer && formState.banner == 0">
                        <img :src="formState.imgServer" alt="">
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end">
                    <a-button html-type="button" @click="handleCloseModal">Cancel</a-button>
                    <a-button type="primary" html-type="submit" style="margin-left: 5px;">Submit</a-button>
                </div>
            </a-form>
        </a-spin>
    </ModalCMS>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import TableCMS from '../../components/TableCMS.vue';
import BannerSrv from '../../services/CMS/banner.service';
import { message } from 'ant-design-vue';
import ModalCMS from '../../components/ModalCMS.vue';


let formState = ref({
    type: 1,
    content: '',
    title: '',
    banner: [],
    url: '',
    imgServer: ''
});
const listBannerDefault = [
    {
        id: 1,
        type: 1,
        banner_url: "",
        url: "-"
    },
    {
        id: 2,
        type: 2,
        banner_url: "",
        url: "-",
    },
    {
        id: 3,
        type: 3,
        banner_url: "",
        url: "-",
    },
    {
        id: 4,
        type: 4,
        banner_url: "",
        url: "-",
    },
    {
        id: 5,
        type: 5,
        banner_url: "",
        url: "-"
    }
]
const loading = ref(false);
const showModal = ref(false);
const listBanner = ref(listBannerDefault);
const formRef = ref(null);
const flagUpdate = ref(false);
const columnsBanner = [
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 70,
        align: 'center'
    },
    {
        title: 'Banner preview',
        dataIndex: 'banner_url',
        key: 'banner_thumbnail',
        width: 200
    },
    {
        title: 'Banner link',
        dataIndex: 'url',
        key: 'url',
    },
    {
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 80
    }
];
const handleBeforeUpload = (file, fileList) => {
    // Prevent automatic upload when selecting file
    return false;
};

const getBanner = async () => {
    loading.value = true;
    try {
        const res = await BannerSrv.getAll();
        if (res.data.success) {
            listBanner.value = listBanner.value.map(obj1 => {
                const matchingObj = res.data.data.find(obj2 => obj2.type === obj1.type);
                if (matchingObj) {
                    return { ...obj1, ...matchingObj };
                } else {
                    return obj1;
                }
            }).concat(res.data.data.filter(obj2 => !listBanner.value.some(obj1 => obj1.type === obj2.type)));
        }
    } catch (error) {
        console.error('Error fetching tag:', error);
    } finally {
        loading.value = false;
    }
};

const handleCloseModal = () => {
    resetFormValidation();
    showModal.value = false;
};

const handleUpdate = async (data) => {
    for (const key in formState.value) {
        if (key != 'banner') {
            formState.value[key] = data[key] == "-" ? "" : data[key];
        }
    }
    formState.value.imgServer = data.banner_url;
    showModal.value = true;
}

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
    formState.value = {
        type: 1,
        banner: [],
        url: '',
        imgServer: ''
    }
    flagUpdate.value = false;
};

const onFinish = async () => {
    loading.value = true;
    const formData = createFormData(formState.value);
    try {
        await updateBanner(formData);
        message.success('Update success!');
        handleCloseModal();
        getBanner();
    } catch (error) {
        message.error('Update fail!');
    } finally {
        loading.value = false;
    }
}

const handleDelete = async (id) => {
    loading.value = true;
    try {
        const res = await BannerSrv.delete(id);
        if (res.data.success) {
            listBanner.value = listBanner.value.map(item => {
                if (item.id == id) {
                    return {
                        type: item.type,
                        banner_url: "",
                        url: "-"
                    }
                }
                return item;
            });
        }
    } catch (error) {
        console.error('Error delete record:', error);
    } finally {
        loading.value = false;
    }
}

const createFormData = (values) => {
    const formData = new FormData();
    for (const key in values) {
        if (values.hasOwnProperty(key) && key !== 'banner') {
            formData.append(key, values[key]);
        }
    }
    if (values.banner && values.banner[0]) {
        formData.append('banner', values.banner[0].originFileObj);
    }
    return formData;
};


const updateBanner = async (formData) => {
    const res = await BannerSrv.update(formData);
    if (!res.data.success) {
        throw new Error('Update failed');
    }
};

onMounted(() => {
    getBanner();
});

</script>
<style lang="scss" scoped>
.img-thumbnail {
    display: block;
    width: 100px;
    height: 100px;

    img {
        width: inherit;
        height: inherit;
        object-fit: contain;
    }
}
</style>