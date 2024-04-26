<template>

    <xmv-popover ref="popoverRef">
        <template #trigger>
            <div class="xmv-cascader">
                <xmv-input suffix-icon="arrowDown" ref="inputRef"></xmv-input>
            </div>
        </template>
        <div class="xmv-cascader-panel">
            <xmv-cascader-menu v-for="tmp,index in cascaderMode.rctData.menuComps" 
                :list="tmp.list" :index="index"></xmv-cascader-menu>
        </div>
    </xmv-popover> 
</template>

<script>
import {defineComponent, nextTick, onMounted, provide, watch ,reactive ,ref} from 'vue'
import xmvCascaderMenu from './cascaderMenu.vue'
import CascaderMode from './mode/cascaderMode'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvCascader",
    components:{xmvCascaderMenu},
    props:{
        options : Array,
        modelValue : String
    },
    setup(props ,context) {

        const cascaderMode = new CascaderMode()
        const popoverRef = ref(false)
        const inputRef = ref(false)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})

        provide('CascaderMode' ,cascaderMode)

        watch(()=>props.options ,(newVal)=>{
            cascaderMode.rctData.options = {children : props.options}
            nextTick(()=>{
                cascaderMode.init()
            })
        })

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            let list = val.split(',')
            list.forEach((tmp,i) =>{
                setTimeout(()=>{
                    $emit('setVal' ,{value:tmp,index:i})
                },10)
            })
        }

        $on('emitModelValue' ,()=>{
            popoverRef.value.hide()
            inputRef.value.val(cascaderMode.selectedLabel.join(' / '))
            context.emit('update:modelValue' ,cascaderMode.selectedValue.join(','))
        })

        onMounted(()=>{
            cascaderMode.rctData.options = {children : props.options}
            cascaderMode.init()
        })

        return {cascaderMode ,popoverRef ,inputRef}
    }
})
</script>

<style lang="" scoped></style>
