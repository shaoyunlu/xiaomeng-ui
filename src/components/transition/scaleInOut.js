import {nextFrame} from 'utils/dom'
import {animateDuration} from 'utils/dict'

const placeMap = {
    top : {origin:'center bottom' ,inVal : '1,1' ,outVal:'1,0'},
    bottom : {origin : 'center top' ,inVal : '1,1' ,outVal:'1,0'},
    left : {origin : 'right top' ,inVal : '1' ,outVal:'0'},
    right : {origin : 'left top' ,inVal : '1' ,outVal:'0'}
}

export function scaleIn(el ,cbf ,opt){
    let placeInfo = placeMap[opt.placement]
    // 如果当前的scale为1的话，直接退出
    if (el.style.opacity == '1'){
        cbf()
        return false
    }
    var oriCssText = el.style.cssText
    el.style.cssText = oriCssText + `;transform-origin:${placeInfo.origin};transform:scale(${placeInfo.outVal});opacity:0;
                        transition:transform var(--xmv-transition-duration) ,opacity var(--xmv-transition-duration)`
    nextFrame(()=>{
        el.style.display = ''

        nextFrame(()=>{
            el.style.transform = `scale(${placeInfo.inVal})`
            el.style.opacity = 1
        })

    })
    
    return setTimeout(()=>{
        oriCssText = oriCssText.replace('none' ,'')
        el.style.cssText = oriCssText + `;transform:scale(1);opacity:1;`
        cbf()
    },animateDuration)
}

export function scaleOut(el ,cbf ,opt){
    let placeInfo = placeMap[opt.placement]
    var oriCssText = el.style.cssText

    el.style.cssText = oriCssText + `;transform-origin:${placeInfo.origin};transform:scale(${placeInfo.inVal});opacity:1;
                    transition:transform var(--xmv-transition-duration) ,opacity var(--xmv-transition-duration)`

    nextFrame(()=>{
        el.style.transform = `scale(${placeInfo.outVal})`
        el.style.opacity = 0
    })

    return setTimeout(()=>{
        el.style.cssText = oriCssText + `;transform:scale(0);opacity:0`
        cbf()

    },animateDuration)
}