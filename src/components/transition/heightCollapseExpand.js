/**
 * 高度的抽屉动效
 */

import {nextFrame} from 'utils/dom'
import {animateDuration} from 'utils/dict'


export function collapse(el ,expandStr ,collapseStr ,cbf){

    var oriCssText = el.style.cssText
    el.style.cssText = oriCssText + `
                        ;height:${expandStr};
                        overflow:hidden;
                        transition:height var(--xmv-transition-duration)`

    nextFrame(()=>{
        el.style.height = collapseStr
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
                        height:${collapseStr};
                        overflow:hidden;
                        transition:height var(--xmv-transition-duration);`

    nextFrame(()=>{
        el.style.height = expandStr
    })

    setTimeout(()=>{
        el.style.cssText = oriCssText
        cbf()
    },animateDuration)
}