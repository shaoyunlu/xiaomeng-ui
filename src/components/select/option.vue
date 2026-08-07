<template>
</template>

<script>
import {defineComponent, inject, onUnmounted, reactive, watch} from 'vue'
export default defineComponent({
    name:"xmvOption",
    props:{
        label : String,
        value : String | Number,
        disabled : {type : Boolean,default : false},
        hide : {type : Boolean,default : false}
    },
    setup(props ,context) {

        const selectMode = inject('SelectMode')
        const option = reactive({
            label : props.label,
            value : props.value,
            disabled : props.disabled,
            hide : props.hide
        })

        selectMode.registerOption(option)

        watch(()=>[props.label ,props.value ,props.disabled ,props.hide] ,(newValue)=>{
            option.label = newValue[0]
            option.value = newValue[1]
            option.disabled = newValue[2]
            option.hide = newValue[3]
            selectMode.updateOption(option)
        })

        onUnmounted(()=>{
            selectMode.unregisterOption(option)
        })
        return {}
    }
})
</script>

<style lang="" scoped></style>
