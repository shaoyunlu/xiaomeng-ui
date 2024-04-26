import {createVNode ,reactive ,render ,watch} from 'vue'
import NotificationConstructor from "./notification.vue"

const TRInstances = reactive([])
const BRInstances = reactive([])
const TLInstances = reactive([])
const BLInstances = reactive([])

function XmvNotification({title,message,position="top-right",duration,type,showClose}){
    let instances = getInstances(position)
    let vm
    let container = document.createElement('div')
    document.body.appendChild(container)
    let topAndBottom = getTopAndBottom(position)
    let vnode = createVNode(NotificationConstructor,{
        top : topAndBottom.top,
        bottom : topAndBottom.bottom,
        title : title,
        message : message,
        position : position,
        duration : duration,
        type : type,
        showClose : showClose,
        onDestroy:()=>{
            setTimeout(() => {
                let index = instances.findIndex(obj => obj === vm)
                instances.splice(index, 1)
                container.remove()
            }, 300);
        }
    })
    render(vnode ,container)
    vm = vnode.component.proxy
    getInstances(position).push(vm)
}

watch(TRInstances ,()=>{
    TRInstances.forEach((instance,i) =>{
        instance.topRef = 20 + i * 100
    })
} ,{deep : false})

watch(TLInstances ,()=>{
    TLInstances.forEach((instance,i) =>{
        instance.topRef = 20 + i * 100
    })
} ,{deep : false})

watch(BRInstances ,()=>{
    BRInstances.forEach((instance,i) =>{
        instance.bottomRef = 20 + i * 100
    })
} ,{deep : false})

watch(BLInstances ,()=>{
    BLInstances.forEach((instance,i) =>{
        instance.bottomRef = 20 + i * 100
    })
} ,{deep : false})

function getInstances(key){
    if (key == 'top-right'){
        return TRInstances
    }else if (key == 'top-left'){
        return TLInstances
    }else if (key == 'bottom-right'){
        return BRInstances
    }else{
        return BLInstances
    }
}

function getTopAndBottom(position){
    if (position == 'top-right' || position == 'top-left'){
        return {
                    top : 20 + getInstances(position).length * 100 ,
                    bottom : 'auto'
                }
    }else{
        return {
            top : 'auto',
            bottom : 20 + getInstances(position).length * 100
        }
    }
}

export default XmvNotification