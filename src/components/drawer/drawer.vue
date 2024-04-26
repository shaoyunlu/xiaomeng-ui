<template>
    <transition name="xmv-drawer">
        <div class="xmv-overlay" v-show="modelValue" @click="handleOverlayClick">
            <div class="xmv-drawer" :class="computeClass" :style="computeDrawerStyle" @click.stop>
                <header class="xmv-drawer__header" v-if="withHeader">
                    <span class="xmv-drawer__title">{{title}}</span>
                    <button class="xmv-drawer__close-btn" @click="handleCloseClick">
                        <xmv-icon name="close" class="xmv-drawer__close"></xmv-icon>
                    </button>
                </header>
                <div class="xmv-drawer__body">
                    <slot></slot>
                </div>
                <div class="xmv-drawer__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {computed, defineComponent ,ref} from 'vue'
export default defineComponent({
    name:"xmvDrawer",
    props:{
        title : {type:String ,default : ''},
        size : {type:String ,default : '30%'},
        direction : {
            type : String,
            default : 'rtl'
        },
        beforeClose : Function,
        withHeader : {type : Boolean,default : true},
        modelValue : Boolean,
        autoClose : {type : Boolean,default : true}
    },
    setup(props ,context) {

        const isOpenRef = ref(false)

        const computeClass = computed(()=>{
            let res = []
            if (isOpenRef.value){
                res.push('open')
            }
            res.push(props.direction)
            return res
        })

        const computeDrawerStyle = computed(()=>{
            let res = {}
            let direction = props.direction
            if (direction == 'rtl' || direction == 'ltr'){
                res.width = props.size
            }else{
                res.height = props.size
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
        }

        const handleOverlayClick = ()=>{
            if (props.modelValue && props.autoClose){
                handleCloseClick()
            }
        }

        return {isOpenRef ,computeClass ,computeDrawerStyle ,
                handleCloseClick ,handleOverlayClick}
    }
})
</script>

<style lang="" scoped></style>
