<template>
    <div class="xmv-divider" :class="computeDirection" :style="{'--xmv-border-style':borderStyle}">
        <div class="xmv-divider__text" :class="computePosition">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent} from 'vue'
export default defineComponent({
    name:"xmvDivider",
    props:{
        direction : {type:String,default:'horizontal'},
        borderStyle : {type:String,default:'solid'},
        contentPosition : {type:String,default:'center'}
    },
    setup({direction ,contentPosition} ,context) {

        const computeDirection = computed(()=>{
            return ['xmv-divider--' + direction]
        })

        const computePosition = computed(()=>{
            return ['is-' + contentPosition]            
        })

        return {computePosition ,computeDirection}
    }
})
</script>

<style lang="" scoped></style>
