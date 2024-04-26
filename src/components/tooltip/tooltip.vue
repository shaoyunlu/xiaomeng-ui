<template>
    <span ref="placeSpan" class="xmv-place-span"></span>
    <slot></slot>
</template>

<script>
import {defineComponent, onMounted  ,onUnmounted, ref ,inject, watch ,render ,h} from 'vue'
import {addClass ,getPagePosition ,getAlignPosition ,addStyle} from 'utils/dom'
import XmvTransition from 'comps/transition/transition'

export default defineComponent({
    name:"xmvTooltip",
    props:{
        content : String | Number,
        placement : {type : String,default : 'top'},
        width : {type : String,default : 'auto'},
        isAlignCenter : {type : Boolean,default : false },
        effect : {type : String ,default : 'dark'},
        disabled : Boolean
    },
    setup(props ,{slots ,attrs}) {
        const placeSpan = ref(null)
        const transition = new XmvTransition()
        var pEl = inject('Xmv-Dom-PopperContainer')
        var triggerEl
        var popperEl
        const keepShow = ref(false)
        let mouseType = ''

        const createPopperEl = ()=>{
            if (popperEl)
                return false
            popperEl = document.createElement('div')
            if (slots.content){
                render(h(() => slots.content()), popperEl)
            }else{
                popperEl.innerHTML = props.content
            }
            addClass(popperEl ,'xmv-popper is-' + props.effect)
            
            let cssText = `z-index:2002;width:${props.width};position:absolute;opacity:0;
                            left:0px;top:0px;margin:0;right:auto;bottom:auto;transform: translate(0px,0px)`
            popperEl.style.cssText = cssText
        }

        const setPosition = ()=>{
            let offsetLeft = 0
            let offsetTop = 0
            let {placement} = props

            addStyle(popperEl,'max-width',document.documentElement.clientWidth + 'px')

            let {left ,top} = getPagePosition(triggerEl ,props.placement ,popperEl ,props.isAlignCenter)
            if (placement == 'top' || placement == 'bottom'){
                left += offsetLeft
            }else{
                top += offsetTop
            }
            popperEl.style.transform = `translate(${left}px,${top}px)`
        }

        const handleMouseover = ()=>{
            if (mouseType == 'mouseover' || keepShow.value){
                return false
            }
            mouseType = 'mouseover'
            if (props.disabled){
                return false
            }
            transition.opacityIn(()=>{
                pEl.appendChild(popperEl)
                setPosition()
            })
        }

        const handleMouseleave = ()=>{       
            mouseType = 'mouseleave'
            if (!keepShow.value){
                transition.opacityOut(()=>{
                    pEl.removeChild(popperEl)
                })
            }
        }

        const hide = ()=>{
            transition.opacityOut(()=>{
                pEl.removeChild(popperEl)
            })
        }

        watch(()=>props.content ,(newVal)=>{
            popperEl.innerHTML = newVal
            setTimeout(()=>{
                setPosition()
            } ,10)
        })

        watch(()=>props.disabled ,(newVal)=>{
            newVal && handleMouseleave()
        })

        onMounted(()=>{
            triggerEl = placeSpan.value.nextElementSibling
            placeSpan.value.remove()
            createPopperEl()
            transition.setEl(popperEl)

            triggerEl.addEventListener('mouseover' ,(event)=>{
                handleMouseover()
            })
            triggerEl.addEventListener('mouseleave' ,()=>{
                handleMouseleave()
            })

            popperEl.addEventListener('mouseover' ,()=>{
                handleMouseover()
            })

            popperEl.addEventListener('mouseleave' ,()=>{
                handleMouseleave()
            })
        })

        onUnmounted(()=>{
            if (popperEl){
                popperEl.remove()
                popperEl = null
            }
        })

        return {placeSpan ,keepShow ,hide}
    }
})
</script>

<style lang="less">

</style>