<template>
    <transition name="xmv-dialog">
        <div class="xmv-overlay" v-show="modelValue">
            <div class="xmv-overlay-dialog" :style="computeOverlayStyle">
                <div class="xmv-dialog"
                    :class="{'is-align-center' : alignCenter ,
                             'xmv-dialog--center' : center,
                             'is-draggable' : draggable}" 
                    :style="computeStyle" ref="dialogRef">
                    <header class="xmv-dialog__header" @mousedown.stop="(event) => handleMousedown(event)">
                        <span class="xmv-dialog__title">
                            {{title}}
                        </span>
                        <button class="xmv-dialog__headerbtn" @click="handleCloseClick">
                            <xmv-icon name="close" class="xmv-dialog__close"></xmv-icon>
                        </button>
                    </header>
                    <div class="xmv-dialog__body">
                        <slot></slot>
                    </div>
                    <footer class="xmv-dialog__footer">
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {computed, defineComponent,ref} from 'vue'
export default defineComponent({
    name:"",
    emits:['close'],
    props:{
        title : {type:String ,default : ''},
        width : String,
        modelValue : Boolean,
        beforeClose : Function,
        center : Boolean,
        alignCenter : Boolean,
        draggable : Boolean
    },
    setup(props ,context) {

        const isShow = ref(true)
        const dialogRef = ref(null)
        const transX = ref(0)
        const transY = ref(0)

        var mousePageX = null
        var mousePageY = null

        var currentTranxX = 0
        var currentTransY = 0

        let dialogBound
        let documentWidth
        let documentHeight

        const computeStyle = computed(()=>{
            let res = {}
            if (props.width != undefined){
                res['--xmv-dialog-width'] = props.width
            }
            if (props.draggable){
                res['transform'] = `translate(${transX.value}px, ${transY.value}px)`
            }
            return res
        })

        const computeOverlayStyle = computed(()=>{
            let res = {}

            if (props.alignCenter){
                res['display'] = 'flex'
            }

            return res
        })

        const handleCloseClick = ()=>{
            if (props.beforeClose != undefined){
                props.beforeClose(()=>{
                    context.emit('update:modelValue' ,false)
                })
            }else{
                context.emit('update:modelValue' ,false)
            }
            context.emit('close')
        }

        const handleMousedown = (e)=>{
            if (!props.draggable){
                return false
            }

            dialogBound = dialogRef.value.getBoundingClientRect()
            mousePageX = e.pageX
            mousePageY = e.pageY

            documentWidth = document.documentElement.clientWidth
            documentHeight = document.documentElement.clientHeight

            window.addEventListener('mouseup' ,handleWindowMouseup)
            window.addEventListener('mousemove' ,handleWindowMousemove)
        }

        const handleWindowMousemove = (e)=>{
            e.preventDefault()
            let {pageX ,pageY} = e
            let xSubtract = pageX - mousePageX
            let ySubtract = pageY - mousePageY

            if (xSubtract + dialogBound.left + dialogBound.width >= documentWidth){
                xSubtract = documentWidth - dialogBound.width - dialogBound.left
            }
            if (xSubtract + dialogBound.left <= 0){
                xSubtract = 0 - dialogBound.left
            }
            if (ySubtract + dialogBound.top <= 0){
                ySubtract = 0 - dialogBound.top
            }
            if (ySubtract + dialogBound.top + dialogBound.height >= documentHeight){
                ySubtract = documentHeight - dialogBound.height - dialogBound.top
            }

            transX.value = xSubtract + currentTranxX
            transY.value = ySubtract + currentTransY
        }

        const handleWindowMouseup = (e)=>{
            window.removeEventListener('mouseup' ,handleWindowMouseup)
            window.removeEventListener('mousemove' ,handleWindowMousemove)
            currentTranxX = transX.value
            currentTransY = transY.value
        }

        return {dialogRef,isShow,computeStyle,computeOverlayStyle,handleCloseClick,handleMousedown}
    }
})
</script>

<style lang="" scoped>
    
</style>
