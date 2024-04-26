<template>
    <div class="xmv-radio-group">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent, onMounted, provide ,reactive ,computed ,watch} from 'vue'
import {createEventBus} from 'utils/event'
import {generateId ,isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvRadioGroup",
    props:{
        size : String,
        disabled : String,
        modelValue : String
    },
    setup(props ,context) {
        
        const eventBus = reactive({
            listeners : {}
        })

        const id = generateId()

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})
        provide('Name' ,'xmv-' + id)

        $on('radioClick' ,(label)=>{
            context.emit('update:modelValue' ,label)
        })

        const modelValueWatch = computed(()=>{
            return props.modelValue
        })

        watch(modelValueWatch ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            $emit('setVal' ,val)
        }

        onMounted(()=>{
            if (!isEmpty(props.modelValue)){
                handleWatch(props.modelValue)
            }
        })

        return {}
    }
})
</script>

<style lang="" scoped></style>
