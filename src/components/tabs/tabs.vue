<template>
    <div class="xmv-tabs" :class="computeTabsClass">
        <div class="xmv-tabs__header" :class="computePositionClass">
            <span class="xmv-tabs__new-tab" @click="handlePlusClick" v-if="tabsMode.editable">
                <xmv-icon name="plus" class="is-icon-plus"></xmv-icon>
            </span>
            <div class="xmv-tabs__nav-wrap" :class="computeNavWrapClass">
                <span class="xmv-tabs__nav-prev" v-if="tabsMode.isScrollable.value && tabsMode.editable" @click="handleLeft">
                    <xmv-icon name="arrowLeft"></xmv-icon>
                </span>
                <span class="xmv-tabs__nav-next" v-if="tabsMode.isScrollable.value && tabsMode.editable" @click="handleRight">
                    <xmv-icon name="arrowRight"></xmv-icon>
                </span>
                <div class="xmv-tabs__nav-scroll" :ref="tabsMode.tabsNavScrollRef">
                    <div class="xmv-tabs__nav" 
                        :class="computePositionClass"
                        :style="{'transform': 'translateX(-'+tabsMode.tabsNavScrollX.value+'px)'}"
                        :ref="tabsMode.tabsNavRef">
                        <div class="xmv-tabs__active-bar" 
                            v-if="!type"
                            :ref="tabsMode.barRef" 
                            :class="computePositionClass"
                            :style="computeActiveBarStyle">
                        </div>
                        <xmv-tabs-item v-for="(tmp,index) in tabsMode.rctData.itemList" :data="tmp" :index="index" :key="tmp.name"></xmv-tabs-item>
                    </div>
                </div>
            </div>
        </div>
        <div class="xmv-tabs__content">
            <xmv-tabs-content v-for="tmp in tabsMode.rctData.itemList" :data="tmp" :key="tmp.name"></xmv-tabs-content>
        </div>
    </div>
    <slot></slot>
</template>

<script>
import {computed, defineComponent, nextTick, onMounted, provide ,reactive, watch} from 'vue'
import TabsMode from './mode/tabsMode'
import xmvTabsItem from './item.vue';
import xmvTabsContent from './content.vue';
import {createEventBus} from 'utils/event'
import {isEmpty} from 'utils/data'
export default defineComponent({
    name:"xmvTabs",
    props:{
        tabPosition : {type:String ,default:'top'},
        type : String,
        modelValue : String | Number,
        editable : Boolean
    },
    emits:['buildDone' ,'remove' ,'add'],
    components:{xmvTabsItem ,xmvTabsContent},
    setup(props ,context) {

        const tabsMode = new TabsMode(props)

        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit ,$remove} = createEventBus(eventBus)

        tabsMode.$on = $on
        tabsMode.$emit = $emit
        tabsMode.$remove = $remove
        tabsMode.ctx = context

        const computeTabsClass = computed(()=>{
            let res = []
            res.push('xmv-tabs--' + props.tabPosition)
            if (props.type != undefined){
                res.push('xmv-tabs--' + props.type)
            }
            return res
        })

        const computeActiveBarStyle = computed(()=>{
            let res = {}
            if (props.tabPosition == 'top' || props.tabPosition == 'bottom'){
                res['width'] = tabsMode.barWidth.value + 'px'
                res['transform'] = 'translateX('+tabsMode.barTranslateX.value+'px)'
            }else{
                res['height'] = tabsMode.barHeight.value + 'px'
                res['transform'] = 'translateY('+tabsMode.barTranslateY.value+'px)'
            }
            return res
        })

        const computeNavWrapClass = computed(()=>{
            let res = []
            res.push('is-' + props.tabPosition)
            if (tabsMode.isScrollable.value && tabsMode.editable){
                res.push('is-scrollable')
            }
            return res
        })

        const computePositionClass = computed(()=>{
            return ['is-' + props.tabPosition]
        })

        const handleLeft = ()=>{
            let clientWidth = tabsMode.tabsNavScrollRef.value.clientWidth
            if (tabsMode.tabsNavScrollX.value < clientWidth){
                tabsMode.tabsNavScrollX.value = 0
            }else{
                tabsMode.tabsNavScrollX.value = tabsMode.tabsNavScrollX.value - clientWidth
            }
        }

        const handleRight = ()=>{
            let scrollWidth = tabsMode.tabsNavRef.value.scrollWidth
            let clientWidth = tabsMode.tabsNavScrollRef.value.clientWidth
            let diff = scrollWidth - tabsMode.tabsNavScrollX.value - clientWidth
            if (diff > clientWidth){
                tabsMode.tabsNavScrollX.value = clientWidth + tabsMode.tabsNavScrollX.value
            }else{
                tabsMode.tabsNavScrollX.value = diff + tabsMode.tabsNavScrollX.value
            }
        }

        const handlePlusClick = ()=>{
            context.emit('add')
            nextTick(()=>{
                let scrollWidth = tabsMode.tabsNavRef.value.scrollWidth
                let clientWidth = tabsMode.tabsNavScrollRef.value.clientWidth
                let length = tabsMode.rctData.itemList.length
                if (scrollWidth > clientWidth){
                    tabsMode.tabsNavScrollX.value = scrollWidth - clientWidth
                }
                let lastNode = tabsMode.rctData.itemList[length - 1]
                tabsMode.$emit('itemClick' ,lastNode.name)
            })
        }

        provide('TabsMode' ,tabsMode)

        watch(()=>props.modelValue ,(newVal)=>{
            handleWatch(newVal)
        })

        const handleWatch = (val)=>{
            tabsMode.$emit('itemClick' ,val)
        }

        const handleScoll = ()=>{
            nextTick(()=>{
                tabsMode.isScrollable.value = (tabsMode.tabsNavRef.value.scrollWidth > tabsMode.tabsNavScrollRef.value.clientWidth)
            })
            
        }

        onMounted(()=>{
            nextTick(()=>{
                context.emit('buildDone')
                if (!isEmpty(props.modelValue)){
                    handleWatch(props.modelValue)
                }
            })
            
            watch(tabsMode.rctData ,(newVal)=>{
                handleScoll()
            })

        })

        return {tabsMode,computeTabsClass,computePositionClass,
                handleLeft,handleRight,handlePlusClick,
                computeActiveBarStyle,computeNavWrapClass}
    }
})
</script>

<style lang="" scoped></style>
