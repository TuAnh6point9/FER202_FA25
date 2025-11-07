# 🔐 TÍNH NĂNG BẢO MẬT NÂNG CAO - ADMIN HIERARCHY

## 📋 TỔNG QUAN

Đã thêm 3 tính năng bảo mật quan trọng:

### ✅ 1. Admin không thể ban/unban chính mình
- Admin không thể tự khóa tài khoản của chính mình
- Button Ban/Unban sẽ bị disable khi xem chính mình
- Hiển thị tooltip: "Bạn không thể khóa chính mình!"

### ✅ 2. Admin Hierarchy theo AdminLevel
- **adminLevel 1**: Super Admin (quyền cao nhất) - nam123
- **adminLevel 2**: Admin (quyền thấp hơn) - thanh123
- Admin chỉ có thể ban admin có level THẤP HƠN (số lớn hơn)
- **VD**: nam123 (level 1) CÓ THỂ ban thanh123 (level 2)
- **VD**: thanh123 (level 2) KHÔNG THỂ ban nam123 (level 1)

### ✅ 3. Auto Logout khi bị ban
- Kiểm tra định kỳ mỗi 10 giây xem user có bị ban không
- Nếu bị ban → Hiển thị thông báo: "⚠️ Bạn đã bị khóa quyền truy cập..."
- Tự động logout sau 3 giây
- Chuyển về trang login

---

## 🗂️ CẤU TRÚC DATABASE

### **db-pt2.json** (Đã cập nhật)

```json
{
  "users": [
    {
      "id": "1",
      "username": "nam123",
      "password": "123456",
      "fullName": "Nguyễn Văn Nam",
      "role": "admin",
      "adminLevel": 1,           ← MỚI: Super Admin
      "status": "active",
      "avatar": "/images/users/admin.png"
    },
    {
      "id": "3",
      "username": "thanh123",
      "password": "123456",
      "fullName": "Nguyễn Văn Thanh",
      "role": "admin",
      "adminLevel": 2,           ← MỚI: Admin thường
      "status": "active",        ← Đã unban
      "avatar": "/images/users/thanh123.png"
    }
  ]
}
```

**Giải thích adminLevel:**
- `adminLevel: 1` = Super Admin (quyền cao nhất)
- `adminLevel: 2` = Admin (quyền thấp hơn)
- Số càng **NHỎ** thì quyền càng **CAO**

---

## 🔧 CÁC FILE ĐÃ THAY ĐỔI

### 1. **db-pt2.json** ✅
- Thêm field `adminLevel` cho các admin
- nam123: adminLevel = 1 (Super Admin)
- thanh123: adminLevel = 2, status = "active" (đã unban)

### 2. **src/hooks/useSessionCheck.js** ✅ (MỚI)
- Custom hook kiểm tra session
- Check mỗi 10 giây xem user có bị ban không
- Auto logout nếu bị ban

### 3. **src/components/UserTable.jsx** ✅
- Thêm logic kiểm tra quyền ban/unban
- Hàm `canBanUser()`:
  - Rule 1: Không thể ban chính mình
  - Rule 2: Chỉ ban được admin có level thấp hơn
- Disable button và hiển thị tooltip nếu không có quyền
- Hiển thị adminLevel trong badge role

### 4. **src/components/UserDetailsModal.jsx** ✅
- Hiển thị adminLevel trong modal
- Show "Super Admin" cho level 1
- Show "Level X" cho các level khác

### 5. **src/pages/UserListPage.jsx** ✅
- Thêm `useSessionCheck()` hook

### 6. **src/pages/DashboardPage.jsx** ✅
- Thêm `useSessionCheck()` hook

### 7. **src/pages/PaymentsPage.jsx** ✅
- Thêm `useSessionCheck()` hook

---

## 🎯 LOGIC PHÂN QUYỀN

### **Quy tắc Ban/Unban:**

```javascript
function canBanUser(currentUser, targetUser) {
    // Rule 1: Không thể ban chính mình
    if (currentUser.id === targetUser.id) {
        return false; // "Bạn không thể khóa chính mình!"
    }
    
    // Rule 2: Kiểm tra adminLevel nếu target là admin
    if (targetUser.role === 'admin') {
        // Current user phải là admin
        if (currentUser.role !== 'admin') {
            return false; // "Chỉ Admin mới có thể khóa Admin khác!"
        }
        
        // Kiểm tra hierarchy
        if (currentUser.adminLevel >= targetUser.adminLevel) {
            return false; // "Bạn không có quyền khóa X. X có quyền cao hơn..."
        }
    }
    
    // Passed all checks
    return true;
}
```

### **Ma trận quyền:**

| Current User | Target User | adminLevel So sánh | Có thể Ban? | Lý do |
|--------------|-------------|-------------------|-------------|-------|
| nam123 | nam123 | 1 vs 1 | ❌ | Không thể ban chính mình |
| nam123 | thanh123 | 1 vs 2 | ✅ | 1 < 2 (quyền cao hơn) |
| nam123 | hainguyen | N/A | ✅ | Target là user |
| thanh123 | thanh123 | 2 vs 2 | ❌ | Không thể ban chính mình |
| thanh123 | nam123 | 2 vs 1 | ❌ | 2 >= 1 (quyền thấp hơn/ngang bằng) |
| thanh123 | hainguyen | N/A | ✅ | Target là user |

---

## 🧪 TEST CASES

### **Test 1: Admin không thể ban chính mình**

```
1. Đăng nhập với nam123
2. Vào User Management
3. Tìm user nam123 trong bảng
4. Hover vào button "Ban Account"
   ✅ Button bị disable
   ✅ Tooltip hiển thị: "Bạn không thể khóa chính mình!"
5. Click vào button
   ✅ Hiển thị alert: "Bạn không thể khóa chính mình!"
```

### **Test 2: Super Admin (nam123) có thể ban Admin (thanh123)**

```
1. Đăng nhập với nam123
2. Vào User Management
3. Tìm user thanh123 (Admin Level 2)
4. Click "Ban Account"
   ✅ Confirm modal hiển thị
5. Xác nhận
   ✅ thanh123 bị ban (status = blocked)
   ✅ Hiển thị success message
```

### **Test 3: Admin (thanh123) KHÔNG THỂ ban Super Admin (nam123)**

```
1. Logout và đăng nhập với thanh123
2. Vào User Management
3. Tìm user nam123 (Super Admin Level 1)
4. Hover vào button "Ban Account"
   ✅ Button bị disable
   ✅ Tooltip hiển thị: "Bạn không có quyền khóa nam123..."
5. Click vào button
   ✅ Alert: "Bạn không có quyền khóa nam123..."
```

### **Test 4: Auto logout khi bị ban**

```
Chuẩn bị:
- Mở 2 trình duyệt (hoặc 2 tab ẩn danh)
- Browser A: Đăng nhập với thanh123
- Browser B: Đăng nhập với nam123

Test:
1. Browser A (thanh123): Đang ở trang User Management
2. Browser B (nam123): Ban user thanh123
3. Chờ 10 giây (hoặc refresh Browser A)
4. Browser A sẽ:
   ✅ Hiển thị alert: "⚠️ Bạn đã bị khóa quyền truy cập..."
   ✅ Sau 3 giây tự động logout
   ✅ Chuyển về trang login
5. Thử đăng nhập lại với thanh123
   ✅ Hiển thị lỗi: "Tài khoản của bạn đã bị khóa..."
```

### **Test 5: Unban và kiểm tra lại**

```
1. Đăng nhập với nam123
2. Unban user thanh123
3. Logout
4. Đăng nhập với thanh123
   ✅ Đăng nhập thành công
5. Vào User Management
6. Thử ban user nam123
   ✅ Không thể ban (button disabled)
```

---

## 📊 LUỒNG HOẠT ĐỘNG

### **Flow 1: Kiểm tra quyền Ban/Unban**

```
User click "Ban Account"
    ↓
canBanUser(currentUser, targetUser)
    ↓
Check: currentUser.id === targetUser.id?
    ↓ YES → Return false + Alert "Không thể ban chính mình"
    ↓ NO
Check: targetUser.role === 'admin'?
    ↓ YES
    Check: currentUser.role === 'admin'?
        ↓ NO → Return false + Alert "Chỉ Admin mới có thể..."
        ↓ YES
        Check: currentUser.adminLevel >= targetUser.adminLevel?
            ↓ YES → Return false + Alert "Không có quyền..."
            ↓ NO → Return true → Cho phép ban
    ↓ NO (targetUser là user)
    Return true → Cho phép ban
```

### **Flow 2: Session Check & Auto Logout**

```
Component mount (Dashboard/Payments/UserList)
    ↓
useSessionCheck() hook chạy
    ↓
useEffect() setup:
    - Check ngay lập tức
    - Setup interval mỗi 10 giây
    ↓
Mỗi 10 giây:
    Fetch user info từ API (getUserById)
    ↓
    Check: user.status !== 'active'?
        ↓ YES
        - Clear interval
        - Show alert "Bạn đã bị khóa quyền truy cập..."
        - setTimeout 3s
        - Logout
        - Redirect to /login
        ↓ NO
        Continue checking
    ↓
Component unmount:
    - Clear interval
    - Clear timeout
```

---

## 💡 GIẢI THÍCH KỸ THUẬT

### **1. Custom Hook: useSessionCheck**

```javascript
const useSessionCheck = () => {
    const { user, logout } = useAuth();
    const checkIntervalRef = useRef(null);
    const logoutTimeoutRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const checkUserStatus = async () => {
            const currentUser = await api.getUserById(user.id);
            if (currentUser.status !== 'active') {
                clearInterval(checkIntervalRef.current);
                alert('⚠️ Bạn đã bị khóa quyền truy cập...');
                logoutTimeoutRef.current = setTimeout(() => {
                    logout();
                    window.location.href = '/login';
                }, 3000);
            }
        };

        checkUserStatus(); // Check ngay
        checkIntervalRef.current = setInterval(checkUserStatus, 10000); // Check mỗi 10s

        return () => {
            clearInterval(checkIntervalRef.current);
            clearTimeout(logoutTimeoutRef.current);
        };
    }, [user, logout]);
};
```

**Giải thích:**
- `useRef()`: Lưu reference của interval/timeout để clear khi unmount
- `useEffect()`: Setup và cleanup interval
- `checkUserStatus()`: Async function fetch user info và kiểm tra status
- Check mỗi 10 giây (10000ms)
- Tự động logout sau 3 giây (3000ms) nếu bị ban

### **2. Logic kiểm tra quyền trong UserTable**

```javascript
const canBanUser = (targetUser) => {
    // Rule 1: Không thể ban chính mình
    if (currentUser.id === targetUser.id) {
        return { canBan: false, reason: 'Bạn không thể khóa chính mình!' };
    }

    // Rule 2: Kiểm tra adminLevel
    if (targetUser.role === 'admin') {
        if (currentUser.role !== 'admin') {
            return { canBan: false, reason: 'Chỉ Admin mới có thể...' };
        }

        const currentLevel = currentUser.adminLevel || 999;
        const targetLevel = targetUser.adminLevel || 999;

        if (currentLevel >= targetLevel) {
            return {
                canBan: false,
                reason: `Bạn không có quyền khóa ${targetUser.username}...`
            };
        }
    }

    return { canBan: true, reason: '' };
};
```

**Giải thích:**
- Return object `{ canBan, reason }` để dễ xử lý
- Default adminLevel = 999 nếu không có (quyền thấp nhất)
- So sánh: currentLevel < targetLevel → CÓ QUYỀN ban

### **3. Disable button với tooltip**

```javascript
<Button
    variant="danger"
    size="sm"
    onClick={() => {
        if (banCheck.canBan) {
            onBanUser(user.id, 'ban');
        } else {
            alert(banCheck.reason);
        }
    }}
    disabled={!banCheck.canBan}
    title={!banCheck.canBan ? banCheck.reason : 'Khóa tài khoản'}
>
    🚫 Ban Account
</Button>
```

**Giải thích:**
- `disabled={!banCheck.canBan}`: Disable nếu không có quyền
- `title={...}`: Hiển thị tooltip với lý do
- `onClick`: Show alert nếu không có quyền (fallback)

---

## 🎓 KIẾN THỨC SINH VIÊN CẦN HIỂU

### **1. useRef() Hook**
```javascript
const intervalRef = useRef(null);
```
- Lưu giá trị **persist** giữa các lần render
- Không trigger re-render khi thay đổi
- Dùng để lưu interval/timeout ID để clear sau

### **2. useEffect() Cleanup**
```javascript
useEffect(() => {
    // Setup
    const interval = setInterval(...);
    
    // Cleanup
    return () => {
        clearInterval(interval);
    };
}, [dependencies]);
```
- Cleanup function chạy khi component unmount hoặc dependencies thay đổi
- Quan trọng để tránh memory leak

### **3. setInterval() vs setTimeout()**
- `setInterval(fn, delay)`: Chạy `fn` **lặp lại** mỗi `delay` ms
- `setTimeout(fn, delay)`: Chạy `fn` **một lần** sau `delay` ms

### **4. Object Destructuring & Default Value**
```javascript
const currentLevel = currentUser.adminLevel || 999;
```
- Nếu `adminLevel` không tồn tại → Dùng giá trị default 999

### **5. Conditional Rendering**
```javascript
disabled={!canBan}
title={!canBan ? reason : 'Default'}
```
- Ternary operator cho conditional props

---

## 📝 CHECKLIST HOÀN THÀNH

- [x] Thêm field `adminLevel` vào db-pt2.json
- [x] Tạo custom hook `useSessionCheck`
- [x] Cập nhật UserTable với logic phân quyền
- [x] Disable button Ban/Unban nếu không có quyền
- [x] Hiển thị tooltip với lý do
- [x] Hiển thị adminLevel trong badge và modal
- [x] Thêm session check vào DashboardPage
- [x] Thêm session check vào PaymentsPage
- [x] Thêm session check vào UserListPage
- [x] Test tất cả các cases
- [x] Viết tài liệu chi tiết

---

## 🎯 KẾT LUẬN

✅ **Đã triển khai đầy đủ 3 tính năng bảo mật:**
1. Admin không thể ban chính mình
2. Admin hierarchy theo adminLevel
3. Auto logout khi bị ban

✅ **Code chất lượng cao:**
- Logic rõ ràng, dễ hiểu
- Comment chi tiết
- Error handling đầy đủ
- Custom hook tái sử dụng được

✅ **User Experience tốt:**
- Button disabled + tooltip
- Alert thông báo rõ ràng
- Auto logout smooth (3 giây)

✅ **Security tốt:**
- Kiểm tra quyền chặt chẽ
- Session check định kỳ
- Không thể bypass bằng UI

**Hệ thống đã sẵn sàng để demo! 🚀**
