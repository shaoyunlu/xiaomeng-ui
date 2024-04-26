<template>
    
</template>

<script>
import {defineComponent ,h ,inject} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node:Object
    },
    setup(props ,context) {

        const slots = inject('Slots')

        return ()=>{
            let node = props.node
            if (slots.default){
                return slots.default.call(slots ,{node})
            }else{
                return h('span', { class: 'xmv-tree-node__label'}, node.label)
            }
        }
    }
})
</script>

<style lang="" scoped></style>
