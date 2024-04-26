<template>
    <li class="xmv-cascader-node" @click="handleClick" :class="computeClass">
        <span class="xmv-cascader-node__label">{{node.label}}</span>
        <xmv-icon name="arrowRight" class="xmv-cascader-node__postfix" v-if="node.children != undefined"></xmv-icon>
    </li>
</template>

<script>
import {computed, defineComponent, inject ,nextTick,ref} from 'vue'
export default defineComponent({
    name:"",
    props:{
        node : Object,
        index : Number
    },
    setup({node ,index} ,context) {

        const cascaderMode = inject('CascaderMode')

        const {$on ,$emit} = inject('EventBus')

        const isActive = ref(false)

        const computeClass = computed(()=>{
            let res = []

            if (isActive.value){
                if (node.children != undefined)
                    res.push('in-active-path')
                else
                    res.push('is-active')
            }

            return res
        })

        const {$on:mOn ,$emit:mEmit} = inject('MenuEventBus')

        const handleClick = ()=>{
            cascaderMode.rctData.menuComps.splice(index+1)
            let length = cascaderMode.rctData.menuComps.length - 1
            cascaderMode.selectedLabel.splice(length)
            cascaderMode.selectedValue.splice(length)
            cascaderMode.selectedLabel.push(node.label)
            cascaderMode.selectedValue.push(node.value)
            mEmit('itemClick' ,node)
            if (node.children != undefined){
                nextTick(()=>{
                    cascaderMode.rctData.menuComps.push({list : node.children})
                })
            }
            else{
                $emit('emitModelValue')
            }
        }

        mOn('itemClick',tmp =>{
            isActive.value = (node.value == tmp.value)
        })

        $on('setVal' ,payLoad =>{
            if (payLoad.value == node.value && payLoad.index == index){
                handleClick()
            }
        })

        return {computeClass ,handleClick}
    }
})
</script>

<style lang="" scoped></style>
