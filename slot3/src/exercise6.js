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

//1.Tạo bản sao (spread [...companies])
//2.Sắp xếp theo end tăng dần
const sortedByEnd = [...companies].sort((a, b) => a.end - b.end);

//3.Lấy 3 công ty đầu tiên
const top3 = sortedByEnd.slice(0, 3);

//4.In ra "Company-EndYear"
top3.forEach(c => console.log(`${c.name}-${c.end}`));
