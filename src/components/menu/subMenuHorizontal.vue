<template>
    <li class="xmv-sub-menu" :class="{'is-active' : node.active}" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
        <xmv-popover :placement="level == 1?'bottom':'right'" :beStripped="level == 1?true:false"
                ref="popoverRef"  trigger="hover" @mouseleave="handlePopML"  @mouseover="handlePopMO">
            <template #trigger>
                <div class="xmv-sub-menu__title">
                    <span>{{node.name}}</span>
                    <xmv-icon class="xmv-sub-menu__icon-arrow" 
                            :class="{'active' : isActive}" name="arrowRight"></xmv-icon>
                </div>
            </template>

            <ul class="xmv-menu xmv-menu--popup is-horizontal" :class="{'is-dark':menuMode.isDark}"  ref="subXmvMenuRef"
                :style="{'--xmv-menu-level':level}">
                <xmv-menu-core-horizontal v-for="child in node.children" :node="child"></xmv-menu-core-horizontal>
            </ul>

        </xmv-popover>
    </li>
</template>

<script>
import {defineComponent, inject, nextTick, onMounted, ref ,watch} from 'vue'
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
        const isActive = ref(false)

        const handleMouseover = (e)=>{
            popoverRef.value.show()
        }

        const handleMouseleave = (e)=>{
            popoverRef.value.hide()
        }

        const handlePopML = ()=>{
            isActive.value = false
        }

        const handlePopMO = ()=>{
            isActive.value = true
        }

        return {
            subXmvMenuRef,level,menuMode,popoverRef,
            handleMouseover,handleMouseleave,handlePopML,handlePopMO,isActive
        }
    }
})
</script>

<style lang="less">
    
</style>