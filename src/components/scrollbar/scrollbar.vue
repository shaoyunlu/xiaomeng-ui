<template>
    <div class="xmv-scrollbar"
        :style="computedScrollbarStyle"
        @mouseover="handleMouseover"
        @mouseleave="handleMouseleave" ref="scrollbarRef">
        <div class="xmv-scrollbar__wrap xmv-scrollbar__wrap--hidden-default"
            @mousedown="handleWrapMousedown"
            @mouseup="handleWrapMouseup"
            @scroll="hanleScroll" 
            :style="scrollbarWrapStyle"
            ref="scrollbarWrapRef">
            <div class="xmv-scrollbar__view" ref="viewRef" >
                <slot></slot>
            </div>
        </div>
        <div class="xmv-scrollbar__bar is-horizontal" :style="{'opacity':isPolyfill?'0':'' ,'height':isPolyfill?'0':''}">
            <div class="xmv-scrollbar__thumb" ref="horThumbRef" 
            @mousedown.stop="(event) => handleMousedown('hor', event)"></div>
        </div>
        <div class="xmv-scrollbar__bar is-vertical">
            <div class="xmv-scrollbar__thumb" ref="verThumRef" 
            @mousedown.stop="(event) => handleMousedown('ver', event)"></div>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent ,inject,nextTick,onMounted,ref} from 'vue'
import {getDomMartix ,setDomMartix ,removeTextSelected} from 'utils/dom'
import {isLowVersionFirefox} from 'utils/dict'
import {resizeOB} from 'utils/event'
export default defineComponent({
    name:"xmvScrollbar",
    props:{
        explicit : {type:Boolean ,default:false},
        maxHeightFlag : {type:Boolean ,default:false},
        maxHeight : {type:Number ,default:274},
        height : {type:Number}
    },
    emits:['scroll'],
    setup(props ,context) {
        
        const scrollbarRef = ref(null)
        const scrollbarWrapRef = ref(null)
        const viewRef = ref(null)
        const horThumbRef = ref(null)
        const verThumRef = ref(null)
        const isPolyfill = isLowVersionFirefox('64.0.0')
        const isMargin = ref(false)
        const XmvBubbling = inject('Xmv-Bubbling')
        var parentHorThumbEl
        var parentVerThumEl
        var currentMouseStatus
        var wRatio
        var hRatio
        var mousePageX = null
        var mousePageY = null
        var isScrollIng = false
        var isMousedown = false
        var isWrapMousedown = false
        var verDomMartix
        var horDomMartix
        var sWh
        var vWh
        var currentMouseDown /* 判断横轴动还是纵轴动 */

        const computedScrollbarStyle = computed(()=>{
            let res = {}
            if (props.height != undefined){
                res['height'] = props.height + 'px'
            }
            return res
        })

        const init = ()=>{
            if (!scrollbarRef.value){
                return false
            }
            sWh = __getWH(scrollbarRef.value)
            vWh = __getWH(viewRef.value)

            wRatio = (sWh.w/vWh.sw).toFixed(3)
            hRatio = (sWh.h/vWh.h).toFixed(3)

            // 判断横竖滚动条，哪个需要展示
            __judgeVisible()
            __calcScrollBarWH()
            __conversion()
        }

        const handleMouseover = ()=>{
            if (currentMouseStatus == 'mouseover'){
                return false
            }
            currentMouseStatus = 'mouseover'
            init()
        }

        const handleMouseleave = ()=>{
            if (isScrollIng && isMousedown){
                return false
            }
            if (isScrollIng && isWrapMousedown){
                return false
            }
            reset()
        }

        const handleWrapMousedown = ()=>{
            isWrapMousedown = true
        }

        const handleWrapMouseup = ()=>{
            isWrapMousedown = false
        }

        const handleMousedown = (type ,e)=>{
            XmvBubbling.status = false
            currentMouseDown = type
            removeTextSelected()
            isScrollIng = true
            isMousedown = true
            //let gutter = __getGutter()
            sWh = __getWH(scrollbarRef.value)
            vWh = __getWH(viewRef.value)
            wRatio = (sWh.w/vWh.sw).toFixed(3)
            hRatio = (sWh.h/vWh.h).toFixed(3)
            mousePageX = e.pageX
            mousePageY = e.pageY
            verDomMartix = getDomMartix(verThumRef.value)
            horDomMartix = getDomMartix(horThumbRef.value)
            window.addEventListener('mouseup' ,handleMouseup)
            window.addEventListener('mousemove' ,handleWindowMousemove)
        }

        const handleWindowMousemove = (e)=>{
            e.preventDefault()
            let {pageX ,pageY} = e
            let ySubtract = pageY - mousePageY
            let xSubtract = pageX - mousePageX

            let translateY = (parseFloat(verDomMartix[5]) + parseFloat(ySubtract)).toFixed(1)
            let translateX = (parseFloat(horDomMartix[4]) + parseFloat(xSubtract)).toFixed(1)

            if (translateY < 0){
                translateY = 0
            }

            if (translateX < 0){
                translateX = 0
            }

            let scrollTopValue = translateY/hRatio
            let scrollLeftValue = translateX/wRatio

            if (scrollTopValue > (vWh.h - sWh.h) ){
                scrollTopValue = vWh.h - sWh.h
                translateY = scrollTopValue * hRatio
            }

            if (scrollLeftValue > (vWh.sw - sWh.w) ){
                scrollLeftValue = vWh.sw - sWh.w
                translateX = scrollLeftValue * wRatio
            }

            if (currentMouseDown == 'ver'){
                setDomMartix(verThumRef.value ,[1,0,0,1,0,translateY])
                scrollbarWrapRef.value.scrollTop = scrollTopValue
            }else if (currentMouseDown == 'hor'){
                setDomMartix(horThumbRef.value ,[1,0,0,1,translateX,0])
                scrollbarWrapRef.value.scrollLeft = scrollLeftValue
            }
        }

        const handleMouseup = ()=>{
            XmvBubbling.status = true
            isMousedown = false
            reset()
            window.removeEventListener('mouseup' ,handleMouseup)
            window.removeEventListener('mousemove' ,handleWindowMousemove)
        }

        const hanleScroll = ()=>{
            isScrollIng = true
            __conversion()
            context.emit('scroll' ,{
                'hor' : scrollbarWrapRef.value.scrollLeft,
                'ver' : scrollbarWrapRef.value.scrollTop
            })
        }

        const reset = ()=>{
            currentMouseStatus = ''
            wRatio = null
            hRatio = null
            mousePageX = null
            mousePageY = null
            isScrollIng = false
            verDomMartix = null
            horDomMartix = null
            sWh = null
            vWh = null
            parentHorThumbEl.style.display = 'none'
            parentVerThumEl.style.display = 'none'
            currentMouseDown = ''
        }

        const scroll = (val ,type='ver')=>{
            if (type == 'ver'){
                scrollbarWrapRef.value.scrollTop = val
            }
        }

        const __judgeVisible = ()=>{
            parentHorThumbEl.style.display = (vWh.sw > sWh.w ? '' : 'none')
            parentVerThumEl.style.display = (vWh.h > sWh.h ? '' : 'none')
        }

        // 计算滚动条的长度
        const __calcScrollBarWH = ()=>{
            horThumbRef.value.style.width = sWh.w * wRatio + 'px'
            verThumRef.value.style.height = sWh.h * hRatio + 'px'
        }

        // 计算滚动条与元素滚动之间的换算关系
        const __conversion = ()=>{
            let scrollTop = scrollbarWrapRef.value.scrollTop
            let scrollLeft = scrollbarWrapRef.value.scrollLeft

            verThumRef.value.style.transform = `matrix(1, 0, 0, 1, 0, ${scrollTop * hRatio})`
            horThumbRef.value.style.transform = `matrix(1, 0, 0, 1, ${scrollLeft * wRatio} ,0)`
        }

        const __getWH = (el ,gutter = {ver:0,hor:0})=>{
            return {w:el.clientWidth ,h:el.clientHeight + gutter.ver ,sw:el.scrollWidth}
        }

        const scrollbarWrapStyle = computed(()=>{
            let styleObj = new Object()
            if (isPolyfill){
                styleObj['margin-right'] = '-17px'
                styleObj['margin-bottom'] = '0px'
            }
            if (props.maxHeightFlag){
                styleObj['max-height'] = props.maxHeight + 'px'
            }
            return styleObj
        })

        const polyfillHeight = ()=>{
            if (!isPolyfill){
                return false
            }
            let viewHeight =  viewRef.value.scrollHeight
            if (props.maxHeightFlag){
                if (viewHeight < props.maxHeight){
                    scrollbarWrapRef.value.style['margin-bottom'] = '-17px'
                }else{
                    scrollbarWrapRef.value.style['margin-bottom'] = '0px'
                }
            }
        }

        onMounted(()=>{
            parentHorThumbEl = horThumbRef.value.parentNode
            parentVerThumEl = verThumRef.value.parentNode

            resizeOB(viewRef.value ,()=>{
                reset()
                //init()
                //polyfillHeight()
            })

            if (props.explicit && isPolyfill){
                viewRef.value.style.width = scrollbarRef.value.scrollWidth - 17 + 'px'
            }
        })

        return {handleMouseover ,handleMouseleave ,hanleScroll, handleMousedown, handleWrapMousedown, handleWrapMouseup,
                scroll,computedScrollbarStyle,
                scrollbarRef ,viewRef ,horThumbRef ,verThumRef ,scrollbarWrapRef ,isPolyfill ,isMargin ,scrollbarWrapStyle}
    }
})
</script>

<style lang="" scoped></style>
