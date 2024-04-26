import { nextTick, reactive } from "vue"
import {getHiddenDomWH} from 'utils/dom'
import {addClass,removeClass,hasClass} from 'utils/dom'
import {isEmpty ,findNode ,findParentNodeByChildNode} from 'utils/data'
import XmvTransition from 'comps/transition/transition'
class MenuMode{

    constructor(ctx){
        this.rctMenu = reactive({
            data : [],
            isCollapse : false
        })
        this.ctx = ctx
        this.isVertical
        this.isDark
        this.menuElRef = null
        this.curSelNode = null
        this.transition = new XmvTransition()
        this.$on = null
        this.$emit = null
    }

    init(){

    }

    loadData(data){
        this.rctMenu.data = data
    }

    collapse(){
        if (this.rctMenu.isCollapse){
            return false
        }
        let expandWidthStr = this.__getExpandWidth()
        this.transition.widthCollapse(this.menuElRef.value,
            expandWidthStr,
            'calc(var(--xmv-menu-icon-width) + var(--xmv-menu-base-level-padding) * 2)',
            ()=>{
                this.rctMenu.isCollapse = true
                this.rctMenu.data.forEach(node =>{
                    node.childrenVisible = false
                })
        })
    }

    expand(){
        if (!this.rctMenu.isCollapse){
            return false
        }
        let expandWidthStr = this.__getExpandWidth()
        this.transition.widthExpand(this.menuElRef.value,
            expandWidthStr,
            'calc(var(--xmv-menu-icon-width) + var(--xmv-menu-base-level-padding) * 2)',
            ()=>{
                this.rctMenu.isCollapse = false
        })
    }

    activeNode(value ,type = 'value' ,needAnimate = false){
        let node = findNode(this.rctMenu.data ,value)
        this.curSelNode = node
        node.active = true
        let parents = findParentNodeByChildNode(this.rctMenu.data ,value ,[] ,type)

        if (!isEmpty(parents)){
            if (parents.length > 1){
                for (let i=1;i<parents.length;i++){
                    parents[i].isExpand = true
                    parents[i].childrenVisible = true
                }
            }
            if (needAnimate){
                nextTick(()=>{
                    this.$emit('triggerSubClick' ,{tmp : parents[0] ,type : type})
                })
            }
        }

        if (!this.isVertical){
            for (let i=0;i<parents.length;i++){
                parents[i].active = true
            }
        }
    }

    itemClick(node){
        if (this.curSelNode){
            this.curSelNode.active = false
            if (!this.isVertical){
                let parents = findParentNodeByChildNode(this.rctMenu.data ,this.curSelNode.value ,[] ,'value')
                for (let i=0;i<parents.length;i++){
                    parents[i].active = false
                }
            }
        }
        //node.active = !node.active
        this.curSelNode = node
        this.activeNode(node.value)
        this.ctx.emit('nodeClick' ,node)
    }

    subClick(node ,subXmvMenuEl){

        return new Promise((resolve ,reject)=>{
            if (this.rctMenu.isCollapse){
                return false
            }
            let {domHeight} = getHiddenDomWH(subXmvMenuEl)
            const cbf = ()=>{
                node.childrenVisible = !node.childrenVisible
            }
    
            if (node.childrenVisible){
                this.transition.heightCollapse(subXmvMenuEl ,domHeight + 'px' ,0 ,cbf)
            }else{
                this.transition.heightExpand(subXmvMenuEl ,domHeight + 'px' ,0 ,cbf)
            }
    
            node.isExpand = !node.isExpand
        })
    }

    onMounted(){

    }

    __getExpandWidth(){
        let expandWidth
        if (hasClass(this.menuElRef.value,'xmv-menu--collapse')){
            removeClass(this.menuElRef.value,'xmv-menu--collapse')
            expandWidth = this.menuElRef.value.scrollWidth
            addClass(this.menuElRef.value,'xmv-menu--collapse')
        }else{
            expandWidth = this.menuElRef.value.scrollWidth
        }
        
        return expandWidth + 'px'
    }
}

export default MenuMode