import { nextTick, reactive ,ref} from "vue"
import {getHiddenDomWH} from 'utils/dom'
import {isEmpty ,findNode ,deleteObjectFromArray ,
        addObjectAfter ,addObjectBefore ,findParentNodeByChildNode} from 'utils/data'
import XmvTransition from 'comps/transition/transition'
class TreeMode{
    constructor(props){
        this.rctData = reactive({
            data : [],
            sData : []
        })
        this.treeRef = null
        this.transition = new XmvTransition()
        this.filterNodeMethod = this.__createFilterMethod(props.filterNodeMethod) //props.filterNodeMethod
        this.showCheckbox = props.showCheckbox
        this.notAssociated = props.notAssociated
        this.lazy
        this.load
        this.onlyChildNode
        this.$on = null
        this.$emit = null
        this.dropIndicatorTop = ref(0)
        this.dropIndicatorLeft = ref(0)
        this.dropIndicatorDisplay = ref(false)
        this.currentDragNode = null
        this.currentDropEnterNode = null
        this.tmpTreeBoundInfo
    }

    loadData(data){
        this.rctData.data = data
    }

    filter(label){
        let self = this
        this.rctData.data.forEach(node =>{
            __filter(node ,label)
        })

        function __filter(node ,label){
            __compare(node ,label)
            if (!isEmpty(node.children)){
                node.children.forEach(tmpNode =>{
                    __filter(tmpNode ,label)
                })
            }
        }

        function __compare(node ,label){
            if (self.filterNodeMethod(node ,label)){
                while(node){
                    node.isHidden = false
                    node = node.parent
                }
            }else{
                node.isHidden = true
            }
        }
    }

    handleNodeClick(node){
        if (isEmpty(node)){
            return false
        }
        if (this.onlyChildNode && !isEmpty(node.children)){
            return false
        }
        if (node.disabled){
            return false
        }
        // 如果是单选模式，要有选中模式
        if (this.showCheckbox != undefined){
            return false
        }
        this.$emit('nodeClick' ,node)
    }

    handleExpandIconClick(node ,subRef){
        const __innerMethod = ()=>{
            if (!isEmpty(node.children)){
                let childrenEl = subRef.value.childrenDivRef
                let {domHeight} = getHiddenDomWH(childrenEl)
                
                node.iconExpanded = !node.iconExpanded
    
                const cbf = ()=>{
                    node.isExpanded = !node.isExpanded
                }
    
                if (node.isExpanded){
                    this.transition.heightCollapse(childrenEl ,domHeight + 'px' ,0 ,cbf)
                }else{
                    this.transition.heightExpand(childrenEl ,domHeight + 'px' ,0 ,cbf)
                }
            }
        }

        if (this.lazy && !node.isLoaded){
            node.isLoading = true
            this.load(node).then(children =>{
                node.isLoading = false
                node.children = children
                node.isLoaded = true
                nextTick(()=>{
                    __innerMethod()
                })
                
            })
        }else{
            __innerMethod()
        }
    }

    handleNodeCheck(node){
        if (this.notAssociated != undefined){

        }
        else{
            if (isEmpty(node.children)){

            }else{
                // 所有子节点都跟着变
                this.__handleChildrenNodeCheck(node ,node.isChecked)
            }
    
            // 需要改变父节点
            this.__handleParentNodeCheck(node)
        }

        this.$emit('nodeCheck' ,this.getCheckedNode())

    }

    getCheckedNode(){
        var self = this
        this.rctData.sData = []
        this.rctData.data.forEach(node =>{
            loop(node)
        })

        function loop(node){
            if (node.isChecked){
                self.rctData.sData.push(node)
            }
            if (isEmpty(node.children)){
                return false
            }
            node.children.forEach(tmp =>{
                loop(tmp)
            })
        }

        return this.rctData.sData

    }

    findNodeByParam(nestedArray, value ,type = 'value'){
        for (let item of nestedArray) {
            if (item[type] === value) {
              return item;
            }
        
            if (item.children && item.children.length > 0) {
              let found = this.findNodeByParam(item.children, value ,type);
              if (found) {
                return found;
              }
            }
          }
        
          return null;
    }

    findParents(nestedArray, value, parents = [] ,type = 'value') {
        for (let item of nestedArray) {
          if (item[type] === value) {
            return parents;
          }
      
          if (item.children && item.children.length > 0) {
            let newParents = parents.concat(item);
            let foundParents = this.findParents(item.children, value, newParents);
            if (foundParents) {
              return foundParents;
            }
          }
        }
        return null;
    }

    __handleParentNodeCheck(node){
        if (!node.parent){
            return false
        }
        let pNode = node.parent
        this.__calcNodeStatus(pNode)
        this.__handleParentNodeCheck(pNode)
    }

    __handleChildrenNodeCheck(cNode ,isChecked){
        cNode.isChecked = isChecked
        if (isEmpty(cNode.children)){
            return false
        }
        cNode.children.forEach(childNode =>{
            this.__handleChildrenNodeCheck(childNode ,isChecked)
        })
    }

    __calcNodeStatus(node){
        let hasChecked = false
        let hasNoChecked = false

        function loop(cNode){
            if (isEmpty(cNode.children)){
                return false
            }
            cNode.children.forEach(tmp=>{
                if (tmp.isChecked){
                    hasChecked = true
                }else{
                    hasNoChecked = true
                }
                loop(tmp)
            })
        }
        loop(node)

        // 全选
        if (hasChecked && !hasNoChecked){
            node.isChecked = true
            node.isIndeterminate = false
        }
        // 部分选
        else if (hasChecked && hasNoChecked){
            node.isChecked = false
            node.isIndeterminate = true
        }
        else if (!hasChecked && hasNoChecked){
            node.isChecked = false
            node.isIndeterminate = false
        }

    }

    __createFilterMethod(filterNodeMethod){
        if (filterNodeMethod){
            return (node ,label)=>{
                return filterNodeMethod(node ,label)
            }
        }
        return (node ,label)=>{
            return node.label.includes(label)
        }
    }
    
    insertNode(node){
        deleteObjectFromArray('value' ,this.currentDragNode.value ,this.rctData.data)
        if (!node.children){
            node.children = []
        }
        node.children.push(this.currentDragNode)
    }

    beforeNode(node){
        deleteObjectFromArray('value' ,this.currentDragNode.value ,this.rctData.data)
        addObjectBefore('value' ,node.value ,this.currentDragNode ,this.rctData.data)
    }

    afterNode(node){
        deleteObjectFromArray('value' ,this.currentDragNode.value ,this.rctData.data)
        addObjectAfter('value' ,node.value ,this.currentDragNode ,this.rctData.data)
    }

    activeNode(value ,type){
        let node = findNode(this.rctData.data ,value)
        node.isCurrent = true
        this.$emit('nodeActive' ,{node ,type})
        let parents = findParentNodeByChildNode(this.rctData.data ,value ,[] ,type)

        if (!isEmpty(parents)){
            if (parents.length > 1){
                for (let i=1;i<parents.length;i++){
                    parents[i].isExpanded = true
                }
            }

            nextTick(()=>{
                this.$emit('triggerExpandClick' ,{tmp : parents[0] ,type : type})
            })
        }
    }
}

export default TreeMode