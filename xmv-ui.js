import 'style/app.less'
import {reactive} from 'vue'
import xmvLayout from 'comps/layout/layout.vue'
import xmvButton from 'comps/button/button.vue'
import xmvButtonGroup from 'comps/button/buttonGroup.vue'
import xmvMenu from 'comps/menu/menu.vue'
import xmvMenuCore from 'comps/menu/menuCore.vue'
import xmvMenuCoreCollapse from 'comps/menu/menuCoreCollapse.vue'
import xmvMenuCoreHorizontal from 'comps/menu/menuCoreHorizontal.vue'
import xmvPopover from 'comps/popover/popover.vue'
import xmvTooltip from 'comps/tooltip/tooltip.vue'
import xmvScrollbar from 'comps/scrollbar/scrollbar.vue'
import xmvTable from 'comps/table/table.vue'
import xmvTableColumn from 'comps/table/tableColumn.vue'
import xmvIcon from 'comps/icon/icon.vue'
import xmvRow from 'comps/rowcol/row.vue'
import xmvCol from 'comps/rowcol/col.vue'
import xmvInput from 'comps/input/input.vue'
import xmvInputNumber from 'comps/inputNumber/inputNumber.vue'
import xmvSelect from 'comps/select/select.vue'
import xmvOption from 'comps/select/option.vue'
import xmvSelectTags from 'comps/select/tags.vue'
import xmvTag from 'comps/tag/tag.vue'
import xmvRadioGroup from 'comps/radio/radioGroup.vue'
import xmvRadio from 'comps/radio/radio.vue'
import xmvRadioButton from 'comps/radio/radioButton.vue'
import xmvCheckbox from 'comps/checkbox/checkbox.vue'
import xmvCheckboxGroup from 'comps/checkbox/checkboxGroup.vue'
import xmvCheckboxButton from 'comps/checkbox/checkboxButton.vue'
import xmvDatePicker from 'comps/datePicker/datePicker.vue'
import xmvTimePicker from 'comps/timePicker/timePicker.vue'
import xmvTree from 'comps/tree/tree.vue'
import xmvTreeNode from 'comps/tree/treeNode.vue'
import xmvTreeSelect from 'comps/treeSelect/treeSelect.vue'
import xmvDialog from 'comps/dialog/dialog.vue'
import xmvForm from 'comps/form/form.vue'
import xmvFormItem from 'comps/form/formItem.vue'
import xmvColorPicker from 'comps/colorPicker/colorPicker.vue'
import xmvDrawer from 'comps/drawer/drawer.vue'
import xmvTabs from 'comps/tabs/tabs.vue'
import xmvTabPanel from 'comps/tabs/panel.vue'
import xmvPagination from 'comps/pagination/pagination.vue'
import xmvDivider from 'comps/divider/divider.vue'
import xmvCard from 'comps/card/card.vue'
import xmvSpace from 'comps/space/space.vue'
import xmvSwitch from 'comps/switch/switch.vue'
import xmvEmpty from 'comps/empty/empty.vue'
import xmvUpload from 'comps/upload/upload.vue'
import xmvTransitionGroup from 'comps/transition/transitionGroup.vue'
import xmvCollapse from 'comps/collapse/collapse.vue'
import xmvCollapseItem from 'comps/collapse/collapseItem.vue'
import xmvCarousel from 'comps/carousel/carousel.vue'
import xmvCarouselItem from 'comps/carousel/carouselItem.vue'
import xmvAffix from 'comps/affix/affix.vue'
import xmvImage from 'comps/image/image.vue'
import xmvBreadcrumb from 'comps/breadcrumb/breadcrumb.vue'
import xmvBreadcrumbItem from 'comps/breadcrumb/breadcrumbItem.vue'
import xmvBacktop from 'comps/backtop/backtop.vue'
import xmvCascader from 'comps/cascader/cascader.vue'
import xmvSlider from 'comps/slider/slider.vue'
import xmvBadge from 'comps/badge/badge.vue'
import xmvDescriptions from 'comps/descriptions/descriptions.vue'
import xmvDescriptionsItem from 'comps/descriptions/descriptionsItem.vue'
import xmvDropdown from 'comps/dropdown/dropdown.vue'
import xmvDropdownMenu from 'comps/dropdown/dropdownMenu.vue'
import xmvDropdownItem from 'comps/dropdown/dropdownItem.vue'
import xmvPageHeader from 'comps/pageHeader/pageHeader.vue'
import xmvAlert from 'comps/alert/alert.vue'
import xmvWatermark from 'comps/watermark/watermark.vue'
import xmvPageRoam from 'comps/pageroam/pageroam.vue'
import xmvPageRoamList from 'comps/pageroam/pageroamlist.vue'
import xmvPageRoamItem from 'comps/pageroam/pageroamitem.vue'

import loadingDirective from 'comps/loading/directive'
import clickoutsideDirective from 'directives/clickoutside.js'
import XmvLoading from 'comps/loading/loading'
import XmvMessageBox from 'comps/messageBox/messageBox.js'
import XmvMessage from 'comps/message/message.js'
import XmvNotification from 'comps/notification/notification.js'

import {createEventBus} from 'utils/event'

const register = (vue)=>{

    const {provide} = vue

    const eventBus = reactive({
        listeners : {}
    })

    const {$on ,$emit ,$remove} = createEventBus(eventBus)

    // 创建一个xmv-popper-container
    const popperContainerDiv = document.createElement('div')
    popperContainerDiv.id = 'xmv-popper-container'
    document.body.appendChild(popperContainerDiv)

    provide('Xmv-Dom-PopperContainer' ,popperContainerDiv)
    provide('Xmv-Event-Emit' ,$emit)
    provide('Xmv-Event-On' ,$on)
    provide('Xmv-Event-Remove' ,$remove)
    provide('Xmv-Bubbling' ,{status : true})

    // 分发各种事件
    window.addEventListener('mouseup' ,(e)=>{
        $emit('mouseup' ,e)
    })

    window.addEventListener('scroll' ,(e)=>{
        $emit('scroll' ,e)
    })

    vue.component('xmvLayout', xmvLayout)
    vue.component('xmvButton', xmvButton)
    vue.component('xmvButtonGroup', xmvButtonGroup)
    vue.component('xmvMenu', xmvMenu)
    vue.component('xmvMenuCore', xmvMenuCore)
    vue.component('xmvMenuCoreCollapse', xmvMenuCoreCollapse)
    vue.component('xmvMenuCoreHorizontal', xmvMenuCoreHorizontal)
    vue.component('xmvPopover', xmvPopover)
    vue.component('xmvTooltip', xmvTooltip)
    vue.component('xmvScrollbar', xmvScrollbar)
    vue.component('xmvTable', xmvTable)
    vue.component('xmvTableColumn', xmvTableColumn)
    vue.component('xmvIcon', xmvIcon)
    vue.component('xmvRow', xmvRow)
    vue.component('xmvCol', xmvCol)
    vue.component('xmvInput', xmvInput)
    vue.component('xmvInputNumber', xmvInputNumber)
    vue.component('xmvSelect', xmvSelect)
    vue.component('xmvOption', xmvOption)
    vue.component('xmvSelectTags', xmvSelectTags)
    vue.component('xmvTag', xmvTag)
    vue.component('xmvRadioGroup', xmvRadioGroup)
    vue.component('xmvRadio', xmvRadio)
    vue.component('xmvRadioButton', xmvRadioButton)
    vue.component('xmvCheckbox', xmvCheckbox)
    vue.component('xmvCheckboxGroup', xmvCheckboxGroup)
    vue.component('xmvCheckboxButton', xmvCheckboxButton)
    vue.component('xmvDatePicker', xmvDatePicker)
    vue.component('xmvTimePicker', xmvTimePicker)
    vue.component('xmvTree', xmvTree)
    vue.component('xmvTreeNode', xmvTreeNode)
    vue.component('xmvTreeSelect', xmvTreeSelect)
    vue.component('xmvDialog', xmvDialog)
    vue.component('xmvForm', xmvForm)
    vue.component('xmvFormItem', xmvFormItem)
    vue.component('xmvColorPicker', xmvColorPicker)
    vue.component('xmvDrawer' ,xmvDrawer)
    vue.component('xmvTabs' ,xmvTabs)
    vue.component('xmvTabPanel' ,xmvTabPanel)
    vue.component('xmvPagination' ,xmvPagination)
    vue.component('xmvDivider' ,xmvDivider)
    vue.component('xmvCard' ,xmvCard)
    vue.component('xmvSpace' ,xmvSpace)
    vue.component('xmvSwitch' ,xmvSwitch)
    vue.component('xmvEmpty' ,xmvEmpty)
    vue.component('xmvUpload' ,xmvUpload)
    vue.component('xmvTransitionGroup' ,xmvTransitionGroup)
    vue.component('xmvCollapse' ,xmvCollapse)
    vue.component('xmvCollapseItem' ,xmvCollapseItem)
    vue.component('xmvCarousel' ,xmvCarousel)
    vue.component('xmvCarouselItem' ,xmvCarouselItem)
    vue.component('xmvAffix' ,xmvAffix)
    vue.component('xmvImage' ,xmvImage)
    vue.component('xmvBreadcrumb' ,xmvBreadcrumb)
    vue.component('xmvBreadcrumbItem' ,xmvBreadcrumbItem)
    vue.component('xmvBacktop' ,xmvBacktop)
    vue.component('xmvCascader' ,xmvCascader)
    vue.component('xmvSlider' ,xmvSlider)
    vue.component('xmvBadge' ,xmvBadge)
    vue.component('xmvDescriptions' ,xmvDescriptions)
    vue.component('xmvDescriptionsItem' ,xmvDescriptionsItem)
    vue.component('xmvDropdown' ,xmvDropdown)
    vue.component('xmvDropdownMenu' ,xmvDropdownMenu)
    vue.component('xmvDropdownItem' ,xmvDropdownItem)
    vue.component('xmvPageHeader' ,xmvPageHeader)
    vue.component('xmvAlert' ,xmvAlert)
    vue.component('xmvWatermark' ,xmvWatermark)
    vue.component('xmvPageRoam' ,xmvPageRoam)
    vue.component('xmvPageRoamList' ,xmvPageRoamList)
    vue.component('xmvPageRoamItem' ,xmvPageRoamItem)

    vue.directive('loading', loadingDirective);
    vue.directive('clickoutside', clickoutsideDirective);
}

export {XmvLoading ,XmvMessageBox ,XmvMessage ,XmvNotification}
export default register