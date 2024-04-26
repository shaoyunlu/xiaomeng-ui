<template>
    <li @click="handleClick" :class="{'is-active':isActive}">{{data}}</li>
</template>

<script>
import {defineComponent, inject ,nextTick,ref} from 'vue'
export default defineComponent({
    name:"",
    props:{
        data : Number
    },
    setup(props ,context) {

        const {$on ,$emit} = inject('EventBus')
        const isActive = ref(false)

        const handleClick = ()=>{
            context.emit('changeNum' ,props.data)
        }

        $on('changeNum' ,(num)=>{
            nextTick(()=>{
                isActive.value = (props.data == num)
            })
            
        })

        return {isActive,handleClick}
    }
})
</script>

<style lang="" scoped></style>
