<template>
    <!-- Table post type -->
    <h2>Quản lý bài viết:</h2>
    <div class="control-header">
        <span>Tổng số: <a-badge :count="listPost.length" /></span>
        <a-button type="primary" @click="openModal">Add</a-button>
    </div>
    <a-spin :spinning="loading">
        <a-table v-if="listPost.length > 0" :scroll="{ x: 1200 }" rowClassName="custom-table"
            :columns="columnsFlashNews" :data-source="listPost.length > 0 ? listPost : [{}]" bordered
            :pagination="false">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'stt'">
                    {{ index + 1 }}
                </template>
                <template v-if="column.key === 'title'">
                    <div class=" line-clamp-2">{{ record.data?.title }}</div>
                </template>
                <template v-if="column.key === 'content'">
                    <div class="line-clamp-2">{{ record.data?.content }}</div>
                </template>
                <template v-if="column.key === 'thumbnail'">
                    <div class="thumbnail-table">
                        <img v-if="record.data?.image"
                            :src="'https://api-v1.pipsnews.net/static/public/public?id=' + record.data.image" alt="">
                    </div>
                </template>
                <template v-if="column.key === 'important'">
                    <a-tag color="green" v-if="record[column.key] == 1">True</a-tag>
                    <a-tag color="red" v-else>False</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <div>
                        <edit-outlined class="editable-cell-icon" @click="editFlashNews(record)"
                            style="color: #ff5501; margin-left: 5px; font-size: 15px;" />
                        <a-popconfirm title="Are you sure delete?" placement="topRight" ok-text="Yes" cancel-text="No"
                            @confirm="handleDelete(record.id)">
                            <DeleteOutlined class="editable-cell-icon"
                                style="color: red; margin-left: 5px; font-size: 15px;" />
                        </a-popconfirm>
                    </div>
                </template>
            </template>
        </a-table>
    </a-spin>

    <button v-if="listPost.length > 0" class="load-more" @click="handleLoadMore()">Load more</button>

    <!-- Modal -->
    <ModalCMS :showModal="showModal" @close-modal="handleCloseModal" :titleModal="'Detail post'" style="top: 20px;">
        <a-spin :spinning="loading">
            <a-form ref="formRef" :model="formState" name="basic" autocomplete="off" layout="vertical"
                @finish="onFinish">
                <a-form-item label="Title" name="title">
                    <a-input v-model:value="formState.title" />
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
                <a-row>
                    <a-form-item label="Important" name="important">
                        <a-switch v-model:checked="formState.important" />
                    </a-form-item>
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
import { onMounted, ref, computed } from 'vue';
import ModalCMS from '../../components/ModalCMS.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import FlashNewsSrv from '../../services/CMS/flash-news.service';
import ImgSrv from '../../services/CMS/img.service';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// Define default form values
const defaultFormState = {
    id: '',
    title: '',
    content: '',
    thumbnail: [],
    important: false,
    ping: true,
    image: ''
}

let fetchParams = {
    page: 1,
    perPage: 15
}
let formState = ref({ ...defaultFormState });
const formRef = ref(null);
const loading = ref(false);
const flagUpdate = ref(false);
let listPost = ref([]);
const columnsFlashNews = [
    {
        title: 'STT',
        key: 'stt',
        width: 60,
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
        width: 300
    },
    {
        title: 'Thumbnail',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        width: 100
    },
    {
        title: 'Important',
        dataIndex: 'important',
        key: 'important',
        width: 85,
        align: 'center'
    },
    {
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 50
    }];
const showModal = ref(false);

const openModal = () => {
    showModal.value = true;
}

const handleCloseModal = () => {
    resetFormValidation();
    showModal.value = false; // Cập nhật showModal khi đóng modal
};

const editFlashNews = (data) => {
    flagUpdate.value = true;
    formState.value.id = data.id;
    formState.value.title = data.data?.title;
    formState.value.important = data.important == 1 ? true : false;
    formState.value.content = data.data?.content;
    formState.value.image = data.data?.image;
    showModal.value = true;
}

const handleLoadMore = async () => {
    await getFlashNews(listPost.value[listPost.value.length - 1]?.id);
}

const getFlashNews = async (id = null) => {
    loading.value = true;
    const data = await axios.get(`https://api-v1.pipsnews.net/api/flash-news/vi/247-news`, {
        params: {
            is_flash: true,
            is_calendar: false,
            is_stock: true,
            id: id
        }
    }).then((res) => res.data.data);
    // nếu có load more thì mới nối mảng
    if (id) {
        listPost.value = [...listPost.value, ...data]
    } else listPost.value = data;
    loading.value = false;
}

const handleDelete = async (idValue) => {
    loading.value = true;
    const dataParam = {
        id: idValue,
        ping: true
    }
    try {
        const res = await FlashNewsSrv.delete(dataParam);
        if (res.status == 200) {
            const objDelete = listPost.value.findIndex(item => item.id == idValue);
            if (objDelete !== -1) {
                listPost.value.splice(objDelete, 1);
            }
            message.success('Delete success!');
        }
    } catch (error) {
        console.error('Error delete record:', error);
    } finally {
        loading.value = false;
    }
}

const handleBeforeUpload = (file, fileList) => {
    // Prevent automatic upload when selecting file
    return false;
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
            const resAdd = await createNews(formState.value);
            if (resAdd) {
                const newData = {
                    data: formState.value,
                    id: formState.value.id,
                    important: formState.value.important
                }
                listPost.value.unshift(newData);
            }
        } else {
            const resEdit = await updateFlashNews(formState.value);
            if (resEdit) {
                const newData = {
                    data: { ...formState.value },
                    id: formState.value.id,
                    important: formState.value.important
                }
                const index = listPost.value.findIndex(item => item.id === formState.value.id);
                if (index !== -1) {
                    listPost.value[index] = newData;
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
};


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

const createNews = async (formData) => {
    const res = await FlashNewsSrv.create(formData);
    if (!res.data.msg == 'success') {
        throw new Error('Create failed');
        return false;
    } else {
        formData.id = res.data.data.id;
        return true;
    }
};

const updateFlashNews = async (formData) => {
    const res = await FlashNewsSrv.update(formData);
    if (!res.data.msg == 'success') {
        throw new Error('Update failed');
        return false;
    }

    return true;
};

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
    formState.value = { ...defaultFormState };
    formState.value.content = ' ';
    formState.value.image = '';
    flagUpdate.value = false;
};

onMounted(() => {
    getFlashNews();
});


</script>
<style lang="scss" scoped>
.control-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

:deep(.ant-form-item) {
    margin-bottom: 10px;
}

:deep(.ant-upload-list) {
    width: 100%;
}

:deep(.custom-select) {
    gap: 10px;

    .ant-form-item {
        width: calc(50% - 10px);
    }
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

.load-more {
    padding: 15px 20px;
    border: 0;
    background: #1677ff;
    border-radius: 5px;
    color: #fff;
    margin: 20px auto;
    display: table;

    cursor: pointer;

    &:hover {
        background: #296ac5;
    }
}
</style>