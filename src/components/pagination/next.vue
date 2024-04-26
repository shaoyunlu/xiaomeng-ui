<template>
    <button type="button" class="btn-next" @click="handleNextClick"
        :disabled="paginationMode.nextButtonDisabled.value">
        <xmv-icon name="arrowRight"></xmv-icon>
    </button>
</template>

<script>
import {defineComponent ,nextTick ,inject} from 'vue'
export default defineComponent({
    name:"",
    setup(props ,context) {

        const paginationMode = inject('PaginationMode')

        const handleNextClick = ()=>{
            if (paginationMode.currentPage.value == paginationMode.maxPageCount.value
                ||paginationMode.maxPageCount.value == 0){
                return false
            }
            paginationMode.currentPage.value = paginationMode.currentPage.value + 1
            paginationMode.set()
            nextTick(()=>{
                paginationMode.emitChangeNumber()
            })
        }
        return {paginationMode ,handleNextClick}
    }
})
</script>

<style lang="" scoped></style>
