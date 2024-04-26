<template>
    
</template>

<script>
import {defineComponent, getCurrentInstance, inject, onMounted} from 'vue'
export default defineComponent({
    name:"xmvTableColumn",
    props:{
        prop : String,
        label : String,
        width : String,
        sortable : String,
        sortMethod : Function,
        fixed : String,
        type : String,
        showOverflowTooltip : Boolean
    },
    setup(props ,context) {
        const tableMode = inject('TableMode')
        const instance = getCurrentInstance()
        tableMode.rctData.header.push({
            label : props.label,
            prop : props.prop,
            width : props.width,
            sortable : props.sortable,
            sortMethod : props.sortMethod,
            slots : instance.slots,
            fixed : props.fixed,
            type : props.type,
            showOverflowTooltip : props.showOverflowTooltip
        })

    }
})
</script>

<style scoped lang="less">

</style>