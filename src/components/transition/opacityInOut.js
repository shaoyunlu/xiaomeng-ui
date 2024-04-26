import {nextFrame} from 'utils/dom'
import {animateDuration} from 'utils/dict'

export function opacityIn(el ,cbf){
    var oriCssText = el.style.cssText
    el.style.cssText = oriCssText + `
                        transition:opacity var(--xmv-transition-duration)`
    nextFrame(()=>{
        el.style.opacity = 1
    })

    return setTimeout(()=>{
        el.style.cssText = oriCssText + `opacity:${el.style.opacity}`
        cbf()
    },animateDuration)
}

export function opacityOut(el ,cbf){
    var oriCssText = el.style.cssText

    el.style.cssText = oriCssText + `
                        transition:opacity var(--xmv-transition-duration)`

    nextFrame(()=>{
        el.style.opacity = 0
    })

    return setTimeout(()=>{
        el.style.cssText = oriCssText + `opacity:${el.style.opacity}`
        cbf()

    },animateDuration)
}