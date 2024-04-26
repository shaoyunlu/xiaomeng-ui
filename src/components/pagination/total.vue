<template>
    <span class="xmv-pagination__total">
        共 {{ paginationMode.props.total }} 条
    </span>
</template>

<script>
import {defineComponent,inject} from 'vue'
export default defineComponent({
    name:"",
    setup(props ,context) {
        const paginationMode = inject('PaginationMode')
        return {paginationMode}
    }
})
</script>

<style lang="" scoped></style>
