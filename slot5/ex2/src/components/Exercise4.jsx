function Exercise4() {

  const basicAges = [33, 12, 20, 16];
  const [first, , third = 0, ...restBasic] = basicAges;
  const evenRestBasic = restBasic.filter(age => age % 2 === 0);

  const extendedAges = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 25, 64, 32];

  // Destructuring cơ bản trên mảng mở rộng
  const [extFirst, , extThird = 0, ...restExt] = extendedAges;
  const evenRestExt = restExt.filter(age => age % 2 === 0);
  const totalExt = restExt.reduce((sum, val) => sum + val, 0);
  const avgExt = restExt.length > 0 ? (totalExt / restExt.length).toFixed(2) : 0;

  // Ví dụ 2: lấy 3 phần tử đầu, còn lại gom vào others
  const [age1, age2, age3, ...others] = extendedAges;

  // Ví dụ 3: lấy phần tử đầu và cuối
  const [firstAge, , , , , , , , , , , , lastAge] = extendedAges;

  // Ví dụ 4: destructuring với mảng ngắn
  const shortAges = [40, 50];
  const [firstShort, , thirdShort = 0, ...restShort] = shortAges;

  return (
    <div>
      <h1>Exercise 4</h1>
      <p><b>Mảng gốc basicAges:</b></p>
      <ul>
        {basicAges.map((age, i) => (
          <li key={i}>Phần tử thứ {i}: {age}</li>
        ))}
      </ul>

      <p><b>Kết quả destructuring:</b></p>
      <ul>
        <li>first: {first}</li>
        <li>third (mặc định 0 nếu không tồn tại): {third}</li>
        <li>restBasic: [{restBasic.join(", ")}]</li>
        <li>Các số chẵn trong restBasic: [{evenRestBasic.join(", ")}]</li>
      </ul>
      <p><b>Mảng mở rộng extendedAges:</b></p>
      <ul>
        {extendedAges.map((age, i) => (
          <li key={i}>Phần tử thứ {i}: {age}</li>
        ))}
      </ul>

      <p><b>Kết quả destructuring trên mảng mở rộng:</b></p>
      <ul>
        <li>extFirst: {extFirst}</li>
        <li>extThird (mặc định 0 nếu không tồn tại): {extThird}</li>
        <li>restExt: [{restExt.join(", ")}]</li>
        <li>Các số chẵn trong restExt: [{evenRestExt.join(", ")}]</li>
        <li>Tổng restExt: {totalExt}</li>
        <li>Trung bình restExt: {avgExt}</li>
      </ul>

      <p><b>Ví dụ 2: Lấy 3 phần tử đầu và gom phần còn lại</b></p>
      <ul>
        <li>age1: {age1}</li>
        <li>age2: {age2}</li>
        <li>age3: {age3}</li>
        <li>others: [{others.join(", ")}]</li>
      </ul>

      <p><b>Ví dụ 3: Lấy phần tử đầu và cuối</b></p>
      <ul>
        <li>firstAge: {firstAge}</li>
        <li>lastAge: {lastAge}</li>
      </ul>

      <p><b>Ví dụ 4: Mảng ngắn shortAges = [{shortAges.join(", ")}]</b></p>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Biến</th>
            <th>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>firstShort</td>
            <td>{firstShort}</td>
          </tr>
          <tr>
            <td>thirdShort (default 0)</td>
            <td>{thirdShort}</td>
          </tr>
          <tr>
            <td>restShort</td>
            <td>[{restShort.join(", ")}]</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Exercise4;