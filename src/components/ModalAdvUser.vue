<template>
    <a-modal v-model:open="open" :footer="null" class="model-custom" centered :afterClose="handleCloseModal">
        <a :href="props.banner?.url ? props.banner.url : ''" target=" _blank">
            <img v-if="props.banner?.banner_url" :src="props.banner?.banner_url" alt="" class="banner-advertising" />
            <img v-else src="../assets/img-default.png" alt="" class="banner-advertising" />
        </a>
    </a-modal>
</template>
<script setup>
import { ref, defineProps } from 'vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps(['banner']);

const open = ref(true);
const router = useRouter();

const handleCloseModal = () => {
    const link = props.banner?.url ? props.banner?.url : '';
    if (link) {
        window.open(link, '_blank');
    }
}

watch(() => router.currentRoute.value,
    (to, from) => {
        open.value = true;
    }
);
</script>
<style lang="scss" scoped>
.model-custom {
    a {
        display: block
    }

    .banner-advertising {
        width: 100%;
        object-fit: fill;
        max-height: 300px;
    }
}
</style>