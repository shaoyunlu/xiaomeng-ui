<template>
    <div class="xmv-collapse-item" :class="{'is-active' : isActive}">
        <div @click="handleCollapse">
            <div class="xmv-collapse-item__header" :class="{'is-active' : isActive}">
                <slot name="title"></slot>
                {{title}}
                <xmv-icon name="arrowRight" class="xmv-collapse-item__arrow" 
                          :class="{'is-active' : isActive}"></xmv-icon>
            </div>
        </div>
        <transition name="xmv-collapse" v-on="on">
            <div class="xmv-collapse-item__wrap" v-show="isActive">
                <div class="xmv-collapse-item__content">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import {defineComponent ,inject,ref} from 'vue'
export default defineComponent({
    name:"xmvCollapseItem",
    props:{
        title : String,
        name : String
    },
    setup(props ,context) {
        const isActive = ref(false)

        const {$on ,$emit} = inject('EventBus')
        const accordion = inject('Accordion')

        $on('setVal' ,(val)=>{
            if (accordion != undefined){
                isActive.value = (props.name == val)
            }else{
                if (props.name == val){
                    isActive.value = true
                }
            }            
        })

        const handleCollapse = ()=>{
            isActive.value = !isActive.value
            if (accordion != undefined){
                $emit('setVal' ,props.name)
            }
        }

        const on = {
            beforeEnter(el){
                if (!el.dataset) el.dataset = {}

                el.dataset.oldPaddingTop = el.style.paddingTop
                el.dataset.oldPaddingBottom = el.style.paddingBottom

                el.style.maxHeight = 0
                el.style.paddingTop = 0
                el.style.paddingBottom = 0
            },
            enter(el){
                el.dataset.oldOverflow = el.style.overflow
                if (el.scrollHeight !== 0) {
                    el.style.maxHeight = `${el.scrollHeight}px`
                    el.style.paddingTop = el.dataset.oldPaddingTop
                    el.style.paddingBottom = el.dataset.oldPaddingBottom
                } else {
                    el.style.maxHeight = 0
                    el.style.paddingTop = el.dataset.oldPaddingTop
                    el.style.paddingBottom = el.dataset.oldPaddingBottom
                }

                el.style.overflow = 'hidden'
            },
            afterEnter(el) {
                el.style.maxHeight = ''
                el.style.overflow = el.dataset.oldOverflow
            },
            beforeLeave(el){
                if (!el.dataset) el.dataset = {}
                el.dataset.oldPaddingTop = el.style.paddingTop
                el.dataset.oldPaddingBottom = el.style.paddingBottom
                el.dataset.oldOverflow = el.style.overflow

                el.style.maxHeight = `${el.scrollHeight}px`
                el.style.overflow = 'hidden'
            },
            leave(el){
                if (el.scrollHeight !== 0) {
                    el.style.maxHeight = 0
                    el.style.paddingTop = 0
                    el.style.paddingBottom = 0
                }
            },
            afterLeave(el){
                el.style.maxHeight = ''
                el.style.overflow = el.dataset.oldOverflow
                el.style.paddingTop = el.dataset.oldPaddingTop
                el.style.paddingBottom = el.dataset.oldPaddingBottom
            }
        }

        return {isActive , on,handleCollapse}
    }
})
</script>

<style lang="" scoped></style>
