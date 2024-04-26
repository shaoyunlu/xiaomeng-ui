<template>
    <li class="xmv-sub-menu" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
        <xmv-popover :beStripped="level == 1?true:false"  trigger="mouse" ref="popoverRef" placement="right">
            <template #trigger>
                <div class="xmv-sub-menu__title">
                    <xmv-icon v-if="level == 1" :name="node.icon"></xmv-icon>
                    <span>{{node.name}}</span>
                </div>
            </template>

            <ul class="xmv-menu is-collapse"  :class="{'is-dark':menuMode.isDark}" ref="subXmvMenuRef"
                :style="{'--xmv-menu-level':level}">
                <xmv-menu-core-collapse v-for="child in node.children" :node="child"></xmv-menu-core-collapse>
            </ul>
        </xmv-popover>
    </li>
</template>

<script>
import {defineComponent, inject, ref} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node:Object
    },
    setup(props ,context) {
        const level = inject('Level')
        const menuMode = inject('MenuMode')
        const subXmvMenuRef = ref(null)
        const popoverRef = ref(null)

        const handleMouseover = (e)=>{
            popoverRef.value.show()
        }

        const handleMouseleave = (e)=>{
            popoverRef.value.hide()
        }

        return {
            subXmvMenuRef,level,menuMode,popoverRef,
            handleMouseover,handleMouseleave
        }
    }
})
</script>

<style lang="less">
    
</style>