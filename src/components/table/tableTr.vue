<template>
    <tr class="xmv-table__row" :class="computeTrClass" ref="trRef"
        @click="handleTrClick" 
        :draggable="tableMode.option.draggable"
        @dragstart.stop="handleDragStart"
        @dragenter.stop="handleDragEnter"
        @dragleave.stop="handleDragLeave"
        @dragover.stop="handleDragOver"
        @dragend.stop="handleDragEnd"
        @drop.stop="handleDrop">
        <xmv-table-td v-for="header in tableMode.rctData.header" :header="header" :data="data" :index="index"></xmv-table-td>
    </tr>
    <xmv-table-tr
        v-if="data.xmvIsExpand"
        v-for="(cData,cIndex) in data.children" 
        :data="cData" 
        :key="cIndex" 
        :index="cIndex"></xmv-table-tr>
</template>

<script>
import {computed, defineComponent, inject ,ref} from 'vue'
import XmvTableTd from './tableTd.vue'
export default defineComponent({
    name:"xmvTableTr",
    components:{XmvTableTd},
    props:{
        data : Object,
        index : Number
    },
    setup(props ,context) {
        const tableMode = inject('TableMode')
        const isExpandTr = ref(false)
        const trRef = ref(null)

        const dragStyle = ref('')
        let tmpDragStyle

        let tmpNodeContentClientHeight

        const computeTrClass = computed(()=>{
            let res = []
            if (props.data.xmvTrStatus){
                res.push(props.data.xmvTrStatus + '-row')
            }
            if (tableMode.option.stripe){
                if (props.index%2 != 0){
                    res.push('xmv-table__row--striped')
                }
            }
            if (dragStyle.value != ''){
                res.push('xmv-table__row--drag-' + dragStyle.value)
            }
            if (props.data.checked){
                res.push('current-row')
            }
            if (props.data.xmvDepth != 0){
                res.push('xmv-table__row--level-' + props.data.xmvDepth)
            }
            return res
        })
        const handleTrClick = ()=>{
            if (tableMode.option.highlightCurrentRow){
                tableMode.$emit('trClick' ,props.index)
            }
        }
        tableMode.$on('trClick' ,__index =>{
            props.data.checked = (props.index == __index)
        })

        const handleDragStart = ()=>{
            tableMode.currentDragNode = props.data
        }

        const handleDragEnter = (e)=>{
            e.preventDefault()
            if (tableMode.currentDropEnterNode === props.data ||
                tableMode.currentDragNode === props.data){
            }else{
                tableMode.currentDropEnterNode = props.data
                tmpNodeContentClientHeight = trRef.value.clientHeight
                tableMode.tmpTableBoundInfo = tableMode.tableBodyRef.value.getBoundingClientRect()
            }
        }

        const handleDragOver = (e)=>{
            e.preventDefault()
            if (tableMode.currentDragNode === props.data){
                return false
            }
            let nodeClientHeight = tmpNodeContentClientHeight
            let midPoint = trRef.value.offsetTop + nodeClientHeight/2
            let cursorPoint = e.clientY - tableMode.tmpTableBoundInfo.top
            let minus = cursorPoint - midPoint
            if (minus > 8){
                dragStyle.value = 'bottom'
                tmpDragStyle = 'bottom'
            }else if (minus < -8){
                dragStyle.value = 'up'
                tmpDragStyle = 'up'
            }else{
                dragStyle.value = 'middle'
                tmpDragStyle = 'middle'
            }
            
        }

        const handleDragLeave = ()=>{
            dragStyle.value = ''
        }

        const handleDragEnd = ()=>{
            tableMode.ctx.emit('node-drag-end' ,{
                dragNode : tableMode.currentDragNode,
                enterNode : tableMode.currentDropEnterNode
            })
            tableMode.$emit('node-drag-end')
        }

        const handleDrop = (e)=>{
            if (tableMode.option.beforeDrop){
                tableMode.option.beforeDrop(tableMode.currentDragNode ,tableMode.currentDropEnterNode).then(()=>{
                    tableMode.ctx.emit('node-drop' ,{
                        dragNode : tableMode.currentDragNode,
                        enterNode : tableMode.currentDropEnterNode
                    })
                    __handleDrop()
                }).catch(()=>{
                })
            }else{
                __handleDrop()
            }
        }

        const __handleDrop = ()=>{
            switch (tmpDragStyle) {
                case 'up':
                    tableMode.beforeNode()
                    break;
                case 'bottom':
                    tableMode.afterNode()
                    break;
                case 'middle':
                    tableMode.exchangeNode()
                    break;
                default:
                    break;
            }
        }

        tableMode.$on('node-drag-end' ,()=>{
            dragStyle.value = ''
        })

        return {tableMode ,computeTrClass ,isExpandTr ,trRef,dragStyle,
                handleTrClick ,handleDragStart ,handleDragEnter ,
                handleDragLeave ,handleDragOver ,handleDragEnd ,handleDrop}
    }
})
</script>

<style lang="" scoped></style>
