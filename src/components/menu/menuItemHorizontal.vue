<template>
    <li class="xmv-menu-item" 
        :class="{'is-active':node.active}" @click.stop="handleClick">
        <span>{{node.name}}</span>
    </li>
</template>

<script>
import {defineComponent,h,inject, onMounted} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node:Object
    },
    setup(props ,context) {

        const menuMode = inject('MenuMode')
        const level = inject('Level')

        const handleClick = (e)=>{
            menuMode.itemClick(props.node)
        }

        onMounted(()=>{
            if (props.node.active)
                menuMode.curSelNode = props.node
        })

        return {
            handleClick,menuMode,level
        }

    }
})
</script>

<style lang="less">
    
</style>