<template>
    <div :class="computeClass" ref="xmvInputRef">
        <div class="xmv-input__wrapper" :class="{'is-focus' : isFocus}" 
            @mouseover="handleMouseover" 
            @mouseleave="handleMouseleave" v-if="type != 'textarea'">
            <span class="xmv-input__prefix" v-if="isShowPrefix" @click="handlePrefixClick">
                <span class="xmv-input__prefix-inner">
                    <xmv-icon :name="prefixIcon" class="xmv-input__icon"></xmv-icon>
                </span>
            </span>
            <input class="xmv-input__inner" 
                :type="inputType" 
                :step="step"
                autocomplete="off"
                ref="inputRef"
                :disabled="computeDisable"
                :placeholder="placeholder"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
                @keyup.enter="handleKeyupEnter"
                @input="handleInputInput"
                :value="modelValue" v-if="modelValue != undefined">
            <input class="xmv-input__inner" 
                :type="inputType"
                :step="step"
                autocomplete="off"
                ref="inputRef"
                :placeholder="placeholder"
                @focus="handleInputFocus" @blur="handleInputBlur"
                @input="handleInputInput" v-else>
            <span class="xmv-input__suffix" v-if="computeShowSuffix" @click="handleSuffixClick">
                <span class="xmv-input__suffix-inner">
                    <xmv-icon :name="pwdIconName" class="xmv-input__icon" v-if="pwdShow"
                    @mouseup="handleIconPwdClick"></xmv-icon>
                    <xmv-icon :name="rightIconName"  class="xmv-input__icon" v-if="suffixIcon != undefined || clearable" 
                    ref="suffixiconRef" @mouseup="handleRightIconClick"></xmv-icon>
                </span>
            </span>
        </div>
        <textarea class="xmv-textarea__inner"  
            :placeholder="placeholder"  :rows="rows"
            :style="computeTextareaStyle"
            :value="modelValue" ref="inputRef" @input="handleInputInput" v-else></textarea>
    </div>
</template>

<script>
import {defineComponent ,ref ,computed ,onMounted, nextTick, watch ,inject} from 'vue'
import {isFirefox} from 'utils/dict'
import { isEmpty } from 'utils/data'
export default defineComponent({
    name:"xmvInput",
    emits:['blur','input','clear','update:modelValue','iconClick','focus','enter'],
    props:{
        disabled : Boolean,
        type : {type:String ,default:'text'},
        placeholder : {type:String ,default:'请输入'},
        showPassword : Boolean,
        prefixIcon : String | Object,
        suffixIcon : String | Object,
        clearable : Boolean,
        size : String,
        modelValue : String | Number,
        rows:Number,
        autosize:Object,
        step:Number
    },
    setup(props ,context) {

        const xmvInputRef = ref(null)
        const isFocus = ref(false)
        const inputRef = ref(null)
        const isShowPrefix = ref(false)
        const suffixiconRef = ref(null)
        const pwdIconName = ref('hide')
        const inputType = ref(props.type)
        const pwdShow = ref(false)
        const clearShow = ref(false)
        const rightIconName = ref(props.suffixIcon)

        const minRowsRef = ref(1)
        const textareaHeightRef = ref(null)
        const maxTextareaHeightRef = ref(9999)

        const {$formItemOn ,$formItemEmit} = inject('FormItemEventBus' ,{$on:()=>{} ,$emit:()=>{}})

        const computeShowSuffix = computed(()=>{
            return (props.suffixIcon != undefined || props.clearable || props.showPassword)
        })

        const computeClass = computed(()=>{
            let res = []
            if (props.type != 'textarea'){
                res.push('xmv-input')
            }else{
                res.push('xmv-textarea')
            }
            if (props.disabled){
                res.push('is-disabled')
            }
            if (props.size != undefined){
                res.push('xmv-input--' + props.size)
            }
            return res
        })

        const computeTextareaStyle = computed(()=>{
            if (props.type != 'textarea' || props.autosize == undefined){
                return false
            }
            let res = {}
            res['min-height'] = 31 + (minRowsRef.value - 1) * 21 + 'px'
            res['height'] = textareaHeightRef.value + 'px'
            return res
        })

        const computeDisable = computed(()=>{
            return props.disabled
        })

        const handleInputFocus = ()=>{
            if (inputRef.value.value && props.clearable){
                showClearable()
            }
            isFocus.value = true
            context.emit('focus')
        }

        const handleInputBlur = (e)=>{
            hideClearable()
            isFocus.value = false
            context.emit('blur' ,e)
            $formItemEmit && $formItemEmit('blur')
        }

        const handleKeyupEnter = ()=>{
            context.emit('enter')
        }

        const handleMouseover = ()=>{
            if (inputRef.value.value && props.clearable){
                showClearable()
            }
        }

        const handleMouseleave = ()=>{
            if (!isFocus.value){
                hideClearable()
            }
        }

        const handleInputInput = ()=>{
            if (props.type == 'number'){
                // 验证是不是数字
                let regex = /^-?\d+(?:\.\d+)?$/;;
                let isNumber = regex.test(inputRef.value.value);
                if (!isNumber){
                    inputRef.value.value = ''
                    context.emit('input' ,'')
                }
            }

            if (props.clearable || props.showPassword){
                // 判断输入框里是否有值
                if (inputRef.value.value){
                    if (props.showPassword){
                        pwdShow.value = true
                    }
                    if (props.clearable && isFocus.value){
                        showClearable()
                    }
                }else{
                    pwdShow.value = false
                    hideClearable()
                }
            }

            if (props.modelValue != undefined){
                if (props.type == 'textarea' && props.autosize != undefined){
                    aujustTextareaHeight()
                }
                context.emit('update:modelValue' ,inputRef.value.value)
            }
            context.emit('input' ,inputRef.value.value)
        }

        const showClearable = ()=>{
            rightIconName.value = 'circleClose'
        }

        const hideClearable = ()=>{
            if (props.suffixIcon != undefined){
                rightIconName.value = props.suffixIcon
            }else{
                rightIconName.value = 'empty'
            }
        }

        const handlePrefixClick = ()=>{
            inputRef.value.focus()
        }

        const handleSuffixClick = ()=>{
            inputRef.value.focus()
        }

        const handleIconPwdClick = ()=>{
            if (pwdIconName.value == 'hide'){
                pwdIconName.value = 'vew'
                inputType.value = 'text'
            }else{
                pwdIconName.value = 'hide'
                inputType.value = 'password'
            }
        }

        const handleIconClearClick = ()=>{
            inputRef.value.value = ''
            handleInputInput()
            context.emit('clear')
            focus()
        }

        const handleRightIconClick = ()=>{
            if (props.clearable){
                handleIconClearClick()
            }else{
                context.emit('iconClick' ,inputRef.value.value)
            }
        }

        const initPrefix = ()=>{
            if (props.prefixIcon != undefined){
                isShowPrefix.value = true
            }
        }

        const focus = ()=>{
            inputRef.value.focus()
        }

        const val =(value)=>{
            inputRef.value.value = value
            handleInputInput()
        }

        const getVal = ()=>{
            return inputRef.value.value
        }

        const setInputWidth = (width)=>{
            inputRef.value.style.width = width + 'px'
        }

        initPrefix()

        const aujustTextareaHeight = ()=>{
            inputRef.value.style.height = 'auto'
            let scrollHeight = inputRef.value.scrollHeight
            if (scrollHeight >= maxTextareaHeightRef.value){
                scrollHeight = maxTextareaHeightRef.value
            }
            textareaHeightRef.value = scrollHeight
        }

        watch(()=>props.modelValue ,(newVal)=>{
            if (props.type == 'textarea' && props.autosize != undefined){
                aujustTextareaHeight()
            }
        })

        watch(()=>props.disabled ,(newVal)=>{
            if (newVal){
                inputRef.value.setAttribute('disabled' ,'')
            }else{
                inputRef.value.removeAttribute('disabled')
            }
        })

        onMounted(()=>{
            // 前后都有图标的时候，需要显示设置inputRef的值
            if (isFirefox && props.prefixIcon != undefined && props.suffixIcon != undefined){
                inputRef.value.style.width = '1px'
            }

            if (props.type == 'textarea' && props.autosize != undefined){
                if (typeof props.autosize === 'object'){
                    let {minRows ,maxRows} = props.autosize
                    minRowsRef.value = minRows
                    maxTextareaHeightRef.value = 31 + (maxRows-1)*21
                }
                aujustTextareaHeight()
            }
            
            if (props.disabled){
                inputRef.value.setAttribute('disabled' ,'')
            }

            hideClearable()
        })

        return {isFocus ,xmvInputRef ,inputRef, isShowPrefix ,
                inputType,pwdIconName ,pwdShow ,clearShow, computeClass, suffixiconRef,computeDisable,
                computeTextareaStyle,minRowsRef,textareaHeightRef,computeShowSuffix,rightIconName,
                handleInputFocus ,handleInputBlur , handlePrefixClick ,handleSuffixClick ,handleInputInput ,
                handleMouseover,handleIconPwdClick ,handleIconClearClick ,focus ,val ,setInputWidth ,getVal,
                handleRightIconClick,handleMouseleave,handleKeyupEnter}
    }
})
</script>

<style lang="" scoped></style>
