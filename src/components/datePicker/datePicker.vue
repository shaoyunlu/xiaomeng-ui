<template>
    <xmv-popover placement="bottom" :ref="datePickerMode.popoverRef">
        <template #trigger>
            <xmv-input class="xmv-date-editor xmv-date-editor xmv-date-editor--date" :size="size"
                v-if="type != 'daterange' && type != 'monthrange'" :style="style"
                prefix-icon="calendar" clearable  ref="inputRef" @clear="handleDateClear"></xmv-input>
            <div v-if="type == 'daterange' || type == 'monthrange'" 
                class="xmv-date-editor xmv-date-editor--daterange xmv-input__wrapper 
                        xmv-range-editor xmv-range-editor--default"
                :class="{'is-active' : isActive ,'xmv-date-time-range-picker':withTime != undefined}"
                @click="handleDateRangeMouseup"
                ref="daterangeRef">
                <xmv-icon name="calendar" class="xmv-input__icon xmv-range__icon"></xmv-icon>
                <input type="text" class="xmv-range-input" ref="leftInputRef">
                <span class="xmv-range-separator">到</span>
                <input type="text" class="xmv-range-input" ref="rightInputRef">
                <xmv-icon name="circleClose" @click.stop="handleDateRangeClose"
                class="xmv-input__icon xmv-range__close-icon"></xmv-icon>
            </div>
        </template>
    </xmv-popover>
    <div class="xmv-picker-panel" :class="computePanelClass">
        <div class="xmv-picker-panel__body-wrapper">
            <div class="xmv-picker-panel__body">
                <xmv-calendar :dMode="datePickerMode"></xmv-calendar>
                <xmv-calendar v-if="type == 'daterange' || type == 'monthrange'" :dMode="datePickerRightMode"></xmv-calendar>
            </div>
        </div>
        <div class="xmv-picker-panel__footer"></div>
    </div>
</template>

<script>
import {computed, defineComponent, onMounted, provide ,reactive ,ref ,inject,watch, nextTick} from 'vue'
import DatePickerMode from './mode/datePickerMode'
import StoreMode from './mode/storeMode'
import xmvCalendar from './calendar.vue'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
import dayjs from 'dayjs'
export default defineComponent({
    name:"xmvDatePicker",
    components:{xmvCalendar},
    props:{
        type : {type:String,default:'date'}, //daterange
        format : {type:String,default:'YYYY-MM-DD'},
        modelValue : String | Array,
        withTime : String,
        size : String,
        style : String | Object
    },
    setup(props ,context) {
        const storeMode = new StoreMode()
        const datePickerMode = new DatePickerMode(props)
        const datePickerRightMode = new DatePickerMode(props)
        datePickerRightMode.dateObj = datePickerRightMode.dateObj.add(1 ,'month')
        datePickerRightMode.initMode()
        datePickerRightMode.pos = 'right'
        storeMode.leftDMode = datePickerMode
        storeMode.rightDMode = datePickerRightMode
        datePickerMode.storeMode = storeMode
        datePickerRightMode.storeMode = storeMode
        const inputRef = ref(null)
        const leftInputRef = ref(null)
        const rightInputRef = ref(null)
        const daterangeRef = ref(null)
        const isActive = ref(false)

        const XmvEventOn = inject('Xmv-Event-On')

        XmvEventOn('mouseup' ,(e)=>{
            isActive.value = false
        })

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('DatePickerMode' ,datePickerMode)
        provide('DatePickerRightMode' ,datePickerRightMode)
        provide('StoreMode' ,storeMode)
        provide('EventBus' ,{$on ,$emit})

        const computePanelClass = computed(()=>{
            let res = []
            if (datePickerMode.type.value == 'date' || datePickerMode.type.value == 'month'){
                res.push('xmv-date-picker')
            }else if(datePickerMode.type.value == 'daterange' || datePickerMode.type.value == 'monthrange'){
                res.push('xmv-date-range-picker')
            }
            return res
        })

        $on('tdClick' ,(data)=>{
            if (datePickerMode.type.value == 'date' || datePickerMode.type.value == 'month')
            {
                context.emit('update:modelValue' ,datePickerMode.getVal())
                datePickerMode.popoverRef.value.hide()
            }
            else if (datePickerMode.type.value == 'daterange' || datePickerMode.type.value == 'monthrange')
            {
                if (storeMode.dateList.length != 2){
                    return false
                }
                
                let dateList = storeMode.dateList.sort((a, b) => {
                    if (a.isBefore(b)) {
                        return -1;
                    } else if (a.isAfter(b)) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                storeMode.dateObj.left = dateList[0]
                storeMode.dateObj.right = dateList[1]
                context.emit('update:modelValue' ,[datePickerMode.getVal() ,datePickerRightMode.getVal()])
                datePickerMode.popoverRef.value.hide()
            }
        })

        const handleDateRangeMouseup = ()=>{
            isActive.value = true
        }

        const handleDateRangeClose = ()=>{
            leftInputRef.value.value = ''
            rightInputRef.value.value = ''
            storeMode.dateList = []
            // 取消current
            $emit('removeCurrent')
            context.emit('update:modelValue' ,[])
        }

        const handleDateClear = ()=>{
            inputRef.value.val('')
            storeMode.dateObj['left'] = new Object()
            // 取消current
            $emit('removeCurrent')
            context.emit('update:modelValue' ,'')
        }

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            if (isEmpty(val)){
                return false
            }
            if (props.type == 'date' || props.type == 'month')
            {
                datePickerMode.setMode(val)
                storeMode.dateObj.left = dayjs(val)
                datePickerMode.setInput()
            }
            else if (props.type == 'daterange')
            {
                storeMode.dateObj.left = dayjs(val[0])
                storeMode.dateObj.right = dayjs(val[1])
                storeMode.handleList(dayjs(val[0]))
                storeMode.handleList(dayjs(val[1]))
                // 如果两个月份是同月的话
                if (storeMode.dateObj.left.diff(storeMode.dateObj.right ,'month') == 0){
                    datePickerMode.setMode(val[0])
                    datePickerRightMode.setMode(storeMode.dateObj.left.add(1 ,'month').format(datePickerMode.format))
                }else{
                    datePickerMode.setMode(val[0])
                    datePickerRightMode.setMode(val[1])
                }
                datePickerMode.setInput()
                datePickerRightMode.setInput()
            }
            else if (props.type == 'monthrange')
            {
                storeMode.dateObj.left = dayjs(val[0])
                storeMode.dateObj.right = dayjs(val[1])
                storeMode.handleList(dayjs(val[0]))
                storeMode.handleList(dayjs(val[1]))
                datePickerMode.setMode(val[0])
                datePickerRightMode.setMode(val[1])
                datePickerMode.setInput()
                datePickerRightMode.setInput()
            }
            
            $emit('change')
        }

        onMounted(()=>{
            if (props.type == 'date' || props.type == 'month'){
                inputRef.value.setInputWidth(1)
                datePickerMode.inputRef = inputRef
                datePickerMode.inputEl = inputRef.value.inputRef
            } else if(props.type == 'daterange' || props.type == 'monthrange'){
                datePickerMode.inputEl = leftInputRef.value
                datePickerRightMode.inputEl = rightInputRef.value
            }
            if (!isEmpty(props.modelValue)){
               handleWatch(props.modelValue)
            }
            $emit('change')
        })

        return {datePickerMode ,datePickerRightMode ,computePanelClass ,
                inputRef,leftInputRef,rightInputRef,daterangeRef,isActive,
                handleDateRangeMouseup,handleDateRangeClose,handleDateClear}
    }
})
</script>

<style lang="" scoped></style>
