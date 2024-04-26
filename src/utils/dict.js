export const animateDuration = 300

export const isFirefox = window.navigator.userAgent.indexOf("Firefox") > 0

function getNavigatorInfo(){
    // 获取user agent字符串
    var userAgent = navigator.userAgent;
    var res = new Object()

    // 判断浏览器类型和版本号
    if (userAgent.indexOf("Firefox") > -1) {
        // 火狐浏览器
        var version = userAgent.match(/Firefox\/([0-9\.]+)/)[1];
        res.name = 'Firefox'
        res.version = version
    } else if (userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("CriOS") > -1) {
        // Chrome或者Chrome内核的浏览器（如360浏览器、猎豹浏览器等）
        var version = userAgent.match(/(Chrome|CriOS)\/([0-9\.]+)/)[2];
        res.name = 'Chrome'
        res.version = version
    } else {
        console.log("This is not Firefox or Chrome.");
    }

    return res
}

function compareVersions(version1, version2) {
    const v1 = version1.split('.');
    const v2 = version2.split('.');
    const len = Math.max(v1.length, v2.length);
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]) || 0;
      const num2 = parseInt(v2[i]) || 0;
  
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
  
    return v1.length - v2.length;
  }

export const isLowVersionFirefox = (version)=>{
    
    let res = getNavigatorInfo()
    if (res.name == 'Firefox' && (compareVersions(version ,res.version) > 0)){
        return true
    }else{
        return false
    }
}