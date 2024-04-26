<template>
    <div class="xmv-checkbox-group">
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent ,computed ,watch ,reactive ,provide ,onMounted} from 'vue'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvCheckGroup",
    props:{
        modelValue : Array,
        max : Number
    },
    setup(props ,context) {

        let checkList = []

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)
        provide('EventBus' ,{$on ,$emit})

        const modelValueWatch = computed(()=>{
            return props.modelValue
        })

        watch(modelValueWatch ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            let list = val
            checkList = list
            $emit('setVal' ,list)
            handleMax()
        }

        $on('checkClick' ,(info)=>{
            if (info.status){
                checkList.push(info.label)
            }else{
                checkList = checkList.filter(tmp => {return tmp != info.label})
            }
            context.emit('update:modelValue' ,checkList)
            handleMax()
        })
        
        const handleMax = ()=>{
            if (props.max == undefined){
                return false
            }
            let length = checkList.length
            let flag = false
            if (length >= props.max){
                flag = true
            }
            $emit('setDisabled' ,flag)
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
