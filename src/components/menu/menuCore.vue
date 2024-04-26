<template>
    <xmv-menu-item v-if="isLeaf" :node="node"></xmv-menu-item>
    <xmv-sub-menu v-else :node="node"></xmv-sub-menu>
</template>

<script>
import {computed, defineComponent, inject, provide} from 'vue'
import xmvMenuItem from './menuItem.vue'
import xmvSubMenu from './subMenu.vue'
import {isEmpty} from 'utils/data'

export default defineComponent({
    name:"xmvMenuCore",
    components:{xmvMenuItem,xmvSubMenu},
    props:{
        node:Object
    },
    setup(props ,context) {

        provide('Level' ,inject('Level') + 1)

        const isLeaf = computed(()=>{
            return isEmpty(props.node.children)
        })

        return {
            isLeaf
        }
    }
})
</script>

<style lang="less">

</style>