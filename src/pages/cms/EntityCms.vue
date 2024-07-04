<template>
    <!-- Table post type -->
    <h2>Quản lý bài viết:</h2>
    <div class="control-header">
        <span>Tổng số: <a-badge :count="total" /></span>
        <a-button type="primary" @click="openModal">Add</a-button>
    </div>
    <a-spin :spinning="loading">
        <TableCMS :columns="columnsEntities" :data="listEntities" @update="handleUpdate" @delete="handleDelete"
            :scroll="2000" />
        <PaginationCustom v-if="listEntities.length" :current-page="fetchParams.page" :total="total"
            :page-size="fetchParams.per_page" @change-page="handleChangePage" />
    </a-spin>

    <!-- Modal -->
    <ModalCMS :showModal="showModal" @close-modal="handleCloseModal" :titleModal="'Detail post'" style="top: 20px;">
        <a-spin :spinning="loading">
            <a-form ref="formRef" :model="formState" name="basic" autocomplete="off" layout="vertical"
                @finish="onFinish">
                <a-form-item label="Title" name="title"
                    :rules="[{ required: true, message: 'Please input type title!' }]">
                    <a-input v-model:value="formState.title" />
                </a-form-item>
                <a-form-item label="Description" name="description">
                    <QuillEditor theme="snow" contentType="html" toolbar="minimal"
                        v-model:content="formState.description" />
                </a-form-item>
                <a-row :gutter="24">
                    <a-form-item name="thumbnail" label="Thumbnail" :rules="thumbnailRules" class="custom-upload">
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
                    <div class="img-thumbnail" v-if="formState.imgServer && formState.thumbnail == 0">
                        <img :src="formState.imgServer" alt="">
                    </div>
                </a-row>
                <a-row>
                    <a-form-item label="Important" name="is_show"
                        :rules="[{ required: true, message: 'Please choose show!' }]">
                        <a-switch v-model:checked="formState.is_" />
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
import TableCMS from '../../components/TableCMS.vue';
import ModalCMS from '../../components/ModalCMS.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import EntitySrv from '../../services/CMS/entity.service';
import { message } from 'ant-design-vue';
import PaginationCustom from '../../components/PaginationCustom.vue';

// Define default form values
const defaultFormState = {
    id: '',
    title: '',
    description: '',
    thumbnail: [],
    is_favorite: false,
}

let fetchParams = {
    page: 1,
    per_page: 15
}
let formState = ref({ ...defaultFormState });
const formRef = ref(null);
const loading = ref(false);
const flagUpdate = ref(false);
let listEntities = ref([]);
const total = ref(0);
const columnsEntities = [
    {
        title: 'STT',
        key: 'stt',
        width: 60,
        align: 'center'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Thumbnail',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        width: 300
    },
    {
        title: 'Important',
        dataIndex: 'is_important',
        key: 'switch',
        width: 80,
        align: 'center'
    },
    {
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 80
    }];
const showModal = ref(false);

const thumbnailRules = computed(() => {
    if (formState.value.imgServer) {
        return []; // Không có quy tắc nếu có imgServer
    } else {
        return [{ required: true, message: 'Please input thumbnail!' }]; // Quy tắc bắt buộc nếu không có imgServer
    }
});

const openModal = () => {
    showModal.value = true;
}

const handleCloseModal = () => {
    resetFormValidation();
    showModal.value = false; // Cập nhật showModal khi đóng modal
};

const handleChangePage = (page) => {
    fetchParams = {
        ...fetchParams,
        page: page
    }
    getAllPost();
}

const getAllPost = async () => {
    loading.value = true;
    try {
        const res = await EntitySrv.getAll(fetchParams);
        if (res.data.success) {
            listEntities.value = res.data.data;
            total.value = res.data.pagination.total;
        }
    } catch (error) {
        console.error('Error fetching all post:', error);
    } finally {
        loading.value = false;
    }
};

const handleUpdate = async (data) => {
    flagUpdate.value = true;

    // return data type về dạng [1, 2, 3]
    const types = data.types.length > 0 && data.types.map(type => type.id);
    for (const key in formState.value) {
        if (key == 'is_show' || key == 'is_favorite') {
            formState.value[key] = data[key] == 1 ? true : false;
        } else if (key == 'type') {
            formState.value[key] = types;
        } else if (key != 'thumbnail') {
            formState.value[key] = data[key];
        }
    }
    formState.value.imgServer = data.thumbnail;
    showModal.value = true;
}

const handleDelete = async (id) => {
    loading.value = true;
    try {
        const res = await EntitySrv.delete(id);
        if (res.data.success) {
            getAllPost();
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
const onFinish = async (values) => {
    loading.value = true;
    const formData = createFormData(values);

    try {
        if (!flagUpdate.value) {
            await createEntity(formData);
        } else {
            await updateEntity(formData);
        }
        message.success(flagUpdate.value ? 'Update success!' : 'Create success!');
        getAllPost();
        handleCloseModal();

    } catch (error) {
        message.error(flagUpdate.value ? 'Update fail!' : 'Create fail!');
        console.error(`Error ${flagUpdate.value ? 'update' : 'create'} entity:`, error);
    } finally {
        loading.value = false;
    }
};

const createFormData = (values) => {
    const formData = new FormData();
    for (const key in values) {
        if (values.hasOwnProperty(key) && key !== 'thumbnail') {
            if (key === 'is_show' || key === 'is_favorite') {
                formData.append(key, values[key] === true ? 1 : 0)
            } else if (key === 'type' && Array.isArray(values[key])) {
                values[key].forEach((typeValue) => {
                    formData.append(`${key}[]`, typeValue);
                });
            } else {
                formData.append(key, values[key]);
            }
        }
    }
    if (values.thumbnail[0]) {
        formData.append('thumbnail', values.thumbnail[0].originFileObj);
    }
    return formData;
};

const createEntity = async (formData) => {
    const res = await EntitySrv.create(formData);
    if (!res.data.success) {
        throw new Error('Create failed');
    }
};

const updateEntity = async (formData) => {
    const res = await EntitySrv.update(formState.value.id, formData);
    if (!res.data.success) {
        throw new Error('Update failed');
    }
};

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
    formState.value = { ...defaultFormState };
    formState.value.description = ' ';
    formState.value.imgServer = '';
    flagUpdate.value = false;
};

onMounted(() => {
    getAllPost();
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
    width: 100px;
    height: 100px;

    img {
        width: inherit;
        height: inherit;
        object-fit: contain;
    }
}
</style>
