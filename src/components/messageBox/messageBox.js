import {render ,createVNode} from 'vue'
import MessageBoxConstructor from './messageBox.vue'

class XmvMessageBox{

}

const messageInstance = new Map()

function createComponent(msg,title,type,option={}){
    let vm
    let container = document.createElement('div')
    document.body.appendChild(container)
    let vnode = createVNode(MessageBoxConstructor ,{
        title : title,
        message : msg,
        type : type,
        inputPattern : option.inputPattern,
        inputErrorMessage : option.inputErrorMessage,
        dangerouslyUseHTMLString : option.dangerouslyUseHTMLString,
        center : option.center,
        onLeave : ()=>{
            messageInstance.delete(vm)
            render(null ,container)
            container.remove()
        }
    },{
        default : msg
    })
    render(vnode, container)
    vm = vnode.component.proxy
    messageInstance.set(vm ,vnode)
    return vm
}

XmvMessageBox.alert = (msg,title,option)=>{
    let vm = createComponent(msg,title,'alert',option)
    vm.setAlert()
    vm.show()
}

XmvMessageBox.confirm = (msg ,title,option)=>{
    let vm = createComponent(msg,title,'confirm',option)
    let confirmPromise = new Promise((resolve ,reject)=>{
        vm.setConfirm(resolve ,reject)
        vm.show()
    })
    return confirmPromise
}

XmvMessageBox.prompt = (msg ,title ,option)=>{
    let vm = createComponent(msg,title,'prompt',option)
    let confirmPromise = new Promise((resolve ,reject)=>{
        vm.setPrompt(resolve ,reject)
        vm.show()
    })
    return confirmPromise
}

XmvMessageBox.vnode = ({title ,message})=>{
    let vm = createComponent(message,title,'vnode')
    vm.setAlert()
    vm.show()
}

export default XmvMessageBox