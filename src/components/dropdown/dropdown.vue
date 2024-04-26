<template>

    <div class="xmv-dropdown" v-if="splitButton">
        <xmv-button-group>
            <xmv-button :type="type" :size="size">
                <slot></slot>
            </xmv-button>

            <xmv-popover :trigger="trigger" pop-class="xmv-dropdown__popper" ref="popoverRef" :is-align-center="isAlignCenter">
                <template #trigger>
                    <xmv-button :type="type" :size="size">
                        <xmv-icon name="arrowDown"></xmv-icon>
                    </xmv-button>
                </template>
                <slot name="dropdown"></slot>
            </xmv-popover>
        </xmv-button-group>
    </div>

    <xmv-popover v-if="!splitButton" 
                :trigger="trigger" :pop-class="'xmv-dropdown__popper ' + extraClass" 
                ref="popoverRef" :is-align-center="isAlignCenter">
        <template #trigger>
            <div class="xmv-dropdown">
                <slot></slot>
            </div>
        </template>
        <slot name="dropdown"></slot>
    </xmv-popover>
</template>

<script>
import {defineComponent, provide ,ref} from 'vue'
export default defineComponent({
    name:"xmvDropdown",
    emits:['itemClick'],
    props:{
        trigger : {type : String ,default : 'hover'},
        splitButton : {type : Boolean ,default : false},
        type : {type : String ,default : 'primary'},
        size : {type : String},
        extraClass : {type :String ,default : ''},
        isAlignCenter : {type : Boolean ,default : true}
    },
    setup(props ,context) {
        const popoverRef = ref(null)
        provide('Context' ,context)
        provide('PopoverRef' ,popoverRef)
        provide('Size' ,props.size)
        return {popoverRef}
    }
})
</script>

<style lang="" scoped></style>
