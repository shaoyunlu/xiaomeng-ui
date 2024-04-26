<template>
    <div class="xmv-page-header" :class="computeClass">
        <div class="xmv-page-header__breadcrumb">
            <slot name="breadcrumb"></slot>
        </div>
        <div class="xmv-page-header__header">
            <div class="xmv-page-header__left">
                <div class="xmv-page-header__back" @click="handleBackClick">
                    <div class="xmv-page-header__icon">
                        <xmv-icon :name="icon" v-if="icon != undefined"></xmv-icon>
                        <xmv-icon name="back" v-else></xmv-icon>
                    </div>
                    <div class="xmv-page-header__title">
                        Back
                    </div>
                </div>
                <xmv-divider direction="vertical"></xmv-divider>
                <div class="xmv-page-header__content">
                    <slot name="content"></slot>
                </div>
            </div>
            <div class="xmv-page-header__extra">
                <slot name="extra"></slot>
            </div>
        </div>
        <div class="xmv-page-header__main">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {defineComponent,computed} from 'vue'
export default defineComponent({
    name:"xmvPageHeader",
    emits:['back'],
    props:{
        icon : String | Object
    },
    setup(props ,context) {

        const computeClass = computed(()=>{
            let res = []
            if (context.slots.default != undefined){
                res.push('is-contentful')
            }
            if (context.slots.breadcrumb != undefined){
                res.push('xmv-page-header--has-breadcrumb')
            }
            if (context.slots.extra != undefined){
                res.push('xmv-page-header--has-extra')
            }
            return res
        })

        const handleBackClick = ()=>{
            context.emit('back')
        }

        return {handleBackClick,computeClass}
    }
})
</script>

<style lang="less" scoped>
    
</style>
