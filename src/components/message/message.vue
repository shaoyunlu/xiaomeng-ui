<template>
    <transition name="xmv-message"  @after-leave="handleLeave">
        <div v-show="isShow" v-if="isDisplay" ref="divRef">
            <div class="xmv-message" :class="computeClass" :style="computeStyle">
                <xmv-badge class="xmv-message__badge" :value="groupNumRef" v-if="grouping"></xmv-badge>
                <xmv-icon :name="(type=='error'?'circleClose':type) + 'Filled'"
                          class="xmv-message__icon" :class="computeIconClass"></xmv-icon>
                <p class="xmv-message__content">{{message}}</p>
                <xmv-icon v-if="showClose" name="close" class="xmv-message__closeBtn" @click="handleCloseClick"></xmv-icon>
            </div>
        </div>
    </transition>
</template>

<script>
import {defineComponent ,ref, onMounted ,nextTick, computed, watch, onUnmounted} from 'vue'
import xmvIcon  from 'comps/icon/icon.vue'
import xmvBadge from 'comps/badge/badge.vue'
export default defineComponent({
    name:"xmvMessage",
    components:{xmvIcon,xmvBadge},
    props:{
        top : {type:Number ,default:20},
        message : String,
        instances : Array,
        type : {type:String ,default : 'info'},
        showClose : Boolean,
        duration : {type:Number ,default : 3000},
        grouping : Boolean
    },
    setup(props ,context) {
        const isShow = ref(false)
        const isDisplay = ref(false)

        const topRef = ref(props.top)
        const groupNumRef = ref(1)

        const divRef = ref(null)

        let timeout

        const computeClass = computed(()=>{
            let res = []
            res.push('xmv-message--' + props.type)
            if (props.showClose){
                res.push('is-closable')
            }
            return res
        })

        const computeStyle = computed(()=>{
            return {top : topRef.value + 'px'}
        })

        const computeIconClass = computed(()=>{
            return ['xmv-message-icon--' + props.type]
        })

        const handleLeave = ()=>{
            isDisplay.value = false
        }

        const destroy = ()=>{
            if (props.duration != 0){
                timeout = setTimeout(()=>{
                    isShow.value = false
                    context.emit('destroy')                    
                } ,props.duration)
            }
        }

        const handleCloseClick = ()=>{
            isShow.value = false
            context.emit('destroy')
            clearTimeout(timeout)
        }

        watch(groupNumRef ,()=>{
            clearTimeout(timeout)
            destroy()
        })

        onMounted(()=>{
            isDisplay.value = true
            nextTick(()=>{
                isShow.value = true
            })

            destroy()
        })

        return {isShow ,isDisplay, computeClass , computeIconClass,computeStyle,topRef,groupNumRef,
                divRef,
                handleLeave,handleCloseClick}
    }
})
</script>

<style lang="" scoped></style>
