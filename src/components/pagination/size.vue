<template>
    <span class="xmv-pagination__sizes">
        <xmv-select v-model="paginationMode.sizeMode.value" @change="handleSelectChange">
            <xmv-option label="10条/页" :value="10"></xmv-option>
            <xmv-option label="50条/页" :value="50"></xmv-option>
            <xmv-option label="100条/页" :value="100"></xmv-option>
        </xmv-select>
    </span>
</template>

<script>
import {defineComponent, ref ,inject, watch, onMounted} from 'vue'
export default defineComponent({
    name:"",
    setup(props ,context) {
        const paginationMode = inject('PaginationMode')

        const handleSelectChange = (val)=>{
            paginationMode.ctx.emit('update:pageSize' ,val)
        }

        onMounted(()=>{
            paginationMode.sizeMode.value = paginationMode.props.pageSize
        })
        return {paginationMode ,handleSelectChange}
    }
})
</script>

<style lang="" scoped></style>
