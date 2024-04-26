export function coverNum(val){
    if (val < 10){
        return '0' + parseInt(val)
    }
    return val
}

export function sortIndexesByDistance(arr, index) {
    const distances = [];
    for (let i = 0; i < arr.length; i++) {
        const distance = Math.abs(i - index);
        distances.push({ index: i, distance: distance });
    }
    distances.sort((a, b) => a.distance - b.distance);
    const sortedIndexes = distances.map((item) => item.index);
    return sortedIndexes;
}