<template>
    <div class="xmv-collapse">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent, onMounted, watch ,provide ,reactive} from 'vue'
import {createEventBus} from 'utils/event'
export default defineComponent({
    name:"xmvCollapse",
    props:{
        modelValue : [String ,Array],
        accordion : String
    },
    setup(props ,context) {

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})
        provide('Accordion' ,props.accordion)

        const handleWatch = (newVal)=>{
            if (Array.isArray(newVal)){
                newVal.forEach(val =>{
                    $emit('setVal' ,val)
                })
            }else{
                $emit('setVal' ,newVal)
            }
            
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        onMounted(()=>{
            if (props.modelValue != undefined){
                handleWatch(props.modelValue)
            }
        })

        return {handleWatch}
    }
})
</script>

<style lang="" scoped></style>
