<template>
    <div class="xmv-badge" >
        <slot></slot>
        <sup class="xmv-badge__content" :class="computeClass">{{ computeValue }}</sup>
    </div>
</template>

<script>
import {computed, defineComponent} from 'vue'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvBadge",
    props:{
        type : {type:String ,default : 'danger'},
        max : Number,
        value : Number | String,
        isDot : Boolean
    },
    setup(props ,context) {
        const computeClass = computed(()=>{
            let res = []

            if (props.type != undefined){
                res.push('xmv-badge__content--' + props.type)
            }

            if (context.slots.default){
                res.push('is-fixed')
            }

            if (isEmpty(props.value ,true)){
                res.push('is-empty')
            }

            if (props.isDot){
                res.push('is-dot')
            }

            return res
        })

        const computeValue = computed(()=>{
            if (props.isDot){
                return ''
            }
            if (typeof props.value === "string"){
                return props.value
            }
            if (props.max == undefined){
                return props.value
            }
            if (props.value <= props.max){
                return props.value
            }
            return props.max + '+'
        })

        return {computeClass ,computeValue}
    }
})
</script>

<style lang="" scoped></style>
