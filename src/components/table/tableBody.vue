<template>
    <colgroup>
        <col v-for="head in tableMode.rctData.header" :width="head.width">
    </colgroup>
    <tbody>
        <xmv-table-tr v-for="(trData,index) in tableMode.rctData.data" :data="trData" :key="index" :index="index"></xmv-table-tr>
    </tbody>
</template>

<script>
import {defineComponent ,inject} from 'vue'
import XmvTableTr from './tableTr.vue'

export default defineComponent({
    name:"xmvTableBody",
    components:{XmvTableTr},
    setup(props ,context) {
        const tableMode = inject('TableMode')
        return {tableMode}
    }
})
</script>

<style lang="" scoped></style>
