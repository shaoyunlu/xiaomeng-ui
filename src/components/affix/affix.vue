<template>
    <div class="xmv-affix" ref="affixRef" :style="computedAffixStyle">
        <div :class="{'xmv-affix--fixed' : isFixed}" :style="computedFixedStyle" ref="fixDivRef">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent, inject, onMounted, reactive, ref} from 'vue'
import {addStyle} from 'utils/dom'
export default defineComponent({
    name:"",
    props:{
        offset : Number,
        position : {type:String ,default:'top'},
        zIndex : {type:Number ,default:100},
        target : String
    },
    setup({offset,position,zIndex,target} ,context) {

        const affixRef = ref(null)
        const fixDivRef = ref(null)
        const isFixed = ref(false)
        const XmvEventOn = inject('Xmv-Event-On')
        const translateYRef = ref(0)

        const computedAffixStyle = computed(()=>{
            let res = {}
            if (isFixed.value){
                res.width = oriWidth + 'px'
                res.height = oriHeight + 'px'
            }
            return res
        })

        const computedFixedStyle = computed(()=>{
            let res = {}
            if (isFixed.value){
                res.width = oriWidth + 'px'
                res.height = oriHeight + 'px'
                res[position] = offset + 'px'
                res['z-index'] = zIndex
                if (translateYRef.value != 0){
                    res['transform'] = 'translateY('+translateYRef.value+'px)'
                }
            }
            return res
        })

        let oriWidth
        let oriHeight

        let oriAffixRectTop
        let oriAffixRectBottom

        let hasFirstTrigger = false

        let targetRectTop
        let targetRectBottom

        XmvEventOn('scroll' ,(e)=>{
            setFix()
        })

        const setFix = ()=>{
            let scrollTop = document.documentElement.scrollTop

            if (target != undefined){
                let globalDiff = document.documentElement.clientHeight + scrollTop - targetRectBottom
                if (globalDiff <= 0){
                    isFixed.value = false
                    translateYRef.value = 0
                    return false
                }else{
                    let innerDiff = (oriHeight + offset) - (targetRectBottom - scrollTop)
                    if (innerDiff > 0 ){
                        translateYRef.value = 0 - innerDiff
                    }else{
                        translateYRef.value = 0
                    }
                }
            }

            if (position == 'top'){
                let distanceFromTop = oriAffixRectTop - scrollTop;
                isFixed.value = (distanceFromTop < offset)
            }else{
                let documentHeight = document.documentElement.clientHeight + scrollTop
                let distanceFromBottom = oriAffixRectBottom
                let tmp = documentHeight - distanceFromBottom

                if (tmp > 0){
                    hasFirstTrigger = true
                }
                if (tmp < offset && hasFirstTrigger){
                    isFixed.value = true
                }else{
                    isFixed.value = false
                }
            }
        }

        onMounted(()=>{
            let scrollTop = document.documentElement.scrollTop
            if (target != undefined){
                let targetEl = document.querySelector(target)
                let targetRect = targetEl.getBoundingClientRect()
                targetRectTop = targetRect.top + scrollTop
                targetRectBottom = targetRect.top + scrollTop + targetRect.height
            }
            let affixRect = affixRef.value.getBoundingClientRect();
            
            oriWidth = affixRect.width
            oriHeight = affixRect.height
            oriAffixRectTop = affixRect.top + scrollTop
            oriAffixRectBottom = affixRect.top + scrollTop + affixRect.height
            setFix()
        })

        return {affixRef ,fixDivRef ,isFixed ,computedAffixStyle ,computedFixedStyle}
    }
})
</script>

<style lang="" scoped></style>
