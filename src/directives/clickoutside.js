export default{
    mounted(el, binding) {
        // 点击元素外部时触发的回调函数
        const handleClickOutside = (event) => {
          if (!el.contains(event.target) && el !== event.target) {
            binding.value();
          }
        };
    
        // 添加事件监听器
        document.addEventListener('click', handleClickOutside);
    
        // 在元素上存储事件监听器，以便在 unmounted 时进行清理
        el._clickoutside = handleClickOutside;
      },
      unmounted(el) {
        // 清理事件监听器
        document.removeEventListener('click', el._clickoutside);
        delete el._clickoutside;
      }
}