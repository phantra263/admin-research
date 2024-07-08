<template>
    <!-- Table post type -->
    <h2>Quản lý quảng cáo:</h2>
    <div class="control-header">
        <span>Tổng số: <a-badge :count="listAdvertising.length" /></span>
        <a-button type="primary" @click="openModal">Add</a-button>
    </div>
    <a-spin :spinning="loading">
        <a-spin :spinning="loading">
            <a-table v-if="listAdvertising.length > 0" :scroll="{ x: 1200 }" rowClassName="custom-table"
                :columns="columnsAdvertising" :data-source="listAdvertising.length > 0 ? listAdvertising : [{}]"
                bordered :pagination="false">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'stt'">
                        {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'title'">
                        <div class=" line-clamp-2">{{ record?.title }}</div>
                    </template>
                    <template v-if="column.key === 'content'">
                        <div class="line-clamp-2">{{ record?.content }}</div>
                    </template>
                    <template v-if="column.key === 'link'">
                        <div>{{ record?.link }}</div>
                    </template>
                    <template v-if="column.key === 'thumbnail'">
                        <div class="thumbnail-table">
                            <img v-if="record?.image"
                                :src="'https://api-v1.pipsnews.net/static/public/public?id=' + record?.image" alt="">
                        </div>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div>
                            <edit-outlined class="editable-cell-icon" @click="editAds(record)"
                                style="color: #ff5501; margin-left: 5px; font-size: 15px;" />
                            <a-popconfirm title="Are you sure delete?" placement="topRight" ok-text="Yes"
                                cancel-text="No" @confirm="handleDelete(record._id)">
                                <DeleteOutlined class="editable-cell-icon"
                                    style="color: red; margin-left: 5px; font-size: 15px;" />
                            </a-popconfirm>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </a-spin>

    <!-- Modal -->
    <ModalCMS :showModal="showModal" @close-modal="handleCloseModal" :titleModal="'Infor advertising'">
        <a-spin :spinning="loading">
            <a-form ref="formRef" :model="formState" name="basic" layout="vertical" autocomplete="off"
                @finish="onFinish">
                <a-form-item label="Title" name="title">
                    <a-input v-model:value="formState.title" />
                </a-form-item>
                <a-form-item label="Link advertising" name="link">
                    <a-input v-model:value="formState.link" />
                </a-form-item>
                <a-form-item label="Content" name="content">
                    <QuillEditor theme="snow" contentType="html" v-model:content="formState.content" />
                </a-form-item>
                <a-row>
                    <a-form-item name="thumbnail" label="Thumbnail" class="custom-upload">
                        <a-upload v-model:fileList="formState.thumbnail" :before-upload="handleBeforeUpload"
                            :maxCount="1" accept=".jpg,.png,.gif" name="logo" list-type="picture">
                            <a-button>
                                <template #icon>
                                    <UploadOutlined />
                                </template>
                                Click to upload
                            </a-button>
                        </a-upload>
                    </a-form-item>
                    <div class="img-thumbnail" v-if="formState.image && formState.thumbnail == 0">
                        <img :src="'https://api-v1.pipsnews.net/static/public/public?id=' + formState.image" alt="">
                    </div>
                </a-row>

                <div style="display: flex; justify-content: flex-end">
                    <a-button html-type="button" @click="handleCloseModal">Cancel</a-button>
                    <a-button type="primary" html-type="submit" style="margin-left: 5px;">Submit</a-button>
                </div>
            </a-form>
        </a-spin>
    </ModalCMS>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import AdvertisingSrv from '../../services/CMS/advertising.service';
import { message } from 'ant-design-vue';
import ModalCMS from '../../components/ModalCMS.vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import ImgSrv from '../../services/CMS/img.service';

const defaultFormState = {
    title: '',
    content: '',
    thumbnail: [],
    link: '',
    image: '',
    id: ''
}

let formState = ref({ ...defaultFormState });
const loading = ref(false);
const showModal = ref(false);
const listAdvertising = ref([]);
const formRef = ref(null);
const flagUpdate = ref(false);
const columnsAdvertising = [
    {
        title: 'STT',
        key: 'stt',
        width: 40,
        align: 'center'
    },
    {
        title: 'Title',
        dataIndex: 'data',
        key: 'title',
        width: 200
    },
    {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
        width: 200
    },
    {
        title: 'Banner link',
        dataIndex: 'link',
        key: 'link',
        width: 200
    },
    {
        title: 'Thumbnail',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        width: 100
    },
    {
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 50
    }
];
const handleBeforeUpload = (file, fileList) => {
    // Prevent automatic upload when selecting file
    return false;
};

const editAds = (data) => {
    flagUpdate.value = true;
    formState.value.id = data._id;
    formState.value.title = data?.title;
    formState.value.link = data?.link;
    formState.value.content = data?.content;
    formState.value.image = data?.image;
    showModal.value = true;
}

const getAdvertising = async () => {
    loading.value = true;
    try {
        const res = await AdvertisingSrv.getAll();
        if (res.status == 200) {
            listAdvertising.value = res.data.data
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

const openModal = () => {
    showModal.value = true;
}

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
    formState.value = { ...defaultFormState };
    formState.value.content = ' ';
    formState.value.image = '';
    flagUpdate.value = false;
};

const onFinish = async () => {
    loading.value = true;
    if (formState.value?.thumbnail && formState.value.thumbnail[0]) {
        const idImg = await getIdImg(formState.value.thumbnail[0]);
        if (idImg) {
            formState.value.image = idImg;
        } else {
            message.error('Upload image error!');
            return;
        }
    }
    try {
        if (!flagUpdate.value) {
            const resAdd = await createAds(formState.value);
            if (resAdd) {
                const newData = {
                    ...formState.value,
                    _id: formState.value.id
                };
                listAdvertising.value.unshift(newData);
            }
        } else {
            const resEdit = await updateAds(formState.value);
            if (resEdit) {
                const newData = {
                    ...formState.value,
                    _id: formState.value.id,
                    image: formState.value.image
                };
                const index = listAdvertising.value.findIndex(item => item.id === formState.value._id);
                if (index !== -1) {
                    listAdvertising.value[index] = newData;
                }
            }
        }
        message.success(flagUpdate.value ? 'Update success!' : 'Create success!');
        handleCloseModal();
    } catch (error) {
        message.error(flagUpdate.value ? 'Update fail!' : 'Create fail!');
        console.error(`Error ${flagUpdate.value ? 'update' : 'create'} entity:`, error);
    } finally {
        loading.value = false;
    }
}

const getIdImg = async (value) => {
    const formData = new FormData();
    formData.append('file', value.originFileObj);
    try {
        const res = await ImgSrv.uploadImg(formData);
        if (res.status == 200) {
            return res.data.data.image_id;
        }

    } catch (error) {
        console.error(`Error upload img`);
    }
    return '';
}

const createAds = async (formData) => {
    const res = await AdvertisingSrv.create(formData);
    if (!res.status == 200) {
        throw new Error('Create failed');
        return false;
    } else {
        formState.value.id = res.data.data.insert_id;
        return true;
    }
};


const handleDelete = async (idValue) => {
    loading.value = true;
    const formData = new FormData();
    formData.append('id', idValue);
    console.log(formData);
    try {
        const res = await AdvertisingSrv.delete(formData);
        if (res.status == 200) {
            const objDelete = listAdvertising.value.findIndex(item => item._id == idValue);
            if (objDelete !== -1) {
                listAdvertising.value.splice(objDelete, 1);
            }
            message.success('Delete success!');
        }
    } catch (error) {
        console.error('Error delete record:', error);
    } finally {
        loading.value = false;
    }
}


const updateAds = async (formData) => {
    const res = await AdvertisingSrv.update(formData);
    if (!res.status == 200) {
        throw new Error('Update failed');
        return false;
    }

    return true;
};

onMounted(() => {
    getAdvertising();
});

</script>
<style lang="scss" scoped>
.control-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.img-thumbnail {
    width: 100%;
}

.img-thumbnail img {
    height: 50px;
    object-fit: contain;
    margin: auto
}

.thumbnail-table {
    width: 100%;
}

.thumbnail-table img {
    height: 50px;
    object-fit: contain;
    margin: auto;
    display: block
}
</style>