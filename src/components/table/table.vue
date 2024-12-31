<template>
    <div class="xmv-table"  :class="computeTableClass" ref="tableRef" :style="computeTableStyle">
        <div class="xmv-table__inner-wrapper" :style="computeTableInnerStyle">
            <div class="hidden-columns">
                <slot></slot>
            </div>
            <div class="xmv-table__header-wrapper" ref="tableHeaderWrapperRef">
                <table class="xmv-table__header" border="0" cellpadding="0" cellspacing="0"
                :width="tableMode.rctData.tableWidth + 'px'">
                    <xmv-table-header></xmv-table-header>
                </table>
            </div>
            <div class="xmv-table__body-wrapper">
                <xmv-scrollbar @scroll="handleScroll" ref="scrollBarRef" 
                    :maxHeightFlag="scrollMaxHeightFlag" :maxHeight="scrollMaxHeight">
                    <table class="xmv-table__body" ref="tableBodyRef" cellpadding="0" cellspacing="0" border="0"
                    :width="tableMode.rctData.tableWidth + 'px'">
                        <xmv-table-body></xmv-table-body>
                    </table>
                </xmv-scrollbar>
                <xmv-empty v-if="isShowEmpty"></xmv-empty>
            </div>
        </div>
        <div class="xmv-table__column-resize-proxy"></div>
    </div>
</template>

<script>
import {defineComponent, onMounted, provide ,ref ,reactive, computed ,watch} from 'vue'
import TableMode from './mode/tableMode'

import XmvTableHeader from './tableHeader.vue'
import XmvTableBody from './tableBody.vue'

import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'

export default defineComponent({
    name:"xmvTable",
    components:{XmvTableHeader,XmvTableBody},
    props:{
        height : {type : String},
        border : {type : Boolean ,default : false},
        stripe : {type : Boolean ,default : false},
        maxHeight : String,
        data : Array,
        highlightCurrentRow : Boolean,
        lazy : Boolean,
        load : Function,
        draggable : Boolean,
        beforeDrop : Function
    },
    emits:['node-drag-end','node-drop','tr-click'],
    setup(props ,context) {

        const tableMode = new TableMode(props)
        const tableHeaderWrapperRef = ref(null)
        const tableRef = ref(null)
        const scrollBarRef = ref(null)
        const tableBodyRef = ref(null)
        const scrollMaxHeightFlag = ref(false)
        const scrollMaxHeight = ref(0)
        const scrollingStatus = ref('')
        const isShowEmpty = ref(true)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        tableMode.tableRef = tableRef
        tableMode.tableBodyRef = tableBodyRef

        provide('TableMode' ,tableMode)
        provide('EventBus' ,{$on ,$emit})

        tableMode.$on = $on
        tableMode.$emit = $emit
        tableMode.ctx = context

        const loadData = (data)=>{
            isShowEmpty.value = isEmpty(data)
            tableMode.rctData.data = data
            tableMode.createIndex(tableMode.rctData.data)
        }

        const handleScroll = (info)=>{
            setScrollClass(info)
            tableHeaderWrapperRef.value.scrollLeft = info.hor
        }

        const setScrollClass = (info = {hor : 0})=>{
            if (!isEmpty(info.hor ,true)){
                if (tableRef.value.clientWidth + info.hor == tableMode.rctData.tableWidth){
                    scrollingStatus.value = 'right'
                }else{
                    scrollingStatus.value = 'middle'
                }
            }else{
                scrollingStatus.value = 'left'
            }
        }

        const computeTableClass = computed(()=>{
            let res = []
            if (props.border){
                res.push('xmv-table--border')
            }
            if (props.stripe){
                res.push('xmv-table--striped')
            }
            if (!isEmpty(scrollingStatus.value)){
                res.push('is-scrolling-' + scrollingStatus.value)
            }
            return res
        })

        const computeTableStyle = computed(()=>{
            let res = {}
            if (props.maxHeight != undefined){
                res['max-height'] = props.maxHeight + 'px'
            }
            scrollMaxHeightFlag.value = true
            scrollMaxHeight.value = parseInt(props.maxHeight) - 40
            return res
        })

        const computeTableInnerStyle = computed(()=>{
            let res = {}
            res.height = (props.height != undefined ? (props.height + 'px') : 'auto')
            if (props.maxHeight != undefined){
                res['max-height'] = props.maxHeight + 'px'
            }
            return res
        })
        
        watch(()=>props.data ,(newVal)=>{
            loadData(newVal)
        } ,{ deep: true })

        onMounted(()=>{
            tableMode.init()
            if (!isEmpty(props.data)){
                loadData(props.data)
            }
            setScrollClass()
        })

        return {tableHeaderWrapperRef , tableRef ,tableMode ,computeTableClass,
                computeTableStyle ,computeTableInnerStyle,scrollBarRef ,
                scrollMaxHeightFlag ,scrollMaxHeight ,isShowEmpty,tableBodyRef,
                loadData ,handleScroll}

    }
})
</script>

<style scoped lang="less">

</style>