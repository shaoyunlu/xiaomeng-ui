<template>
    <span ref="placeSpan" class="xmv-place-span"></span>
    <slot name="trigger"></slot>
    <slot></slot>
</template>

<script>
import {defineComponent,inject,onUnmounted,onMounted,ref} from 'vue'
import {addClass ,getPagePosition } from 'utils/dom'
import {resizeOB} from 'utils/event'
import XmvTransition from 'comps/transition/transition'
export default defineComponent({
    name:"xmvPopover",
    emits:['mouseover' ,'mouseleave' ,'mouseclick' ,'show' ,'hide'],
    props:{
        trigger :{
            type : String,
            default : 'click'
        },
        placement : {
            type : String,
            default : 'bottom'
        },
        beStripped : {type : Boolean ,default : true},
        popClass : {type : String},
        isAlignCenter : Boolean
    },
    setup(props ,{slots ,attrs ,emit}) {
        const enableRef = ref(true)
        const placeSpan = ref(null)
        const transition = new XmvTransition({})
        const XmvBubbling = inject('Xmv-Bubbling')
        const XmvEventOn = inject('Xmv-Event-On')
        var pEl = inject('Xmv-Dom-PopperContainer')
        var triggerEl
        var popperEl
        var defaultEl
        var currentEventName
        const isShow = ref(false)

        const createPopperEl = ()=>{
            if (popperEl)
                return false
            popperEl = document.createElement('div')

            addClass(popperEl ,'xmv-popper is-light is-pure')
            if (props.popClass != undefined){
                addClass(popperEl ,props.popClass)
            }

            let cssText = `z-index:2080;position:absolute;display:none;
                            left:0px;top:0px;margin:0;right:auto;bottom:auto;`
            popperEl.style.cssText = cssText
        }

        const setPosition = ()=>{
            let offsetLeft = 0
            let offsetTop = 0
            let {left ,top ,type} = getPagePosition(triggerEl ,props.placement ,popperEl ,props.isAlignCenter)
            transition.placement = type

            if (!props.beStripped){
                if (props.placement == 'bottom'){
                    left = 0
                    top = triggerEl.offsetTop + triggerEl.clientHeight + 5
                }else if(props.placement == 'right'){
                    left = triggerEl.offsetWidth + 5
                    top = triggerEl.offsetTop - 1
                }
            }

            if (props.placement == 'top' || props.placement == 'bottom'){
                left += offsetLeft

            }else{
                top += offsetTop
            }
            popperEl.style.left = left + 'px'
            popperEl.style.top = top + 'px'
        }
    
        const handleMouseover = (cbf)=>{
            if (currentEventName == 'mouseover'){
                return false
            }
            isShow.value = true
            currentEventName = 'mouseover'
            setPosition()
            transition.scaleIn(()=>{

            } ,()=>{
                emit('show')
            })
            emit('mouseover')
        }

        const handleMouseleave = (withEmit = true ,timeout=200)=>{
            currentEventName = 'mouseleave'
            isShow.value = false
            transition.scaleOut(()=>{
                popperEl.style.display = 'none'
            },timeout)
            if (withEmit){
                emit('mouseleave')
                emit('hide')
            }
        }

        const handleMouseclick = ()=>{
            if (!enableRef.value){
                return false
            }
            if (isShow.value){
                isShow.value = false
                handleMouseleave()
            }else{
                isShow.value = true
                handleMouseover()
            }
        }

        XmvEventOn('mouseup' ,(e)=>{
            if (!XmvBubbling.status){
                return false
            }
            let parent = e.target.closest('.xmv-popper')
            if (!parent){
                if (isShow.value){
                    hide(true ,0)
                }
            }
        })

        const show = ()=>{
            isShow.value = true
            handleMouseover()
        }

        const hide = (withEmit = false ,timeout=200)=>{
            if (isShow.value == false){
                return false
            }
            isShow.value = false
            handleMouseleave(withEmit,timeout)
        }

        const enable = ()=>{
            enableRef.value = true
        }

        const disabled = ()=>{
            enableRef.value = false
        }

        onUnmounted(()=>{
            popperEl && popperEl.remove()
        })

        onMounted(()=>{
            triggerEl = placeSpan.value.nextElementSibling
            defaultEl = triggerEl.nextElementSibling
            placeSpan.value.remove()

            if (!props.beStripped){
                pEl = defaultEl.parentNode
            }

            createPopperEl()
            popperEl.appendChild(defaultEl)
            pEl.appendChild(popperEl)

            transition.setEl(popperEl)

            if (props.trigger == 'click')
            {
                triggerEl.addEventListener('click' ,()=>{
                    handleMouseclick()
                })
            }
            else
            {
                triggerEl.addEventListener('mouseover' ,()=>{
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
            }
            resizeOB(triggerEl ,()=>{
                setPosition()
            })

            // resizeOB(popperEl ,()=>{
            //     setPosition()
            // })
        })

        return {enableRef ,placeSpan ,isShow ,show ,hide ,enable ,disabled ,setPosition}
    }
})
</script>

<style lang="less">

</style>