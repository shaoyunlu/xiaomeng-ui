<template>

</template>

<script>
import {defineComponent, h, nextTick, onMounted ,ref} from 'vue'
import {removeClass} from 'utils/dom'
export default defineComponent({
    name:"xmvTransitionGroup",
    props:{
        tag : {type:String ,default:'ul'},
        name : {type:String ,default:'xmv'}
    },
    emits:['after-leave'],
    setup({name ,tag} ,{slots ,emit}) {

        const elRef = ref(null)

        let transitionDuration = 0

        const getTransitionDuration = ()=>{
            let el = document.createElement('div')
            document.body.appendChild(el)
            el.setAttribute('class' ,name + '-enter-active')
            let styles = window.getComputedStyle(el);
            transitionDuration = parseFloat(styles.transitionDuration) * 1000 
            el.remove()
        }

        const inAnimation = (el)=>{
            if (!el)
                return false
            nextTick(()=>{
                el.classList.add(name + '-enter-active' ,name + '-enter-from')
                setTimeout(()=>{
                    removeClass(el ,name + '-enter-active')
                    removeClass(el ,name + '-enter-from')
                } ,10)
            })
        }

        const copyPosition = (node ,nextNode)=>{
            let disX = nextNode.offsetLeft - node.offsetLeft
            let disY = nextNode.offsetTop - node.offsetTop
            nextNode.style.transition = 'none'
            nextNode.style.transform = `translate(${disX}px ,${disY}px)`
        }

        const findLastChild = (el)=>{
            let resNode
            let children = el.children
            for (let i = children.length -1; i>=0;i--){
                let childNode = children[i]
                if (!childNode.classList.contains('xmv-filter')){
                    resNode = childNode
                    break;
                }
            }
            return resNode
        }

        onMounted(()=>{
            getTransitionDuration()
            let observer = new MutationObserver((record)=>{
                let item = record[0]

                // 进场动画
                if (item.target.localName == tag){
                    let lastChild = findLastChild(item.target)
                    inAnimation(lastChild)
                }

                // 元素删除动画
                if (item.attributeName == 'style' && item.target.style.display == 'none' 
                    && item.target.localName != tag && item.type == 'attributes'){

                    item.target.style.display = ''

                    let cNode = item.target
                    let siblingList = []
                    while(cNode.nextElementSibling ){    
                        siblingList.push(cNode.nextElementSibling)
                        copyPosition(cNode ,cNode.nextElementSibling)
                        cNode = cNode.nextElementSibling
                    }

                    item.target.style.left = item.target.offsetLeft + 'px'
                    item.target.style.top = item.target.offsetTop + 'px'
                    item.target.classList.add(name + '-leave-active' ,name + '-leave-to');

                    setTimeout(()=>{
                        siblingList.forEach(node =>{
                            node.style.removeProperty('transition');
                            node.style.transform = `translate(0px ,0px)`
                        })

                        nextTick(()=>{
                            siblingList.forEach(node =>{
                                node.removeAttribute('style')
                            })
                        })
                    },10)

                    setTimeout(()=>{
                        item.target.remove()
                        emit('after-leave')
                    } ,transitionDuration)
                }
            })
            observer.observe(elRef.value ,{subtree : true,childList : true ,attributes : true})

            // 进场动画
            const children = elRef.value.children
            for (let i=0;i<children.length;i++){
                children[i].classList.add(name + '-enter-active' ,name + '-enter-from')
            }

            nextTick(()=>{
                for (let i=0;i<children.length;i++){
                    removeClass(children[i] ,name + '-enter-active')
                    removeClass(children[i] ,name + '-enter-from')
                }
            })
        })

        return ()=>{
            let renderSlot = []
            let defaultSlot = slots.default ? slots.default() : null;
            
            if (defaultSlot)
            {
                if (defaultSlot && defaultSlot.length > 0)
                {
                    defaultSlot.forEach((__slot) => {
                        renderSlot.push(h(__slot ,{

                        }));
                    });
                }
            }

            return h(tag ,{ref:elRef} ,renderSlot)
        }
    }
})
</script>

<style lang="" scoped></style>
