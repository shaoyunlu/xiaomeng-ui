<template>
    <div class="xmv-row" :style="styleObject" :class="classObject">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent, provide ,computed} from 'vue'
export default defineComponent({
    name:"xmvRow",
    props:{
        gutter : {type:Number ,default:0},
        justify : {type:String}
    },
    setup(props ,context) {

        let gutter = props.gutter/2

        provide('Gutter' ,gutter)

        const styleObject = computed(()=>{
            if (gutter == 0){
                return {}
            }else{
                return {'margin-left' : '-' + gutter + 'px' ,'margin-right' : '-' + gutter + 'px'}
            }
        })

        const classObject = computed(()=>{
            let res = []
            if (props.justify){
                res.push('is-justify-' + props.justify)
            }
            return res
        })

        return {styleObject ,classObject}
    }
})
</script>

<style lang="" scoped></style>
