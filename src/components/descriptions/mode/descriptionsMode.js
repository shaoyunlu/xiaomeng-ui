import { ref } from "vue"

class DescriptionsMode{
    constructor({column,direction,border}){

      this.trList = ref([])

      this.column = column
      this.direction = direction
      this.border = border

      this.itemList = []
    }

    init(){

      let arr = __createNestedArray(this.itemList ,this.column ,this.direction)
      this.trList.value = arr

    }
}

function __createNestedArray(arr ,column ,direction) {

    let __column = column

    if (direction != 'vertical'){
      __column = __column * 2
    }

    var nestedArray = [];
    var tempArray = [];
  
    for (var i = 0; i < arr.length; i++) {
      tempArray.push(arr[i]);
      // 横向时需要多一个push
      if (direction != 'vertical'){
        tempArray.push(arr[i])
      }
      
      if (tempArray.length === __column) {
        nestedArray.push(tempArray);
        if (direction == 'vertical'){
          nestedArray.push(tempArray);
        }
        tempArray = [];
      }
    }
  
    if (tempArray.length > 0) {
      nestedArray.push(tempArray);
      if (direction == 'vertical'){
        nestedArray.push(tempArray);
      }
    }
  
    return nestedArray;
  }

export default DescriptionsMode