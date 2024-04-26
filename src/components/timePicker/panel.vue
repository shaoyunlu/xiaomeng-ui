<template>
    <div class="xmv-time-panel__content has-seconds">
        <div class="xmv-time-spinner has-seconds">
            <xmv-time-hour @val="handleVal" ref="timeHourRef" :pos="pos"></xmv-time-hour>
            <xmv-time-minute @val="handleVal" ref="timeMinuteRef" :pos="pos"></xmv-time-minute>
            <xmv-time-second @val="handleVal" ref="timeSecondRef" :pos="pos"></xmv-time-second>
        </div>
    </div>
</template>

<script>
import {defineComponent ,ref ,provide, inject} from 'vue'
import xmvTimeHour from './hour.vue'
import xmvTimeMinute from './minute.vue'
import xmvTimeSecond from './second.vue'
import {coverNum} from './utils'
export default defineComponent({
    name:"",
    emits:['val'],
    props:{
        tMode : Object,
        pos : String
    },
    components:{xmvTimeHour ,xmvTimeMinute ,xmvTimeSecond},
    setup({tMode ,pos} ,context) {

        const {$on ,$emit} = inject('EventBus')

        const timeHourRef = ref(null)
        const timeMinuteRef = ref(null)
        const timeSecondRef = ref(null)

        const hourRef = ref('0')
        const minuteRef = ref('0')
        const secondRef = ref('0')

        provide('Hour' ,hourRef)
        provide('Minute' ,minuteRef)
        provide('Second' ,secondRef)

        const handleVal = ()=>{
            let res = coverNum(hourRef.value) + ":" 
                    + coverNum(minuteRef.value) + ":" 
                    + coverNum(secondRef.value)
            tMode.inputEl.value = res
            context.emit('val' ,{pos:pos ,value:res})
        }

        const dispatchVal = (val)=>{
            let list = val.split(':')
            timeHourRef.value.setVal(list[0])
            timeMinuteRef.value.setVal(list[1])
            timeSecondRef.value.setVal(list[2])

            tMode.inputEl.value = val
        }

        return {timeHourRef ,timeMinuteRef ,timeSecondRef ,
                handleVal ,dispatchVal}
    }
})
</script>

<style lang="" scoped></style>
