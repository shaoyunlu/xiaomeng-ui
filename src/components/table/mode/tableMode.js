import {nextTick, reactive,ref} from 'vue'
import {resizeOB} from 'utils/event'
import {isEmpty,filter,find,deleteObjectFromArray ,
    addObjectAfter ,addObjectBefore ,exchangeObjectFromArray} from 'utils/data'

class TableMode{

    constructor(opt){
        this.rctData = reactive({
            header : [],
            data : [],
            tableWidth : ''
        })
        this.ctx
        this.tableBodyRef
        this.checkboxHeader
        this.option = opt
        this.automatic
        this.parentEl
        this.tableRef
        this.$on
        this.$emit
        this.hasChildren = ref(false)
        this.currentDragNode = null
        this.currentDropEnterNode = null
        this.tmpTableBoundInfo
    }

    init(){
        this.checkboxHeader = find(this.rctData.header ,(data)=>{
            return data.type == 'checkbox'
        })

        this.__setAutomatic()
        this.layout()
    }

    layout(){
        let self = this
        if (this.automatic){
            this.parentEl = this.tableRef.value.parentNode
            this.__handleAutomatic()
            resizeOB(self.parentEl ,()=>{
                self.__handleAutomatic()
            })
        }else{
            this.__handleFixed()
        }
    }

    checkAll(flag){
        this.rctData.data.forEach(data =>{
            data.checked = flag
        })
    }

    checkSingle(){
        let res = filter(this.rctData.data ,(data=>{
            return !data.checked
        }))
        this.checkboxHeader.checked = isEmpty(res)
    }

    insertData(index ,__data){
        this.rctData.data.splice(index ,0 ,__data)
    }

    deleteData(index){
        this.rctData.data.splice(index, 1)
    }

    createIndex(arr ,depth = 0 ,parentIndex = 0){
        let i = 0
        let j = 0
        arr.forEach(data=>{
            if (depth == 0){
                data.xmvIndex = i
                data.xmvSortIndex = j
            }else{
                data.xmvChildrenIndex = (parentIndex + "-" + j)
            }
            data.xmvDepth = depth
            // 展开的数据不算作xmvIndex 内
            if (!data.xmvExpandData){
                i++
            }
            j++
            if (!isEmpty(data.children)){
                this.createIndex(data.children ,depth + 1 ,data.xmvChildrenIndex?data.xmvChildrenIndex:(j-1))
            }
        })
    }

    __setAutomatic(){
        const header = this.rctData.header
        let flag = false
        header.forEach(tmp => {
            if (!tmp.width){
                tmp.automatic = true
                flag = true
            }
        })
        this.automatic = flag
    }

    __handleAutomatic(){
        // 根据父元素的宽度，重新分配各个col
        let parentNodeWidth = this.parentEl.clientWidth
        const header = this.rctData.header

        const hasWidthArray = header.filter(tmp=>{return !tmp.automatic})
        const noWidthArray = header.filter(tmp =>{return tmp.automatic})

        let hasWidthTotal = 0
        hasWidthArray.forEach(tmp =>{
            hasWidthTotal += parseInt(tmp.width)
        })

        let stillWidth = parentNodeWidth - hasWidthTotal
        let unitWidth = stillWidth/noWidthArray.length
        if (unitWidth <= 100){
            unitWidth = 100
        }

        noWidthArray.forEach(tmp => {
            tmp.width = unitWidth
        })

        this.__handleFixed()
    }

    __handleFixed(){
        const header = this.rctData.header
        let resWidth = 0
        header.forEach(tmp =>{
            let width
            if (tmp.width){
                width = parseInt(tmp.width)
            }
            resWidth += width
        })
        this.rctData.tableWidth = resWidth
    }

    beforeNode(){
        deleteObjectFromArray(null ,this.currentDragNode ,this.rctData.data)
        addObjectBefore(null ,this.currentDropEnterNode ,this.currentDragNode ,this.rctData.data)
    }

    afterNode(){
        deleteObjectFromArray(null ,this.currentDragNode ,this.rctData.data)
        addObjectAfter(null ,this.currentDropEnterNode ,this.currentDragNode ,this.rctData.data)
    }

    exchangeNode(){
        exchangeObjectFromArray(this.currentDropEnterNode ,this.currentDragNode ,this.rctData.data)
    }

}

export default TableMode