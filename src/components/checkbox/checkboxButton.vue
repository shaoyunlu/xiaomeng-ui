<template>
    <div class="xmv-checkbox-button" 
        :class="{'is-checked':isChecked,
                 'is-disabled':disabled,
                 'xmv-checkbox-button--small':size == 'small',
                 'xmv-checkbox-button--large':size == 'large'}" @click.stop="handleClick">
        <input class="xmv-checkbox-button__original" type="checkbox" :value="label" ref="inputRef">
        <span class="xmv-checkbox-button__inner">
            <slot></slot>
        </span>
    </div>
</template>

<script>
import {defineComponent ,ref ,inject ,watch} from 'vue'
export default defineComponent({
    name:"xmvCheckboxButton",
    props:{
        disabled:String,
        label:String,
        size:String
    },
    setup(props ,context) {
        const inputRef = ref(null)
        const isChecked = ref(false)
        const disabled = ref(props.disabled != undefined)
        const {$on ,$emit} = inject('EventBus')

        const handleClick = ()=>{
            if (disabled.value){
                return false
            }
            isChecked.value = !isChecked.value
            if (isChecked.value)
                inputRef.value.setAttribute('checked','')
            else
                inputRef.value.removeAttribute('checked')

            $emit('checkClick' ,{status:isChecked.value ,label:props.label})
        }

        $on('setVal' ,(list)=>{
            isChecked.value = list.includes(props.label)
        })

        watch(isChecked ,(newVal)=>{
            if (isChecked.value)
                inputRef.value.setAttribute('checked','')
            else
                inputRef.value.removeAttribute('checked')
        })

        return {isChecked ,disabled ,inputRef ,handleClick}
    }
})
</script>

<style lang="" scoped></style>
