<template>
    <ul class="xmv-pager">
        <li class="number" @click="()=>handleNumClick(1)" 
            :class="{'is-active':paginationMode.currentPage.value == 1}"> 1 </li>

        <li class="more btn-quickprev xmv-icon" v-if="paginationMode.quickprevShow.value"
        @click="handleQuickPrevClick">
            <xmv-icon name="moreFilled"></xmv-icon>
        </li>

        <xmv-pagination-item v-for="(tmp,index) in paginationMode.list.value" 
        :data="tmp" :key="index" @changeNum="handleChangeNum"></xmv-pagination-item>

        <li class="more btn-quicknext xmv-icon" v-if="paginationMode.quicknextShow.value"
        @click="handleQuickNextClick">
            <xmv-icon name="moreFilled"></xmv-icon>
        </li>

        <li class="number"
            v-if="paginationMode.maxPageCount.value != 0 && paginationMode.maxPageCount.value != 1"
            @click="()=>handleNumClick(paginationMode.maxPageCount.value)"
            :class="{'is-active':paginationMode.currentPage.value == paginationMode.maxPageCount.value}"> {{paginationMode.maxPageCount}} </li>
    </ul>
</template>

<script>
import {defineComponent ,inject ,nextTick} from 'vue'
import xmvPaginationItem from './item.vue'
export default defineComponent({
    name:"",
    components:{xmvPaginationItem},
    setup(props ,context) {
        const paginationMode = inject('PaginationMode')
        const handleChangeNum = (num)=>{
            paginationMode.currentPage.value = num
            paginationMode.set()
            nextTick(()=>{
                paginationMode.emitChangeNumber()
            })
        }

        const handleNumClick = (num)=>{
            paginationMode.currentPage.value = num
            paginationMode.set()
            paginationMode.emitChangeNumber()
        }

        const handleQuickPrevClick = ()=>{
            let tmp = paginationMode.currentPage.value - paginationMode.props.pageCount + 2
            if (tmp < 1){
                tmp = 1
            }
            paginationMode.currentPage.value = tmp
            paginationMode.set()
            nextTick(()=>{
                paginationMode.emitChangeNumber()
            })
        }

        const handleQuickNextClick = ()=>{
            let tmp = paginationMode.currentPage.value + paginationMode.props.pageCount - 2
            if (tmp > paginationMode.maxPageCount.value){
                tmp = paginationMode.maxPageCount.value
            }
            paginationMode.currentPage.value = tmp
            paginationMode.set()
            nextTick(()=>{
                paginationMode.emitChangeNumber()
            })
        }
        return {paginationMode ,handleChangeNum ,handleNumClick,
                handleQuickPrevClick ,handleQuickNextClick}
    }
})
</script>

<style lang="" scoped></style>
