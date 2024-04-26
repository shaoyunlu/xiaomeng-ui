<template>
    <li class="xmv-sub-menu" @click.stop="handleClick">
        <div class="xmv-sub-menu__title">
            <xmv-icon v-if="level == 1 && node.icon" :name="node.icon"></xmv-icon>
            <span>{{node.name}}</span>
            <xmv-icon name="arrowRight" class="xmv-sub-menu__icon-arrow" :class="{'active' : node.isExpand}"></xmv-icon>
        </div>

        <ul class="xmv-menu" :class="{'is-dark':menuMode.isDark}" v-show="node.childrenVisible" ref="subXmvMenuRef" 
            :style="{'--xmv-menu-level':level}">
            <xmv-menu-core v-for="child in node.children" :node="child"></xmv-menu-core>
        </ul>
    </li>
</template>

<script>
import {defineComponent, inject, onMounted, ref ,watch} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node:Object
    },
    setup(props ,context) {
        const level = inject('Level')
        const menuMode = inject('MenuMode')
        const {$on ,$emit} = inject('EventBus')
        const subXmvMenuRef = ref(null)

        const handleClick = ()=>{
            menuMode.subClick(props.node ,subXmvMenuRef.value)
        }
        $on('triggerSubClick' ,({tmp ,type})=>{
            if (tmp[type] === props.node[type]){
                handleClick()
            }
        })

        onMounted(()=>{
            props.node.subXmvMenuRef = subXmvMenuRef
        })

        return {
            handleClick ,subXmvMenuRef,level,menuMode
        }
    }
})
</script>

<style lang="less">
    
</style>