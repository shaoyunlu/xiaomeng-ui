<template></template>

<script>
import {computed, defineComponent, h, inject} from 'vue'
export default defineComponent({
    name:"",
    props:{
        data : Object,
        line : Number,
        column : Number
    },
    setup({data ,line ,column} ,context) {

        const dMode = inject('DMode')

        const isLabel = ()=>{
            if (dMode.direction == 'vertical'){
                return (line%2 == 0)
            }
            return column%2 == 0
        }

        const computeTdClass = computed(()=>{
            let res = []
            let __isLabel = isLabel()
            res.push('xmv-descriptions__cell')
            if (__isLabel){
                res.push('xmv-descriptions__label')
            }else{
                res.push('xmv-descriptions__content')
            }
            if (dMode.border){
                if (__isLabel){
                    res.push('is-bordered-label')
                }else{
                    res.push('is-bordered-content')
                }
            }
            if (dMode.direction == 'vertical'){
                if (__isLabel){
                    res.push('is-vertical-label')
                }else{
                    res.push('is-vertical-content')
                }
            }
            return res
        })

        const __tdContentRender = ()=>{
            let slots = data.context.slots
            if (isLabel()){
                if (slots.title){
                    return slots.title()
                }
                return data.props.label
            }else{
                let defaultSlot = slots.default ? slots.default() : null;
                return defaultSlot
            }
        }

        const __countColspan = ()=>{
            let colspan = 1
            let arr = dMode.trList.value[line]
            let lastData = arr[arr.length - 1]
            if (lastData === data){
                if (dMode.direction == 'vertical'){
                    if (column + 1 != dMode.column){
                        colspan = dMode.column - column
                    }
                }else{
                    if (!isLabel()){
                        if (column + 1 != dMode.column * 2){
                            colspan = dMode.column * 2 - column
                        }
                    }
                }
            }
            return colspan
        }

        return ()=>{
            return h('td' ,{class : computeTdClass.value ,colspan : __countColspan()} ,__tdContentRender())
        }


    }
})
</script>

<style lang="" scoped></style>
