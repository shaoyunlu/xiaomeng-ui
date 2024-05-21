<template>
    <div class="xmv-tree-node"
        ref="nodeRef"
        :draggable="treeMode.draggable"
        @dragstart.stop="handleDragStart"
        @dragenter.stop="handleDragEnter"
        @dragleave.stop="handleDragLeave"
        @dragover.stop="handleDragOver"
        @dragend.stop="handleDragEnd"
        @drop.stop="handleDrop"
        :class="{'is-expanded' : node.isExpanded ,
                 'is-current' : node.isCurrent ,
                 'is-focusable':node.isFocusable,
                 'is-hidden':node.isHidden,
                 'is-drop-inner':isDropInner}" @click.stop="handleClick">
        <tree-content :node="node" @expandIconClick="handleExpandIconClick"></tree-content>
        <tree-sub :node="node" v-show="node.isExpanded" ref="subRef"></tree-sub>
    </div>
</template>

<script>
import {defineComponent, inject, onMounted, ref, watch} from 'vue'
import treeContent from './treeContent.vue'
import treeSub from './treeSub.vue'
export default defineComponent({
    name:"xmvTreeNode",
    components:{treeContent ,treeSub},
    props:{
        node : Object,
        parent : Object
    },
    setup(props ,context) {

        const treeMode = inject('TreeMode')
        const subRef = ref(null)

        const nodeRef = ref(null)
        const isDropInner = ref(false)

        const level = inject('Level')

        let tmpNodeLabelOffsetLeft
        let tmpNodeContentClientHeight
        let tmpNodeDragPos

        const handleClick = ()=>{
            treeMode.handleNodeClick(props.node)
        }

        const handleExpandIconClick = ()=>{
            treeMode.handleExpandIconClick(props.node ,subRef)
        }

        treeMode.$on('resetStatus' ,()=>{
            props.node.isCurrent = false
            props.node.isExpanded = false
            props.node.iconExpanded = false
        })

        treeMode.$on('nodeClick' ,(tmpNode)=>{
            props.node.isCurrent = (props.node === tmpNode)
        })

        treeMode.$on('nodeActive' ,({node : tmpNode ,type})=>{
            if (tmpNode[type] != props.node[type]){
                props.node.isCurrent = false
            }
        })

        treeMode.$on('triggerExpandClick' ,({tmp ,type})=>{
            if (tmp[type] === props.node[type]){
                if (!props.node.isExpanded){
                    handleExpandIconClick()
                }
            }
        })

        treeMode.$on('expandNodeByLevel' ,(tmpLevel)=>{
            if (tmpLevel >= level){
                props.node.isExpanded = true
            }
        })

        const handleDragStart = (e)=>{
            treeMode.$emit('node-drag-start' ,props.node)
        }

        const handleDragEnter = (e)=>{
            e.preventDefault()
            if (treeMode.currentDropEnterNode === props.node){

            }else{
                treeMode.currentDropEnterNode = props.node
                treeMode.tmpTreeBoundInfo = treeMode.treeRef.value.getBoundingClientRect()
                treeMode.$emit('node-drag-enter' ,props.node)
                tmpNodeLabelOffsetLeft = nodeRef.value.querySelector('.xmv-tree-node__label').offsetLeft
                tmpNodeContentClientHeight = nodeRef.value.querySelector('.xmv-tree-node__content').clientHeight
            }     
        }

        const handleDragOver = (e)=>{
            e.preventDefault()
            if (treeMode.currentDragNode === props.node){
                return false
            }
            let nodeClientHeight = tmpNodeContentClientHeight
            let midPoint = nodeRef.value.offsetTop + nodeClientHeight/2
            let cursorPoint = e.clientY - treeMode.tmpTreeBoundInfo.top
            let minus = cursorPoint - midPoint
            if (minus > 5){
                tmpNodeDragPos = 'bottom'
                treeMode.dropIndicatorDisplay.value = true
                treeMode.dropIndicatorLeft.value = tmpNodeLabelOffsetLeft
                treeMode.dropIndicatorTop.value = midPoint + nodeClientHeight/2
                isDropInner.value = false
            }else if (minus < -5){
                tmpNodeDragPos = 'top'
                treeMode.dropIndicatorDisplay.value = true
                treeMode.dropIndicatorLeft.value = tmpNodeLabelOffsetLeft
                treeMode.dropIndicatorTop.value = midPoint - nodeClientHeight/2
                isDropInner.value = false
            }else{
                tmpNodeDragPos = 'center'
                treeMode.dropIndicatorDisplay.value = false
                isDropInner.value = true
            }
            treeMode.$emit('node-drag-over' ,props.node)
        }

        const handleDragLeave = (e)=>{
            e.preventDefault()
            isDropInner.value = false
            treeMode.dropIndicatorDisplay.value = false
            if (treeMode.currentDropEnterNode !== props.node){
                treeMode.$emit('node-drag-leave' ,props.node)
            }
        }

        const handleDrop = (e)=>{
            e.preventDefault()
            isDropInner.value = false
            treeMode.dropIndicatorDisplay.value = false
            treeMode.$emit('node-drop' ,{node : props.node ,pos : tmpNodeDragPos})
        }

        const handleDragEnd = (e)=>{
            e.preventDefault()
            isDropInner.value = false
            treeMode.dropIndicatorDisplay.value = false
            treeMode.$emit('node-drag-end')
        }

        onMounted(()=>{
            if (props.parent != undefined){
                props.node.parent = props.parent
            }
            if (treeMode.draggable){

            }
        })

        return {treeMode ,subRef , nodeRef ,isDropInner ,handleClick ,handleExpandIconClick ,
                handleDragStart ,handleDragOver ,handleDragEnter ,handleDragLeave ,handleDrop ,handleDragEnd}
    }
})
</script>

<style lang="" scoped></style>
