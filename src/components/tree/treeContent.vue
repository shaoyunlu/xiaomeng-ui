<template>
    <div class="xmv-tree-node__content" :class="{'is-disabled':node.disabled}" :style="computeStyle">
        <xmv-icon name="arrowRight" class="xmv-tree-node__expand-icon" 
        :class="computeIconClass" @click.stop="handleExpandIconClick"></xmv-icon>
        <xmv-checkbox v-if="treeMode.showCheckbox != undefined"
        ref="checkboxRef"
        @check="handleCheck" 
        :checkStatus="node.isChecked"
        :disabled="node.disabled"
        :indeterminateStatus="node.isIndeterminate"></xmv-checkbox>
        <xmv-icon name="loading" class="xmv-tree-node__loading-icon is-loading" v-if="node.isLoading"></xmv-icon>
        <xmv-tree-label :node="node"></xmv-tree-label>
    </div>
</template>

<script>
import {computed, defineComponent ,inject, ref, onMounted} from 'vue'
import {isEmpty} from 'utils/data'
import xmvTreeLabel from './treeLabel.vue'
export default defineComponent({
    name:"",
    emits:['expandIconClick'],
    props:{
        node:Object
    },
    components:{xmvTreeLabel},
    setup(props ,context) {

        const level = inject('Level')
        const treeMode = inject('TreeMode')

        const checkboxRef = ref(null)

        const computeIconClass = computed(()=>{
            let res = []
            if (props.node.iconExpanded){
                res.push('expanded')
            }
            if (treeMode.lazy){
                // 节点已经加载过
                if (props.node.isLoaded){
                    if (isEmpty(props.node.children)){
                        res.push('is-leaf')
                    }
                }
            }else{
                if (isEmpty(props.node.children)){
                    res.push('is-leaf')
                }
            }
            return res
        })

        const computeStyle = computed(()=>{
            return {'padding-left' : level * 18 + 'px'}
        })

        const handleCheck = (checked)=>{
            props.node.isChecked = checked
            props.node.isIndeterminate = false
            treeMode.handleNodeCheck(props.node ,checked)
        }

        const handleExpandIconClick = ()=>{
            context.emit('expandIconClick')
        }

        treeMode.$on('checkNode' ,(node)=>{
            if (node.value == props.node.value){
                handleCheck(node.isChecked)
            }
        })

        onMounted(()=>{
            if (checkboxRef.value){
                checkboxRef.value.isChecked = props.node.isChecked
                checkboxRef.value.isIndeterminate = props.node.isIndeterminate
            }
        })

        return {treeMode ,computeStyle ,computeIconClass ,checkboxRef,
                handleCheck ,handleExpandIconClick}
    }
})
</script>

<style lang="" scoped></style>
