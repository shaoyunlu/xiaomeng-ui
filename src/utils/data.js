/** 返回一个树形结构  */
export function tranListToTreeDate(listData, rootValue, idKey, pIdKey) {
    let list = Object.assign([], listData)
    const arr = []
    list.forEach(itemD => {
        let item = Object.assign({}, itemD)
        if (item[pIdKey] == rootValue) {
            const children = tranListToTreeDate(list, item[idKey], idKey, pIdKey)
            if (children.length) {
                item.children = children
            }
            arr.push(item)
        }
    })
    return arr
}

/** 深拷贝一个数组 */
export function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    let clone;
    if (Array.isArray(obj)) {
      clone = [];
      for (let i = 0; i < obj.length; i++) {
        clone[i] = deepClone(obj[i]);
      }
    } else {
      clone = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clone[key] = deepClone(obj[key]);
        }
      }
    }
  
    return clone;
}

export function areArraysEqualDeep(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    const item1 = array1[i];
    const item2 = array2[i];

    const areBothObjects = isObject(item1) && isObject(item2);
    if (areBothObjects) {
      if (!areObjectsEqualDeep(item1, item2)) {
        return false;
      }
    } else if (Array.isArray(item1) && Array.isArray(item2)) {
      if (!areArraysEqualDeep(item1, item2)) {
        return false;
      }
    } else if (item1 !== item2) {
      return false;
    }
  }

  return true;
}

function isObject(item) {
  return item !== null && typeof item === 'object';
}

function areObjectsEqualDeep(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areBothObjects = isObject(val1) && isObject(val2);

    if (
      areBothObjects && !areObjectsEqualDeep(val1, val2) ||
      Array.isArray(val1) && Array.isArray(val2) && !areArraysEqualDeep(val1, val2) ||
      val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

// 判断数据是否为空
export function isEmpty(obj ,withZero = false){

    if (obj == undefined){
        return true
    }
    else if(typeof obj == "string"){
        return !obj
    }
    else if(typeof obj == "object"){
        if (obj instanceof Array)
            return obj.length == 0
        else
            return !obj
    }else if(typeof obj == "number"){
      if (withZero){
          return obj == 0
      }
      return false
    }
}

/**
 * 显示层级数据
 * @param tree {Array} 树数据
 * @param func {Function} 回调函数
 * @param field {String} 字段名称
 * @param path {Array} 路径数据
 * @returns {*[]|[]|*}
 */

export function treeFindPath(tree, func, field = "", path = []) {
    if (!tree) return []
    for (const data of tree) {
      field === "" ? path.push(data) : path.push(data[field]);
      if (func(data)) return path
      if (data.children) {
        const findChildren = treeFindPath(data.children, func, field, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
}

export function find(array ,fn){
    let res = null
    for (let i = 0; i < array.length; i++) {
        let tmp = array[i]
        if (fn(tmp)) {
            res = tmp
            break;
        }
    }
    return res
}

export function filter(array ,fn){
    return array.filter(tmp =>{
        return fn(tmp)
    })
}

export function findNode(nestedArray, value ,type = 'value'){
  for (let item of nestedArray) {
    if (item[type] === value) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      let found = findNode(item.children, value ,type);
      if (found) {
        return found;
      }
    }
  }

  return null;
}
/**
 * 删除对象中的某个属性对象
 */
export function deleteObjectByKey(key='value' ,value, obj){
  if (obj[key] === value){
    return null
  }

  if (obj.children){
    obj.children = obj.children.filter(child => deleteObjectByKey(key ,value ,child) !== null)
    if (obj.children.length === 0){
      delete obj.children
    }
  }

  return obj
}

export function addObjectBefore(key='value' ,value, newObject, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value || arr[i] === value) {
      arr.splice(i, 0, newObject);
    if (arr[i].children) {
      addObjectBefore(key, value, newObject ,arr[i].children);
    }
    break;
    } else if (arr[i].children) {
      addObjectBefore(key, value, newObject ,arr[i].children);
    }
    }
    return arr;
}

export function addObjectAfter(key ,value, newObject ,arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value || arr[i] === value) {
    arr.splice(i + 1, 0, newObject);
    if (arr[i].children) {
      addObjectAfter(key, value, newObject ,arr[i].children);
    }
    break;
    } else if (arr[i].children) {
      addObjectAfter(key, value, newObject ,arr[i].children);
    }
    }
    return arr;
}

export function deleteObjectFromArray(key='value' ,value, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value || arr[i] === value) {
      arr.splice(i, 1); // 使用splice方法删除匹配的对象
      break; // 找到并删除对象后，跳出循环
    }
    if (arr[i].children) {
      deleteObjectFromArray(key ,value, arr[i].children); // 递归地在子对象中查找并删除
      if (arr[i].children.length === 0) {
        delete arr[i].children; // 如果子对象为空数组，则删除children属性
      }
    }
  }
  return arr;
}

export function exchangeObjectFromArray(sourceNode ,targetNode ,arr){
  const obj1Location = __findObject(sourceNode, arr);
  const obj2Location = __findObject(targetNode, arr);

  if (!obj1Location.found || !obj2Location.found) {
    console.error('One or both objects were not found.');
    return;
  }

  // 解构路径以达到最终对象
  const obj1Ref = __getObjectByPath(arr, obj1Location.path);
  const obj2Ref = __getObjectByPath(arr, obj2Location.path);

  // 交换对象
  const temp = obj1Ref.obj;
  obj1Ref.obj = obj2Ref.obj;
  obj2Ref.obj = temp;
}

/**
 * 通过子节点查询父节点
 */
export function findParentNodeByChildNode(nestedArray, value, parents = [] ,type = 'value'){
    for (let item of nestedArray) {
      if (item[type] === value) {
        return parents;
      }

      if (item.children && item.children.length > 0) {
        let newParents = parents.concat(item);
        let foundParents = findParentNodeByChildNode(item.children, value, newParents);
        if (foundParents) {
          return foundParents;
        }
      }
    }
    return null;
}

let uuid = 0
export function generateId(){
    return uuid++
}

// 递归函数来找到对象及其父级
function __findObject(obj, currentArray, path = []) {
  for (let i = 0; i < currentArray.length; i++) {
    if (currentArray[i] === obj) {
      return { found: true, path: [...path, i] };
    }
    if (currentArray[i].children) {
      const result = __findObject(obj, currentArray[i].children, [...path, i, 'children']);
      if (result.found) {
        return result;
      }
    }
  }
  return { found: false };
}

function __getObjectByPath(arr, path) {
  let current = arr;
  for (let i = 0; i < path.length - 1; i++) {
    if (current[path[i]] === undefined) {
      // 如果路径不正确，提前退出
      return undefined;
    }
    current = current[path[i]];
  }
  return {
    get obj() {
      return current[path[path.length - 1]];
    },
    set obj(value) {
      // 设置前检查路径的最后一步是否有效
      if (current !== undefined && path[path.length - 1] !== undefined) {
        current[path[path.length - 1]] = value;
      } else {
        throw new Error('Invalid path to set value');
      }
    }
  };
}