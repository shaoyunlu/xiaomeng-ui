import { reactive, ref, watch } from "vue"

class TabsMode{
    constructor(options){
        this.rctData = reactive({
            itemList : []
        })
        this.ctx
        this.$on
        this.$emit
        this.$remove
        this.tabPosition = options.tabPosition
        this.editable = options.editable
        this.barRef = ref(null)
        this.tabsNavRef = ref(null)
        this.tabsNavScrollRef = ref(null)
        this.tabsNavScrollX = ref(0)
        this.isScrollable = ref(false)
        this.barTranslateX = ref(0)
        this.barTranslateY = ref(0)
        this.barWidth = ref(0)
        this.barHeight = ref(0)
        this.currentOffsetLeft = 0
    }

    remove(data){

        let cIndex
        this.rctData.itemList.forEach((node,i)=>{
            if (node.name == data.name){
                cIndex = i
            }
        })

        this.rctData.itemList = this.rctData.itemList.filter(node=>{
            return node.name != data.name
        })

        if (data.isActive){
            if (cIndex >= this.rctData.itemList.length){
                cIndex = this.rctData.itemList.length - 1
            }
            let cData = this.rctData.itemList[cIndex]
            this.$emit('itemClick',cData.name)
        }

    }
}

export default TabsMode