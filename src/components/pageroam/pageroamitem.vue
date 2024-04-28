<template>

</template>

<script>
import {defineComponent, h, inject, onMounted ,ref} from 'vue'
export default defineComponent({
    name:"xmvPageRoamItem",
    props:{
        title : String
    },
    setup(props ,context) {

        const mode = inject('PageroamMode')
        const {$on ,$emit} = inject('EventBus')
        const isActive = ref(false)
        const aRef = ref(null)

        $on('itemClick' ,(title)=>{
            isActive.value = (title == props.title)
        })

        let defaultSlot = context.slots.default ? context.slots.default({ props }) : null
        let listSlot = context.slots.list ? context.slots.list({ props }) : null;

        let aType = listSlot !=null ? 'category' : 'item'

        const handleClick = ()=>{
            let dom = mode.contentElRef.value.querySelector('[url="#'+props.title+'"]')
            let bdr = dom.getBoundingClientRect()
            window.scrollTo({
                top: bdr.top + window.scrollY - mode.topValue,
                behavior: 'smooth'
            });
            $emit('itemClick' ,props.title)
        }

        mode.rctData.list = mode.rctData.list.concat(
            h('h2' ,{class:'pageroam-title-h2'},[
                props.title,
                h('a' ,{url : '#' + props.title ,
                        'a-type' : aType,
                        class : 'pageroam-title-a'} ,'#')
            ]),
            h('div', { class: 'pageroam-item' }, defaultSlot)
        )

        const render = ()=>{
            return h('div',{class : 'xmv-anchor__item'} ,[
                h('a',{class : {'xmv-anchor__link' : true ,'is-active' : isActive.value},
                        url:'#'+props.title,
                        ref:aRef,
                        onClick:handleClick},
                        props.title),
                listSlot ? h(listSlot[0]) : null
            ])
        }

        onMounted(()=>{
            if (listSlot != null){
                aRef.value.setAttribute('a-type' ,'category')
            }else{
                aRef.value.setAttribute('a-type' ,'item')
            }
        })

        return ()=>{
            return render()
        }
    }
})
</script>

<style lang="" scoped></style>
