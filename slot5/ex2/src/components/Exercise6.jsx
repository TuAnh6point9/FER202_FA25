function Exercise6() {
  // Mảng gốc companies
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

  // 1. Tạo bản sao và sort theo năm kết thúc tăng dần
  const sortedByEnd = [...companies].sort((a, b) => a.end - b.end);

  // 2. Lấy 3 công ty đầu tiên
  const top3 = sortedByEnd.slice(0, 3);

  // -------- Nâng cao --------
  // Tạo thêm mảng mở rộng
  const companiesExtended = [
    ...companies,
    { name: "Company Ten", category: "Health", start: 2000, end: 2020 },
    { name: "Company Eleven", category: "Auto", start: 1995, end: 2005 },
    { name: "Company Twelve", category: "Finance", start: 1980, end: 1985 },
    { name: "Company Thirteen", category: "Technology", start: 2015, end: 2022 }
  ];

  // Sort theo end giảm dần (để so sánh)
  const sortedDesc = [...companiesExtended].sort((a, b) => b.end - a.end);

  // Lấy 5 công ty kết thúc gần đây nhất
  const recent5 = sortedDesc.slice(0, 5);

  // Lấy 3 công ty start sớm nhất
  const earliest3 = [...companiesExtended]
    .sort((a, b) => a.start - b.start)
    .slice(0, 3);

  return (
    <div>
      <h1>Exercise 6</h1>

      {/* Phần cơ bản */}
      <h2>3 công ty đầu tiên theo năm kết thúc (end tăng dần)</h2>
      <ul>
        {top3.map((c, i) => (
          <li key={i}>{c.name} - {c.end}</li>
        ))}
      </ul>


      <h3>5 công ty kết thúc gần đây nhất</h3>
      <ul>
        {recent5.map((c, i) => (
          <li key={i}>{c.name} - {c.end}</li>
        ))}
      </ul>

      <h3>3 công ty khởi đầu sớm nhất</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Tên công ty</th>
            <th>Danh mục</th>
            <th>Năm bắt đầu</th>
            <th>Năm kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {earliest3.map((c, i) => (
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

export default Exercise6;