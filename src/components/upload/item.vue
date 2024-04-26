<template>

    <li class="xmv-upload-list__item is-success" v-show="data.isShow">
        <img class="xmv-upload-list__item-thumbnail" :src="data.imgSrc" alt="" v-if="listType == 'picture-card' || listType == 'picture'"/>
        <div class="xmv-upload-list__item-info" v-if="listType == 'text' || listType == 'picture'">
            <a class="xmv-upload-list__item-name">
                <xmv-icon name="document" v-if="listType == 'text'"></xmv-icon>
                <span class="xmv-upload-list__item-file-name">{{data.name}}</span>
            </a>
        </div>
        <label class="xmv-upload-list__item-status-label">
            <xmv-icon class="xmv-icon--upload-success xmv-icon--check" :name="checkType"></xmv-icon>
        </label>
        <xmv-icon name="close" class="xmv-icon--close" @click="handleClose" 
            v-if="listType == 'text' || listType == 'picture'"></xmv-icon>
        <span class="xmv-upload-list__item-actions" v-if="listType == 'picture-card'">
            <span class="xmv-upload-list__item-preview">
                <xmv-icon name="zoomIn" class="xmv-icon--zoom-in"></xmv-icon>
            </span>
            <span class="xmv-upload-list__item-delete">
                <xmv-icon name="dlt" class="xmv-icon--delete" @click="handleClose"></xmv-icon>
            </span>
        </span>
    </li>

</template>

<script>
import {defineComponent, onMounted ,ref ,inject, onUnmounted ,getCurrentInstance} from 'vue'
import {deleteObjectFromArray} from 'utils/data'
export default defineComponent({
    name:"",
    props : {
        data : Object,
        listType : {type :String ,default:'text'}
    },
    setup({data ,listType} ,context) {

        const instance = getCurrentInstance()
        const checkType = ref('check')
        const {$on ,$emit} = inject('EventBus')
        const fileList = inject('FileList')

        const handleClose = ()=>{
            data.isShow = false
        }

        $on('after-leave' ,()=>{
            if (instance.isUnmounted){
                return false
            }
            if (!data.isShow){
                deleteObjectFromArray('name' ,data.name ,fileList)
            }
        })

        onUnmounted(()=>{
            // 移除监听事件
        })

        onMounted(()=>{
            data.isShow = true
            if (listType == 'text'){
                checkType.value = 'circleCheck'
            }
        })

        return {checkType ,handleClose}
    }
})
</script>

<style lang="" scoped></style>
