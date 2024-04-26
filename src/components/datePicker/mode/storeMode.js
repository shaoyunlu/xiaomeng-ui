class StoreMode{
    constructor(){
        this.leftDMode = null
        this.rightDMode = null
        this.dateObj = new Object()
        this.dateList = []
    }

    handleList(dateObj){
        if (this.dateList.length == 2){
            this.dateList = []
            this.dateList.push(dateObj)
        }else{
            this.dateList.push(dateObj)
        }
        
    }

}

export default StoreMode