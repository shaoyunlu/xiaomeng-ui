<template>
    <xmv-popover :beStripped="true" @show="handlePopoverShow" @hide="handlePopoverHide">
        <template #trigger>
            <xmv-input class="xmv-date-editor xmv-date-editor--time" :style="style" :size="size" v-if="isRange == undefined"
            prefix-icon="clock" clearable ref="inputRef" @clear="handleClear"></xmv-input>

            <div v-else
                class="xmv-date-editor xmv-date-editor--daterange xmv-input__wrapper 
                        xmv-range-editor xmv-range-editor--default"
                :class="{'is-active' : isActive}"
                @click="handleTimeRangeMouseup"
                ref="daterangeRef">
                <xmv-icon name="clock" class="xmv-input__icon xmv-range__icon"></xmv-icon>
                <input type="text" class="xmv-range-input" ref="leftInputRef" placeholder="请输入">
                <span class="xmv-range-separator">到</span>
                <input type="text" class="xmv-range-input" ref="rightInputRef" placeholder="请输入">
                <xmv-icon name="circleClose" @click.stop="handleTimeRangeClose"
                class="xmv-input__icon xmv-range__close-icon"></xmv-icon>
            </div>
        </template>
    </xmv-popover>
    <div class="xmv-time-panel" :class="{'xmv-time-panel-range' : isRange != undefined}">
            <div class="cell">
                <xmv-time-panel @val="handleVal" :tMode="timePickerMode" ref="panelRef" pos="left"></xmv-time-panel>
            </div>
            <div class="cell">
                <xmv-time-panel v-if="isRange != undefined" 
                    @val="handleVal" ref="panleRightRef" :tMode="timePickerRightMode" pos="right"></xmv-time-panel>
            </div>
        <div class="xmv-time-panel__footer"></div>
    </div>
</template>

<script>
import {reactive, defineComponent, onMounted, provide ,ref, watch ,inject, toRaw} from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import TimePickerMode from './mode/timePicker'
import xmvTimePanel from './panel.vue'
import xmvTimeHour from './hour.vue'
import xmvTimeMinute from './minute.vue'
import xmvTimeSecond from './second.vue'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvTimePicker",
    props:{
        modelValue : String | Array,
        isRange : String,
        splitSymbol : {type : String ,default : ":"},
        size : String,
        style : String | Object,
        disabledHours : Array,
        disabledMinutes : Array,
        disabledSeconds : Array
    },
    components:{xmvTimePanel ,xmvTimeHour ,xmvTimeMinute ,xmvTimeSecond},
    setup(props ,context) {

        dayjs.extend(customParseFormat)

        const panelRef = ref(null)
        const panleRightRef = ref(null)
        const inputRef = ref(null)
        const leftInputRef = ref(null)
        const rightInputRef = ref(null)

        const timePickerMode = new TimePickerMode()
        const timePickerRightMode = new TimePickerMode()
        
        const XmvEventOn = inject('Xmv-Event-On')
        const isActive = ref(false)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)
        provide('EventBus' ,{$on ,$emit})
        provide('IsRange' ,props.isRange != undefined)

        XmvEventOn('mouseup' ,(e)=>{
            isActive.value = false
        })

        const handleClear = ()=>{
            context.emit('update:modelValue' ,'')
        }

        watch(()=>props.modelValue ,(newVal)=>{
            decomposeVal(newVal)
        })

        const decomposeVal = (val)=>{
            if (isEmpty(val)){
                return false
            }
            if (props.isRange != undefined){
                val[0] && panelRef.value.dispatchVal(val[0])
                val[1] && panleRightRef.value.dispatchVal(val[1])

                $emit('disabled' ,{flag : false})

                if ( (val[0] && !val[1]) || (!val[0] && val[1]) ){
                    let list1 = val[0].split(":")
                    let list2 = val[1].split(":")
                    $emit('range' ,{pos:'left' ,val : list1[0] ,type:'hour'})
                    $emit('range' ,{pos:'right' ,val : list2[0] ,type:'hour'})
                }else if(val[0] && val[1]){
                    let list1 = val[0].split(":")
                    let list2 = val[1].split(":")

                    $emit('range' ,{pos:'left' ,val : list1[0] ,type:'hour'})
                    $emit('range' ,{pos:'right' ,val : list2[0] ,type:'hour'})
                    if (list1[0] == list2[0]){
                        $emit('range' ,{pos:'left' ,val : list1[1] ,type:'minute'})
                        $emit('range' ,{pos:'right' ,val : list2[1] ,type:'minute'})
                        if ( list1[1] == list2[1] ){
                            $emit('range' ,{pos:'left' ,val : list1[2] ,type:'second'})
                            $emit('range' ,{pos:'right' ,val : list2[2] ,type:'second'})
                        }
                    }
                }
            }else{
                panelRef.value.dispatchVal(val)
            }
        }

        const handleVal = (info)=>{
            if (props.isRange != undefined){
                context.emit('update:modelValue' ,[
                    timePickerMode.inputEl.value,
                    timePickerRightMode.inputEl.value
                ])
            }else{
                context.emit('update:modelValue' ,info.value)
            }
        }

        const handlePopoverShow = ()=>{
            decomposeVal(props.modelValue)
        }

        const handlePopoverHide = ()=>{
            if (props.isRange != undefined){
                let leftVal = timePickerMode.inputEl.value
                let rightVal = timePickerRightMode.inputEl.value

                let leftFlag = dayjs(leftVal, 'HH:mm:ss', true).isValid()
                let rightFlag = dayjs(rightVal, 'HH:mm:ss', true).isValid()

                if (leftFlag || isEmpty(leftVal)){
                }else{
                    timePickerMode.inputEl.value = props.modelValue[0]?props.modelValue[0]:""
                }

                if (rightFlag || isEmpty(rightVal)){
                }else{
                    timePickerRightMode.inputEl.value = props.modelValue[1]?props.modelValue[1]:""
                }

                context.emit('update:modelValue' ,[
                    timePickerMode.inputEl.value,
                    timePickerRightMode.inputEl.value
                ])
            }else{
                let val = inputRef.value.getVal()
                let flag = dayjs(val, 'HH:mm:ss', true).isValid()
                if (flag || isEmpty(val)){
                    if (val != props.modelValue){
                        context.emit('update:modelValue' ,val)
                    }
                }else{
                    inputRef.value.val(props.modelValue)
                }
            }
        }

        const handleTimeRangeMouseup = ()=>{
            isActive.value = true
        }

        const handleTimeRangeClose = ()=>{
            leftInputRef.value.value = ''
            rightInputRef.value.value = ''
            $emit('disabled' ,{flag : false})
            context.emit('update:modelValue' ,[])
        }

        onMounted(()=>{
            if (props.isRange != undefined){
                timePickerMode.inputEl = leftInputRef.value
                timePickerRightMode.inputEl = rightInputRef.value
            }else{
                timePickerMode.inputEl = inputRef.value.inputRef
            }

            inputRef.value && inputRef.value.setInputWidth(1)
            decomposeVal(props.modelValue)

            $emit('setDisabledHour' ,props.disabledHours)
            $emit('setDisabledMinute' ,props.disabledMinutes)
            $emit('setDisabledSecond' ,props.disabledSeconds)
        })

        return {panelRef,panleRightRef,inputRef,timePickerMode,timePickerRightMode,isActive,
                leftInputRef ,rightInputRef ,
                handlePopoverShow ,handleClear ,handleVal ,
                handleTimeRangeMouseup ,handleTimeRangeClose ,handlePopoverHide}
    }
})
</script>

<style lang="" scoped></style>
