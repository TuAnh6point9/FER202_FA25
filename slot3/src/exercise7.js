const companies = [
  { name: "Company One", category: "Finance", start: 1981, end: 2004 },
  { name: "Company Two", category: "Retail", start: 1992, end: 2008 },
  { name: "Company Three", category: "Auto", start: 1999, end: 2007 },
  { name: "Company Four", category: "Retail", start: 1989, end: 2010 },
  { name: "Company Five", category: "Technology", start: 2009, end: 2014 },
  { name: "Company Six", category: "Finance", start: 1987, end: 2010 },
  { name: "Company Seven", category: "Auto", start: 1986, end: 1996 },
  { name: "Company Eight", category: "Technology", start: 2011, end: 2016 },
  { name: "Company Nine", category: "Retail", start: 1981, end: 1989 }
];

// 1. Tạo company0New từ companies[0], thay đổi start += 1
//    Dùng spread để copy và chỉnh sửa, không ảnh hưởng đến object gốc
const company0New = { ...companies[0], start: companies[0].start + 1 };

console.log("Original:", companies[0]);   // { start: 1981, ... }
console.log("New:", company0New);         // { start: 1982, ... }

// 2. Viết hàm concatAll dùng rest parameter (...arrays)
const concatAll = (...arrays) => {
  // spread để gộp tất cả các mảng truyền vào
  return arrays.reduce((acc, cur) => [...acc, ...cur], []);
};

// 3. Test concatAll
console.log(concatAll([1, 2], [3], [4, 5])); // [1, 2, 3, 4, 5]