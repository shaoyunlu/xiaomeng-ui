<template>
    <colgroup>
        <col v-for="head in tableMode.rctData.header" :width="head.width">
    </colgroup>
    <thead class>
        <tr class>
            <xmv-table-th v-for="head in tableMode.rctData.header" :data="head"></xmv-table-th>
        </tr>
    </thead>
</template>

<script>
import {defineComponent, inject} from 'vue'
import xmvTableTh from './tableTh.vue'
export default defineComponent({
    name:"xmvTableHeader",
    components:{xmvTableTh},
    setup(props ,context) {
        const tableMode = inject('TableMode')

        const handleThClick = ()=>{

        }

        return {tableMode ,handleThClick}
    }
})
</script>

<style lang="" scoped></style>
