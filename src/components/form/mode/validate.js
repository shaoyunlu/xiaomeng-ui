import {isEmpty} from 'utils/data'
const validateMapping = {
    'required' : {vMethod : validateRequired},
    'min' : {vMethod : validateMin},
    'max' : {vMethod : validateMax},
    'email' : {vMethod : validateEmail},
    'number' : {vMethod : validateNumber},
    'integer' : {vMethod : validateInteger}
}

export function validate(val ,ruleList){
    let errorInfo = ''
    if (isEmpty(ruleList)){
        return errorInfo
    }
    ruleList.forEach(rule =>{
        if (errorInfo == ''){
            errorInfo = validateRule(val ,rule)
        }
    })

    return errorInfo
}

function validateRule(val ,rule){
    let errorInfo = ''
    let validateFlag = true
    let keyList = Object.keys(rule)

    for (let i=0;i<keyList.length;i++){
        let key = keyList[i]
        let validateItem = validateMapping[key]
        if (validateItem){
            validateFlag = validateItem.vMethod(val ,rule[key])
            if (!validateFlag.result){
                errorInfo = rule.message || validateFlag.message
                break
            }
        }
    }
    return errorInfo
}

function validateRequired(val){
    return {
        result : !isEmpty(val),
        message : '不能为空'
    }
}

function validateMin(val ,paramVal){
    return {
        result : (val.length >= paramVal),
        message : '最小长度为' + paramVal
    }
}

function validateMax(val ,paramVal){
    return {
        result : (val.length <= paramVal),
        message : '最大长度为' + paramVal
    }
}

function validateEmail(val){
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return {
        result : regex.test(val) || isEmpty(val),
        message : '邮箱地址格式不正确'
    }
}

function validateNumber(val){
    var regex = /^-?\d+(\.\d+)?$/;
    return {
        result : regex.test(val) || isEmpty(val),
        message : '请输入数字格式'
    }
}

function validateInteger(val){
    var regex = /^-?\d+$/;
    return {
        result : regex.test(val) || isEmpty(val),
        message : '请输入数字格式'
    }
}