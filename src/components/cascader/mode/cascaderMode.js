import { reactive } from "vue"

class CascaderMode{
    constructor(){
        this.rctData = reactive({
            options : new Object(),
            menuComps : [],
        })
        this.selectedValue = []
        this.selectedLabel = []
    }

    init(){
        this.rctData.menuComps = []
        this.selected = []
        this.rctData.menuComps.push({list : this.rctData.options.children})
    }

}

export default CascaderMode