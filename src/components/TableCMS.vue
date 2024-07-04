<template>
    <a-table :columns="props.columns" v-if="props.data.length > 0" :scroll="{ x: props.scroll ? props.scroll : 1200 }"
        rowClassName="custom-table" :data-source="props.data?.length > 0 ? props.data : [{}]" bordered
        :pagination="false">
        <template #bodyCell="{ column, record, index }">
            <!-- STT -->
            <template v-if="column.key === 'stt'">
                {{ index + 1 }}
            </template>

            <!-- description -->
            <template v-if="column.key === 'description'">
                <div class="line-clamp-2" v-html="record.description || ''"></div>
            </template>

            <!-- template on/off -->
            <template v-if="column.key === 'switch'">
                <a-tag color="green" v-if="record[column.dataIndex] == 1">On</a-tag>
                <a-tag color="red" v-else>Off</a-tag>
            </template>

            <!-- template time -->
            <template v-if="column.key === 'time'">
                {{ $filters.formatDate(record[column.dataIndex], 'YYYY-MM-DD HH:mm:ss') }}
            </template>

            <!-- banner thumbnail -->
            <template v-if="column.key === 'banner_thumbnail'">
                <img v-if="record.banner_url" :src="record.banner_url" alt=""
                    style="width: 100px; height: 50px; object-fit: contain;">
                <span v-else>-</span>
            </template>

            <!-- action -->
            <template v-if="column.key === 'action'">
                <div>
                    <edit-outlined class="editable-cell-icon" @click="edit(record)"
                        style="color: #ff5501; margin-left: 5px; font-size: 15px;" />
                    <a-popconfirm title="Are you sure delete?" placement="topRight" ok-text="Yes" cancel-text="No"
                        @confirm="deleteRecord(record.id)">
                        <DeleteOutlined class="editable-cell-icon"
                            style="color: red; margin-left: 5px; font-size: 15px;" />
                    </a-popconfirm>
                </div>
            </template>
        </template>
    </a-table>

    <a-empty v-else />
</template>
<script setup>
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const props = defineProps(['columns', 'data', 'widthScroll', 'listGroup', 'scroll']);
const emit = defineEmits(['update', 'delete']);
const edit = (record) => {
    emit('update', record);
}
const deleteRecord = (id) => {
    emit('delete', id);
}
</script>
<style lang="scss">
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
