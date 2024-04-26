import { reactive ,ref} from "vue"
import dayjs from 'dayjs'

class DatePickerMode{
    constructor(props){
        this.dateObj = dayjs()
        this.rctData = reactive({
            dayList : [],
            year : '',
            month : '',
            dateObj : dayjs()
        })
        this.weekHeader = ['一','二','三','四','五','六','日']

        this.inputRef
        this.inputEl
        this.pos = 'left'
        this.format = 'YYYY-MM-DD'

        this.storeMode

        this.timeModel

        this.todayObj = dayjs()
        this.type = ref(props.type)
        this.withTime = (props.withTime != undefined)
        this.popoverRef = ref(null)

        this.initMode()
    }

    initMode(){
        switch (this.type.value) {
            case 'date':
                this.format = 'YYYY-MM-DD'
                this.initDayMode()
                break;
            case 'daterange':
                this.format = 'YYYY-MM-DD'
                this.initDayMode()
                break;
            case 'month':
                this.format = 'YYYY-MM'
                this.initMonthMode()
                break;
            case 'monthrange':
                this.format = 'YYYY-MM'
                this.initMonthMode()
                break;
            default:
                break;
        }
    }

    setMode(dateStr){
        switch (this.type.value) {
            case 'date':
                this.setDayMode(dateStr)
                break;
            case 'daterange':
                this.setDayMode(dateStr)
                break;
            case 'month':
                this.setMonthMode(dateStr)
            case 'monthrange':
                this.setMonthMode(dateStr)
            default:
                break;
        }
    }

    setDayMode(dateStr){
        this.dateObj = dayjs(dateStr)
        this.initDayMode()
    }

    setMonthMode(dateStr){
        this.dateObj = dayjs(dateStr)
        this.initMonthMode()
    }

    initDayMode(){
        let dateObj = this.dateObj
        this.rctData.year = dateObj.format('YYYY')
        this.rctData.month = dateObj.format('MM') + '月'
        this.rctData.dayList = []
        // 游标
        let cursor = 0
        // 这个月有多少天
        let totalDays = dateObj.daysInMonth()
        // 本月一号是礼拜几
        let firstDay = dateObj.startOf('month').day()
        firstDay = firstDay == 0 ? 7 : firstDay
        cursor = 8-firstDay
        // 有fistDay-1天是上个月的
        let lastMonthDays = firstDay - 1
        let dayList_1 = []
        let lastMonthLastDay = dateObj.subtract(1, 'month').endOf('month')
        let currentMonthLastDay = dateObj.endOf('month')
        for(let i=lastMonthDays-1;i>=0;i--){
            let __dataObj = lastMonthLastDay.subtract(i ,'day')
            let dayStr = __dataObj.format('DD')
            dayList_1.push({value:dayStr ,prevMonth:true ,pos:this.pos})
        }
        for(let i=1;i<=(cursor);i++){
            dayList_1.push({value:i ,available:true ,pos:this.pos})
        }
        this.rctData.dayList.push(dayList_1)

        let dayList_2 = []
        for(let i=1;i<=7;i++){
            cursor++
            dayList_2.push({value:cursor,available:true ,pos:this.pos})
        }
        this.rctData.dayList.push(dayList_2)

        let dayList_3 = []
        for(let i=1;i<=7;i++){
            cursor++
            dayList_3.push({value:cursor,available:true ,pos:this.pos})
        }
        this.rctData.dayList.push(dayList_3)

        let dayList_4 = []
        for(let i=1;i<=7;i++){
            cursor++
            dayList_4.push({value:cursor,available:true ,pos:this.pos})
        }
        this.rctData.dayList.push(dayList_4)

        let dayList_5 = []
        for (let i=1;i<=7;i++){
            cursor++
            if (cursor <= totalDays){
                dayList_5.push({
                    value:cursor,
                    available:true ,
                    pos:this.pos})
            }else{
                dayList_5.push({
                    value:currentMonthLastDay.add(cursor-totalDays ,'day').format('D'),
                    nextMonth:true,
                    pos:this.pos
                })
            }
        }
        this.rctData.dayList.push(dayList_5)

        let dayList_6 = []
        for (let i=1;i<=7;i++){
            cursor++
            if (cursor <= totalDays){
                dayList_6.push({
                    value:cursor,
                    available:true,
                    pos:this.pos})
            }else{
                dayList_6.push({
                    value:currentMonthLastDay.add(cursor-totalDays ,'day').format('D'),
                    nextMonth:true,
                    pos:this.pos
                })
            }
        }
        this.rctData.dayList.push(dayList_6)
    }
    
    initMonthMode(){
        let dateObj = this.dateObj
        this.rctData.year = dateObj.format('YYYY')
        this.rctData.month = dateObj.format('MM') + '月'
        this.rctData.dayList = []
        this.rctData.dayList.push([
            {value : '一月' ,num : 0},{value : '二月' ,num : 1},{value : '三月' ,num : 2},{value : '四月' ,num : 3}
        ])
        this.rctData.dayList.push([
            {value : '五月' ,num : 4},{value : '六月' ,num : 5},{value : '七月' ,num : 6},{value : '八月' ,num : 7}
        ])
        this.rctData.dayList.push([
            {value : '九月' ,num : 8},{value : '十月' ,num :9},{value : '十一月' ,num : 10},{value : '十二月' ,num : 11}
        ])
    }

    initYearMode(){

    }

    getVal(){
        let res = ''
        let dateObj = (this.pos == 'left' ? this.storeMode.dateObj.left : this.storeMode.dateObj.right)
        if (dateObj){
            res = dateObj.format(this.format) 
                            + (this.withTime?" " + this.timeModel.value:'' )
        }
        return res
    }

    setInput(){
        let dateObj = (this.pos == 'left' ? this.storeMode.dateObj.left : this.storeMode.dateObj.right)
        if (dateObj){
            this.inputEl.value = dateObj.format(this.format) 
                            + (this.withTime?" " + this.timeModel.value:'' )
        }
        if (this.inputRef){
            this.inputRef.value.handleInputInput()
        }
        
    }

}

export default DatePickerMode