<template>
    <xmv-menu-item-collapse v-if="isLeaf" :node="node"></xmv-menu-item-collapse>
    <xmv-sub-menu-collapse v-else :node="node"></xmv-sub-menu-collapse>
</template>

<script>
import {computed, defineComponent, inject, provide} from 'vue'
import xmvMenuItemCollapse from './menuItemCollapse.vue'
import xmvSubMenuCollapse from './subMenuCollapse.vue'
import {isEmpty} from 'utils/data'

export default defineComponent({
    name:"xmvMenuCoreCollapse",
    components:{xmvMenuItemCollapse,xmvSubMenuCollapse},
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