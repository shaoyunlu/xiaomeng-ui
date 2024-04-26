<template>
    <transition name="xmv-fade-in">
        <div class="xmv-alert xmv-alert--success is-light" :class="computeClass" v-if="isShow">
            <xmv-icon class="xmv-alert__icon" v-if="showIcon"
                      :class="{'is-big' : description != undefined}" 
                      :name="(type=='error'?'circleClose':type) + 'Filled'"></xmv-icon>
            <div class="xmv-alert__content">
                <span class="xmv-alert__title" :class="{'is-bold' : description != undefined}">
                    {{ title }}
                </span>
                <p class="xmv-alert__description" v-if="description != undefined">
                    {{ description }}
                </p>
                <xmv-icon name="close" class="xmv-alert__close-btn" @click="handleCloseClick" v-if="closable"></xmv-icon>
            </div>
        </div>
    </transition>
</template>

<script>
import {computed, defineComponent ,ref} from 'vue'
export default defineComponent({
    name:"xmvAlert",
    emits:['close'],
    props:{
        type : {type:String,default:'success'},
        effect : {type:String,default:'light'},
        title : String,
        description : String,
        showIcon : Boolean,
        center : Boolean,
        closable : {type:Boolean ,default:true}
    },
    setup(props ,context) {

        const isShow = ref(true)

        const computeClass = computed(()=>{
            let res = []
            res.push('xmv-alert--' + props.type)
            res.push('is-' + props.effect)
            if (props.center){
                res.push('is-center')
            }
            return res
        })

        const handleCloseClick = ()=>{
            isShow.value = false
            context.emit('close')
        }

        return {computeClass ,isShow ,handleCloseClick}
    }
})
</script>

<style lang="" scoped></style>
