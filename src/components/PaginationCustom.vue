<template>
    <a-pagination v-model:pageSize="pageSize" v-model:current="currentPage" :total="props.total" show-less-items
        @change="onChange" class="pagination-custom" />
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps(['total', 'currentPage', 'pageSize']);
const emit = defineEmits(['change-page']);
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);
const onChange = (page) => {
    emit('change-page', page);
}
</script>
<style scoped>
.pagination-custom {
    text-align: right;
    margin-top: 10px
}
</style>