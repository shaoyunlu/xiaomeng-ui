<template>
    <div class="xmv-col" :class="classList" :style="styleObject">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent ,computed, inject} from 'vue'
export default defineComponent({
    name:"xmvCol",
    props:{
        span : {type : Number ,default : 24},
        offset : Number
    },
    setup(props ,context) {

        let gutter = inject('Gutter')

        const pos = ['span', 'offset']

        const classList = computed(() =>{
            let res = []
            pos.forEach(prop => {
                const size = props[prop]
                if (size) {
                    res.push(prop !== 'span' ? `xmv-col-${prop}-${size}`:`xmv-col-${size}`)
                }
            })

            if (gutter != 0){
                res.push('is-guttered')
            }

            return res
        })

        const styleObject = computed(()=>{
            if (gutter == 0){
                return {}
            }else{
                return {'padding-left' : gutter + 'px' ,'padding-right' : gutter + 'px'}
            }
            
        })

        return {classList ,styleObject}
    }
})
</script>

<style lang="" scoped></style>
