<template>
    <label class="xmv-radio" @click="handleClick"
        :class="{
                    'xmv-radio--large':size == 'large',
                    'xmv-radio--small':size == 'small',
                    'is-checked':isChecked,
                    'is-disabled':disabled,
                    'is-bordered':border
                }">
        <span class="xmv-radio__input" :class="{'is-checked':isChecked,'is-disabled':disabled}" >
            <input type="radio" class="xmv-radio__original" :value="label" :name="name" ref="inputRef">
            <span class="xmv-radio__inner"></span>
        </span>
        <span class="xmv-radio__label">
            <slot></slot>
        </span>
    </label>
</template>

<script>
import {ref, defineComponent, inject, watch, onMounted} from 'vue'
export default defineComponent({
    name:"xmvRadio",
    props:{
        label : String,
        size : String,
        disabled : Boolean,
        border : {type : Boolean ,default : false}
    },
    setup(props ,context) {
        const {$on ,$emit} = inject('EventBus')
        const name = inject('Name')
        const isChecked = ref(false)
        const inputRef = ref(null)

        const handleClick = (e)=>{
            if (props.disabled){
                return false
            }
            if (!isChecked.value){
                isChecked.value = true
                $emit('radioClick' ,props.label)
            }
        }

        $on('radioClick' ,(label)=>{
            if (props.label != label){
                isChecked.value = false
            }
        })

        $on('setVal' ,(label)=>{
            isChecked.value = (props.label == label)
        })

        watch(()=>props.disabled ,(newVal ,oldVal)=>{
            if (newVal){
                inputRef.value.setAttribute('disabled','disabled')
            }else{
                inputRef.value.removeAttribute('disabled')
            }
        })

        onMounted(()=>{
            if (props.disabled){
                inputRef.value.setAttribute('disabled','disabled')
            }
        })

        return {isChecked,inputRef,name,handleClick}
    }
})
</script>

<style lang="" scoped></style>
