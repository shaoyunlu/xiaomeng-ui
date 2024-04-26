<template>
</template>

<script>
import {defineComponent, inject} from 'vue'
export default defineComponent({
    name:"xmvOption",
    props:{
        label : String,
        value : String | Number,
        disabled : {type : Boolean,default : false},
        hide : {type : Boolean,default : false}
    },
    setup({label ,value,disabled ,hide} ,context) {

        const selectMode = inject('SelectMode')
        selectMode.rctData.options.push({label ,value,disabled ,hide})
        return {}
    }
})
</script>

<style lang="" scoped></style>
