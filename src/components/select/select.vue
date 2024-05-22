<template>
    <xmv-popover :ref="selectMode.popoverRef" @hide="handlePopoverHide">
        <template #trigger>
            <div class="xmv-select" 
                :class="computeClass" 
                :ref="selectMode.selectRef"
                @click="handleActive">
                <div class="select-trigger">
                    <xmv-select-tags v-if="selectMode.multiple.value"></xmv-select-tags>
                    <xmv-input
                        :size="size"
                        :placeholder="inputPlaceholder"
                        suffix-icon="arrowDown" 
                        :ref="selectMode.inputRef"
                        :disabled="disabled"
                        :clearable="clearable"
                        @input="handleInputInput"
                        @clear="handleInputClear"></xmv-input>
                </div>
            </div>
        </template>
        <div class="xmv-select-dropdown" :class="computeClass" 
            :style="{'min-width' : selectMode.rctData.dropdownWidth + 'px'}">
            <xmv-scrollbar :maxHeightFlag="true">
                <ul class="xmv-select-dropdown__list">
                    <xmv-select-item v-if="type == 'select'" 
                        v-for="tmp in selectMode.rctData.options" :data="tmp"></xmv-select-item>
                    <xmv-tree v-if="type == 'tree'" 
                        :ref="selectMode.treeRef"
                        :showCheckbox="multiple"
                        :notAssociated="notAssociated"
                        :onlyChildNode="onlyChildNode"
                        @nodeClick="handleNodeClick"
                        @nodeCheck="handleNodeCheck"
                        :filterNodeMethod="filterNodeMethod" 
                        :expandLevel="expandLevel"
                        :lazy="lazy" :load="load"></xmv-tree>
                    <div class="xmv-select-empty" v-if="selectMode.isEmpty.value">没有查找到相关数据</div>
                </ul>
            </xmv-scrollbar>
        </div>
    </xmv-popover>
    <slot></slot>
</template>

<script>
import {defineComponent, onMounted, provide, reactive ,computed, nextTick ,watch ,ref} from 'vue'
import SelectMode from './mode/selectMode'
import xmvSelectItem from './item.vue'
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
import {find ,filter} from 'utils/data'
export default defineComponent({
    name:"xmvSelect",
    components:{xmvSelectItem},
    emits : ['nodeClick' ,'nodeCheck' ,'update:modelValue' ,'change'],
    props:{
        disabled : Boolean,
        clearable : Boolean,
        multiple : {type : Boolean,default : false},
        size : String,
        collapseTags : Boolean,
        maxcollapseTags : Number,
        filterable : Boolean,
        type:{type:String ,default:'select'},
        notAssociated : String,
        onlyChildNode : Boolean,
        modelValue : [String,Number,Array],
        filterNodeMethod : Function,
        lazy : Boolean,
        load : Function,
        expandLevel : Number,
        placeholder : {type:String ,default:'请选择'}
    },
    components:{xmvSelectItem},
    setup(props ,context) {

        const selectMode = new SelectMode(props)
        const placeholderMsg = props.placeholder
        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)
        const inputPlaceholder = ref(placeholderMsg)

        const computeClass = computed(()=>{
            let res = []
            if (props.disabled){
                res.push('xmv-select--disabled')
            }
            if (selectMode.multiple.value){
                res.push('is-multiple')
            }
            if (props.size != undefined){
                res.push('xmv-select--' + props.size)
            }
            if (selectMode.isFocus.value){
                res.push('is-focus')
            }
            return res
        })

        provide('SelectMode' ,selectMode)
        provide('EventBus' ,{$on ,$emit})

        $on('itemClick' ,(data)=>{
            selectMode.inputRef.value.focus()
            if (selectMode.multiple.value){
                nextTick(()=>{
                    selectMode.adjustWH()
                })
                if (props.modelValue != undefined){
                    context.emit('update:modelValue' ,selectMode.getSelectedValList())
                }
                context.emit('nodeCheck' ,selectMode.rctData.sData)
            }else{
                let selectData = selectMode.rctData.sData[0]
                selectMode.inputRef.value.val(selectData.label)
                selectMode.popoverRef.value.hide(true)
                context.emit('update:modelValue' ,selectData.value)
                context.emit('change' ,selectData.value)
            }
        })

        $on('itemClose' ,data =>{
            if (props.type == 'tree'){
                // 需要调用tree自己的check方法
                data.isChecked = false
                selectMode.treeRef.value.checkNode(data)
            }
        })

        const handleActive = ()=>{
            selectMode.isFocus.value = true
            selectMode.isEmpty.value = false
            selectMode.rctData.dropdownWidth = selectMode.selectRef.value.clientWidth - 2
            if (!props.disabled){
                selectMode.inputRef.value.focus()
                selectMode.popoverRef.value.setPosition()
                selectMode.popoverRef.value.enable()
            }

            if (selectMode.filterable.value){
                selectMode.showAll()
                let sData = selectMode.rctData.sData
                selectMode.inputRef.value.inputRef.value = ''
                if (isEmpty(sData)){
                    inputPlaceholder.value = placeholderMsg
                }else{
                    let label = sData[0].label  
                    inputPlaceholder.value = label
                }
                if (selectMode.type == 'tree'){
                    selectMode.treeRef.value.filter('')
                }
            }   
        }

        const loadTreeData = (data)=>{
            selectMode.treeRef.value.loadData(data)
        }

        const handleNodeClick = (node)=>{
            selectMode.inputRef.value.val(node.label)
            selectMode.popoverRef.value.hide(true)
            context.emit('nodeClick' ,node)
        }

        const handleNodeCheck = (nodeList)=>{
            selectMode.rctData.sData = nodeList
            nextTick(()=>{
                selectMode.adjustWH()
            })
            if (isEmpty(nodeList)){
                inputPlaceholder.value = placeholderMsg
            }else{
                inputPlaceholder.value = ''
            }
            
            context.emit('nodeCheck' ,nodeList)
        }

        const setTreeMultipleValue = (value)=>{
            selectMode.treeRef.value.setMultipleValue(value ,(list)=>{
                selectMode.rctData.sData = list
                inputPlaceholder.value = (isEmpty(selectMode.rctData.sData)?placeholderMsg:'')
            })
        }

        const setTreeValue = (value)=>{
            let node = selectMode.treeRef.value.setValue(value)
            selectMode.rctData.sData = [node]
        }

        const resetTree = ()=>{
            selectMode.rctData.sData = []
            selectMode.treeRef.value.reset()
            selectMode.inputRef.value.val("")
            inputPlaceholder.value = placeholderMsg
        }

        const handleInputInput = ()=>{
            if (selectMode.filterable.value){
                selectMode.filter(selectMode.inputRef.value.getVal())
            }
        }

        const handleInputClear = ()=>{
            inputPlaceholder.value = placeholderMsg
            context.emit('update:modelValue' ,"")
            if (props.type == 'tree'){
                context.emit('clear')
            }
        }

        const handlePopoverHide = ()=>{
            selectMode.isFocus.value = false
            if (selectMode.filterable.value){
                let sData = selectMode.rctData.sData
                if (isEmpty(sData)){
                    selectMode.inputRef.value.inputRef.value = ''
                    inputPlaceholder.value = placeholderMsg
                }else{
                    let label = sData[0].label  
                    selectMode.inputRef.value.inputRef.value = label
                }
            }
        }

        const modelValueWatch = computed(()=>{
            return props.modelValue
        })

        watch(modelValueWatch ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            if (props.multiple){
                let list = val
                selectMode.rctData.sData = []
                list.forEach(item =>{
                    let __data = filter(selectMode.rctData.options ,tmp=>{
                        return tmp.value == item
                    })
                    if (!isEmpty(__data)){
                        selectMode.rctData.sData.push(__data[0])
                    }
                })
                inputPlaceholder.value = (isEmpty(selectMode.rctData.sData)?placeholderMsg:'')
            }else{
                selectMode.rctData.sData = filter(selectMode.rctData.options ,tmp=>{
                    return tmp.value == val
                })
                if (!isEmpty(selectMode.rctData.sData)){
                    selectMode.inputRef.value.val(selectMode.rctData.sData[0].label)
                }else{
                    selectMode.inputRef.value.val("")
                }
            }
            
            nextTick(()=>{
                $emit('setVal')
            })
        }

        onMounted(()=>{
            selectMode.rctData.dropdownWidth = selectMode.selectRef.value.clientWidth - 2
            if (props.disabled){
                selectMode.popoverRef.value.disabled()
            }
            if (selectMode.multiple.value){
                // 需要设置最小高度
                selectMode.inputRef.value.inputRef.style['min-height'] = '30px'
            }
            if (!selectMode.filterable.value){
                selectMode.inputRef.value.inputRef.setAttribute('readonly' ,'')
            }
            if (!isEmpty(props.modelValue)){
                handleWatch(props.modelValue)
            }
        })

        return {selectMode ,computeClass ,inputPlaceholder,loadTreeData,resetTree,
                handleActive ,handleNodeClick ,handleNodeCheck ,setTreeValue ,
                setTreeMultipleValue,handleInputClear,handleInputInput,handlePopoverHide}
    }
})
</script>

<style lang="" scoped></style>
