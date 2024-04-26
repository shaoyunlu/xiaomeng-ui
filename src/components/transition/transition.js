
import {opacityIn as opcIn ,opacityOut as opcOut} from 'comps/transition/opacityInOut'
import {collapse as wCollapse ,expand as wExpand} from 'comps/transition/widthCollapseExpand'
import {collapse as hCollapse ,expand as hExpand} from 'comps/transition/heightCollapseExpand'
import {scaleIn as sIn ,scaleOut as sOut} from 'comps/transition/scaleInOut'


class XmvTransition{

    constructor(opt = {}){
        this.el
        this.animateType
        this.delayRunTimeout
        this.animateTimeOutMap = {}
        this.isAnimating = false
        this.placement
    }

    setEl(el){
        this.el = el
    }

    reset(){
        this.animateType = ''
        this.isAnimating = false
    }

    opacityIn(beforeCbf){
        if (this.animateType == 'opacityIn' && this.isAnimating){
            return false
        }
        this.animateType = 'opacityIn'
        this.isAnimating = true
        beforeCbf && beforeCbf()
        const afterCbf = ()=>{
            this.isAnimating = false
        }
        clearTimeout(this.animateTimeOutMap['opacityOut'])
        clearTimeout(this.delayRunTimeout)
        opcIn(this.el ,afterCbf)
    }

    opacityOut(afterCbf){
        if (this.animateType == 'opacityOut'){
            return false
        }
        this.animateType = 'opacityOut'
        const wrapCbf = ()=>{
            afterCbf && afterCbf()
        }
        this.delayRunTimeout = setTimeout(()=>{
            this.animateTimeOutMap['opacityOut'] = opcOut(this.el ,wrapCbf)
        },200)
    }

    scaleIn(beforeCbf ,afterCbf){
        if (this.animateType == 'scaleIn' && this.isAnimating){
            return false
        }
        
        this.animateType = 'scaleIn'
        this.isAnimating = true
        beforeCbf && beforeCbf()
        const afterCbfWrapper = ()=>{
            this.isAnimating = false
            afterCbf && afterCbf()
        }
        clearTimeout(this.animateTimeOutMap['scaleOut'])
        clearTimeout(this.delayRunTimeout)
        sIn(this.el ,afterCbfWrapper ,{
            placement : this.placement
        })
    }

    scaleOut(afterCbf,timeout=200){
        if (this.animateType == 'scaleOut'){
            return false
        }
        this.animateType = 'scaleOut'
        const wrapCbf = ()=>{
            afterCbf && afterCbf()
        }
        this.delayRunTimeout = setTimeout(()=>{
            this.animateTimeOutMap['scaleOut'] = sOut(this.el ,wrapCbf ,{
                placement : this.placement
            })
        },timeout)
    }

    widthCollapse(el ,expandStr ,collapseStr ,cbf){
        if (this.isAnimating){
            return false
        }
        let wrapCbf = ()=>{
            this.isAnimating = false
            cbf && cbf()
        }
        this.isAnimating = true
        wCollapse(el ,expandStr ,collapseStr ,wrapCbf)
    }

    widthExpand(el ,expandStr ,collapseStr ,cbf){
        if (this.isAnimating){
            return false
        }
        let wrapCbf = ()=>{
            this.isAnimating = false
            cbf && cbf()
        }
        this.isAnimating = true
        wExpand(el ,expandStr ,collapseStr ,wrapCbf)
    }

    heightCollapse(el ,expandStr ,collapseStr ,cbf){
        if (this.isAnimating){
            return false
        }
        let wrapCbf = ()=>{
            this.isAnimating = false
            cbf && cbf()
        }
        this.isAnimating = true
        hCollapse(el ,expandStr ,collapseStr ,wrapCbf)
    }

    heightExpand(el ,expandStr ,collapseStr ,cbf){
        if (this.isAnimating){
            return false
        }
        let wrapCbf = ()=>{
            this.isAnimating = false
            cbf && cbf()
        }
        this.isAnimating = true
        hExpand(el ,expandStr ,collapseStr ,wrapCbf)
    }
}

export default XmvTransition