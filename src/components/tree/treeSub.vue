<template>
    <div class="xmv-tree-node__children" ref="childrenDivRef">
        <xmv-tree-node v-for="tmp in node.children" :node="tmp" :parent="node" :key="tmp.value"></xmv-tree-node>
    </div>
</template>

<script>
import {defineComponent ,provide ,inject, onMounted ,ref} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node : Object
    },
    setup(props ,context) {

        const childrenDivRef = ref(null)

        provide('Level' ,inject('Level') + 1)

        onMounted((()=>{
            
        }))

        return {childrenDivRef}
    }
})
</script>

<style lang="" scoped></style>
