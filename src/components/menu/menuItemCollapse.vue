<template>
    <li class="xmv-menu-item" 
        :class="{'is-active':node.active}" @click.stop="handleClick">
        <xmv-tooltip :content="node.name" placement="right" v-if="level == 1" :isAlignCenter="true">
            <div class="xmv-menu-tooltip__trigger xmv-tooltip__trigger">
                <xmv-icon v-if="level == 1" name="plus"></xmv-icon>
            </div>
        </xmv-tooltip>
        <span v-if="level > 1">{{node.name}}</span>
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