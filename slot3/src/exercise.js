const double = (x) => x * 2;
console.log(double(7)); // should print 14

const double2 = (x) => {return x * 2;}
console.log(double2(14)); // should print 14

const isEven = (x) => {return x % 2 === 0;}
console.log(isEven(7)); // should print false