import { addStyle } from "../../utils/dom"

let loadingInstance = null

/**
 * 构造函数参数
 * lock
 * text
 * background
 */
class XmvLoading{
    constructor(options = {}){
        const container = document.createElement('div')
        this.container = container

        container.className = 'xmv-loading-mask'
        addStyle(container,'position','fixed')

        const spinner = document.createElement('div')
        this.spinner = spinner
        spinner.className = 'xmv-loading-spinner'
        container.appendChild(spinner)

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class' ,'circular')
        svg.setAttribute('viewBox' ,'0 0 50 50')

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'path');
        circle.setAttribute('cx', '25');
        circle.setAttribute('cy', '25');
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', 'none');
        svg.appendChild(circle)
        spinner.appendChild(svg)
        this.__setText(options.text)
        this.__setBackground(options.background)
        document.body.appendChild(container)
        container.style.display = 'block'
    }

    loadingOptions(options){
        
    }

    loading(){
        this.container.style.display = 'block'
    }

    close(){
        this.container.style.display = 'none'
    }

    __setText(text){
        if (text){
            const loadingTextEl = document.createElement('p')
            loadingTextEl.className = 'xmv-loading-text'
            loadingTextEl.innerHTML = text
            this.spinner.appendChild(loadingTextEl)
        }
    }

    __setBackground(background){
        addStyle(this.container,'background-color' ,background)
    }
}

XmvLoading.service = (options)=>{
    if (loadingInstance){
        loadingInstance.loadingOptions(options)
    }
    else{
        loadingInstance = new XmvLoading(options)
    }
    loadingInstance.loading()
    return loadingInstance
}

export default XmvLoading