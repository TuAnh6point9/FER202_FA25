// Mảng gốc
const ages = [33, 12, 20, 16];

// Destructuring array
// Cú pháp: [first, , third = 0, ...restAges]
const [first, , third = 0, ...restAges] = ages;

const evenRestAges = restAges.filter(age => age % 2 === 0);
// In kết quả
console.log(first);     // 33  -> phần tử đầu tiên trong mảng
console.log(third);     // 20  -> phần tử thứ 3 (do phần tử này có tồn tại, không dùng mặc định)
console.log(restAges);  // [16] -> gom tất cả phần tử còn lại sau vị trí thứ 3
console.log(evenRestAges); // [16, 40, 54, 44, 64, 32] -> lọc phần tử chẵn từ restAges