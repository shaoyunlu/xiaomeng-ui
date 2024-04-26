<template>
    <div class="xmv-carousel__item" 
        :class="computeClass" ref="itemRef" @click="handleClick">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent, inject, ref ,getCurrentInstance, computed} from 'vue'
export default defineComponent({
    name:"xmvCarouselItem",
    setup(props ,context) {

        const itemRef = ref(null)
        const instance = getCurrentInstance()
        const carouselMode = inject('CarouselMode')
        let countObj = inject('CarouselCount')
        let index = countObj.num
        countObj.num++

        const computeClass = computed(()=>{
            let res = []
            if (carouselMode.type == 'card'){
                res.push('xmv-carousel__item--card')
            }
            if (carouselMode.type == 'card' && carouselMode.direction == 'vertical'){
                res.push('xmv-carousel__item--card-vertical')
            }
            return res
        })

        const handleClick = ()=>{
            carouselMode.goTo(index)
        }

        carouselMode.rctData.itemList.push(instance)

        return {itemRef ,carouselMode ,computeClass ,handleClick}
    }
})
</script>

<style lang="" scoped></style>
