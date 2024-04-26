<template>
    <div class="xmv-descriptions" 
        :class="{'xmv-descriptions--small' : size == 'small',
                 'xmv-descriptions--large' : size == 'large'}">
        <div class="xmv-descriptions__header">
            <div class="xmv-descriptions__title">{{ title }}</div>
            <div class="xmv-descriptions__extra"></div>
        </div>
        <div class="xmv-descriptions__body">
            <table class="xmv-descriptions__table" :class="{'is-bordered' : border}">
                <tr v-for="tdList,line in dMode.trList.value">
                    <descriptions-td v-for="tdData,column in tdList" :data="tdData" :line="line" :column="column"></descriptions-td>
                </tr>
            </table>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent, onMounted, provide} from 'vue'
import descriptionsTd from './descriptionsTd.vue'
import DescriptionsMode from './mode/descriptionsMode';
export default defineComponent({
    name:"xmvDescriptions",
    props:{
        title : String,
        column : {type : Number ,default : 3},
        size : String,
        direction : String,   // 垂直向为vertical
        border : Boolean
    },
    components : {descriptionsTd},
    setup(props ,context) {
        const dMode = new DescriptionsMode(props)
        provide('DMode' ,dMode)

        onMounted(()=>{
            dMode.init()
        })

        return {dMode}
    }
})
</script>

<style lang="" scoped></style>
