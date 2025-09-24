//mảng people chứa các đối tượng với thuộc tính name và age
const people = [
    { name: "Alice", age: 13 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 },
    { name: "Diana", age: 28 },
    { name: "Ethan", age: 19 }
];
//1.filter: tạo mảng mới chỉ chứa những người có tuổi từ 13 tới 19(bao gồm 13 và 19)
//2.map: chuyển thành chuỗi "Tên (tuổi)"
const teens = people
.filter(p => p.age >= 13 && p.age <= 19) //lọc teens
.map(p => `Tên: ${p.name} (${p.age}) tuổi`); //đổi thành chuỗi

//In ra kết quả
teens.forEach(t => console.log(t));
console.log(teens.length); //in ra số lượng phần tử trong mảng teens                    


