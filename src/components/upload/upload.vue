<template>
    <div :class="class">
        <div class="xmv-upload xmv-upload--text" :class="{'is-drag':drag}"
            @mouseup="handleUploadClick"
            v-if="listType == 'text' || listType == 'picture'">
            <div :class="{'xmv-upload-dragger' : drag}" @dragover.stop="handleDragover" @drop.stop="handleDrop">
                <slot></slot>
                <input class="xmv-upload__input" name="file" multiple="" accept="" type="file" ref="uploadInpRef"/>
            </div>
        </div>
        
        <slot name="tip" v-if="listType == 'text'"></slot>

        <xmv-transition-group name="xmv-list"
            class="xmv-upload-list" 
            :class="['xmv-upload-list--'+listType]" 
            @after-leave="handleAfterLeave">
            <xmv-upload-item v-for="(item) in fileList"
            :key="item.name"
            :data="item" 
            :listType="listType"></xmv-upload-item>
            <div class="xmv-upload xmv-upload--picture-card xmv-filter" v-if="listType == 'picture-card'"
                @mouseup="handleUploadClick">
                <slot></slot>
                <input class="xmv-upload__input" name="file" multiple="" accept="" type="file" ref="uploadInpRef"/>
            </div>
        </xmv-transition-group>
    </div>
</template>

<script>
import {defineComponent, h ,onMounted,provide,ref ,reactive} from 'vue'
import xmvUploadItem from './item.vue'
import {createEventBus} from 'utils/event'
import {deleteObjectFromArray} from 'utils/data'
export default defineComponent({
    name:"",
    emits:['uploadDone'],
    components:{xmvUploadItem},
    props:{
        class : String,
        fileList : Array,
        limit : Number,
        listType : {type :String ,default:'text'},
        drag : Boolean,
        beforeUpload : Function
    },
    setup(props ,context) {

        const uploadInpRef = ref(null)
        const eventBus = reactive({
            listeners : {}
        })

        const {$on ,$emit} = createEventBus(eventBus)

        provide('EventBus' ,{$on ,$emit})

        const handleUploadClick = ()=>{
            uploadInpRef.value.click()
        }

        provide('FileList' ,props.fileList)

        const handleLimit = (file ,imgSrc)=>{
            let fileObj = {name : file.name ,imgSrc : imgSrc ,obj : file}
            let limit = props.limit
            if (limit == undefined)
            {
                props.fileList.push(fileObj)
                context.emit('uploadDone',props.fileList)
            }
            else
            {
                if (props.fileList.length < limit)
                {
                    props.fileList.push(fileObj)
                    context.emit('uploadDone',props.fileList)
                }
                else
                {
                    props.fileList[0].isShow = false
                    setTimeout(()=>{
                        props.fileList.push(fileObj)
                        context.emit('uploadDone',props.fileList)
                    },300)
                }
            }
        }

        const handleAfterLeave = ()=>{
            $emit('after-leave')
        }

        const handleDragover = (e)=>{
            e.preventDefault();
        }

        const handleDrop = (e)=>{
            e.preventDefault();
            let file = e.dataTransfer.files[0]
            __handleFile(file)
        }

        const __handleFile = (file)=>{
            if (props.beforeUpload != undefined){
                let fnRes = props.beforeUpload(file)
                if (fnRes instanceof Promise){
                    fnRes.then(res=>{
                        __upload(file)
                    })
                }else{
                    fnRes && __upload(file)
                }
            }else{
                __upload(file)
            }
        }

        const __upload = (file)=>{
            const reader = new FileReader()
            reader.addEventListener('load' ,event =>{
                handleLimit(file ,event.target.result)
            })
            reader.readAsDataURL(file)
        }

        onMounted(()=>{
            uploadInpRef.value.addEventListener('change' ,event =>{
                let file = event.target.files[0];
                __handleFile(file)
            })
        })

        return {uploadInpRef ,handleUploadClick ,handleAfterLeave ,handleDrop ,handleDragover}
    }
})
</script>

<style lang="" scoped></style>
