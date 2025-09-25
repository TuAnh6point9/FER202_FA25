function Exercise3() {
  // Dữ liệu mẫu
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

  const person = {
    name: "Costas",
    address: {
      street: "Lalaland 12"
    }
  };

  // Destructuring lồng nhau + giá trị mặc định
  const { address: { street, city = "Unknown City" } = {} } = person;

  return (
    <div>
      <h1>Exercise 3</h1>

      <p>Thông tin person:</p>
      <ul>
        <li>Street: {street}</li>
        <li>City: {city}</li>
      </ul>

      <p>Danh sách công ty:</p>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Tên công ty</th>
            <th>Ngành</th>
            <th>Năm bắt đầu</th>
            <th>Năm kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.category}</td>
              <td>{c.start}</td>
              <td>{c.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exercise3;
