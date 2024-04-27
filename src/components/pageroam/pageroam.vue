<template>

</template>

<script>
import {defineComponent, h ,provide,renderSlot ,ref, onMounted ,reactive} from 'vue'
import {createEventBus} from 'utils/event'
import PageroamMode from './mode/pageroamMode.js'
export default defineComponent({
    name:"xmvPageRoam",
    setup(props ,context) {

        const mode = new PageroamMode()

        const contentElRef = ref(null)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})
        provide('PageroamMode' ,mode)

        const render = ()=>{
            return h('div' ,{class : 'xmv-pageroam'},[
                h('nav' ,{class : 'xmv-pageroam-sidebar'} ,[
                    h('h3',{class:'xmv-pageroam-sidebar__heading'} ,'Contents'),
                    h('div',{class:'xmv-anchor xmv-anchor--vertical'},renderSlot(context.slots, 'default'))
                ]),
                h('div', { class: 'xmv-pageroam-content' ,ref : contentElRef} ,mode.rctData.list)
            ])
        }

        onMounted(()=>{
            mode.contentElRef = contentElRef
        })

        return ()=>{
            return render()
        }
    }
})
</script>

<style lang="" scoped></style>
