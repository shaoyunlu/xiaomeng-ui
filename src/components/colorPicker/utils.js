export function rgbTobinary(str){
    const arr = str.slice(4, -1).split(',').map(Number);
    const hex = '#' + arr.map(c => c.toString(16).padStart(2, '0')).join('');
    return hex.toUpperCase()
}

export function binaryToRgb(hex){
    const arr = hex.slice(1).match(/.{2}/g).map(h => parseInt(h, 16));
    const rgb = `rgb(${arr[0]},${arr[1]},${arr[2]})`;
    return rgb
}