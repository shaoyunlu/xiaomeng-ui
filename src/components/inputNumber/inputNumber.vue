<template>
    <div class="xmv-input-number" :class="computeClass">
        <span class="xmv-input-number__decrease" :class="{'is-disabled' : decreaseDisabled}" @click="handleDecrease">
            <xmv-icon name="minus"></xmv-icon>
        </span>
        <span class="xmv-input-number__increase" :class="{'is-disabled' : increaseDisabled}" @click="handleIncrease">
            <xmv-icon name="plus"></xmv-icon>
        </span>
        <xmv-input ref="inputRef" type="number" :step="inputStep" @blur="handleBlur" @input="handleInput" :size="size" :disabled="isDisabled"></xmv-input>
    </div>
</template>

<script>
import {defineComponent, onMounted, watch ,ref, computed} from 'vue'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvInputNumber",
    emits:['inputChange' ,'update:modelValue'],
    props:{
        modelValue : [Number,String],
        step:{type:Number ,default:1},
        stepStrictly:{type:Boolean,default:false},
        min:{type:Number},
        max:{type:Number},
        precision:{type:Number,default:0},
        controlsPosition:String,
        size:String,
        disabled:{type:Boolean,default:false}
    },
    setup(props ,context) {

        const inputStep = ref(1/Math.pow(10, props.precision))
        const inputRef = ref(null)
        const decreaseDisabled = ref(false)
        const increaseDisabled = ref(false)
        const isDisabled = ref(props.disabled)

        const computeClass = computed(()=>{
            let res = []
            if (props.size != undefined){
                res.push('xmv-input-number--' + props.size)
            }
            if (props.controlsPosition != undefined){
                res.push('is-controls-' + props.controlsPosition)
            }
            if (isDisabled.value){
                res.push('is-disabled')
            }
            return res
        })

        const handleDecrease = ()=>{
            if (isDisabled.value){
                return false
            }
            inputRef.value.val(props.modelValue - props.step)
        }

        const handleIncrease = ()=>{
            if (isDisabled.value){
                return false
            }
            inputRef.value.val(props.modelValue + props.step)
        }

        const handleBlur = ()=>{
            if (props.stepStrictly){
                let val = inputRef.value.getVal()
                let remainder = val%props.step
                if (remainder != 0){
                    val = Math.floor(val / props.step) * props.step;
                    inputRef.value.val(val)
                    context.emit('update:modelValue' ,val)
                    context.emit('inputChange' ,val)
                }
            }
        }

        const handleInput = (val)=>{
            if (isEmpty(val))
            {
                context.emit('update:modelValue' ,'')
                return false
            }
            val = parseFloat(parseFloat(val).toFixed(props.precision))
            if (val < props.min || val > props.max){
                if (isEmpty(props.modelValue)){
                    val = props.min
                }else{
                    val = props.modelValue
                }
                inputRef.value.val(val)
            }
            
            context.emit('update:modelValue' ,val)
            context.emit('inputChange' ,val)
        }

        const decreaseIncreaseDisabled = (val)=>{
            decreaseDisabled.value = (val <= props.min)
            increaseDisabled.value = (val >= props.max)
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        watch(()=>props.disabled ,(newVal)=>{
            isDisabled.value = newVal
        })

        const handleWatch = (val)=>{
            inputRef.value.val(val)
            decreaseIncreaseDisabled(val)
        }

        onMounted(()=>{
            handleWatch(props.modelValue)
        })

        return {inputRef , inputStep ,decreaseDisabled , increaseDisabled,computeClass,isDisabled,
                handleDecrease ,handleIncrease ,handleInput ,handleBlur}
    }
})
</script>

<style lang="" scoped></style>
