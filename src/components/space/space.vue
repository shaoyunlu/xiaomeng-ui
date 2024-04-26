<template>

</template>

<script>
import {computed, defineComponent, h, watch} from 'vue'
export default defineComponent({
    name:"xmvSpace",
    props:{
        size : {type:[Number,String] ,default : 8},
        fill : {type:Boolean ,default : false},
        wrap : {type:Boolean ,default : true},
        direction : {type:String ,default : 'horizontal'}, //vertical
        alignment : {type:String ,default : 'start'}    //stretch ,center ,start ,end
    },
    setup(props ,{slots}) {

        const computeClass = computed(()=>{
            let res = []
            res.push('xmv-space')
            if (props.direction == 'vertical'){
                res.push('xmv-space--vertical')
            }
            return res
        })

        const computeSpaceItemStyle = computed(()=>{
            let res = {}
            let __size = props.size
            if (props.size == 'small'){
                __size = 8
            }else if (props.size == 'default'){
                __size = 12
            }else if (props.size == 'large'){
                __size = 16
            }
  
            res['padding-bottom'] = __size + 'px'
            res['margin-right'] = __size + 'px'
            res['min-width'] = props.fill?'100%':''
            return res
        })

        const computeSpaceStyle = computed(()=>{
            let res = {}
            let __size = props.size
            if (props.size == 'small'){
                __size = 8
            }else if (props.size == 'default'){
                __size = 12
            }else if (props.size == 'large'){
                __size = 16
            }

            if (props.fill){
                res['width'] = '100%'
            }

            res['flex-wrap'] = props.wrap?'wrap':''
            res['margin-bottom'] = '-' + __size + 'px'
            res['align-items'] = props.alignment
            return res
        })

        return ()=>{
            let renderSlot = []
            let defaultSlot = ( slots.default) == null ? void 0 : slots.default.call(slots)
            
            const parseVNode = (vNode)=>{
                if (vNode.children){
                    if (vNode.children instanceof Array){
                        vNode.children.forEach(__vNode=>{
                            parseVNode(__vNode)
                        })
                    }else{
                        renderSlot.push(h('div' ,{class:'xmv-space__item',style:computeSpaceItemStyle.value} ,vNode)) 
                    }
                    
                }else{
                    renderSlot.push(h('div' ,{class:'xmv-space__item',style:computeSpaceItemStyle.value} ,vNode))
                }
            }

            defaultSlot.forEach(__vNode =>{
                parseVNode(__vNode)
            })

            return h('div' ,{class:computeClass.value ,style:computeSpaceStyle.value},renderSlot)
        }
    }
})
</script>

<style lang="" scoped></style>
