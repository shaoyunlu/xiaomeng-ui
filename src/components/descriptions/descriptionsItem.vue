<template>

</template>

<script>
import {defineComponent, inject} from 'vue'
export default defineComponent({
    name:"xmvDescriptionsItem",
    props:{
        label : String
    },
    setup(props ,context) {
        const dMode = inject('DMode')
        dMode.itemList.push({props ,context})

        return {}
    }
})
</script>

<style lang="" scoped></style>
