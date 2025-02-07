<template>
    <li class="xmv-dropdown-menu__item--divided" v-if="divided"></li>
    <li class="xmv-dropdown-menu__item" :class="{'is-disabled' : disabled}"
        @click="handleClick">
        <xmv-icon :name="icon" v-if="icon != undefined"></xmv-icon>
        <slot></slot>
    </li>
</template>

<script>
import {defineComponent, inject ,ref} from 'vue'
import xmvIcon  from 'comps/icon/icon.vue'
export default defineComponent({
    name:"xmvDropdownItem",
    components:{xmvIcon},
    props:{
        icon : String | Object,
        disabled : Boolean,
        divided : Boolean,
        itemValue : String | Number
    },
    setup(props ,context) {

        const parentContext = inject('Context')
        const popoverRef = inject('PopoverRef')

        const handleClick = ()=>{
            if (props.disabled){
                return false
            }
            parentContext.emit('itemClick' ,props.itemValue)
            popoverRef.value.hide(false,0)
        }
        return {handleClick}
    }
})
</script>

<style lang="" scoped></style>
