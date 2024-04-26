<template>

</template>

<script>
import {defineComponent, getCurrentInstance, inject} from 'vue'
export default defineComponent({
    name:"xmvTabPanel",
    props:{
        label : String,
        name : String
    },
    setup(props ,context) {

        const instance = getCurrentInstance()

        const tabsMode = inject('TabsMode')

        //let isActive = (tabsMode.rctData.itemList.length == 0)

        tabsMode.rctData.itemList.push({
            label : props.label,
            name : props.name,
            slots : instance.slots,
            isActive : false
        })
    }
})
</script>

<style lang="" scoped></style>
