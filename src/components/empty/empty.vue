<template>
    <div class="xmv-empty">
        <div class="xmv-empty__image" :style="{'width' : imageSize + 'px'}">
            <svg version="1.1" v-if="image == undefined"
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">
                <path class="st0" d="M179.1,71.3L89.5,59.4v47.3l89.6,9.4V71.3z"/>
                <path class="st1" d="M17.9,74.9l71.6-15.5v53.7l-71.6,15.5C17.9,128.6,17.9,74.9,17.9,74.9z"/>
                <path class="st2" d="M101.5,92.8l77.6-21.5v101.5l-77.6,21.5C101.5,194.3,101.5,92.8,101.5,92.8z"/>
                <path class="st3" d="M17.9,74.9l83.6,17.9v101l-83.6-20.4C17.9,173.4,17.9,74.9,17.9,74.9z"/>
                <path class="st4" d="M101.5,92.7L17.9,74.9L0,110.7L86.6,131L101.5,92.7z"/>
                <path class="st1" d="M101.5,92.8l77.6-21.5l20.9,35.8l-74.6,24.4L101.5,92.8z"/>
            </svg>
            <img :src="image">
        </div>
        <div class="xmv-empty__description">
            <p>{{description}}</p>
        </div>
        <div class="xmv-empty__bottom" v-if="slots.default">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
    name:"xmvEmpty",
    props:{
        description : {type:String ,default:'暂无数据'},
        imageSize : {type:Number ,default:100},
        image : String
    },
    setup(props ,{slots}) {
        return {slots}
    }
})
</script>

<style lang="less" scoped>
    .st0{fill:#EBEEF2;}
    .st1{fill:#E0E4E9;}
    .st2{fill:#EEF0F5;}
    .st3{fill:#F6F7F8;}
    .st4{fill:#EAEEF5;}
</style>
