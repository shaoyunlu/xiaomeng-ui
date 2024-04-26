<template>
    <xmv-menu-item-horizontal v-if="isLeaf" :node="node"></xmv-menu-item-horizontal>
    <xmv-sub-menu-horizontal v-else :node="node"></xmv-sub-menu-horizontal>
</template>

<script>
import {computed, defineComponent, inject, provide} from 'vue'
import xmvMenuItemHorizontal from './menuItemHorizontal.vue'
import xmvSubMenuHorizontal from './subMenuHorizontal.vue'
import {isEmpty} from 'utils/data'

export default defineComponent({
    name:"xmvMenuCoreCollapse",
    components:{xmvMenuItemHorizontal,xmvSubMenuHorizontal},
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