<template>
    <div class="xmv-image">
        <img class="xmv-image__inner" :src="src" 
        :style="computeImgStyle" 
        :class="{'xmv-image__preview' : previewSrcList != undefined}"
        v-if="computeImage" @click="handleImageClick">
        <div class="xmv-image__error" v-if="!computeImage && context.slots.error == null">图片加载失败</div>
        <slot name="error" v-if="!computeImage"></slot>
        <Transition name="xmv-dialog">
            <div class="xmv-image-viewer__wrapper" v-if="imageViewerIf">
                <div class="xmv-image-viewer__mask"></div>
                <span class="xmv-image-viewer__btn xmv-image-viewer__close" @click="handleCloseClick">
                    <xmv-icon name="close"></xmv-icon>
                </span>
                <span class="xmv-image-viewer__btn xmv-image-viewer__prev" @click="handlePrevClick">
                    <xmv-icon name="arrowLeft"></xmv-icon>
                </span>
                <span class="xmv-image-viewer__btn xmv-image-viewer__next" @click="handleNextClick">
                    <xmv-icon name="arrowRight"></xmv-icon>
                </span>
                <div class="xmv-image-viewer__btn xmv-image-viewer__actions">
                    <div class="xmv-image-viewer__actions__inner">
                        <xmv-icon name="zoomOut" @click="handleZoomOutClick"></xmv-icon>
                        <xmv-icon name="zoomIn" @click="handleZoomInClick"></xmv-icon>
                        <xmv-icon name="refreshLeft" @click="handleRefreshLeftClick"></xmv-icon>
                        <xmv-icon name="refreshRight" @click="handleRefreshRightClick"></xmv-icon>
                    </div>
                </div>
                <div class="xmv-image-viewer__canvas">
                    <xmv-image-item :srcStr="tmp" v-for="tmp,index in previewSrcList" :index="index"></xmv-image-item>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import {computed, defineComponent ,ref ,reactive ,provide, nextTick} from 'vue'
import {isEmpty} from 'utils/data'
import {createEventBus} from 'utils/event'
import xmvImageItem from './item.vue'
export default defineComponent({
    name:"xmvImage",
    components:{xmvImageItem},
    props:{
        src : String,
        fit : {type:String ,default:'none'}, //'fill', 'contain', 'cover', 'none', 'scale-down'
        previewSrcList : Array
    },
    setup(props ,context) {

        const imageViewerIf = ref(false)
        const indexRef = ref(0)
        const viewerInfo = {
            index : 0,
            scale : 1,
            rotate : 0,
            translateX : 0,
            translateY : 0,
            maxHeight : 100,
            maxWidth : 100
        }
        const eventBus = reactive({
            listeners : {}
        })
        const {$on ,$emit} = createEventBus(eventBus)
        provide('EventBus' ,{$on ,$emit})

        const computeImage = computed(()=>{
            return !isEmpty(props.src)
        })

        const computeImgStyle = computed(()=>{
            let res = new Object()
            if (props.fit != undefined){
                res['object-fit'] = props.fit
            }
            return res
        })

        const handleImageClick = ()=>{
            viewerInfoRest()
            imageViewerIf.value = true
            nextTick(()=>{
                $emit('setVal' ,viewerInfo)
            })
        }

        const handleCloseClick = ()=>{
            imageViewerIf.value = false
        }

        const handlePrevClick = ()=>{
            viewerInfoRest()
            viewerInfo.index = viewerInfo.index - 1
            if (viewerInfo.index < 0){
                viewerInfo.index = props.previewSrcList.length - 1
            }
            $emit('setVal' ,viewerInfo)
        }

        const handleNextClick = ()=>{
            viewerInfoRest()
            viewerInfo.index = viewerInfo.index + 1
            if (viewerInfo.index == props.previewSrcList.length){
                viewerInfo.index = 0
            }
            $emit('setVal' ,viewerInfo)
        }

        const handleZoomOutClick = ()=>{
            viewerInfo.scale = viewerInfo.scale - 0.2
            $emit('setVal' ,viewerInfo)
        }

        const handleZoomInClick = ()=>{
            viewerInfo.scale = viewerInfo.scale + 0.2
            $emit('setVal' ,viewerInfo)
        }

        const handleRefreshLeftClick = ()=>{
            viewerInfo.rotate = viewerInfo.rotate - 90
            $emit('setVal' ,viewerInfo)
        }

        const handleRefreshRightClick = ()=>{
            viewerInfo.rotate = viewerInfo.rotate + 90
            $emit('setVal' ,viewerInfo)
        }

        const viewerInfoRest = ()=>{
            viewerInfo.scale = 1
            viewerInfo.rotate = 0
            viewerInfo.translateX = 0
            viewerInfo.translateY = 0
            viewerInfo.maxHeight = 100
            viewerInfo.maxWidth = 100
        }

        return {computeImgStyle ,computeImage ,
                context ,imageViewerIf ,handleImageClick ,handleCloseClick ,
                handlePrevClick ,handleNextClick,handleZoomOutClick,handleZoomInClick,
                handleRefreshLeftClick,handleRefreshRightClick}
    }
})
</script>

<style lang="" scoped></style>
