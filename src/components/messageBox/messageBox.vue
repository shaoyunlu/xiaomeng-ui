<template>
    <transition name="xmv-message-box" v-show="isShow" v-if="isDisplay" @after-leave="handleLeave">
        <div class="xmv-overlay is-message-box" ref="messageBoxRef">
            <div class="xmv-overlay-message-box">
                <div class="xmv-message-box" :class="{'xmv-message-box--center':center}">
                    <div class="xmv-message-box__header">
                        <div class="xmv-message-box__title">
                            <span>{{title}}</span>
                        </div>
                        <button class="xmv-message-box__headerbtn">
                            <xmv-icon name="close" class="xmv-message-box__close" @click="handleClose('close')"></xmv-icon>
                        </button>
                    </div>
                    <div class="xmv-message-box__content">
                        <div class="xmv-message-box__container">
                            <div class="xmv-message-box__message">
                                <p v-if="type != 'vnode' && !dangerouslyUseHTMLString">{{message}}</p>
                                <div v-html="message" v-if="dangerouslyUseHTMLString"></div>
                                <slot v-if="type == 'vnode'"></slot>
                            </div>
                        </div>
                        <div class="xmv-message-box__input" v-if="type == 'prompt'">
                            <xmv-input v-model="inputModel"></xmv-input>
                            <div class="xmv-message-box__errormsg" :style="computeErrormsgStyle">
                                {{ errormsgRef }}
                            </div>
                        </div>
                    </div>
                    <div class="xmv-message-box__btns">
                        <xmv-button @click="handleClose('cancel')" v-if="isShowCloseButton">{{ cancelButtonText }}</xmv-button>
                        <xmv-button type="primary" @click="handleEnter">{{ confirmButtonText }}</xmv-button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {defineComponent ,nextTick,watch,ref, computed} from 'vue'
import xmvButton from 'comps/button/button.vue'
import xmvIcon  from 'comps/icon/icon.vue'
import xmvInput from 'comps/input/input.vue'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvMessageBox",
    props:{
        title : String,
        message : String | Object | Function,
        type : String,
        confirmButtonText : {type:String ,default:'确认'},
        cancelButtonText : {type:String ,default:'取消'},
        inputPattern : RegExp,
        inputErrorMessage : {type:String ,default:'error'},
        dangerouslyUseHTMLString : false,
        center : false
    },
    components : {xmvButton ,xmvIcon ,xmvInput},
    emits : ['leave'],
    setup(props ,context) {

        const messageBoxRef = ref(null)

        const isShow = ref(false)
        const isDisplay = ref(false)
        const isShowCloseButton = ref(false)

        const inputModel = ref('')
        const errormsgRef = ref('')

        let currentResolve
        let currentReject

        watch(inputModel ,(newVal)=>{
            validate(newVal)
        })

        const validate = (newVal)=>{
            if ( !isEmpty(newVal) &&  props.inputPattern.test(newVal)){
                errormsgRef.value = ''
            }else{
                errormsgRef.value = props.inputErrorMessage
            }
        }

        const computeErrormsgStyle = computed(()=>{
            if (isEmpty(errormsgRef.value)){
                return {'visibility':'hidden'}
            }else{
                return {'visibility':'visible'}
            }
        })

        const setAlert = ()=>{
            isShowCloseButton.value = false
            currentResolve = null
            currentReject = null
        }

        const setConfirm = (resolve ,reject)=>{
            isShowCloseButton.value = true
            currentResolve = resolve
            currentReject = reject
        }

        const setPrompt = (resolve ,reject)=>{
            isShowCloseButton.value = true
            currentResolve = resolve
            currentReject = reject
        }

        const show = ()=>{
            isDisplay.value = true
            nextTick(()=>{
                isShow.value = true
            })
        }

        const handleClose = (closeType)=>{
            currentReject && currentReject(closeType)
            isShow.value = false
        }

        const handleEnter = ()=>{
            if ( props.type == 'prompt' ){
                validate(inputModel.value)
                if (!isEmpty(errormsgRef.value)){
                    return false
                }
                currentResolve && currentResolve(inputModel.value)
            }else if (props.type == 'confirm'){
                currentResolve && currentResolve('')
            }
            isShow.value = false
        }

        const handleLeave = ()=>{
            isDisplay.value = false
            context.emit('leave')
        }

        return {isShow , isDisplay ,isShowCloseButton ,messageBoxRef ,errormsgRef,computeErrormsgStyle,
                inputModel,
                show ,handleClose ,handleLeave ,handleEnter ,setAlert ,setConfirm ,setPrompt}
    }
})
</script>

<style lang="" scoped></style>
