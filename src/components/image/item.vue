<template>
    <img :src="srcStr" :style="computeStyle">
</template>

<script>
import {defineComponent ,computed ,ref ,inject} from 'vue'
export default defineComponent({
    name:"",
    props:{
        srcStr : String,
        index : Number
    },
    setup(props ,context) {

        const {$on ,$emit} = inject('EventBus')

        const scaleRef = ref(1)
        const rotateRef = ref(0)
        const translateXRef = ref(0)
        const translateYRef = ref(0)
        const maxHeightRef = ref(100)
        const maxWidthRef = ref(100)
        const displayRef = ref(false)

        const computeStyle = computed(()=>{
            let res = {}
            res['transform'] = `scale(${scaleRef.value}) rotate(${rotateRef.value}deg) translate(${translateXRef.value}px, ${translateYRef.value}px)`
            res['max-height'] = `${maxHeightRef}%`
            res['max-width'] = `${maxWidthRef}%`
            res['transition'] = `transform 0.3s ease 0s`
            res['display'] = displayRef.value ? '' : 'none'
            return res
        })

        $on('setVal' ,(info)=>{
            displayRef.value = (props.index == info.index)
            scaleRef.value = info.scale
            rotateRef.value = info.rotate
        })

        return {computeStyle,scaleRef,rotateRef,translateXRef,translateYRef,maxHeightRef,maxWidthRef,displayRef}
    }
})
</script>

<style lang="" scoped></style>
