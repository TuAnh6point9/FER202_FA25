# 🧪 SCRIPT DEMO & TEST

## 📋 CÁC BƯỚC TEST CHI TIẾT

### **PHẦN 1: TEST AUTHENTICATION (Yêu cầu 1)**

#### ✅ Test Case 1: Admin + Active → Thành công
```
Bước 1: Mở trình duyệt tại http://localhost:3000
Bước 2: Nhập thông tin:
   - Username: nam123
   - Password: 123456
Bước 3: Click "Login"
Kết quả mong đợi:
   ✓ Hiển thị modal "Login Successful!"
   ✓ Chuyển hướng đến /home (Dashboard)
   ✓ Hiển thị "Signed in as: Nguyễn Văn Nam"
```

#### ❌ Test Case 2: User + Active → Thất bại (Không phải admin)
```
Bước 1: Logout (nếu đang đăng nhập)
Bước 2: Nhập thông tin:
   - Username: hainguyen
   - Password: 123456
Bước 3: Click "Login"
Kết quả mong đợi:
   ✓ Hiển thị Alert màu đỏ
   ✓ Nội dung: "Bạn không có quyền truy cập. Chỉ Admin mới có thể đăng nhập!"
   ✓ KHÔNG chuyển hướng
```

#### ❌ Test Case 3: Admin + Blocked → Thất bại (Tài khoản bị khóa)
```
Bước 1: Logout (nếu đang đăng nhập)
Bước 2: Nhập thông tin:
   - Username: thanh123
   - Password: 123456
Bước 3: Click "Login"
Kết quả mong đợi:
   ✓ Hiển thị Alert màu đỏ
   ✓ Nội dung: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!"
   ✓ KHÔNG chuyển hướng
```

#### ❌ Test Case 4: User + Locked → Thất bại (Không phải admin)
```
Bước 1: Logout (nếu đang đăng nhập)
Bước 2: Nhập thông tin:
   - Username: thanhpt
   - Password: 123456
Bước 3: Click "Login"
Kết quả mong đợi:
   ✓ Hiển thị Alert màu đỏ
   ✓ Nội dung: "Bạn không có quyền truy cập. Chỉ Admin mới có thể đăng nhập!"
   ✓ KHÔNG chuyển hướng
```

---

### **PHẦN 2: TEST NAVIGATION (Yêu cầu 2)**

#### ✅ Test Case 5: Hiển thị link User Management
```
Bước 1: Đăng nhập với nam123
Bước 2: Quan sát thanh Navigation
Kết quả mong đợi:
   ✓ Thấy 3 links: Dashboard, Payment Management, User Management
   ✓ Link "User Management" hiển thị rõ ràng
```

#### ✅ Test Case 6: Click vào User Management
```
Bước 1: Click vào "User Management"
Kết quả mong đợi:
   ✓ URL chuyển thành http://localhost:3000/users
   ✓ Trang UserList hiển thị
   ✓ Link "User Management" được highlight (active)
```

---

### **PHẦN 3: TEST USER MANAGEMENT (Yêu cầu 3)**

#### 🔍 Test Case 7: Hiển thị danh sách users
```
Bước 1: Vào trang /users
Kết quả mong đợi:
   ✓ Thấy UserFilter (phần tìm kiếm/lọc)
   ✓ Thấy UserTable với các cột: ID, Username, Họ và Tên, Role, Status, Action
   ✓ Hiển thị đúng số lượng users (4 users)
   ✓ Badge Role: Admin (đỏ), User (xanh)
   ✓ Badge Status: Active (xanh), Blocked (đỏ), Locked (vàng)
```

#### 🔎 Test Case 8: Tìm kiếm users
```
Bước 1: Nhập "nguyen" vào ô "Tìm kiếm"
Kết quả mong đợi:
   ✓ Hiển thị 3 users: Nguyễn Văn Nam, Nguyễn Hải, Nguyễn Văn Thanh
   ✓ Không hiển thị Phạm Thanh

Bước 2: Xóa và nhập "nam"
Kết quả mong đợi:
   ✓ Hiển thị 2 users: Nguyễn Văn Nam (nam123), Nguyễn Văn Thanh (có chữ "nam")
```

#### 🎛️ Test Case 9: Lọc theo Role
```
Bước 1: Chọn Role = "Admin"
Kết quả mong đợi:
   ✓ Hiển thị 2 users: nam123, thanh123
   ✓ Không hiển thị user role

Bước 2: Chọn Role = "User"
Kết quả mong đợi:
   ✓ Hiển thị 2 users: hainguyen, thanhpt
   ✓ Không hiển thị admin role
```

#### 🎛️ Test Case 10: Lọc theo Status
```
Bước 1: Chọn Status = "Active"
Kết quả mong đợi:
   ✓ Hiển thị 2 users: nam123, hainguyen
   ✓ Không hiển thị blocked/locked users

Bước 2: Chọn Status = "Blocked"
Kết quả mong đợi:
   ✓ Hiển thị 1 user: thanh123
```

#### 🔄 Test Case 11: Sắp xếp
```
Bước 1: Chọn "Sắp xếp theo" = "Username", "Thứ tự" = "Tăng dần"
Kết quả mong đợi:
   ✓ Users sắp xếp theo alphabet: hainguyen, nam123, thanh123, thanhpt

Bước 2: Chọn "Thứ tự" = "Giảm dần"
Kết quả mong đợi:
   ✓ Users sắp xếp ngược lại: thanhpt, thanh123, nam123, hainguyen
```

#### 👁️ Test Case 12: View Details
```
Bước 1: Click "View Details" của user "nam123"
Kết quả mong đợi:
   ✓ Modal hiển thị
   ✓ Tiêu đề: "👤 Chi tiết User"
   ✓ Hiển thị đầy đủ thông tin:
      - ID: 1
      - Username: nam123
      - Họ và Tên: Nguyễn Văn Nam
      - Role: Admin (badge đỏ)
      - Status: Active (badge xanh)
      - Password: ****** (ẩn)
   ✓ Có button "Đóng"

Bước 2: Click "Đóng"
Kết quả mong đợi:
   ✓ Modal đóng lại
```

#### 🚫 Test Case 13: Ban Account
```
Bước 1: Click "Ban Account" của user "hainguyen" (status = active)
Kết quả mong đợi:
   ✓ Modal xác nhận hiển thị
   ✓ Tiêu đề: "🚫 Xác nhận khóa tài khoản"
   ✓ Nội dung: "Bạn có chắc chắn muốn khóa tài khoản "hainguyen"?..."

Bước 2: Click "Khóa tài khoản"
Kết quả mong đợi:
   ✓ Modal đóng
   ✓ Hiển thị Alert xanh: "✅ Đã khóa tài khoản "hainguyen" thành công!"
   ✓ Bảng tự động refresh
   ✓ User "hainguyen" có status = "Blocked" (badge đỏ)
   ✓ Button đổi thành "✅ Unban Account"

Bước 3: Kiểm tra trong db-pt2.json
Kết quả mong đợi:
   ✓ User hainguyen có status: "blocked"
```

#### ✅ Test Case 14: Unban Account
```
Bước 1: Click "Unban Account" của user "thanh123" (status = blocked)
Kết quả mong đợi:
   ✓ Modal xác nhận hiển thị
   ✓ Tiêu đề: "✅ Xác nhận mở khóa tài khoản"
   ✓ Nội dung: "Bạn có chắc chắn muốn mở khóa tài khoản "thanh123"?..."

Bước 2: Click "Mở khóa tài khoản"
Kết quả mong đợi:
   ✓ Modal đóng
   ✓ Hiển thị Alert xanh: "✅ Đã mở khóa tài khoản "thanh123" thành công!"
   ✓ Bảng tự động refresh
   ✓ User "thanh123" có status = "Active" (badge xanh)
   ✓ Button đổi thành "🚫 Ban Account"

Bước 3: Kiểm tra trong db-pt2.json
Kết quả mong đợi:
   ✓ User thanh123 có status: "active"
```

#### 🔄 Test Case 15: Kiểm tra login sau khi Ban/Unban
```
Bước 1: Logout
Bước 2: Thử đăng nhập với "thanh123" (vừa unban)
   - Username: thanh123
   - Password: 123456
Kết quả mong đợi:
   ✓ Đăng nhập thành công (vì role = admin, status = active)

Bước 3: Logout
Bước 4: Thử đăng nhập với "hainguyen" (vừa ban)
   - Username: hainguyen
   - Password: 123456
Kết quả mong đợi:
   ✓ Hiển thị lỗi "Bạn không có quyền truy cập..."
   ✓ (Vì role = user, không phải vì bị ban)
```

---

### **PHẦN 4: TEST KẾT HỢP**

#### 🎯 Test Case 16: Lọc + Tìm kiếm + Sắp xếp kết hợp
```
Bước 1: Nhập search = "nguyen"
Bước 2: Chọn Role = "Admin"
Bước 3: Chọn Status = "Active"
Bước 4: Sắp xếp theo "Full Name" - "Tăng dần"
Kết quả mong đợi:
   ✓ Chỉ hiển thị 1 user: Nguyễn Văn Nam
   ✓ (Vì: có "nguyen", role = admin, status = active)
```

#### 🎯 Test Case 17: Không tìm thấy kết quả
```
Bước 1: Nhập search = "xyz123notfound"
Kết quả mong đợi:
   ✓ Hiển thị message: "Không tìm thấy user nào phù hợp với tiêu chí lọc."
   ✓ Bảng không hiển thị
```

---

### **PHẦN 5: TEST ERROR HANDLING**

#### ❌ Test Case 18: JSON Server không chạy
```
Bước 1: Tắt JSON Server
Bước 2: Refresh trang /users
Kết quả mong đợi:
   ✓ Hiển thị Alert đỏ: "Không thể tải danh sách users. Vui lòng thử lại!"
   ✓ Hiển thị spinner loading trước đó
```

#### ❌ Test Case 19: Network error khi Ban/Unban
```
Bước 1: Tắt JSON Server
Bước 2: Thử Ban một user
Kết quả mong đợi:
   ✓ Hiển thị Alert đỏ: "Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại!"
```

---

## 📊 KẾT QUẢ MONG ĐỢI

### Tổng số test cases: 19
- ✅ Authentication: 4 test cases
- ✅ Navigation: 2 test cases
- ✅ User Management: 11 test cases
- ✅ Error Handling: 2 test cases

### Tất cả test cases phải PASS! ✅

---

## 🎬 VIDEO DEMO FLOW

```
1. Mở trang login
2. Test các trường hợp login khác nhau
3. Login thành công với nam123
4. Xem Dashboard
5. Click "User Management"
6. Thử tìm kiếm "nguyen"
7. Thử lọc Role = "Admin"
8. Thử lọc Status = "Active"
9. Thử sắp xếp theo Username
10. Click "View Details" một user
11. Đóng modal
12. Click "Ban Account" một user active
13. Xác nhận → Xem kết quả
14. Click "Unban Account" user vừa ban
15. Xác nhận → Xem kết quả
16. Logout
17. Thử login với user vừa ban/unban
18. Kết thúc
```

---

## 📝 CHECKLIST DEMO

Khi demo cho giảng viên/bạn bè, đảm bảo:

- [ ] JSON Server đang chạy (port 3001)
- [ ] React App đang chạy (port 3000)
- [ ] db-pt2.json đã được sử dụng
- [ ] Trình duyệt đã clear cache
- [ ] Mở DevTools để xem Console/Network (nếu cần)
- [ ] Chuẩn bị các test account:
  - [ ] nam123 (admin, active) ✅
  - [ ] thanh123 (admin, blocked) ❌
  - [ ] hainguyen (user, active) ❌
  - [ ] thanhpt (user, locked) ❌

---

**🎉 Sẵn sàng demo!**
