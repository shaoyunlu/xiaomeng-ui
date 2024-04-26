import {addStyle} from 'utils/dom'

export default {
    mounted(el, binding){
        const container = document.createElement('div')
        container.className = 'xmv-loading-mask'
        if (el.getAttribute('xmv-loading-background')){
            addStyle(container,'background-color' ,el.getAttribute('xmv-loading-background'))
        }

        const spinner = document.createElement('div')
        spinner.className = 'xmv-loading-spinner'
        container.appendChild(spinner)

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class' ,'circular')
        if (el.getAttribute('xmv-loading-svg-view-box')){
            svg.setAttribute('viewBox' ,el.getAttribute('xmv-loading-svg-view-box'))
        }else{
            svg.setAttribute('viewBox' ,'0 0 50 50')
        }
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'path');
        circle.setAttribute('cx', '25');
        circle.setAttribute('cy', '25');
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', 'none');

        if (el.getAttribute('xmv-loading-svg')){
            svg.innerHTML = el.getAttribute('xmv-loading-svg')
        }else{
            svg.appendChild(circle)
        }
        spinner.appendChild(svg)

        if (el.getAttribute('xmv-loading-text')){
            const loadingTextEl = document.createElement('p')
            loadingTextEl.className = 'xmv-loading-text'
            loadingTextEl.innerHTML = el.getAttribute('xmv-loading-text')
            spinner.appendChild(loadingTextEl)
        }

        if (binding.modifiers.fullscreen){
            addStyle(container,'position','fixed')
            document.body.appendChild(container)
        }else{
            el.appendChild(container)
        }

        el._loadingContainer = container

        if (binding.value){
            el._loadingContainer.style.display = 'block'
        }else{
            el._loadingContainer.style.display = 'none'
        }
    },
    updated(el, binding) {
        if (binding.value){
            el._loadingContainer.style.display = 'block'
        }else{
            el._loadingContainer.style.display = 'none'
        }
    },
    unmounted(el) {
        el._loadingContainer && el._loadingContainer.remove()

    }
}