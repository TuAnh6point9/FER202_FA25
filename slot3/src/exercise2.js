const sum = (...nums) => {
    return nums
    .filter(n => typeof n === 'number' && !isNaN(n))
    .reduce((acc, cur) => acc + cur, 0);
};

const avg = (...nums) => {
    const validNums = nums.filter(n => typeof n === 'number' && !isNaN(n));
    if (validNums.length === 0) return 0;
    const total = validNums.reduce((acc, cur) => acc + cur, 0);
     return (total / validNums.length).toFixed(2);
};

console.log(sum(1,2,3,4,5)); 
console.log(sum(1,2,'x',4,5)); 
console.log(avg(1,2,3,4,5)); 
console.log(avg());
