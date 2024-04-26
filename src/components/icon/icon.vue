<template>
    <i class="xmv-icon">
        <component :is="name" v-if="typeof name == 'string'"></component>
        <component :is="tRaw(name)" v-else></component>
    </i>
</template>

<script>
import {defineComponent, onMounted, toRaw} from 'vue'
import arrowDown from './category/arrowDown.vue'
import arrowLeft from './category/arrowLeft.vue'
import arrowRight from './category/arrowRight.vue'
import arrowUp from './category/arrowUp.vue'
import back from './category/back.vue'
import barChart from './category/barChart.vue'
import base from './category/base.vue'
import check from './category/check.vue'
import close from './category/close.vue'
import circleCheck from './category/circleCheck.vue'
import circleClose from './category/circleClose.vue'
import circleCloseFilled from './category/circleCloseFilled.vue'
import calendar from './category/calendar.vue'
import clock from './category/clock.vue'
import document from './category/document.vue'
import dArrowLeft from './category/dArrowLeft.vue'
import dArrowRight from './category/dArrowRight.vue'
import dlt from './category/delete.vue'
import download from './category/download.vue'
import edit from './category/edit.vue'
import empty from './category/empty.vue'
import hide from './category/hide.vue'
import infoFilled from './category/infoFilled.vue'
import loading from './category/loading.vue'
import lineChart from './category/lineChart.vue'
import moreFilled from './category/moreFilled.vue'
import message from './category/message.vue'
import minus from './category/minus.vue'
import pieChart from './category/pieChart.vue'
import plus from './category/plus.vue'
import pic from './category/picture.vue'
import refresh from './category/refresh.vue'
import refreshLeft from './category/refreshLeft.vue'
import refreshRight from './category/refreshRight.vue'
import search from './category/search.vue'
import sort from './category/sort.vue'
import setting from './category/setting.vue'
import star from './category/star.vue'
import successFilled from './category/successFilled.vue'
import upload from './category/upload.vue'
import uploadFilled from './category/uploadFilled.vue'
import user from './category/user.vue'
import userFilled from './category/userFilled.vue'
import vew from './category/view.vue'
import warningFilled from './category/warningFilled.vue'
import zoomIn from './category/zoomIn.vue'
import zoomOut from './category/zoomOut.vue'
export default defineComponent({
    name:"xmvIcon",
    components:{
                    arrowLeft,arrowRight,arrowUp,arrowDown,
                    back,barChart,base,
                    calendar,check,clock,close,circleCheck,circleClose,circleCloseFilled,
                    dArrowLeft ,dArrowRight,download,dlt,document,
                    edit,empty,
                    hide,
                    infoFilled,lineChart,
                    loading , 
                    message,minus,moreFilled,
                    plus,pieChart,pic,
                    refresh,refreshLeft,refreshRight,
                    sort ,setting ,search,successFilled,star,
                    upload,uploadFilled,user,userFilled,
                    vew,
                    warningFilled,
                    zoomIn,zoomOut
              },
    props:{
        name : String | Object
    },
    setup(props ,context) {

        const tRaw = (val)=>{
            return toRaw(val)
        }

        return {tRaw}
    }
})
</script>

<style lang="" scoped></style>
