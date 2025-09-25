function Exercise7() {
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

  // Copy object bằng spread, chỉnh sửa nhưng không ảnh hưởng gốc
  const company0New = { ...companies[0], start: companies[0].start + 1 };
  const company1New = { ...companies[1], end: companies[1].end + 2 };

  // Hàm gộp mảng dùng rest + spread
  const concatAll = (...arrays) => arrays.reduce((acc, cur) => [...acc, ...cur], []);

  // Gộp tên công ty thành một mảng
  const companyNames = companies.map(c => c.name);
  const moreNames = ["Company Ten", "Company Eleven"];
  const mergedNames = concatAll(companyNames, moreNames);

  return (
    <div>
      <h1>Exercise 7</h1>

      <p>Danh sách companies:</p>
      <ul>
        {companies.map((c, i) => (
          <li key={i}>
            {c.name} - {c.category} - {c.start} → {c.end}
          </li>
        ))}
      </ul>

      <p>So sánh object gốc và bản sao:</p>
      <p>Gốc: {companies[0].name} - Start: {companies[0].start}</p>
      <p>Bản sao: {company0New.name} - Start: {company0New.start}</p>

      <p>Gốc: {companies[1].name} - End: {companies[1].end}</p>
      <p>Bản sao: {company1New.name} - End: {company1New.end}</p>

      <p>Kết quả concatAll(companyNames, moreNames): [{mergedNames.join(", ")}]</p>
    </div>
  );
}

export default Exercise7;