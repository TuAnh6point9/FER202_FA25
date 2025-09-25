function Exercise8() {
  const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

  const stats = ages.reduce(
    (acc, age) => {
      acc.total += age;
      acc.min = Math.min(acc.min, age);
      acc.max = Math.max(acc.max, age);

      // phân loại nhóm
      if (age < 13) {
        acc.buckets.child.count++;
        acc.buckets.child.sum += age;
      } else if (age >= 13 && age <= 19) {
        acc.buckets.teen.count++;
        acc.buckets.teen.sum += age;
      } else if (age >= 20 && age < 60) {
        acc.buckets.adult.count++;
        acc.buckets.adult.sum += age;
      } else {
        acc.buckets.senior.count++;
        acc.buckets.senior.sum += age;
      }

      return acc;
    },
    {
      total: 0,
      min: Infinity,
      max: -Infinity,
      buckets: {
        child: { count: 0, sum: 0 },
        teen: { count: 0, sum: 0 },
        adult: { count: 0, sum: 0 },
        senior: { count: 0, sum: 0 },
      },
    }
  );

  const average = (stats.total / ages.length).toFixed(2);

  return (
    <div>
      <h1>Exercise 8</h1>

      <p>Mảng gốc ages: [{ages.join(", ")}]</p>

      <p>
        Total: {stats.total}, Min: {stats.min}, Max: {stats.max}, Average:{" "}
        {average}
      </p>

      <h3>Thống kê theo nhóm:</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Nhóm</th>
            <th>Số lượng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Child (&lt;13)</td>
            <td>{stats.buckets.child.count}</td>
            <td>{stats.buckets.child.sum}</td>
          </tr>
          <tr>
            <td>Teen (13–19)</td>
            <td>{stats.buckets.teen.count}</td>
            <td>{stats.buckets.teen.sum}</td>
          </tr>
          <tr>
            <td>Adult (20–59)</td>
            <td>{stats.buckets.adult.count}</td>
            <td>{stats.buckets.adult.sum}</td>
          </tr>
          <tr>
            <td>Senior (≥60)</td>
            <td>{stats.buckets.senior.count}</td>
            <td>{stats.buckets.senior.sum}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Exercise8;