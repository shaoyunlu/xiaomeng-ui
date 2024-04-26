<template>
    <button type="button" class="btn-prev" @click="handlePrevClick"
        :disabled="paginationMode.prevButtonDisabled.value">
        <xmv-icon name="arrowLeft"></xmv-icon>
    </button>
</template>

<script>
import {defineComponent ,inject ,nextTick} from 'vue'
export default defineComponent({
    name:"",
    setup(props ,context) {

        const paginationMode = inject('PaginationMode')

        const handlePrevClick = ()=>{
            if (paginationMode.currentPage.value == 1 
                || paginationMode.maxPageCount.value == 0){
                return false
            }
            paginationMode.currentPage.value = paginationMode.currentPage.value - 1
            paginationMode.set()
            nextTick(()=>{
                paginationMode.emitChangeNumber()
            })
        }

        return {paginationMode,handlePrevClick}
    }
})
</script>

<style lang="" scoped></style>
