export function Exercise2 () {
//1. Tạo mảng số nguyên, in ra danh sách thẻ list 
const numbers = [1, 12, -3, 4, 15, 20, -10, 8, 7, 6];
//2.Tính tổng các phần tử trong mảng
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
//3. Tính giá trị trung bình của mảng đó
const average = sum / numbers.length;
//4. Khai sáng chuỗi names, in ra danh sách các tên,
//theo thứ tự tăng dần Alphabet
const names = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Hùng', 
    'Minh', 'Nam', 'Quân', 'Tuấn'];
    names.sort(); //Sắp xếp mảng names theo thứ tự tăng dần Alphabet
//5.Khai báo đối tượng 1 mảng student chứa 10 đối tượng students

//Mỗi đối tượng student có các thuộc tính: id, name, age, grade
//{ id là số nguyên, name là chuỗi, age là số nguyên, grade là số thực}
const students = [
    { id: 1, name: 'An', age: 20, grade: 8.5 },
    { id: 2, name: 'Bình', age: 21, grade: 7.0 },
    { id: 3, name: 'Cường', age: 19, grade: 9.0 },
    { id: 4, name: 'Dũng', age: 22, grade: 6.5 },
    { id: 5, name: 'Hà', age: 20, grade: 8.0 },
    { id: 6, name: 'Hùng', age: 21, grade: 7.5 },
    { id: 7, name: 'Minh', age: 19, grade: 9.5 },
    { id: 8, name: 'Nam', age: 22, grade: 6.0 },
    { id: 9, name: 'Quân', age: 20, grade: 8.8 },
    { id: 10, name: 'Tuấn', age: 21, grade: 7.2 },
];
//In ra danh sách student có grade >= 7,5, sắp xếp theo grade giảm dần
const topStudents = students
    .filter(student => student.grade >= 7.5)
    .sort((a, b) => b.grade - a.grade);
    //In ra danh sách top Students dưới dạng bảng

// Tính tổng và trung bình điểm của topStudents
const topTotal = topStudents.reduce((acc, s) => acc + (s.grade || 0), 0);
const topAverage = topStudents.length > 0 ? topTotal / topStudents.length : 0;

    return (
        <div>
            <h1>Exercise 2</h1> 
            <p>Tổng số nguyên:</p>
            <ul>
                {numbers.map((number, i) => (
                    <li key={i}>Phần tử thứ {i}-{number}</li>
                ))}
            </ul>
            <p>Tổng các phần tử của mảng: {sum} </p> 
            <p>Giá trị trung các phần tử trong mảng: {average.toFixed(2)}</p>
            <p>Danh sách tên theo thứ tự tăng dần Alphabet:</p>
            <ul>
                {names.map((name, i) => (
                    <li key={i}>Tên thứ {i}-{name}</li>
                ))}
            </ul>
            <p>Hiển thị danh sách topStudents dưới dạng bảng:</p>
            <p>Tổng điểm top students: {topTotal}</p>
            <p>Điểm trung bình top students: {topAverage.toFixed(2)}</p>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {topStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.age}</td>
                            <td>{student.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}