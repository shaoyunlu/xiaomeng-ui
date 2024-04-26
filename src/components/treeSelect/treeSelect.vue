<template>
    <xmv-select type="tree" ref="xmvSelectRef" 
    :multiple="multiple" 
    :notAssociated="notAssociated" 
    :onlyChildNode="onlyChildNode"
    :filterable="filterable"
    @nodeClick="handleNodeClick" 
    @nodeCheck="handleNodeCheck"
    @clear="handleClear"
    :filterNodeMethod="filterNodeMethod"
    :lazy="lazy" :load="load"
    :collapseTags="collapseTags"></xmv-select>
</template>

<script>
import {defineComponent ,ref, watch ,onMounted} from 'vue'
import {deepClone ,isEmpty} from 'utils/data'
export default defineComponent({
    name:"",
    props:{
        multiple : String,
        notAssociated : String,
        data : Array,
        modelValue : String | Array,
        onlyChildNode : Boolean,
        filterable : Boolean,
        filterNodeMethod : Function,
        lazy:Boolean,
        load:Function,
        collapseTags:Boolean
    },
    setup(props ,context) {

        const xmvSelectRef = ref(null)

        const loadData = (data)=>{
            xmvSelectRef.value.loadTreeData(data)
        }

        const handleNodeClick = (node)=>{
            context.emit('update:modelValue' ,node.value)
        }

        const handleNodeCheck = (nodeList)=>{
            let res = []
            nodeList.forEach(node =>{
                res.push(node.value)
            })
            context.emit('update:modelValue' ,res)
        }

        const handleClear = ()=>{
            context.emit('update:modelValue' ,'')
        }

        watch(()=>props.data ,(newVal)=>{
            xmvSelectRef.value.loadTreeData(newVal)
        })

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            if (isEmpty(val)){
                xmvSelectRef.value.resetTree()
                return false
            }
            if (props.multiple != undefined){
                xmvSelectRef.value.setTreeMultipleValue(val)
            }else{
                xmvSelectRef.value.setTreeValue(val)
            }
        }

        onMounted(()=>{
            if (!isEmpty(props.data)){
                xmvSelectRef.value.loadTreeData(props.data)
            }
            if (!isEmpty(props.modelValue)){
                handleWatch(props.modelValue)
            }
        })

        return {xmvSelectRef ,loadData ,handleNodeClick ,handleNodeCheck ,handleClear}
    }
})
</script>

<style lang="" scoped></style>
