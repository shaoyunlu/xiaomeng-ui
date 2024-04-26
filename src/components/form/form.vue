<template>
    <form class="xmv-form xmv-form--default" :class="computeFormClass">
        <slot></slot>
    </form>
</template>

<script>
import {defineComponent, provide ,computed ,reactive} from 'vue'
import {createEventBus} from 'utils/event'
export default defineComponent({
    name:"xmvForm",
    props:{
        mode : Object,
        rules : Object,
        labelWidth : String,
        labelPosition : {type:String ,default:'right'},
        inline:{type:Boolean,default:false}
    },
    setup(props ,context) {

        const formItemCollector = []

        provide('Props' ,props)
        provide('Collector' ,formItemCollector)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})

        const computeFormClass = computed(()=>{
            let res = []
            res.push('xmv-form--label-' + props.labelPosition)
            if (props.inline){
                res.push('xmv-form--inline')
            }
            return res 
        })

        const validate = ()=>{
            let promiseArray = []
            formItemCollector.forEach(formItemInstance =>{
                promiseArray.push(formItemInstance.proxy.validateByRules())
            })
            return Promise.all(promiseArray)
        }

        const errorReset = ()=>{
            $emit('errorReset')
        }

        const reset = ()=>{
            $emit('formReset')
        }

        return {computeFormClass ,validate,reset ,errorReset}
    }
})
</script>

<style lang="" scoped></style>
