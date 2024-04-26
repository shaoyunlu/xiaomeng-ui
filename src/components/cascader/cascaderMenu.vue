<template>
    <xmv-scrollbar>
        <ul class="xmv-cascader-menu__list">
            <xmv-cascader-item v-for="tmp,idx in list" :node="tmp" :index="index" :key="idx"></xmv-cascader-item>
        </ul>
    </xmv-scrollbar>
</template>

<script>
import {defineComponent ,provide,reactive} from 'vue'
import xmvCascaderItem from './item.vue'
import {createEventBus} from 'utils/event'
export default defineComponent({
    name:"",
    props:{
        list : Array,
        index : Number
    },
    components:{xmvCascaderItem},
    setup({index} ,context) {

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('MenuEventBus' ,{$on ,$emit})

        return {}
    }
})
</script>

<style lang="" scoped></style>
