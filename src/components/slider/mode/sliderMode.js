import {ref} from 'vue'

class SliderMode{
    constructor(props){
        this.props = props
        this.sliderVal = ref(0)
        this.toolTipContent = ref(0)
        this.tooltipRef = ref(null)
        this.isDragging
        this.sliderBound = null
        this.ctx
        this.trigger

        this.handleWindowMouseupFn = this.handleWindowMouseup.bind(this)
        this.handleWindowMousemoveFn = this.handleWindowMousemove.bind(this)
        
    }

    handleSliderButtonMousedown(){
        if (this.props.disabled){
            return false
        }
        this.isDragging.value = true
        this.tooltipRef.value.keepShow = true
        
        window.addEventListener('mouseup' ,this.handleWindowMouseupFn)
        window.addEventListener('mousemove' ,this.handleWindowMousemoveFn)
    }

    handleWindowMouseup(){
        this.isDragging.value = false
        this.tooltipRef.value.keepShow = false
        this.tooltipRef.value.hide()
        window.removeEventListener('mouseup' ,this.handleWindowMouseupFn)
        window.removeEventListener('mousemove' ,this.handleWindowMousemoveFn)
    }

    handleWindowMousemove(e){
        let offsetX = parseInt(e.clientX) - this.sliderBound.left
        let val = parseInt((offsetX/this.sliderBound.width)*100)

        if (val <= 0)
            val = 0
        if (val >= 100)
            val = 100

        this.sliderVal.value = this.__nearestStep(val,this.props.step)
        this.trigger()
        //this.ctx.emit('update:modelValue' ,val)
    }

    __nearestStep(num, step){
        return Math.round(num / step) * step;
    }
}

export default SliderMode