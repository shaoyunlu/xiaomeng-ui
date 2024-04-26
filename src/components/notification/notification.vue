<template>
    <transition :name="'xmv-notification-' + position"  @after-leave="handleLeave">
        <div v-show="isShow" v-if="isDisplay">
            <div class="xmv-notification" :class="computeNotificationClass" :style="computeStyle">
                <xmv-icon v-if="type != null" 
                    :name="(type=='error'?'circleClose':type) + 'Filled'" 
                    class="xmv-notification__icon" :class="computeIconClass"></xmv-icon>
                <div class="xmv-notification__group">
                    <h2 class="xmv-notification__title">
                        {{ title }}
                    </h2>
                    <div class="xmv-notification__content">
                        <p>{{ message }}</p>
                    </div>
                    <xmv-icon v-if="showClose" name="close" class="xmv-notification__closeBtn" @click="handleCloseClick"></xmv-icon>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {computed, defineComponent ,onMounted ,nextTick ,ref} from 'vue'
import xmvIcon  from 'comps/icon/icon.vue'
export default defineComponent({
    name:"xmvNotification",
    props:{
        position : {type : String, default : 'top-right'},
        type : String,
        title : String,
        message : String,
        top : Number | String,
        bottom : Number | String,
        duration : {type:Number ,default : 4500},
        showClose : {type:Boolean,default : true}
    },
    components:{xmvIcon},
    setup(props ,context) {

        const isShow = ref(false)
        const isDisplay = ref(false)
        const topRef = ref(props.top)
        const bottomRef = ref(props.bottom)

        let timeout

        const computeNotificationClass = computed(()=>{
            let res = []
            let position = props.position
            if (position == 'top-right' || position == 'bottom-right'){
                res.push('right')
            }else{
                res.push('left')
            }
            return res
        })

        const computeIconClass = computed(()=>{
            return ['xmv-notification--' + props.type]
        })

        const computeStyle = computed(()=>{
            return {top : topRef.value + 'px' ,bottom : bottomRef.value + 'px'}
        })

        const handleCloseClick = ()=>{
            clearTimeout(timeout)
            isShow.value = false
            context.emit('destroy')
        }

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

        onMounted(()=>{
            isDisplay.value = true
            nextTick(()=>{
                isShow.value = true
            })

            destroy()
        })

        return {computeNotificationClass,isShow,isDisplay,computeStyle,
                topRef,bottomRef,computeIconClass,
                handleLeave,handleCloseClick}
    }
})
</script>

<style lang="" scoped></style>
