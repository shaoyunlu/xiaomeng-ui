<template>
    <div class="xmv-card" :class="computeCardClass">
        <div class="xmv-card__header" v-if="headerShow">
            <slot name="header"></slot>
        </div>
        <div class="xmv-card__body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent ,ref} from 'vue'
export default defineComponent({
    name:"",
    props:{
        shadow : {type:String ,default:'always'}
    },
    setup(props ,{slots}) {

        const headerShow = ref((slots.header != undefined))

        const computeCardClass = computed(()=>{
            return ['is-' + props.shadow + '-shadow']
        })

        return {computeCardClass ,headerShow}
    }
})
</script>

<style lang="" scoped></style>
