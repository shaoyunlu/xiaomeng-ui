<template>
    <div class="xmv-layout">
        <div class="xmv-layout-main" :class="[mode == 'l_tr' ? 'row' : 'column']">
            <div :class="[mode == 'l_tr' ? 'xmv-layout-left' : 'xmv-layout-top']" 
                 :style="lOrTop1Style">
                <slot :name="lOrTop1SlotName"></slot>
            </div>
            <div class="xmv-layout-content" :class="[mode == 'l_tr' ? 'column' : 'row']">
                <div :class="[mode == 'l_tr' ? 'xmv-layout-top' : 'xmv-layout-left']" 
                 :style="lOrTop2Style">
                    <slot :name="lOrTop2SlotName"></slot>
                </div>
                <div class="xmv-layout-right">
                    <slot name="right"></slot>
                </div>
            </div>
        </div>
        <div class="xmv-layout-foot" :style="computeFootStyle">
            <slot name="foot"></slot>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent,reactive,ref} from 'vue'
export default defineComponent({
    name:"xmvLayout",
    props:{
        mode : {
            type : String,
            default : 't_lr' //  l_tr  t_lr
        },
        headHval : {
            type : String,
            default : '100px'
        },
        footHval : {
            type : String,
            default : 'auto'
        },
        lWval : {
            type : String,
            default : '100px'
        },
        responsive : false
    },
    setup(props ,context) {

        const lOrTop1Style = reactive({})
        const lOrTop2Style = reactive({})
        const lOrTop1SlotName = ref('')
        const lOrTop2SlotName = ref('')

        if (props.mode == 'l_tr'){
            lOrTop1Style.width = props.lWval
            lOrTop2Style.height = props.headHval
            lOrTop1SlotName.value = 'left'
            lOrTop2SlotName.value = 'top'
        }else{
            lOrTop2Style.width = props.lWval
            lOrTop1Style.height = props.headHval
            lOrTop1SlotName.value = 'top'
            lOrTop2SlotName.value = 'left'
        }

        const computeFootStyle = computed(()=>{
            return {height : props.footHval}
        })

        return {
            lOrTop1Style,lOrTop2Style,lOrTop1SlotName,lOrTop2SlotName,computeFootStyle
        }
    }
})
</script>

<style lang="" scoped></style>