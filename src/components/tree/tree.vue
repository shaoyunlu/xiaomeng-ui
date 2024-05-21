<template>
    <div class="xmv-tree" ref="treeRef">
        <xmv-tree-node v-for="node in treeMode.rctData.data" :node="node" :key="node.value"></xmv-tree-node>
        <div v-if="draggable" class="xmv-tree__drop-indicator" :style="computeDropIndicatorStyle"></div>
    </div>
</template>

<script>
import {defineComponent ,nextTick,provide ,reactive ,onMounted ,watch, computed, ref} from 'vue'
import TreeMode from './mode/treeMode';
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
import TableMode from '../table/mode/tableMode';
export default defineComponent({
    name:"xmvTree",
    emits:['nodeClick' ,'nodeCheck' ,'node-drag-start' ,
            'node-drag-over' ,'node-drag-enter' ,'node-drag-leave' ,'node-drop' ,'node-drag-end'],
    props:{
        showCheckbox : {type:Boolean ,default : false},
        filterNodeMethod : {
            type : Function
        },
        notAssociated : {type:Boolean ,default : false},  // 父子节点是否相关联,
        draggable : {type:Boolean ,default : false},
        lazy : Boolean,
        load : Function,
        data : Array,
        expandLevel : Number,
        onlyChildNode : Boolean
    },
    setup(props ,context) {
        const treeMode = new TreeMode(props)
        const treeRef = ref(null)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        treeMode.$on = $on
        treeMode.$emit = $emit
        treeMode.treeRef = treeRef
        treeMode.draggable = props.draggable
        treeMode.lazy = props.lazy
        treeMode.load = props.load
        treeMode.onlyChildNode = props.onlyChildNode

        provide('Level' ,0)
        provide('TreeMode' ,treeMode)
        provide('Slots' ,context.slots)
        provide('EventBus' ,{$on ,$emit})

        const computeDropIndicatorStyle = computed(()=>{
            let res =  {left : treeMode.dropIndicatorLeft.value + 'px',
                        top : treeMode.dropIndicatorTop.value + 'px'}

            if (!treeMode.dropIndicatorDisplay.value){
                res.display = 'none'
            }

            return res
        })

        $on('nodeClick' ,(node)=>{
            context.emit('nodeClick' ,node)
        })

        $on('nodeCheck' ,(nodeList)=>{
            context.emit('nodeCheck' ,nodeList)
        })

        $on('node-drag-start' ,(node)=>{
            treeMode.currentDragNode = node
            context.emit('node-drag-start' ,node)
        })

        $on('node-drag-over' ,(node)=>{
            context.emit('node-drag-over' ,node)
        })

        $on('node-drag-enter' ,(node)=>{
            context.emit('node-drag-enter' ,node)
        })

        $on('node-drag-leave' ,(node)=>{
            context.emit('node-drag-leave' ,node)
        })

        $on('node-drop' ,({node ,pos})=>{
            if (treeMode.currentDragNode !== node){
                context.emit('node-drop' ,node)
                if (pos == 'center'){
                    treeMode.insertNode(node)
                }else if (pos == 'bottom'){
                    treeMode.afterNode(node)
                }else {
                    treeMode.beforeNode(node)
                }
            }
        })

        $on('node-drag-end' ,()=>{
            context.emit('node-drag-end')
        })

        const loadData = (data)=>{
            treeMode.loadData(data)
            if (props.expandLevel != undefined){
                expandNodeByLevel(props.expandLevel)
            }
        }

        const filter = (label)=>{
            treeMode.filter(label)
        }

        const setMultipleValue = (val ,cbf)=>{
            treeMode.rctData.sData = []
            let list = val
            nextTick(()=>{
                list.forEach(tmp =>{
                    let node = treeMode.findNodeByParam(treeMode.rctData.data ,tmp)
                    if (!isEmpty(node)){
                        node.isChecked = true
                        treeMode.rctData.sData.push(node)
                    }
                })
                cbf(treeMode.rctData.sData)
                if (props.notAssociated == false){
                    nextTick(()=>{
                        treeMode.rctData.sData.forEach(tmp =>{
                            treeMode.__handleParentNodeCheck(tmp)
                        })
                    })
                }
            })
        }

        const setValue = (val)=>{
            let node = treeMode.findNodeByParam(treeMode.rctData.data ,val)
            let parentNodes = treeMode.findParents(treeMode.rctData.data ,val)
            parentNodes && parentNodes.forEach(parentNode =>{
                parentNode.isExpanded = true
            })

            nextTick(()=>{
                treeMode.handleNodeClick(node)
            })
            return node
        }

        const reset = ()=>{
            treeMode.$emit('resetStatus')
        }

        const activeNode = (value ,type = 'value')=>{
            treeMode.activeNode(value ,type)
        }

        const expandNodeByLevel = (level)=>{
            nextTick(()=>{
                $emit('expandNodeByLevel' ,level)
            })
        }

        const checkNode = (node)=>{
            treeMode.$emit('checkNode' ,node)
        }

        watch(()=>props.data ,(newVal)=>{
            loadData(newVal)
        })

        onMounted(()=>{
            if (!isEmpty(props.data)){
                loadData(props.data)
            }
        })

        return {treeMode ,computeDropIndicatorStyle , treeRef,
                loadData ,filter ,setValue ,setMultipleValue ,reset,
                activeNode ,expandNodeByLevel,checkNode}
    }
})
</script>

<style lang="" scoped></style>
