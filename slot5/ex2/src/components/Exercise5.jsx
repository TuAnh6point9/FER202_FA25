function Exercise5() {
  // Mảng gốc
  const people = [
    { name: "Alice", age: 13 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 },
    { name: "Diana", age: 28 },
    { name: "Ethan", age: 19 }
  ];

  // Mảng mở rộng
  const peopleExtended = [
    { name: "Fiona", age: 17 },
    { name: "George", age: 14 },
    { name: "Hannah", age: 22 },
    { name: "Ivan", age: 15 },
    { name: "Julia", age: 18 },
    { name: "Kevin", age: 13 },
    { name: "Laura", age: 16 },
    { name: "Mike", age: 19 },
    { name: "Nina", age: 20 },
    { name: "Oscar", age: 29 }
  ];

  // Cơ bản: teen trong mảng gốc
  const teens = people.filter(p => p.age >= 13 && p.age <= 19);
  const teenStrings = teens.map(p => `Tên: ${p.name} (${p.age}) tuổi`);

  // Nâng cao: teen trong mảng mở rộng
  const teensExtended = peopleExtended.filter(p => p.age >= 13 && p.age <= 19);
  const totalAge = teensExtended.reduce((acc, p) => acc + p.age, 0);
  const averageAge = teensExtended.length > 0 ? totalAge / teensExtended.length : 0;

  const youngerTeens = teensExtended.filter(p => p.age < 16);
  const olderTeens = teensExtended.filter(p => p.age >= 16);

  return (
    <div>
      <h1>Exercise 5</h1>

      {/* Phần cơ bản */}
      <h2>Cơ bản: Danh sách teen (từ mảng gốc)</h2>
      <ul>
        {teenStrings.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <p>Tổng số teen (mảng gốc): {teens.length}</p>

      {/* Phần nâng cao */}
      <h2>Nâng cao: Danh sách teen (từ mảng mở rộng)</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tuổi</th>
          </tr>
        </thead>
        <tbody>
          {teensExtended.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Tổng số teen (mảng mở rộng): {teensExtended.length}</p>
      <p>Tổng tuổi: {totalAge}</p>
      <p>Tuổi trung bình: {averageAge.toFixed(2)}</p>

      <h3>Nhóm teen nhỏ hơn 16 tuổi:</h3>
      <ul>
        {youngerTeens.map((p, i) => (
          <li key={i}>{p.name} ({p.age})</li>
        ))}
      </ul>

      <h3>Nhóm teen từ 16 tuổi trở lên:</h3>
      <ul>
        {olderTeens.map((p, i) => (
          <li key={i}>{p.name} ({p.age})</li>
        ))}
      </ul>
    </div>
  );
}

export default Exercise5;