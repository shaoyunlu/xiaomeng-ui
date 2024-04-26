<template>
    <div class="xmv-select__tags" ref="tagsRef">
        <span class="xmv-select-tags-wrapper has-prefix" v-if="selectMode.collapseTags.value">
            <xmv-tag closable @close="() => handleClose(collapData.data)" v-if="collapData.data">
                {{collapData.data.label}}
            </xmv-tag>
            <xmv-tag v-if="collapData.residue">
                {{collapData.residue}}
            </xmv-tag>
        </span>
        <span class="xmv-select-tags-wrapper has-prefix" v-else>
            <xmv-tag v-for="tmp in selectMode.rctData.sData" 
                :key="tmp.value" 
                closable
                @close="() => handleClose(tmp)">
                {{tmp.label}}
            </xmv-tag>
        </span>
    </div>
</template>

<script>
import {defineComponent ,inject,nextTick,reactive,ref,watch} from 'vue'
import {find ,filter} from 'utils/data'
export default defineComponent({
    name:"",
    setup(props ,context) {
        const tagsRef = ref(null)
        const selectMode = inject('SelectMode')
        const {$on ,$emit} = inject('EventBus')
        selectMode.tagsRef = tagsRef

        const collapData = reactive({
            data : null,
            residue : null
        })

        const handleClose = (cData)=>{
            selectMode.popoverRef.value.disabled()
            selectMode.rctData.sData = filter(selectMode.rctData.sData ,(tmp)=>{
                return tmp.value != cData.value
            })
            $emit('itemClose' ,cData)
            $emit('itemClick' ,cData)
        }

        watch(selectMode.rctData ,(newValue, oldValue)=>{
            collapData.data = newValue.sData[0]
            let length = newValue.sData.length
            if (length > 1){
                collapData.residue = length - 1
            }else{
                collapData.residue = null
            }
        })

        return {selectMode ,tagsRef ,collapData ,handleClose}
    }
})
</script>

<style lang="" scoped></style>
