<template>
    <div class="xmv-carousel"
        :class="{'xmv-carousel--horizontal' : direction != 'vertical',
                'xmv-carousel--vertical' : direction == 'vertical'}"
        @mouseover="handleMouseover" @mouseleave="handleMouseleave">
        <div class="xmv-carousel__container" ref="containerRef">
            <transition name="xmv-fade-in" v-if="direction != 'vertical'">
                <button type="button" class="xmv-carousel__arrow xmv-carousel__arrow--left" @click="handleLeft" v-show="leftRightButtonShow">
                    <xmv-icon name="arrowLeft"></xmv-icon>
                </button>
            </transition>
            <transition name="xmv-fade-in" v-if="direction != 'vertical'">
                <button type="button" class="xmv-carousel__arrow xmv-carousel__arrow--right" @click="handleRight" v-show="leftRightButtonShow">
                    <xmv-icon name="arrowRight"></xmv-icon>
                </button>
            </transition>
            <slot></slot>
        </div>
        <ul class="xmv-carousel__indicators" ref="indicatorUlRef" v-if="indicatorPosition != 'none'"
            :class="{'xmv-carousel__indicators--outside' : indicatorPosition == 'outside',
                    'xmv-carousel__indicators--horizontal' : direction != 'vertical',
                    'xmv-carousel__indicators--vertical' : direction == 'vertical',
                    'xmv-carousel__indicators--right' : direction == 'vertical'}">
            <li v-for="tmp,index in carouselMode.rctData.itemList"
                class="xmv-carousel__indicator"
                :class="{'xmv-carousel__indicator--horizontal' : direction != 'vertical',
                        'xmv-carousel__indicator--vertical' : direction == 'vertical'}"
                @click="handleIndicatorClick(index)">
                <button class="xmv-carousel__button"></button>
            </li>
        </ul>
    </div>
</template>

<script>
import {defineComponent, onMounted, provide, ref} from 'vue'
import CarouselMode from './mode/carouselMode';
export default defineComponent({
    name:"xmvCarousel",
    props:{
        type : String,
        indicatorPosition : {type : String}, //outside
        direction : String
    },
    setup(props ,context) {

        const containerRef = ref(null)
        const indicatorUlRef = ref(null)
        const carouselMode = new CarouselMode({
            wrapperRef : containerRef,
            indicatorUlRef : indicatorUlRef,
            type : props.type,
            direction : props.direction
        })
        const leftRightButtonShow = ref(false)
        const countObj = {num : 0}

        provide('CarouselMode' ,carouselMode)
        provide('CarouselCount' ,countObj)

        const handleLeft = ()=>{
            carouselMode.left()
        }

        const handleRight = ()=>{
            carouselMode.right()
        }

        const handleMouseover = ()=>{
            leftRightButtonShow.value = true
            carouselMode.stop()
        }

        const handleMouseleave = ()=>{
            leftRightButtonShow.value = false
            carouselMode.animate()
        }

        const handleIndicatorClick = (index)=>{
            carouselMode.setActiveClass(index)
            carouselMode.goTo(index)
        }

        onMounted(()=>{
            carouselMode.reset()
            carouselMode.animate()
        })

        return {containerRef ,indicatorUlRef ,leftRightButtonShow ,carouselMode,
                handleLeft ,handleRight ,handleMouseover ,handleMouseleave ,handleIndicatorClick}
    }
})
</script>

<style lang="" scoped></style>
