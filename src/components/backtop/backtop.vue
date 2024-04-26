<template>
    <transition name="xmv-fade-in">
        <div class="xmv-backtop" :style="computeStyle" v-if="isShow" @click="handleClick">
            <xmv-icon name="arrowRight" class="xmv-backtop__icon" v-if="computeIfIcon"></xmv-icon>
            <slot></slot>
        </div>
    </transition>
</template>

<script>
import {computed, defineComponent ,ref ,inject} from 'vue'
export default defineComponent({
    name:"xmvBacktop",
    props:{
        right : {type:Number ,default : 40},
        bottom : {type:Number ,default : 40},
        visibilityHeight : {type:Number ,default : 200}
    },
    setup({right,bottom,visibilityHeight} ,context) {

        const isShow = ref(false)

        const computeIfIcon = computed(()=>{
            return context.slots.default == undefined
        })

        const $on = inject('Xmv-Event-On')

        $on('scroll' ,(e)=>{
            judgeShow()
        })

        const judgeShow = ()=>{
            let scrollTop = document.documentElement.scrollTop
            isShow.value = (scrollTop > visibilityHeight)
        }

        const computeStyle = computed(()=>{
            return {right : right + 'px' ,bottom : bottom + 'px'}
        })

        const handleClick = ()=>{
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
        }

        return {isShow ,computeStyle ,computeIfIcon ,handleClick}
    }
})
</script>

<style lang="" scoped></style>
