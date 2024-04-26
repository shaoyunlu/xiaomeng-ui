<template>
    <div :class="computeClass" @click="handleClick" ref="itemRef">
        {{data.label}}
    </div>
</template>

<script>
import {computed, defineComponent ,inject, h ,ref, onUnmounted} from 'vue'
import xmvIcon from 'comps/icon/icon.vue'
export default defineComponent({
    name:"",
    props:{
        data : Object,
        index : Number
    },
    components:{xmvIcon},
    setup(props ,context) {
        const itemRef = ref(null)
        const tabsMode = inject('TabsMode')
        const computeClass = computed(()=>{
            let res = ['xmv-tabs__item']
            res.push('is-' + tabsMode.tabPosition)
            if (props.data.isActive){
                res.push('is-active')
            }
            if (tabsMode.editable){
                res.push('is-closable')
            }
            return res
        })

        

        const $onItemClick = (name)=>{
            props.data.isActive = (name == props.data.name)
            if (props.data.isActive){
                if (tabsMode.tabPosition == 'top' || tabsMode.tabPosition == 'bottom'){
                    tabsMode.barWidth.value = itemRef.value.clientWidth - 20
                    tabsMode.barTranslateX.value = itemRef.value.offsetLeft == 0 ? 0 : itemRef.value.offsetLeft + 20
                }else{
                    tabsMode.barHeight.value = itemRef.value.clientHeight
                    tabsMode.barTranslateY.value = itemRef.value.offsetTop
                }
            }
        }

        const handleClick = ()=>{
            props.data.isActive = true
            tabsMode.$emit('itemClick' ,props.data.name)
        }

        const handleCloseClick = (e)=>{
            e.stopPropagation()
            tabsMode.remove(props.data)
            tabsMode.ctx.emit('remove' ,props.data.name)
        }

        tabsMode.$on('itemClick' ,$onItemClick)

        const contentRender = ()=>{
            let res = []
            if (props.data.slots.label){
                res.push(h(props.data.slots.label))
                if (tabsMode.editable){
                    res.push(h(xmvIcon ,{
                                name:'close',
                                class:'is-icon-close',
                                onClick:handleCloseClick}))
                }
                
                return res

            }else{
                res.push(props.data.label)
                if (tabsMode.editable){
                    res.push(h(xmvIcon ,{
                                name:'close',
                                class:'is-icon-close',
                                onClick:handleCloseClick}))
                }
                return res

            }

        }

        onUnmounted(()=>{
            // 需要解除监听事件
            tabsMode.$remove('itemClick',$onItemClick)
        })

        return ()=>{
            return h('div' ,{
                'class':computeClass.value,
                'onClick':handleClick,
                'ref':itemRef
            } ,contentRender())
        }

        //return {computeClass ,handleClick ,itemRef}
    }
})
</script>

<style lang="" scoped></style>
