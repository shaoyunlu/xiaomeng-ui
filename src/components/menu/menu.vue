<template>
    <ul class="xmv-menu"  ref="menuElRef"
        :class="{'xmv-menu--collapse' : menuMode.rctMenu.isCollapse ,
                'xmv-menu--vertical' : isVertical,
                'xmv-menu--horizontal' : !isVertical,
                'is-dark' : isDark}"  style="--xmv-menu-level:0">
        <xmv-menu-core v-for="child in menuMode.rctMenu.data" :node="child" 
                    v-if="!menuMode.rctMenu.isCollapse && isVertical "></xmv-menu-core>
        <xmv-menu-core-collapse v-for="child in menuMode.rctMenu.data" :node="child"
                    v-if="menuMode.rctMenu.isCollapse"></xmv-menu-core-collapse>
        <xmv-menu-core-horizontal v-for="child in menuMode.rctMenu.data" :node="child" 
                    v-if="!isVertical"></xmv-menu-core-horizontal>
    </ul>
</template>

<script>
import {defineComponent, onMounted, provide ,ref ,watch ,reactive} from 'vue'
import MenuMode from './mode/menuMode'
import {isEmpty} from 'utils/data'
import {createEventBus} from 'utils/event'

export default defineComponent({
    name:"xmvMenu",
    emits:['nodeClick'],
    props:{
        isVertical : {
            type : Boolean,
            default : true,
        },
        data : Array,
        isDark : Boolean
    },
    setup(props ,context) {

        const menuElRef = ref(null)
        const menuMode = new MenuMode(context)
        menuMode.isVertical = props.isVertical
        menuMode.isDark = props.isDark

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        menuMode.$on = $on
        menuMode.$emit = $emit
        
        const loadData = (menuData)=>{
            menuMode.loadData(menuData)
        }

        // 缩略图模式
        const collapse = ()=>{
            menuMode.collapse()
        }

        // 正常模式
        const expand = ()=>{
            menuMode.expand()
        }

        const activeNode = (value)=>{
            menuMode.activeNode(value ,'value' ,true)
        }

        onMounted(()=>{
            menuMode.menuElRef = menuElRef
            menuMode.onMounted()
        })

        provide('MenuMode' ,menuMode)
        provide('Level' ,0)
        provide('IsVertical' ,props.isVertical)
        provide('EventBus' ,{$on ,$emit})

        watch(()=>props.data ,(newVal)=>{
            loadData(newVal)
        })

        onMounted(()=>{
            if (!isEmpty(props.data)){
                loadData(props.data)
            }
        })

        return {
            loadData,activeNode,collapse,expand,menuMode,menuElRef
        }
    }
})
</script>

<style lang="less">
 
</style>