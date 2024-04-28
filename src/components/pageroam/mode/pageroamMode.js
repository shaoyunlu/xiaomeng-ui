import {ref,reactive} from 'vue'

class PageroamMode {
    constructor(){
        this.rctData = reactive({
            list : []
        })
        this.contentElRef
        this.topValue
    }
}

export default PageroamMode