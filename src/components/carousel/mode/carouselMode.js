import {nextTick, reactive } from "vue"
import {addStyle ,removeStyle ,addClass ,removeClass} from 'utils/dom'

class CarouselMode{

    constructor({wrapperRef,indicatorUlRef,type,direction}){
        this.rctData = reactive({
            itemList : [],
        })
        this.type = type
        this.clientWidth
        this.clientHeight
        this.itemLength
        this.indexArray
        this.wrapperRef = wrapperRef
        this.indicatorUlRef = indicatorUlRef
        this.direction = direction
        this.translateStr = (this.direction == 'vertical' ? 'translateY' : 'translateX')
        this.currentAnimateIndex = 0
        this.position = 'right'
        this.interval
        this.cache = []
        this.isExcute = false
    }

    reset(){
        this.startIndex = 0
        this.itemLength = this.rctData.itemList.length
        this.clientWidth = this.wrapperRef.value.clientWidth
        this.clientHeight = this.wrapperRef.value.clientHeight
        this.beforeAnimate()
        nextTick(()=>{
            this.setActiveClass(0)
        })
        
    }

    beforeAnimate(){
        if (this.type == 'card'){
            this.__beforeCardAnimate()
        }else{
            this.__beforeAnimate()
        }
    }

    __beforeAnimate(){  
        let pom = (this.position == 'right' ? '' : '-')
        let wrapperVal = (this.direction == 'vertical' ? this.clientHeight : this.clientWidth)
        this.indexArray = shiftArray(this.itemLength ,this.currentAnimateIndex ,this.position)
        this.rctData.itemList.forEach((instance ,i)=>{
            let itemEl = instance.proxy.itemRef
            addStyle(itemEl ,'transform' ,`${this.translateStr}(${pom + wrapperVal*this.indexArray.indexOf(i)}px)`)
        })
    }

    __beforeCardAnimate(){
        this.indexArray = shiftArray(this.itemLength ,this.currentAnimateIndex ,this.position)
        let length = this.rctData.itemList.length

        this.__beCenter(this.rctData.itemList[0].proxy.itemRef)
        this.__nearRight(this.rctData.itemList[1].proxy.itemRef)
        this.__nearLeft(this.rctData.itemList[length-1].proxy.itemRef)

        this.rctData.itemList.forEach((instance ,i)=>{
            let itemEl = instance.proxy.itemRef
            if (i != this.indexArray[0] && i !=this.indexArray[1] && i!= (this.indexArray[length-1])){
                this.__nearRightOut(itemEl)
            }
        })
    }

    animateOnce(){
        if (this.type == 'card'){
            this.__animateCardOnce()
        }else{
            this.__animateOnce()
        }

        if (this.position == 'right')
        {
            this.currentAnimateIndex ++
            if (this.currentAnimateIndex == this.itemLength)
                this.currentAnimateIndex = 0
        }
        else
        {
            this.currentAnimateIndex --
            if (this.currentAnimateIndex == -1)
                this.currentAnimateIndex = this.itemLength - 1
        }
        this.setActiveClass(this.currentAnimateIndex)
        setTimeout(()=>{
            this.afterAnimate()
        } ,450)

    }

    __animateOnce(){
        let pom = (this.position == 'right' ? '-' : '')
        let wrapperVal = (this.direction == 'vertical' ? this.clientHeight : this.clientWidth)
        this.rctData.itemList.forEach((instance ,i) =>{
            let itemEl = instance.proxy.itemRef
            if (i == this.indexArray[0] || i == this.indexArray[1]){
                addClass(itemEl ,'is-animating')
            }else{
                removeClass(itemEl ,'is-animating')
            }
        })

        this.rctData.itemList.forEach((instance ,i) =>{
            let itemEl = instance.proxy.itemRef
            if (i == this.indexArray[0]){
                addStyle(itemEl ,'transform' ,`${this.translateStr}(${pom + wrapperVal}px)`)
            }
            if (i == this.indexArray[1]){
                addStyle(itemEl ,'transform' ,`${this.translateStr}(0px)`)
            }
        })
        
    }

    __animateCardOnce(){
        this.rctData.itemList.forEach((instance ,i) =>{
            let itemEl = instance.proxy.itemRef
            if (this.position == 'right'){
                if (i == this.indexArray[0]){  
                    removeClass(itemEl ,'is-active')
                    this.__nearLeft(itemEl)
                }
                if (i == this.indexArray[1]){
                    addClass(itemEl ,'is-active')
                    this.__beCenter(itemEl)
                }
                if (i == this.indexArray[this.itemLength - 1]){
                    removeClass(itemEl ,'is-active')
                    this.__nearLeftOut(itemEl)
                }
                if (i == this.indexArray[2]){
                    removeClass(itemEl ,'is-active')
                    this.__nearRight(itemEl)
                }
            }else{
                if (i == this.indexArray[0]){
                    removeClass(itemEl ,'is-active')
                    this.__nearRight(itemEl)
                }
                if (i == this.indexArray[1]){
                    addClass(itemEl ,'is-active')
                    this.__beCenter(itemEl)
                }
                if (i == this.indexArray[2]){
                    removeClass(itemEl ,'is-active')
                    this.__nearLeft(itemEl)
                }
                if (i == this.indexArray[this.itemLength - 1]){
                    removeClass(itemEl ,'is-active')
                    this.__nearRightOut(itemEl)
                }
            }
            
        })
    }

    afterAnimate(){
        this.rctData.itemList.forEach((instance ,i) =>{
            let itemEl = instance.proxy.itemRef
            removeClass(itemEl ,'is-animating')
        })
    }

    run(){
        this.beforeAnimate()
        setTimeout(()=>{
            this.animateOnce()
        },10)
    }

    animate(){
        clearInterval(this.interval)
        this.interval = setInterval(()=>{
            this.position = 'right'
            this.run()
        } ,5000)
    }

    excuteCache(){
        if (this.cache[0]){
            this.position = this.cache[0]
            this.run()
        }
    
        setTimeout(()=>{
            this.cache.shift()
            if (this.cache[0] != undefined){
                this.excuteCache()
            }else{
                // 缓存已播放完毕
                this.isExcute = false
            }
        } ,500)
    }

    stop(){
        this.cache = []
        this.isExcute = false
        clearInterval(this.interval)
    }

    left(){
        this.cache.push('left')
        if (!this.isExcute){
            this.isExcute = true
            this.excuteCache()
        }
    }

    right(){
        this.cache.push('right')
        if (!this.isExcute){
            this.isExcute = true
            this.excuteCache()
        }
    }

    setActiveClass(index){
        if (!this.indicatorUlRef.value){
            return false
        }
        var liList = this.indicatorUlRef.value.querySelectorAll("li")
        liList.forEach(function(li) {
            removeClass(li ,'is-active')
        });
        addClass(liList[index],'is-active')
    }

    goTo(page){
        if (this.type == 'card'){
            this.__cardGoTo(page)
        }
        else{
            this.__goTo(page)
        }
    }

    __goTo(page){
        this.currentAnimateIndex = page
        let pom = (this.position == 'right' ? '' : '-')
        let wrapperVal = (this.direction == 'vertical' ? this.clientHeight : this.clientWidth)
        this.indexArray = shiftArray(this.itemLength ,this.currentAnimateIndex ,this.position)
        this.rctData.itemList.forEach((instance ,i)=>{
            let itemEl = instance.proxy.itemRef
            addStyle(itemEl ,'transform' ,`${this.translateStr}(${pom + wrapperVal*(this.indexArray.indexOf(i)+1)}px)`)
        })

        setTimeout(()=>{
            this.rctData.itemList.forEach((instance ,i) =>{
                let itemEl = instance.proxy.itemRef
                if (i == this.indexArray[0] || i == this.indexArray[1]){
                    addClass(itemEl ,'is-animating')
                }else{
                    removeClass(itemEl ,'is-animating')
                }
            })

            this.rctData.itemList.forEach((instance ,i) =>{
                let itemEl = instance.proxy.itemRef
                if (i == this.indexArray[0]){
                    addStyle(itemEl ,'transform' ,`${this.translateStr}(0px)`)
                }
            })
            setTimeout(()=>{
                this.afterAnimate()
            } ,450)
        },10)

    }

    __cardGoTo(page){
        this.currentAnimateIndex = page
        this.indexArray = shiftArray(this.itemLength ,this.currentAnimateIndex ,this.position)

        this.rctData.itemList.forEach((instance ,i) =>{
            let itemEl = instance.proxy.itemRef
            if (i == this.indexArray[0]){
                addClass(itemEl ,'is-active')
                this.__beCenter(itemEl)
            }
            else if (i == this.indexArray[this.itemLength - 1]){
                removeClass(itemEl ,'is-active')
                this.__nearLeft(itemEl)
            }
            else if (i == this.indexArray[1]){
                removeClass(itemEl ,'is-active')
                this.__nearRight(itemEl)
            }else{
                removeClass(itemEl ,'is-active')
                this.__nearRightOut(itemEl)
                
            }
        })
    }

    __nearLeft(itemEl){
        let tmp
        if (this.direction == 'vertical'){
            tmp =  itemEl.clientHeight * 0.075
        }else{
            tmp =  itemEl.clientWidth * 0.075
        }
        addStyle(itemEl ,'transform' ,`${this.translateStr}(-${tmp}px) scale(0.85)`)
    }

    __nearRight(itemEl){
        let tmp
        if (this.direction == 'vertical'){
            tmp =  this.clientHeight - itemEl.clientHeight + itemEl.clientHeight * 0.075
        }else{
            tmp =  this.clientWidth - itemEl.clientWidth + itemEl.clientWidth * 0.075
        }
        addStyle(itemEl ,'transform' ,`${this.translateStr}(${tmp}px) scale(0.85)`)
    }

    __nearRightOut(itemEl){
        let tmp
        if (this.direction == 'vertical'){
            tmp =  this.clientHeight - itemEl.clientHeight * 0.075
        }else{
            tmp =  this.clientWidth - itemEl.clientWidth * 0.075
        }
        addStyle(itemEl ,'transform' ,`${this.translateStr}(${ tmp }px) scale(0.85)`)
    }

    __nearLeftOut(itemEl){
        let tmp
        if (this.direction == 'vertical'){
            tmp =  itemEl.clientHeight - itemEl.clientHeight * 0.075
        }else{
            tmp =  itemEl.clientWidth - itemEl.clientWidth * 0.075
        }
        addStyle(itemEl ,'transform' ,`${this.translateStr}(-${tmp}px) scale(0.85)`)
    }

    __beCenter(itemEl){
        let tmp
        if (this.direction == 'vertical'){
            tmp =  (this.clientHeight - itemEl.clientHeight) / 2
        }else{
            tmp =  (this.clientWidth - itemEl.clientWidth) / 2
        }
        addStyle(itemEl ,'transform' ,`${this.translateStr}(${tmp}px) scale(1)`)
        addClass(itemEl ,'is-active')
    }
}


function shiftArray(length, num ,position) {
    const arr = []
    for (let i=0;i<length;i++){
        arr.push(i)
    }
    
    if (position == 'right'){
        let shiftedArr = [...arr.slice(num), ...arr.slice(0, num)]
        return shiftedArr
    }else{
        let shiftedArr = [];
        for (let i=0;i<arr.length;i++){
            if (num >= 0){
                shiftedArr.push(arr[num])
            }else{
                shiftedArr.push(arr[arr.length + num])
            }
            num --
        }
        return shiftedArr;
    }
}

export default CarouselMode