# 📋 CHI TIẾT CÁC FILE JSX ĐÃ CẬP NHẬT

## 📊 TỔNG QUAN

### **Files Mới Tạo** (4 files):
1. `src/components/UserFilter.jsx` ← HOÀN TOÀN MỚI
2. `src/components/UserTable.jsx` ← HOÀN TOÀN MỚI
3. `src/components/UserDetailsModal.jsx` ← HOÀN TOÀN MỚI
4. `src/pages/UserListPage.jsx` ← HOÀN TOÀN MỚI

### **Files Đã Cập Nhật** (5 files):
1. `src/contexts/AuthContext.jsx` ← Cập nhật logic kiểm tra đăng nhập
2. `src/pages/NavigationHeader.jsx` ← Thêm link User Management
3. `src/services/api.js` ← Thêm API functions
4. `src/routes/AppRoutes.jsx` ← Thêm route /users
5. `src/hooks/useSessionCheck.js` ← File đã có sẵn, không cần sửa

---

## 🔧 CHI TIẾT CÁC FILE ĐÃ CẬP NHẬT

### 1️⃣ **src/contexts/AuthContext.jsx**

**Mục đích**: Thêm kiểm tra role = "admin" VÀ status = "active" khi đăng nhập

#### 📍 **Dòng 56-90**: Cập nhật hàm `login()`
```jsx
// TRƯỚC (Dòng 56-85 - CHỈ KIỂM TRA USERNAME/PASSWORD):
if (user) { 
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return { success: true, user };
} else { 
    const errorMessage = 'Invalid username/email or password!';
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
}

// SAU (Dòng 56-90 - THÊM KIỂM TRA ROLE & STATUS):
if (user) { 
    // YÊU CẦU MỚI: Kiểm tra role và status trước khi cho phép đăng nhập
    if (user.role !== 'admin') {
        const errorMessage = 'Bạn không có quyền truy cập. Chỉ Admin mới có thể đăng nhập!';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
    }
    
    if (user.status !== 'active') {
        const errorMessage = 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
    }
    
    // Nếu đủ điều kiện: role = admin VÀ status = active
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return { success: true, user };
} else { 
    const errorMessage = 'Invalid username/email or password!';
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
}
```

**Các dòng cụ thể được thêm mới**:
- **Dòng 70-75**: Kiểm tra role !== 'admin'
- **Dòng 77-82**: Kiểm tra status !== 'active'
- **Dòng 84-86**: Chỉ cho phép đăng nhập nếu pass cả 2 điều kiện

**Comment đã thêm**:
- **Dòng 69**: `// YÊU CẦU MỚI: Kiểm tra role và status trước khi cho phép đăng nhập`
- **Dòng 70**: `// Chỉ cho phép đăng nhập nếu role là "admin" VÀ status là "active"`

---

### 2️⃣ **src/pages/NavigationHeader.jsx**

**Mục đích**: Thêm link "User Management" vào thanh Navigation

#### 📍 **Dòng 39-48**: Thêm Nav.Link mới
```jsx
// TRƯỚC (Dòng 25-37 - CHỈ CÓ 2 LINKS):
<Nav className="me-auto">
    <Nav.Link 
        onClick={() => navigate('/home')}
        active={location.pathname === '/home'}
        className="text-white"
    >
        Dashboard
    </Nav.Link>
    <Nav.Link 
        onClick={() => navigate('/payments')}
        active={location.pathname === '/payments'}
        className="text-white"
    >
        Payment Management
    </Nav.Link>
</Nav>

// SAU (Dòng 25-48 - THÊM LINK USER MANAGEMENT):
<Nav className="me-auto">
    <Nav.Link 
        onClick={() => navigate('/home')}
        active={location.pathname === '/home'}
        className="text-white"
    >
        Dashboard
    </Nav.Link>
    <Nav.Link 
        onClick={() => navigate('/payments')}
        active={location.pathname === '/payments'}
        className="text-white"
    >
        Payment Management
    </Nav.Link>
    {/* YÊU CẦU MỚI: Thêm link User Management */}
    <Nav.Link 
        onClick={() => navigate('/users')}
        active={location.pathname === '/users'}
        className="text-white"
    >
        User Management
    </Nav.Link>
</Nav>
```

**Các dòng cụ thể được thêm mới**:
- **Dòng 38**: Comment `{/* YÊU CẦU MỚI: Thêm link User Management */}`
- **Dòng 39-47**: Nav.Link mới cho User Management
  - onClick: navigate đến `/users`
  - active: Highlight khi đang ở trang users
  - className: `text-white` để hiển thị màu trắng

---

### 3️⃣ **src/services/api.js**

**Mục đích**: Thêm các API functions để quản lý users (CRUD operations)

#### 📍 **Dòng 70-126**: Thêm User Management API Functions
```javascript
// THÊM MỚI HOÀN TOÀN (Sau dòng 69):

//3. Các hàm API khác có thể được thêm vào đây

// YÊU CẦU MỚI: User Management API Functions

// Get user by ID
export const getUserById = async (id) => {
    try {
        const response = await API.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch user with ID: ${id}`);
    }
};

// Update user (dùng cho Ban/Unban account)
export const updateUser = async (id, userData) => {
    try {
        const response = await API.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update user with ID: ${id}`);
    }
};

// Ban account (cập nhật status thành "blocked")
export const banUser = async (id) => {
    try {
        // Lấy thông tin user hiện tại
        const user = await getUserById(id);
        // Cập nhật status thành "blocked"
        const updatedUser = await updateUser(id, { ...user, status: 'blocked' });
        return updatedUser;
    } catch (error) {
        throw new Error(`Failed to ban user with ID: ${id}`);
    }
};

// Unban account (cập nhật status thành "active")
export const unbanUser = async (id) => {
    try {
        // Lấy thông tin user hiện tại
        const user = await getUserById(id);
        // Cập nhật status thành "active"
        const updatedUser = await updateUser(id, { ...user, status: 'active' });
        return updatedUser;
    } catch (error) {
        throw new Error(`Failed to unban user with ID: ${id}`);
    }
};
```

**Các functions được thêm mới**:
- **Dòng 75-82**: `getUserById(id)` - Lấy thông tin user theo ID
- **Dòng 85-92**: `updateUser(id, userData)` - Cập nhật thông tin user
- **Dòng 95-105**: `banUser(id)` - Khóa tài khoản (status = "blocked")
- **Dòng 108-118**: `unbanUser(id)` - Mở khóa tài khoản (status = "active")

**Logic quan trọng**:
- `banUser()` và `unbanUser()` đều:
  1. Lấy thông tin user hiện tại bằng `getUserById()`
  2. Giữ nguyên tất cả thông tin user `{ ...user }`
  3. Chỉ thay đổi field `status`
  4. Gọi `updateUser()` để cập nhật vào database

---

### 4️⃣ **src/routes/AppRoutes.jsx**

**Mục đích**: Thêm route `/users` để truy cập trang User Management

#### 📍 **Dòng 7**: Import UserListPage
```jsx
// THÊM MỚI:
import UserListPage from '../pages/UserListPage'; // YÊU CẦU MỚI: Import UserListPage
```

#### 📍 **Dòng 56-64**: Thêm route /users
```jsx
// TRƯỚC (Dòng 49-52 - CHƯA CÓ ROUTE /users):
<Route 
    path="/payments/add" 
    element={
        <PrivateRoute>
            <AddPayment /> 
        </PrivateRoute>
    } 
/>

// SAU (Dòng 49-64 - THÊM ROUTE /users):
<Route 
    path="/payments/add" 
    element={
        <PrivateRoute>
            <AddPayment /> 
        </PrivateRoute>
    } 
/>

{/* YÊU CẦU MỚI: Route cho User Management */}
<Route 
    path="/users" 
    element={
        <PrivateRoute>
            <UserListPage /> 
        </PrivateRoute>
    } 
/>
```

**Các dòng cụ thể được thêm mới**:
- **Dòng 7**: Import UserListPage component
- **Dòng 56**: Comment `{/* YÊU CẦU MỚI: Route cho User Management */}`
- **Dòng 57-64**: Route definition cho `/users`
  - Được bảo vệ bởi `<PrivateRoute>` (chỉ user đã login mới truy cập được)
  - Render component `<UserListPage />`

---

## 📁 CÁC FILE MỚI (KHÔNG CẦN CẬP NHẬT)

### 1. **src/components/UserFilter.jsx** (120 dòng)
- Component mới 100%, không cập nhật file cũ
- Chức năng: Tìm kiếm, lọc, sắp xếp users

### 2. **src/components/UserTable.jsx** (211 dòng)
- Component mới 100%, không cập nhật file cũ
- Chức năng: Hiển thị bảng users với actions (View Details, Ban/Unban)

### 3. **src/components/UserDetailsModal.jsx** (129 dòng)
- Component mới 100%, không cập nhật file cũ
- Chức năng: Modal hiển thị chi tiết thông tin user

### 4. **src/pages/UserListPage.jsx** (258 dòng)
- Component mới 100%, không cập nhật file cũ
- Chức năng: Trang chính quản lý users (tổng hợp tất cả components)

### 5. **src/hooks/useSessionCheck.js** (98 dòng)
- File đã có sẵn từ trước, KHÔNG CẦN CẬP NHẬT
- Chức năng: Kiểm tra session, tự động logout nếu bị ban

---

## 📊 BẢNG TÓM TẮT CÁC THAY ĐỔI

| File | Loại | Số dòng thêm/sửa | Mô tả thay đổi |
|------|------|------------------|----------------|
| **AuthContext.jsx** | Cập nhật | ~20 dòng | Thêm kiểm tra role & status trong hàm login() |
| **NavigationHeader.jsx** | Cập nhật | ~10 dòng | Thêm Nav.Link cho User Management |
| **api.js** | Cập nhật | ~50 dòng | Thêm 4 API functions: getUserById, updateUser, banUser, unbanUser |
| **AppRoutes.jsx** | Cập nhật | ~10 dòng | Thêm import và route /users |
| **UserFilter.jsx** | Mới | 120 dòng | Component mới hoàn toàn |
| **UserTable.jsx** | Mới | 211 dòng | Component mới hoàn toàn |
| **UserDetailsModal.jsx** | Mới | 129 dòng | Component mới hoàn toàn |
| **UserListPage.jsx** | Mới | 258 dòng | Component mới hoàn toàn |

**Tổng cộng**:
- ✅ **4 files cập nhật** với ~90 dòng code
- ✅ **4 files mới** với ~718 dòng code
- ✅ **Total**: ~808 dòng code mới

---

## 🎯 ĐIỂM QUAN TRỌNG CẦN NHỚ

### ✅ Các thay đổi trong AuthContext.jsx:
```javascript
// Kiểm tra TUẦN TỰ:
1. Username/Password đúng?
   ↓ YES
2. Role === "admin"?
   ↓ YES
3. Status === "active"?
   ↓ YES
4. → Đăng nhập thành công!

// Mỗi bước thất bại → Hiển thị lỗi tương ứng
```

### ✅ Các thay đổi trong NavigationHeader.jsx:
```jsx
// Thêm link thứ 3:
Dashboard → Payment Management → User Management (MỚI!)
                                      ↓
                                   /users route
```

### ✅ Các thay đổi trong api.js:
```javascript
// 4 functions mới:
getUserById(id)     → GET /users/:id
updateUser(id, data) → PUT /users/:id
banUser(id)         → updateUser với status="blocked"
unbanUser(id)       → updateUser với status="active"
```

### ✅ Các thay đổi trong AppRoutes.jsx:
```jsx
// Route mới được bảo vệ:
/users → <PrivateRoute> → <UserListPage />
```

---

## 🔍 CÁCH TÌM KIẾM NHANH TRONG CODE

### Tìm các thay đổi trong AuthContext.jsx:
```javascript
// Search: "YÊU CẦU MỚI"
// Hoặc: "role !== 'admin'"
// Hoặc: "status !== 'active'"
```

### Tìm các thay đổi trong NavigationHeader.jsx:
```jsx
// Search: "User Management"
// Hoặc: "navigate('/users')"
```

### Tìm các thay đổi trong api.js:
```javascript
// Search: "getUserById"
// Hoặc: "banUser"
// Hoặc: "YÊU CẦU MỚI"
```

### Tìm các thay đổi trong AppRoutes.jsx:
```jsx
// Search: "UserListPage"
// Hoặc: "path=\"/users\""
```

---

## 📝 CHECKLIST XÁC NHẬN

- [x] AuthContext.jsx: Đã thêm kiểm tra role & status (Dòng 70-86)
- [x] NavigationHeader.jsx: Đã thêm link User Management (Dòng 39-47)
- [x] api.js: Đã thêm 4 API functions (Dòng 75-118)
- [x] AppRoutes.jsx: Đã thêm route /users (Dòng 57-64)
- [x] UserFilter.jsx: File mới đã tạo (120 dòng)
- [x] UserTable.jsx: File mới đã tạo (211 dòng)
- [x] UserDetailsModal.jsx: File mới đã tạo (129 dòng)
- [x] UserListPage.jsx: File mới đã tạo (258 dòng)

---

**✅ Tất cả các file đã được cập nhật chính xác theo yêu cầu!**
