import { computed, nextTick, reactive, ref } from "vue";

class SelectMode{
    constructor(props){
        this.rctData = reactive({
            options : [],
            sData : [],
            dropdownWidth : 0
        })
        this.selectRef = ref(null)
        this.isFocus = ref(false)
        this.inputRef = ref(null)
        this.popoverRef = ref(null)
        this.treeRef = ref(null)
        this.isEmpty = ref(false)
        this.tagsRef
        this.type = props.type
        this.multiple = ref(props.multiple)
        this.collapseTags = ref(props.collapseTags)
        this.filterable = ref(props.filterable)
        this.disabled = computed(()=>props.disabled)
        this.optionsVersion = ref(0)
    }

    registerOption(option){
        if (this.rctData.options.indexOf(option) != -1){
            return
        }
        this.rctData.options.push(option)
        this.notifyOptionsChange()
    }

    updateOption(){
        this.notifyOptionsChange()
    }

    unregisterOption(option){
        let optionIndex = this.rctData.options.indexOf(option)
        if (optionIndex != -1){
            this.rctData.options.splice(optionIndex ,1)
        }

        let selectedIndex = this.rctData.sData.indexOf(option)
        if (selectedIndex != -1){
            this.rctData.sData.splice(selectedIndex ,1)
        }
        this.notifyOptionsChange()
    }

    notifyOptionsChange(){
        this.optionsVersion.value++
    }

    adjustWH(){
        // 调整input的高度
        let ht = this.tagsRef.value.clientHeight
        this.inputRef.value.inputRef.style.height = ht +'px'
        // 调整popover的位置
        //this.popoverRef.value.setPosition()
    }

    getSelectedValList(){
        let res = []
        this.rctData.sData.forEach(tmp =>{
            res.push(tmp.value)
        })
        return res
    }

    filter(label){
        if (this.type == 'select'){
            let flag = true
            this.rctData.options.forEach(option =>{
                option.hide = (!option.label.includes(label))
                if (!option.hide){
                    flag = false
                }
            })
            this.isEmpty.value = flag
        }
        else{
            this.treeRef.value.filter(label)
        }
        
        nextTick(()=>{
            //this.popoverRef.value.setPosition()
        })
        
    }

    showAll(){
        this.rctData.options.forEach(option =>{
            option.hide = false
        })
    }
}

export default SelectMode
