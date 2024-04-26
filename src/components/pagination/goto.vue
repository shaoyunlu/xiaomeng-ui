<template>
    <span class="xmv-pagination__jump">
        <span class="xmv-pagination__goto">跳转</span>
        <xmv-input class="xmv-pagination__editor is-in-pagination" 
            placeholder="页数" type="number"
            v-model="paginationMode.gotoMode.value" @blur="handleInputBlur" @enter="handleInputBlur"></xmv-input>
        <span class="xmv-pagination__classifier"></span>
    </span>
</template>

<script>
import {defineComponent ,inject ,onMounted,ref} from 'vue'
export default defineComponent({
    name:"",
    setup(props ,context) {
        const paginationMode = inject('PaginationMode')

        const handleInputBlur = ()=>{
            let __val = parseInt(paginationMode.gotoMode.value)
            if (!Number.isInteger(__val)){
                paginationMode.gotoMode.value = paginationMode.currentPage.value
                return false
            }
            if (__val == paginationMode.currentPage.value){
                return false
            }

            if (__val > paginationMode.maxPageCount.value){
                __val = paginationMode.maxPageCount.value
                paginationMode.gotoMode.value = __val
            }
            if(__val < 1){
                __val = 1
                paginationMode.gotoMode.value = __val
            }

            paginationMode.currentPage.value = __val
            paginationMode.set()
            paginationMode.emitChangeNumber()
        }

        paginationMode.$on('changeNum' ,()=>{
            paginationMode.gotoMode.value = paginationMode.currentPage.value
        })

        onMounted(()=>{
            paginationMode.gotoMode.value = paginationMode.currentPage.value
        })

        return {paginationMode ,handleInputBlur}
    }
})
</script>

<style lang="" scoped></style>
