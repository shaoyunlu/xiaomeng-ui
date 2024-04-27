<template>
    <div class="xmv-anchor__item">
        <a class="xmv-anchor__link" :href="'#'+title">{{ title }}</a>
    </div>
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

        $on('itemClick' ,(title)=>{
            if (title != props.title){
                isActive.value = false
            }
        })

        let defaultSlot = context.slots.default ? context.slots.default({ props }) : null
        let listSlot = context.slots.list ? context.slots.list({ props }) : null;

        const handleClick = ()=>{
            let dom = mode.contentElRef.value.querySelector('[href="#'+props.title+'"]') 
            dom.scrollIntoView({ behavior: 'smooth' });
            isActive.value = true
            $emit('itemClick' ,props.title)
        }

        mode.rctData.list = mode.rctData.list.concat(
            h('h2' ,{class:'pageroam-title-h2'},[
                props.title,
                h('a' ,{href : '#' + props.title ,class : 'pageroam-title-a'} ,'#')
            ]),
            h('div', { class: 'pageroam-item' }, defaultSlot)
        )

        const render = ()=>{
            return h('div',{class : 'xmv-anchor__item'} ,[
                h('a',{class : {'xmv-anchor__link' : true ,'is-active' : isActive.value},href:'#'+props.title,onClick:handleClick},props.title),
                listSlot ? h(listSlot[0]) : null
            ])
        }

        return ()=>{
            return render()
        }
    }
})
</script>

<style lang="" scoped></style>
