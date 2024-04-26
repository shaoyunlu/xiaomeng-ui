import {nextFrame} from 'utils/dom'

const animateDuration = 300

class TransitionBase{
    constructor({elRef ,baCbf ,caCbf ,aaCbf}){
        this.elRef = elRef
        this.oriCssText
        this.baCbf = baCbf
        this.caCbf = caCbf
        this.aaCbf = aaCbf 
    }

    init(){

    }

    start(){
        this.beforeAnimate()
        this.currentAnimate()
        this.afterAnimate()
    }

    beforeAnimate(){
        this.oriCssText = this.elRef.value.oriCssText
        this.baCbf(this.elRef.value ,this.oriCssText)
    }

    currentAnimate(){
        nextFrame(()=>{
            this.caCbf(this.elRef.value)
        })
    }

    afterAnimate(){
        setTimeout(()=>{
            this.elRef.value.style.cssText = this.oriCssText
            this.aaCbf(this.elRef.value)
        } ,animateDuration)
    }
}

export default TransitionBase