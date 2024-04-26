<template>
    <xmv-popover ref="popoverRef" @hide="handlePopoverHide" @show="handlePopoverShow">
        <template #trigger>
            <div class="xmv-color-picker xmv-tooltip__trigger" :class="computeColorPickerClass">
                <div class="xmv-color-picker__trigger">
                    <span class="xmv-color-picker__color">
                        <span class="xmv-color-picker__color-inner" :style="{'background-color' : computeSelectedRGB}">
                            <xmv-icon name="arrowDown" class="xmv-color-picker__icon"></xmv-icon>
                        </span>
                    </span>
                </div>
            </div>
        </template>
    </xmv-popover>
    <div style="width:320px;padding:10px 10px 0 10px">
        <div class="xmv-color-dropdown__main-wrapper">
            <div class="xmv-color-hue-slider is-vertical hue-slider">
                <div class="xmv-color-hue-slider__bar"></div>
                <div class="xmv-color-hue-slider__thumb" 
                :style="{'left':'0px' ,'top':sliderTop + 'px'}"
                @mousedown.stop="handleSliderMousedown"></div>
            </div>
            <div class="xmv-color-svpanel" :style="{'background-color' : sliderRGB}">
                <div class="xmv-color-svpanel__white"></div>
                <div class="xmv-color-svpanel__black"></div>
                <div class="xmv-color-svpanel__cursor" 
                    :style="{'left':cursorX+'px','top':cursorY+'px'}"
                    @mousedown.stop="handleCursorMousedown">
                    <div></div>
                </div>
            </div>
        </div>
        <xmv-alpha-slider v-if="showAlpha != undefined" ref="alphaSliderRef"></xmv-alpha-slider>
        <div class="xmv-color-dropdown__btns">
            <span class="xmv-color-dropdown__value">
                <xmv-input size="small" ref="inputRef"></xmv-input>
            </span>
            <xmv-button size="small" text @click="handleClear">清除</xmv-button>
            <xmv-button size="small" plain @click="handleEnter">确认</xmv-button>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent ,onMounted,ref, watch ,inject ,reactive ,provide} from 'vue'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
import xmvAlphaSlider from './alphaSlider.vue'
export default defineComponent({
    name:"xmvColorPicker",
    components:{xmvAlphaSlider},
    props:{
        modelValue : String,
        showAlpha : String,
        size : String
    },
    setup(props ,context) {
        const sliderTop = ref(0)
        const sliderRGB = ref('rgb(255,0,0)')
        const selectedRGB = ref('')
        const cursorX = ref(0)
        const cursorY = ref(0)
        const inputRef = ref(null)
        const popoverRef = ref(null)
        const svgPanelWidth = 280
        const svgPanelHeight = 180

        const alphaSliderRef = ref(null)

        let mousePageX
        let mousePageY
        let currentCursorX = 0
        let currentCursorY = 0
        let currentSliderTop

        let tempCursorX = 0
        let tempCursorY = 0
        let tempSliderTop = 0
        let tempSelectedRGB = ''
        let tempSliderRGB = 'rgb(255,0,0)'
    
        let sliderRate = 8.6932

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})

        const XmvBubbling = inject('Xmv-Bubbling')

        $on('alphaChange' ,()=>{
            inputVal(rgba())
        })

        const computeColorPickerClass = computed(()=>{
            let res = []
            if (props.size != undefined){
                res.push('xmv-color-picker--' + props.size)
            }
            return res
        })

        const handleSliderMousedown = (e)=>{
            XmvBubbling.status = false
            mousePageY = e.pageY
            currentSliderTop = sliderTop.value
            window.addEventListener('mouseup' ,handleSliderMouseup)
            window.addEventListener('mousemove' ,handleSliderMousemove)
        }

        const handleSliderMousemove = (e)=>{
            let {pageY} = e
            let ySubtract = pageY - mousePageY + currentSliderTop
            if (ySubtract <= 0){
                sliderTop.value = 0
            }else if(ySubtract >= 176){
                sliderTop.value = 176
            }else{
                sliderTop.value = ySubtract
            }

            calcSliderRGB(Math.floor(sliderTop.value * sliderRate))
            calcMouseRGB(currentCursorX/svgPanelWidth ,currentCursorY/svgPanelHeight)
        }

        const handleSliderMouseup = (e)=>{
            XmvBubbling.status = true
            window.removeEventListener('mouseup' ,handleSliderMouseup)
            window.removeEventListener('mousemove' ,handleSliderMousemove)
        }

        const handleCursorMousedown = (e)=>{
            XmvBubbling.status = false
            mousePageX = e.pageX
            mousePageY = e.pageY

            currentCursorX = cursorX.value
            currentCursorY = cursorY.value

            window.addEventListener('mouseup' ,handleCursorMouseup)
            window.addEventListener('mousemove' ,handleCursorMousemove)
        }

        const handleCursorMousemove = (e)=>{
            let {pageX ,pageY} = e

            let xSubtract = pageX - mousePageX + currentCursorX
            let ySubtract = pageY - mousePageY + currentCursorY

            if (xSubtract <= 0){
                xSubtract = 0
            }
            if (xSubtract >= svgPanelWidth){
                xSubtract = svgPanelWidth
            }

            if (ySubtract <= 0){
                ySubtract = 0
            }
            if (ySubtract >= svgPanelHeight){
                ySubtract = svgPanelHeight
            }

            cursorX.value = xSubtract
            cursorY.value = ySubtract

            calcMouseRGB(cursorX.value/svgPanelWidth ,cursorY.value/svgPanelHeight)
        }

        const handleCursorMouseup = (e)=>{
            XmvBubbling.status = true
            currentCursorX = cursorX.value
            currentCursorY = cursorY.value
            e.stopPropagation()
            window.removeEventListener('mouseup' ,handleCursorMouseup)
            window.removeEventListener('mousemove' ,handleCursorMousemove)
        }

        const calcSliderRGB = (val)=>{
            let betweenNum = Math.floor(val/255)
            let remainder = val%255

            if (betweenNum == 6){
                sliderRGB.value = 'rgb(255,0,0)' 
            }

            if (betweenNum == 0){
                sliderRGB.value = 'rgb(255 ,' + remainder + ' ,0)'
            }
            else if (betweenNum == 1){
                sliderRGB.value = `rgb(${255-remainder},255,0)`
            }
            else if (betweenNum == 2){
                sliderRGB.value = `rgb(0,255,${remainder})`
            }
            else if (betweenNum == 3){
                sliderRGB.value = `rgb(0,${255-remainder},255)`
            }
            else if (betweenNum == 4){
                sliderRGB.value = `rgb(${remainder},0,255)`
            }
            else if (betweenNum == 5){
                sliderRGB.value = `rgb(255,0,${255-remainder})`
            }

            calcMouseRGB()
        }

        const calcMouseRGB = (x ,y)=>{
            const white = [255, 255, 255];
            const spec = sliderRGB.value.slice(4, -1).split(',').map(Number);
            const black = [0, 0, 0]

            let r = (1 - y) * ((1 - x) * white[0] + x * spec[0]) + y * ((1 - x) * black[0] + x * black[0])
            let g = (1 - y) * ((1 - x) * white[1] + x * spec[1]) + y * ((1 - x) * black[1] + x * black[1])
            let b = (1 - y) * ((1 - x) * white[2] + x * spec[2]) + y * ((1 - x) * black[2] + x * black[2])

            selectedRGB.value = `rgb(${Math.floor(r)} ,${Math.floor(g)} ,${Math.floor(b)})`
            inputVal(rgba())
        }

        const handleClear = ()=>{
            popoverRef.value.hide()
            inputVal('')
            selectedRGB.value = ''
            context.emit('update:modelValue' ,'')
        }

        const handleEnter = ()=>{
            cache()
            context.emit('update:modelValue' ,rgba())
            popoverRef.value.hide()

        }

        const handlePopoverShow = ()=>{
            if (props.showAlpha != undefined){
                alphaSliderRef.value.calcSliderBound()
            }
        }

        const handlePopoverHide = ()=>{
            reset()
        }

        const cache = ()=>{
            tempCursorX = cursorX.value
            tempCursorY = cursorY.value
            tempSliderTop = sliderTop.value
            tempSelectedRGB = selectedRGB.value
            tempSliderRGB = sliderRGB.value
        }

        const reset = ()=>{
            cursorX.value = tempCursorX
            cursorY.value = tempCursorY
            sliderTop.value = tempSliderTop
            selectedRGB.value = tempSelectedRGB
            sliderRGB.value = tempSliderRGB
            inputVal(rgba())
        }

        const inputVal = (val)=>{
            $emit('colorVal' ,val)
            inputRef.value.val(val)
        }

        function __changeAlpha(color, alpha) {
            if (color.startsWith("rgba")) {
                return color.replace(/[\d.]+\)$/, alpha + ")");
            } else if (color.startsWith("rgb")) {
                return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
            } else {
                return color;
            }
        }

        function __getAlpha(color) {
            const rgbaArray = color.match(/\d+(\.\d+)?/g);
            if (rgbaArray && rgbaArray.length === 4) {
                return parseFloat(rgbaArray[3]);
            } else {
                return null;
            }
        }

        const rgba = ()=>{
            if (props.showAlpha != undefined){
                if (!isEmpty(selectedRGB.value)){             
                    return __changeAlpha(selectedRGB.value ,alphaSliderRef.value.thumbLeft)
                }
            }
            return selectedRGB.value
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (newVal)=>{
            if (props.showAlpha != undefined){
                let alpha = __getAlpha(newVal)
                if (alpha){
                    alphaSliderRef.value.thumbLeft = alpha
                }
            }
            selectedRGB.value = newVal
            tempSelectedRGB = newVal
            inputVal(rgba())
        }

        const computeSelectedRGB = computed(()=>{
            if (props.showAlpha != undefined){
                if (!isEmpty(selectedRGB.value)){             
                    return __changeAlpha(selectedRGB.value ,alphaSliderRef.value.thumbLeft)
                }
            }
            return selectedRGB.value
        })

        onMounted(()=>{
            if (props.modelValue != undefined){
                handleWatch(props.modelValue)
            }
        })

        return {sliderRGB ,selectedRGB ,sliderTop ,
                cursorX ,cursorY ,inputRef,popoverRef,alphaSliderRef,computeSelectedRGB,
                computeColorPickerClass,
                handleSliderMousedown,handleCursorMousedown,
                handleClear,handleEnter ,handlePopoverHide ,handlePopoverShow}
    }
})
</script>

<style lang="" scoped></style>
