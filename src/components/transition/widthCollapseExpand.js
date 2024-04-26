/**
 * 宽度的抽屉动效
 */
import {nextFrame} from 'utils/dom'
import {animateDuration} from 'utils/dict'

export function collapse(el ,expandStr ,collapseStr ,cbf){
    var oriCssText = el.style.cssText
    el.style.cssText =  oriCssText + `
                        ;display:block;
                        overflow:hidden;
                        width:${expandStr};
                        transition:width var(--xmv-transition-duration);`

    nextFrame(()=>{
        el.style.width = collapseStr
    })

    setTimeout(()=>{
        el.style.cssText = oriCssText
        cbf()
    },animateDuration)
}

export function expand(el ,expandStr ,collapseStr ,cbf){
    var oriCssText = el.style.cssText
    el.style.cssText =  oriCssText + `
                        ;display:block;
                        overflow:hidden;
                        width:${collapseStr};
                        transition:width var(--xmv-transition-duration);`

    nextFrame(()=>{
        el.style.width = expandStr
    })

    setTimeout(()=>{
        el.style.cssText = oriCssText
        cbf()
    },animateDuration)
}