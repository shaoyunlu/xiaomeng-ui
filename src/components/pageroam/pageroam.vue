<template>

</template>

<script>
import {defineComponent, h ,provide,renderSlot ,ref, onMounted ,reactive ,inject, onUnmounted} from 'vue'
import {createEventBus,debounce} from 'utils/event'
import PageroamMode from './mode/pageroamMode.js'
export default defineComponent({
    name:"xmvPageRoam",
    props:{
        topValue : {type : Number,default : 0}
    },
    setup(props ,context) {

        const mode = new PageroamMode()
        mode.topValue = props.topValue

        const contentElRef = ref(null)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})
        provide('PageroamMode' ,mode)

        const xmvOn = inject('Xmv-Event-On')
        const xmvRemove = inject('Xmv-Event-Remove')

        const onScrollDebounce = debounce(()=>{
            let arr = []
            let parentBdr = mode.contentElRef.value.getBoundingClientRect()
            let parentOffsetTop = parentBdr.top
            let list = mode.contentElRef.value.querySelectorAll('a[url]')
            for(let i=0;i<list.length;i++){
                arr.push({
                            index:i,
                            value:list[i].offsetTop + parentOffsetTop - mode.topValue,
                            type:list[i].getAttribute('a-type'),
                            url:list[i].getAttribute('url')})
            }
            let minPositiveValueObject = arr.reduce((min, current) => {
                // 检查 current.value 是否是正数，并且（当前没有最小值或者 current.value 小于 min.value）
                if (current.value > -5 && (!min || current.value < min.value)) {
                    return current;
                } else {
                    return min;
                }
            }, null);  // 初始化 min 为 null
            if (minPositiveValueObject == null){
                minPositiveValueObject = arr[arr.length - 1]
            }

            $emit('itemClick',minPositiveValueObject.url.substr(1))

        },100)

        xmvOn('scroll' ,onScrollDebounce)

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

        onUnmounted(()=>{
            xmvRemove('scroll' ,onScrollDebounce)
        })

        return ()=>{
            return render()
        }
    }
})
</script>

<style lang="" scoped></style>
