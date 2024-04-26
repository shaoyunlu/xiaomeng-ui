<template>
    <div class="xmv-picker-calendar">
        <div class="xmv-date-picker__time-header" v-if="dMode.withTime">
            <xmv-time-picker v-model="timeMode"></xmv-time-picker>
        </div>
        <div :class="computeHeaderClass">
            <span class="xmv-date-picker__prev-btn" >
                <button type="button" class="d-arrow-left xmv-picker-panel__icon-btn"
                    v-if="leftSideDButton"
                    @mouseup.stop="handleDArrowLeft">
                    <xmv-icon name="dArrowLeft"></xmv-icon>
                </button>
                <button type="button" class="xmv-picker-panel__icon-btn arrow-left"
                    v-if="leftSideButton"
                    @mouseup.stop="handleArrowLeft">
                    <xmv-icon name="arrowLeft"></xmv-icon>
                </button>
            </span>
            <span v-if="dMode.type.value == 'date' || dMode.type.value == 'month'"  class="xmv-date-picker__header-label">
                {{dMode.rctData.year}}
            </span>
            <span v-if="dMode.type.value == 'date'"  class="xmv-date-picker__header-label">
                {{dMode.rctData.month}}
            </span>
            <span class="xmv-date-picker__next-btn">
                <button type="button" class="xmv-picker-panel__icon-btn arrow-right"
                        v-if="rightSideButton"
                        @mouseup.stop="handleArrowRight">
                    <xmv-icon name="arrowRight"></xmv-icon>
                </button>
                <button type="button" class="xmv-picker-panel__icon-btn d-arrow-right"
                    v-if="rightSideDButton"
                    @mouseup.stop="handleDArrowRight">
                    <xmv-icon name="dArrowRight"></xmv-icon>
                </button>
            </span>
            <div v-if="dMode.type.value == 'daterange'">{{dMode.rctData.year}} {{dMode.rctData.month}}</div>
            <div v-if="dMode.type.value == 'monthrange'">{{dMode.rctData.year}}</div>
        </div>
        <div class="xmv-picker-panel__content">
            <table class="xmv-date-table" v-if="dMode.type.value == 'date' || dMode.type.value == 'daterange'">
                <tbody>
                    <tr>
                        <th v-for="tmp in dMode.weekHeader">{{tmp}}</th>
                    </tr>
                    <tr class="xmv-date-table__row" v-for="rowList in dMode.rctData.dayList">
                        <xmv-calendar-td v-for="tmp in rowList" :data="tmp" :dMode="dMode"></xmv-calendar-td>
                    </tr>
                </tbody>
            </table>
            <table class="xmv-month-table" v-if="dMode.type.value == 'month' || dMode.type.value == 'monthrange'">
                <tbody>
                    <tr v-for="rowList in dMode.rctData.dayList">
                        <xmv-calendar-td v-for="tmp in rowList" :data="tmp" :dMode="dMode"></xmv-calendar-td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import {computed, defineComponent, inject ,nextTick,onMounted,provide,reactive ,ref, watch} from 'vue'
import xmvCalendarTd from './calendarTd.vue'
import {createEventBus} from 'utils/event'
export default defineComponent({
    name:"",
    props:{
        dMode : Object
    },
    components:{xmvCalendarTd},
    setup({dMode} ,context) {
        const timeMode = ref('00:00:00')
        const storeMode = inject('StoreMode')
        const leftSideDButton = ref(true)
        const leftSideButton = ref(true)
        const rightSideButton = ref(true)
        const rightSideDButton = ref(true)

        const {$on : aOn ,$emit : aEmit} = inject('EventBus')

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)
        provide('CalendarEventBus' ,{$on ,$emit})

        const handleDArrowLeft = ()=>{
            dMode.dateObj = dMode.dateObj.subtract(1,'year')
            dMode.initMode()
            $emit('change')
            aEmit('change')
        }

        const handleArrowLeft = ()=>{
            dMode.dateObj = dMode.dateObj.subtract(1,'month')
            dMode.initMode()
            $emit('change')
            aEmit('change')
        }

        const handleDArrowRight = ()=>{
            dMode.dateObj = dMode.dateObj.add(1,'year')
            dMode.initMode()
            $emit('change')
            aEmit('change')
        }

        const handleArrowRight = ()=>{
            dMode.dateObj = dMode.dateObj.add(1,'month')
            dMode.initMode()
            $emit('change')
            aEmit('change')
        }

        aOn('change' ,()=>{
            judgeButtonShow()
        })

        const judgeButtonShow = ()=>{
            if (dMode.type.value == 'date'){
                return false
            }

            if (dMode.type.value == 'month'){
                leftSideButton.value = false
                rightSideButton.value = false
                return false
            }

            let leftMode = storeMode.leftDMode
            let rightMode = storeMode.rightDMode
            let differMonth = rightMode.dateObj.diff(leftMode.dateObj, 'month')
            let differYear = rightMode.dateObj.diff(leftMode.dateObj, 'year')
            if (differMonth > 1)
            {
                leftSideButton.value = true
                rightSideButton.value = true
            }
            else{
                if (dMode.pos == 'left'){
                    leftSideButton.value = true
                    rightSideButton.value = false
                }else{
                    leftSideButton.value = false
                    rightSideButton.value = true
                }
            }
            if (differYear > 0)
            {
                leftSideDButton.value = true
                rightSideDButton.value = true
            }
            else{
                if (dMode.pos == 'left'){
                    leftSideDButton.value = true
                    rightSideDButton.value = false
                }else{
                    leftSideDButton.value = false
                    rightSideDButton.value = true
                }
            }

            if (dMode.type.value == 'monthrange'){
                
                leftSideButton.value = false
                rightSideButton.value = false
            }
        }

        const computeHeaderClass = computed(()=>{
            let res = []

            if (dMode.type.value == 'daterange' || dMode.type.value == 'monthrange'){
                res.push('xmv-date-range-picker__header')
            }else if (dMode.type.value == 'date' || dMode.type.value == 'month'){
                res.push('xmv-date-picker__header')
            }

            return res
        })

        watch(timeMode ,(newVal)=>{
            dMode.setInput()
        })

        onMounted(()=>{
            dMode.timeModel = timeMode
        })

        return {handleDArrowLeft ,handleArrowLeft ,
                handleDArrowRight ,handleArrowRight ,judgeButtonShow,
                computeHeaderClass ,leftSideButton ,rightSideButton,
                leftSideDButton ,rightSideDButton ,timeMode}
    }
})
</script>

<style lang="" scoped></style>
