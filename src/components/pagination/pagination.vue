<template>
    <div class="xmv-pagination" 
        :class="{
                    'is-background' : (background != undefined),
                    'xmv-pagination--small' : (small != undefined),
                    'is-total-zero' : (total == 0)
                }">
        <component :is='"xmv-pagination-" + layoutArr[0]' class="is-first"></component>
        <component :is='"xmv-pagination-" + layoutArr[1]'></component>
        <component :is='"xmv-pagination-" + layoutArr[2]'></component>
        <component :is='"xmv-pagination-" + layoutArr[3]'></component>
        <component :is='"xmv-pagination-" + layoutArr[4]'></component>
        <component :is='"xmv-pagination-" + layoutArr[5]'></component>
    </div>
</template>

<script>
import {defineComponent, ref, onMounted ,provide,reactive, watch} from 'vue'
import PaginationMode from './mode/paginationMode'
import xmvPaginationPrev from './prev.vue'
import xmvPaginationNext from './next.vue'
import xmvPaginationPager from './pager.vue'
import xmvPaginationGoto from './goto.vue'
import xmvPaginationSize from './size.vue'
import xmvPaginationTotal from './total.vue'
import {createEventBus} from 'utils/event'
export default defineComponent({
    name:"xmvPagination",
    components:{xmvPaginationPrev,xmvPaginationNext,xmvPaginationTotal,
                xmvPaginationPager,xmvPaginationGoto,xmvPaginationSize},
    emits:['changeNumber','update:pageSize'],
    props:{
        total : {type:Number ,default:0},
        pageSize : {type:Number ,default:10},
        pageCount : {type:Number ,default:7},
        background : String,
        small : String,
        layout : {type:String ,default:'prev,pager,next'}
    },
    setup(props ,context) {

        const eventBus = reactive({
            listeners : {}
        })

        const layoutArr = props.layout.split(',')

        const {$on ,$emit} = createEventBus(eventBus)

        const paginationMode = new PaginationMode(props ,context)
        paginationMode.$emit = $emit
        paginationMode.$on = $on

        provide('PaginationMode' ,paginationMode)
        provide('EventBus' ,{$on ,$emit})

        const getPageInfo = ()=>{
            return {
                pageNum : paginationMode.currentPage.value,
                pageSize : props.pageSize
            }
        }

        const reset = ()=>{
            paginationMode.currentPage.value = 1
            $emit('changeNum' ,1)
            paginationMode.set()
        }

        watch(()=>props.total ,(newVal)=>{
            paginationMode.currentPage.value = 1
            paginationMode.set()
            paginationMode.emitInnerChangeNumber()
        })

        watch(()=>props.pageSize ,(newVal)=>{
            paginationMode.currentPage.value = 1
            paginationMode.gotoMode.value = 1
            paginationMode.set()
            paginationMode.emitChangeNumber()
        })

        onMounted(()=>{
            paginationMode.set()
        })

        return {paginationMode ,layoutArr ,getPageInfo ,reset}
    }
})
</script>

<style lang="" scoped></style>
