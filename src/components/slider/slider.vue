<template>
    <div class="xmv-slider" :class="computeSliderClass">
        <div class="xmv-slider__runway"
            :class="{'is-disabled' : disabled}"
            @click.stop="handleSliderClick" ref="sliderRef">
            <div class="xmv-slider__bar" :style="{width : sliderBarWidth + '%' ,left : sliderBarLeft + '%'}"></div>

            <div class="xmv-slider__button-wrapper" 
                :style="{left : sliderMode.sliderVal.value + '%'}"
                >
                <xmv-tooltip :content="sliderMode.toolTipContent.value" :isAlignCenter="true" :ref="sliderMode.tooltipRef">
                    <div class="xmv-slider__button" @mousedown.stop="sliderMode.handleSliderButtonMousedown"></div>
                </xmv-tooltip>
            </div>

            <div class="xmv-slider__button-wrapper" v-if="range"
                :style="{left : sliderRightMode.sliderVal.value + '%'}"
                >
                <xmv-tooltip :content="sliderRightMode.toolTipContent.value" :isAlignCenter="true" :ref="sliderRightMode.tooltipRef">
                    <div class="xmv-slider__button" @mousedown.stop="sliderRightMode.handleSliderButtonMousedown"></div>
                </xmv-tooltip>
            </div>

            <div v-if="showStep != undefined">
                <div v-for="tmp in stepList" class="xmv-slider__stop" :style="{left:tmp + '%'}"></div>
            </div>
        </div>
        <xmv-input-number class="xmv-slider__input" v-if="showInput != undefined"
            v-model="sliderMode.sliderVal.value" :step="step" :size="size" :min="0" :max="100"
            @inputChange="handleInputChange"></xmv-input-number>
    </div>
</template>

<script>
import {computed, defineComponent,onMounted,ref, watch} from 'vue'
import {isEmpty} from 'utils/data'
import SliderMode from './mode/sliderMode'
export default defineComponent({
    name:"xmvSlider",
    props:{
        modelValue : Number | Array,
        formatTooltip : Function,
        step : {type : Number ,default : 1},
        showStep : {type : String},
        showInput : {type : String},
        size : {type : String},
        disabled : {type : Boolean,default : false},
        range : {type : Boolean,default : false}
    },
    setup(props ,context) {

        const sliderMode = new SliderMode(props)
        const sliderRightMode = new SliderMode(props)

        const sliderRef = ref(null)
        const isDragging = ref(false)
        const stepList = ref([])

        const sliderBarWidth = ref(0)
        const sliderBarLeft = ref(0)

        sliderMode.ctx = context
        sliderRightMode.ctx = context

        sliderMode.isDragging = isDragging
        sliderRightMode.isDragging = isDragging

        let sliderBound

        const computeSliderClass = computed(()=>{
            let res = []
            if (isDragging.value){
                res.push('dragging')
            }
            if (props.showInput != undefined){
                res.push('xmv-slider--with-input')
            }
            if (props.size != undefined){
                res.push('xmv-slider--' + props.size)
            }
            return res
        })

        const handleSliderClick = (e)=>{
            if (props.disabled){
                return false
            }
            let offsetX = parseInt(e.clientX) - sliderBound.left
            let val = parseInt((offsetX/sliderBound.width)*100)

            if (val <= 0)
                val = 0
            if (val >= 100)
                val = 100

            if (!props.range){
                context.emit('update:modelValue' ,val)
            }else{
                let diff1 = Math.abs(val - sliderMode.sliderVal.value)
                let diff2 = Math.abs(val - sliderRightMode.sliderVal.value)
                if (diff1 <= diff2){
                    sliderMode.sliderVal.value = val
                }else{
                    sliderRightMode.sliderVal.value = val
                }
                trigger()
            }
        }

        const __nearestStep = (num, step)=> {
            return Math.round(num / step) * step;
        }

        const handleInputChange = (val)=>{
            context.emit('update:modelValue' ,val)
        }

        const handleWatch = (val)=>{
            if(!props.range){
                let __val = __nearestStep(val ,props.step)
                sliderMode.sliderVal.value = __val
                sliderMode.toolTipContent.value = formatTooltip(__val)
                sliderBarWidth.value = __val
            }else{
                let __val1 = __nearestStep(val[0] ,props.step)
                sliderMode.sliderVal.value = __val1
                sliderMode.toolTipContent.value = formatTooltip(__val1)

                let __val2 = __nearestStep(val[1] ,props.step)
                sliderRightMode.sliderVal.value = __val2
                sliderRightMode.toolTipContent.value = formatTooltip(__val2)

                let min = __val1
                let max = __val2
                if (__val2 < __val1){
                    min = __val2
                    max = __val1
                }
                sliderBarLeft.value = min
                sliderBarWidth.value = max - min
            }
        }

        const trigger = ()=>{
            if (props.range){
                context.emit('update:modelValue' ,[sliderMode.sliderVal.value ,sliderRightMode.sliderVal.value])
            }else{
                context.emit('update:modelValue' ,sliderMode.sliderVal.value)
            }
            
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const formatTooltip = (val)=>{
            if (props.formatTooltip != undefined){
                return props.formatTooltip(val)
            }
            return val
        }

        onMounted(()=>{
            sliderBound = sliderRef.value.getBoundingClientRect()
            sliderMode.sliderBound = sliderBound
            sliderRightMode.sliderBound = sliderBound
            sliderMode.trigger = trigger
            sliderRightMode.trigger = trigger

            if (!isEmpty(props.modelValue)){
                handleWatch(props.modelValue)
            }

            if (props.showStep != undefined){
                let listNum = 100 / props.step
                for(let i=1;i<listNum;i++){
                    stepList.value.push(i*props.step)
                }
            }
        })
        
        return {sliderRef , computeSliderClass,
                stepList,sliderMode,sliderRightMode,sliderBarWidth,sliderBarLeft,
                handleSliderClick ,handleInputChange}
    }
})
</script>

<style lang="" scoped></style>
