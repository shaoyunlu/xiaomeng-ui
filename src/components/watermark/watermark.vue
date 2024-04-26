<template>
    <div style="position: relative;" ref="wrapDiv">
        <slot></slot>
        <div ref="canvasDiv" :style="computeStyle"></div>
    </div>
</template>

<script>
import {computed, defineComponent, onMounted ,ref} from 'vue'
export default defineComponent({
    name:"xmvWatermark",
    props:{
        width : {type : Number ,default : 200},
        height : {type : Number ,default : 200},
        offsetX : {type : Number ,default : 10},
        offsetY : {type : Number ,default : 80},
        rotate : {type : Number ,default : -Math.PI / 12},
        fontSize : {type : Number ,default : 20},
        content : {type : String ,default : ''},
        image : String,
        imageRate : {type : Number ,default : 1},
        opacity : {type : Number ,default : 0.5}
    },
    setup(props ,context) {

        const wrapDiv = ref(null)
        const canvasDiv = ref(null)
        const base64Ref = ref('')

        let canvas

        const computeStyle = computed(()=>{
            let res = {}
            res['z-index'] = 9
            res['position'] = 'absolute'
            res['left'] = 0
            res['top'] = 0
            res['width'] = '100%'
            res['height'] = '100%'
            res['pointer-events'] = 'none'
            res['background-repeat'] = 'repeat'
            res['background-position'] = '0px 0px'
            res['background-image'] = 'url('+base64Ref.value+')'
            return res
        })

        const drawText = ()=>{
            var ctx = canvas.getContext("2d");
            ctx.globalAlpha = props.opacity;
            ctx.font = props.fontSize + "px Arial";
            ctx.translate(props.offsetX, props.offsetY); // 平移坐标原点到当前位置
            ctx.rotate(props.rotate); // 旋转角度，这里是45度
            ctx.fillText(props.content, 0, 0); // 在平移后的坐标原点绘制文本
            base64Ref.value = canvas.toDataURL()
        }

        const drawImage = ()=>{
            var ctx = canvas.getContext("2d");
            ctx.globalAlpha = props.opacity;
            ctx.font = props.fontSize + "px Arial";
            ctx.translate(props.offsetX, props.offsetY); // 平移坐标原点到当前位置
            ctx.rotate(props.rotate); 

            const image = new Image();
            image.crossOrigin = "anonymous";
            image.src = props.image
            image.onload = function() {
                ctx.drawImage(image, 0, 0 ,image.width/props.imageRate ,image.height/props.imageRate);
                console.log(image)
                base64Ref.value = canvas.toDataURL()
            };
        }

        onMounted(()=>{
            canvas = document.createElement('canvas')
            canvas.width = props.width
            canvas.height = props.height
            if (props.image != undefined){
                drawImage()
            }else{
                drawText()
            }
            
        })

        return {wrapDiv ,canvasDiv ,computeStyle}
    }
})
</script>

<style lang="" scoped></style>
