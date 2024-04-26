<template>
    <span class="xmv-breadcrumb__item">
        <span class="xmv-breadcrumb__inner" :class="{'is-link':(to != undefined)}" @click="handleClick">
            <slot></slot>
        </span>
        
        <xmv-icon v-if="separatorIconRef != ''" :name="separatorIconRef" class="xmv-breadcrumb__separator"></xmv-icon>
        <span class="xmv-breadcrumb__separator" v-else>
            {{separatorRef}}
        </span>
    </span>
</template>

<script>
import {defineComponent, inject ,ref} from 'vue'
export default defineComponent({
    name:"xmvBreadcrumbItem",
    props:{
        separator : {type:String ,default:'/'},
        to : Object
    },
    setup({to} ,context) {

        const {$on ,$emit} = inject('EventBus')
        const separatorRef = ref('')
        const separatorIconRef = ref('')

        const separator = inject('Separator')
        const separatorIcon = inject('SeparatorIcon')
        
        separatorRef.value = separator
        separatorIconRef.value = separatorIcon

        const handleClick = ()=>{
            if(to != undefined){
                $emit('route' ,to)
            } 
        }

        return {separatorRef,separatorIconRef,handleClick}
    }
})
</script>

<style lang="" scoped></style>
