<template>
    <th class="xmv-table__cell" :class="computeThClass" @click="handleThClick" >
        <div class="cell">
            {{data.label}}
            <span class="caret-wrapper" v-if="data.sortable != undefined">
                <i class="sort-caret ascending" @click.stop="handleAscClick"></i>
                <i class="sort-caret descending" @click.stop="handleDescClick"></i>
            </span>
            <xmv-checkbox v-if="data.type == 'checkbox'" @check="handleCheck" v-model="data.checked"></xmv-checkbox>
        </div>
    </th>
</template>

<script>
import {computed, defineComponent ,ref ,inject} from 'vue'
export default defineComponent({
    name:"xmvTableTh",
    props:{
        data : Object
    },
    setup(props ,context) {

        const tableMode = inject('TableMode')

        const sortAD = ref(null)

        let sortType

        const computeThClass = computed(()=>{
            let res = []
            res.push(sortAD.value)
            if (props.data.sortable != undefined){
                res.push('is-sortable')
            }
            if (props.data.fixed != undefined){
                res.push('xmv-table-fixed-column--'+(props.data.fixed == ''?'left':props.data.fixed))
            }
            if (props.data.type == 'checkbox'){
                res.push('xmv-table-column--selection')
            }
            return res
        })

        const handleThClick = ()=>{
            if (props.data.sortable == undefined){
                return false
            }
            if (sortAD.value == 'ascending'){
                sortAD.value = 'descending'
            }else if (sortAD.value == 'descending'){
                sortAD.value = ''
            }else{
                sortAD.value = 'ascending'
            }

            if (props.data.sortMethod){
                props.data.sortMethod(props.data.prop ,sortAD.value)  
            }else{
                sort(props.data.prop)
            }
        }

        const handleAscClick = ()=>{
            if (props.data.sortable == undefined){
                return false
            }
            if (sortAD.value == 'ascending'){
                sortAD.value = ''
            }else{
                sortAD.value = 'ascending'
            }
            if (props.data.sortMethod){
                props.data.sortMethod(props.data.prop ,sortAD.value)  
            }else{
                sort(props.data.prop)
            }
        }

        const handleDescClick = ()=>{
            if (props.data.sortable == undefined){
                return false
            }
            if (sortAD.value == 'descending'){
                sortAD.value = ''
            }else{
                sortAD.value = 'descending'
            }
            if (props.data.sortMethod){
                props.data.sortMethod(props.data.prop ,sortAD.value)  
            }else{
                sort(props.data.prop)
            }
        }

        const sort = (key)=>{

            let type = judgeSortType(key)

            if (sortAD.value == ''){
                key ='xmvSortIndex'
                type = 'number'
            }

            tableMode.rctData.data.sort((a, b) => {
                if (type == 'string'){
                    return sortStringMethod(a ,b ,key)
                }else if(type == 'number'){
                    return sortNumberMethod(a ,b ,key)
                }
            })

            if (sortAD.value == 'descending'){
                tableMode.rctData.data.reverse()
            }
        }

        const sortNumberMethod = (a ,b ,key)=>{
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        }

        const sortStringMethod = (a ,b ,key)=>{
            return a[key].localeCompare(b[key])
        }

        const judgeSortType = (key)=>{
            if (tableMode.rctData.data.length != 0){
                let tmpData = tableMode.rctData.data[0][key]
                return typeof tmpData
            }
            return 'string'
        }

        const handleCheck = (flag)=>{
            tableMode.checkAll(flag)
        }

        return {computeThClass ,handleThClick , handleAscClick ,handleDescClick,handleCheck,sortAD}
    }
})
</script>

<style lang="" scoped></style>
