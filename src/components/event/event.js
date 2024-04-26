class XmvEvent{
    constructor(el){
        this.el = el
        this.eventMap = {}
        this.curEvtName
    }

    add(eventName ,cbf){
        this.eventMap[eventName] = cbf
        this.el.addEventListener(eventName ,()=>{
            this.trigger(eventName)
        })
    }

    trigger(eventName){
        if (this.curEvtName == eventName){
            return false
        }
        this.curEvtName = eventName
        this.eventMap[eventName]()
    }
}

export default XmvEvent