<template></template>

<script>
import {defineComponent, h, computed ,inject ,ref, nextTick ,toRefs} from 'vue'
import xmvCheckbox from 'comps/checkbox/checkbox.vue'
import xmvTooltip from 'comps/tooltip/tooltip.vue'
import xmvIcon from 'comps/icon/icon.vue'
export default defineComponent({
    name:"xmvTableTd",
    props:{
        header : Object,
        data : Object,
        index : Number
    },
    components:{xmvCheckbox,xmvIcon},
    setup(props ,context) {
        let data = props.data
        const slots = props.header.slots || {}
        const tableMode = inject('TableMode')
        const expandIcon = ref('arrowRight')

        const computeTdClass = computed(()=>{
            let res = []
            res.push('xmv-table__cell')
            if (props.header.fixed != undefined){
                res.push('xmv-table-fixed-column--'+(props.header.fixed == ''?'left':props.header.fixed))
            }
            if(props.data.xmvExpandData){
                res.push('xmv-table__expanded-cell')
            }
            return res
        })

        const computeTdExpandClass = computed(()=>{
            let res = []
            res.push('xmv-table__expand-icon')
            if (props.data.xmvIsExpand){
                res.push('xmv-table__expand-icon--expanded')
            }
            return res
        })

        const computeIconClass = computed(()=>{
            let res = []

            if (expandIcon.value == 'loading'){
                res.push('is-loading')
            }

            return res
        })

        const handleCheck = (flag)=>{
            data.checked = flag
            tableMode.checkSingle()
        }

        const handleExpandClick = ()=>{
            props.data.xmvIsExpand = !props.data.xmvIsExpand
            if (props.data.xmvIsExpand){
                let __data = Object.assign({} ,props.data ,{xmvExpandData : true}) 
                tableMode.insertData(props.index + 1 ,__data)
            }else{
                tableMode.deleteData(props.index + 1)
            }
        }

        const handleChildrenClick = ()=>{
            if (props.data.xmvIsExpand){
                props.data.xmvIsExpand = false
                return 
            }

            if (tableMode.option.lazy && !props.data.xmvHasLoad){
                expandIcon.value = 'loading'
                tableMode.option.load().then((res)=>{
                    expandIcon.value = 'arrowRight'
                    props.data.xmvHasLoad = true
                    props.data.xmvIsExpand = true
                    props.data.children = res
                })
            }else{
                props.data.xmvIsExpand = !props.data.xmvIsExpand
            }
            
        }

        const renderCellContent = (content)=>{
            let res = []
            if (props.data.hasChildren){
                tableMode.hasChildren.value = true
                if (tableMode.rctData.header[0] === props.header){
                    res.push(h('div' ,{class:computeTdExpandClass.value} 
                                ,h(xmvIcon ,{'name' : expandIcon.value,
                                             'onClick' : handleChildrenClick,
                                             'class':computeIconClass.value})))
                }
            }
            if (props.data.xmvDepth != 0 && tableMode.rctData.header[0] === props.header){
                res.push(h('span' ,{
                                    class:'xmv-table__indent',
                                    style:{'padding-left' : (props.data.xmvDepth) * 16 + 'px'},
                                   }))
            }
            if (tableMode.hasChildren.value 
                            && tableMode.rctData.header[0] === props.header 
                            && !props.data.hasChildren){
                res.push(h('span' ,{class : 'xmv-table__placeholder'}))
            }
            res.push(content)
            return res
        }

        const render = ()=>{
            let renderSlot = []
            let defaultSlot = slots.default ? slots.default({ props }) : null;
            if (props.data.xmvExpandData){
                if(props.header.type == 'expand'){
                    if (defaultSlot && defaultSlot.length > 0)
                    {
                        defaultSlot.forEach((__slot) => {
                            renderSlot.push(h(__slot));
                        });

                        return h('td', { class: computeTdClass.value ,
                                        colspan :  tableMode.rctData.header.length}, [
                            h('div', { class: 'cell' }, renderSlot)
                        ]);
                    }
                }
            }
            else if(props.header.type == 'expand'){
                return h('td' ,{ class: computeTdClass.value },[
                    h('div' ,{class : 'cell'} ,h(xmvIcon ,{
                        'class' : computeTdExpandClass.value,
                        'name' : 'arrowRight',
                        'onClick' : handleExpandClick
                    }))
                ])
            }
            else if (defaultSlot)
            {
                if (defaultSlot && defaultSlot.length > 0)
                {
                    defaultSlot.forEach((__slot) => {
                        renderSlot.push(h(__slot));
                    });

                    return h('td', { class: computeTdClass.value }, [
                        h('div', { class: 'cell' }, renderSlot)
                    ]);
                }
            }
            else if(props.header.type == 'checkbox'){
                return h('td', { class: computeTdClass.value }, [
                            h('div', { class: 'cell' } ,h(xmvCheckbox ,{
                                'modelValue' : data.checked,
                                'onCheck' : handleCheck
                            }))
                        ]);
            }
            else if(props.header.type == 'index'){
                return h('td', { class: computeTdClass.value }, [
                            h('div', { class: 'cell' } ,props.data.xmvIndex + 1)
                        ]);
            }
            else
            {
                if (props.header.showOverflowTooltip){
                    return h(xmvTooltip ,{'content':props.data[props.header.prop]} ,
                                         {default : ()=> h('td' ,{ class: computeTdClass.value } ,
                                            h('div',{class:'cell xmv-tooltip'},props.data[props.header.prop])
                                        )}
                            )
                }else{
                    return h('td', { class: computeTdClass.value }, [
                            h('div', { class: 'cell' } ,renderCellContent(props.data[props.header.prop]))
                        ]);
                }
            }
        }

        return ()=>{
            return render()
        }
    }
})
</script>

<style lang="" scoped></style>
