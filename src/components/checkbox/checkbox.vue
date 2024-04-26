<template>
    <div class="xmv-checkbox" 
        :class="{'is-checked':isChecked ,
                 'is-disabled':disabled ,
                 'xmv-checkbox--large':size == 'large',
                 'xmv-checkbox--small':size == 'small'}" @click.stop="handleClick">
        <span class="xmv-checkbox__input" 
            :class="{
                        'is-checked':isChecked ,
                        'is-disabled':disabled ,
                        'is-indeterminate':isIndeterminate
                    }">
            <input type="checkbox" class="xmv-checkbox__original" :value="label" ref="inputRef">
            <span class="xmv-checkbox__inner"></span>
        </span>
        <span class="xmv-checkbox__label" v-if="computeLabelShow">
            <slot></slot>
        </span>
    </div>
</template>

<script>
import {defineComponent ,ref ,computed, watch ,inject, onMounted} from 'vue'
export default defineComponent({
    name:"xmvCheckbox",
    emits:['check' ,'update:modelValue'],
    props:{
        disabled:Boolean,
        label:String,
        checkStatus:Boolean,
        indeterminateStatus:Boolean,
        modelValue:Boolean,
        size:String
    },
    setup(props ,context) {
        const inputRef = ref(null)
        const isChecked = ref(false)
        const isIndeterminate = ref(false)
        const disabled = ref(props.disabled)

        const {$on ,$emit} = inject('EventBus' ,{$on:()=>{} ,$emit:()=>{}})

        const handleClick = ()=>{
            if (disabled.value){
                return false
            }
            isChecked.value = !isChecked.value
            $emit('checkClick' ,{status:isChecked.value ,label:props.label})
            context.emit('update:modelValue' ,isChecked.value)
            context.emit('check' , isChecked.value)
        }

        const computeLabelShow = computed(()=>{
            return props.label != undefined
        })

        $on('setVal' ,(list)=>{
            isChecked.value = list.includes(props.label)
        })

        $on('setDisabled' ,val=>{
            if (!isChecked.value){
                disabled.value = val
            }
        })

        watch(isChecked ,(newVal)=>{
            if (isChecked.value)
                inputRef.value.setAttribute('checked','')
            else
                inputRef.value.removeAttribute('checked')
        })

        watch(()=>props.checkStatus ,val =>{
            isChecked.value = val
        })

        watch(()=>props.indeterminateStatus ,val =>{
            isIndeterminate.value = val
        })

        watch(()=>props.modelValue ,newVal =>{
            isChecked.value = newVal
        })

        onMounted(()=>{
            if (props.modelValue != undefined){
                isChecked.value = props.modelValue
            }
        })

        return {isChecked,isIndeterminate,disabled,inputRef,handleClick,computeLabelShow}
    }
})
</script>

<style lang="" scoped></style>
