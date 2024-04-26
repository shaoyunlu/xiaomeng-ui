<template>
    <div class="xmv-switch" :class="computeClass" @click="handleClick">
        <input class="xmv-switch__input" type="checkbox">
        <span v-if="!inlinePrompt && inactiveText != undefined" 
            class="xmv-switch__label xmv-switch__label--left" :class="{'is-active':!isActive}" >
            <span>{{ inactiveText }}</span>
        </span>
        <span class="xmv-switch__core" :style="computeCoreStyle">
            <div class="xmv-switch__inner" v-if="inlinePrompt">
                <span class="is-text">{{innerText}}</span>
            </div>
            <div class="xmv-switch__action">
                <xmv-icon name="loading" v-if="computeLoading" :class="{'is-loading':isLoading}"></xmv-icon>
            </div>
        </span>
        <span v-if="!inlinePrompt && activeText != undefined" 
            class="xmv-switch__label xmv-switch__label--right" :class="{'is-active':isActive}" >
            <span>{{ activeText }}</span>
        </span>
    </div>
</template>

<script>
import {defineComponent, onMounted, watch ,ref, computed} from 'vue'
export default defineComponent({
    name:"xmvSwitch",
    props:{
        size : String,
        inlinePrompt : Boolean,
        activeText:{type:String},
        inactiveText:{type:String},
        modelValue : Boolean,
        width:String,
        disabled:Boolean,
        loading:Boolean
    },
    setup(props ,context) {

        const isActive = ref(false)
        const isLoading = ref(true)
        const innerText = ref('')

        const computeClass = computed(()=>{
            let res = []
            if (isActive.value){
                res.push('is-checked')
            }
            if (props.size != undefined){
                res.push('xmv-switch--' + props.size)
            }
            if (props.disabled){
                res.push('is-disabled')
            }
            return res
        })

        const computeCoreStyle = computed(()=>{
            let res = {}
            if (props.width != undefined){
                res['width'] = props.width
            }
            return res
        })

        const computeLoading = computed(()=>{
            return (props.loading && isLoading.value)
        })

        const handleClick = ()=>{
            if (props.disabled){
                return false
            }
            isActive.value = !isActive.value
            context.emit('update:modelValue' ,isActive.value)
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWach(newVal)
        })

        const handleWach = (val)=>{
            isActive.value = val
            if (props.inlinePrompt){
                innerText.value = (isActive.value ? props.activeText : props.inactiveText)
            }
        }

        onMounted(()=>{
            if (props.modelValue != undefined){
                handleWach(props.modelValue)
            }
        })

        return {isActive,innerText,computeClass,
                computeCoreStyle,isLoading,computeLoading,handleClick}
    }
})
</script>

<style lang="" scoped></style>
