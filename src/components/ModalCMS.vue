<template>
    <a-modal :open="showModal" :title="titleModal" :footer="null" @cancel="emit('close-modal')" :maskClosable="false">
        <slot />
        <div class="modal-footer">
            <slot name="footer"></slot>
        </div>
    </a-modal>
</template>
<script setup>
import { ref, defineProps, watch } from 'vue';
const props = defineProps(['showModal', 'titleModal']);
const showModal = ref(props.showModal);
const emit = defineEmits(['submit', 'close-modal']);

const handleOk = (e) => {
    emit('submit');
};
watch(() => props.showModal, (newValue) => {
    showModal.value = newValue;
});
</script>