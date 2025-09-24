// dữ liệu ages từ các bài trước
const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

// dùng reduce để tính toàn bộ thống kê
const stats = ages.reduce(
  (acc, age) => {
    // cộng dồn tổng
    acc.total += age;

    // cập nhật min và max
    acc.min = Math.min(acc.min, age);
    acc.max = Math.max(acc.max, age);

    // phân loại vào buckets
    if (age >= 13 && age <= 19) {
      acc.buckets.teen++;
    } else if (age >= 20) {
      acc.buckets.adult++;
    }
    return acc;
  },
  {
    total: 0,
    min: Infinity,
    max: -Infinity,
    buckets: { teen: 0, adult: 0 }
  }
);

// in kết quả
console.log(`Total: ${stats.total}, Min: ${stats.min}, Max: ${stats.max}`);
console.log("Buckets:", stats.buckets);
