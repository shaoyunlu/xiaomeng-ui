<template>
    <xmv-time-scroll :list="list" @scrollNum="handleNum" ref="scrollRef" type="hour" :pos="pos"></xmv-time-scroll>
</template>

<script>
import {defineComponent ,inject ,onMounted,ref} from 'vue'
import xmvTimeScroll from './scroll.vue'
import {coverNum} from './utils'
export default defineComponent({
    name:"",
    emits:['val'],
    components:{xmvTimeScroll},
    props:{
        pos : String
    },
    setup(props ,context) {

        const {$on ,$emit} = inject('EventBus')
        const scrollRef = ref(null)

        const list = ref([])
        const __list = []
        for(let i=0;i<24;i++){
            __list.push({label : coverNum(i) ,value : i})
        }
        list.value = __list

        const hourRef = inject('Hour')

        const handleNum = (num)=>{
            hourRef.value = num
            context.emit('val' ,num)
        }

        const setVal = (val)=>{
            hourRef.value = val
            scrollRef.value.setActive({num:val ,needEmit : false})
        }

        $on('range' ,(info)=>{
            if (info.type == 'hour'){
                if (info.pos == 'left' && props.pos == 'right'){
                    let val = parseInt(info.val)
                    list.value.forEach(tmp =>{
                        tmp.isDisabled = (tmp.value < val)
                    })
                }else if(info.pos == 'right' && props.pos == 'left'){
                    let val = parseInt(info.val)
                    list.value.forEach(tmp =>{
                        tmp.isDisabled = (tmp.value > val)
                    })
                }
            }
        })

        $on('disabled' ,(info)=>{
            list.value.forEach(tmp =>{
                tmp.isDisabled = info.flag
            })
        })

        $on('setDisabledHour' ,(val)=>{
            if (!val){
                return false
            }
            list.value.forEach(tmp =>{
                tmp.isDisabled = val.includes(tmp.value)
            })
        })

        return {list ,handleNum ,setVal ,scrollRef}
    }
})
</script>

<style lang="" scoped></style>
