<template>
    <span class="xmv-tag" :class="computeTagClass" ref="tagRef">
        <span class="xmv-tag__content">
            <slot></slot>
        </span>
        <xmv-icon v-if="closable != undefined"
            name="close" class="xmv-tag__close" 
            @click.stop="handleCloseClick" @mouseup.stop="()=>{}"></xmv-icon>
    </span>
</template>

<script>
import {computed, defineComponent,getCurrentInstance,ref} from 'vue'
export default defineComponent({
    name:"xmvTag",
    props:{
        closable : String,
        type : {type : String ,default : 'light'},
        size : String,
        effect : String,
        round : Boolean
    },
    emits:['close'],
    setup(props ,context) {

        const tagRef = ref(null)

        const handleCloseClick = ()=>{
            context.emit('close')
        }

        const computeTagClass = computed(()=>{
            let res = []
            res.push('xmv-tag--' + props.type)
            if (props.size != undefined){
                res.push('xmv-tag--' + props.size)
            }
            if (props.effect != undefined){
                res.push('xmv-tag--' + props.effect)
            }
            if (props.round){
                res.push('is-round')
            }
            return res
        })

        return {tagRef ,computeTagClass ,handleCloseClick}
    }
})
</script>

<style lang="" scoped></style>
