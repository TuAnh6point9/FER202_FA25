# 📚 HƯỚNG DẪN BÀI TẬP REACT - USER MANAGEMENT & AUTHENTICATION

## 📋 TỔNG QUAN ĐỀ BÀI

Bài tập này yêu cầu xây dựng một hệ thống quản lý người dùng (User Management) với các tính năng:

### **Yêu cầu 1: Kiểm tra đăng nhập nâng cao**
- Chỉ cho phép user có **role: "admin"** VÀ **status: "active"** đăng nhập
- Hiển thị thông báo lỗi phù hợp:
  - "Bạn không có quyền truy cập. Chỉ Admin mới có thể đăng nhập!" (nếu role không phải admin)
  - "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!" (nếu status không phải active)

### **Yêu cầu 2: Thêm link User Management vào Navigation**
- Cập nhật `NavigationHeader.jsx` để thêm link "User Management"
- Khi click vào link này, chuyển hướng đến `/users` (trang UserList)

### **Yêu cầu 3: Tạo trang UserList với 3 component**
- **UserFilter**: Cho phép tìm kiếm, lọc và sắp xếp users
- **UserTable**: Hiển thị danh sách users dưới dạng bảng
- **Actions**: View Details và Ban Account

---

## 🏗️ CẤU TRÚC DỰ ÁN

```
src/
├── components/
│   ├── UserFilter.jsx          ← Mới: Component tìm kiếm/lọc/sắp xếp
│   ├── UserTable.jsx           ← Mới: Component bảng hiển thị users
│   ├── UserDetailsModal.jsx    ← Mới: Modal hiển thị chi tiết user
│   └── ConfirmModal.jsx        ← Cập nhật: Thêm props mới
├── pages/
│   ├── UserListPage.jsx        ← Mới: Trang quản lý users chính
│   └── NavigationHeader.jsx    ← Cập nhật: Thêm link User Management
├── contexts/
│   └── AuthContext.jsx         ← Cập nhật: Thêm logic kiểm tra role/status
├── services/
│   └── api.js                  ← Cập nhật: Thêm API cho user management
└── routes/
    └── AppRoutes.jsx           ← Cập nhật: Thêm route /users
```

---

## 🔍 PHÂN TÍCH CHI TIẾT TỪNG PHẦN

### **1️⃣ YÊU CẦU 1: KIỂM TRA ĐĂNG NHẬP**

#### 📝 Giải thích:
- Khi user đăng nhập, hệ thống cần kiểm tra **2 điều kiện**:
  1. `role === "admin"` (phải là admin)
  2. `status === "active"` (tài khoản phải active)
- Nếu **KHÔNG ĐỦ** điều kiện → Hiển thị thông báo lỗi và từ chối đăng nhập

#### 📂 File cần sửa: `src/contexts/AuthContext.jsx`

#### 🔧 Cách làm:
```javascript
// Trong hàm login(), sau khi tìm thấy user:
if (user) {
    // Kiểm tra role
    if (user.role !== 'admin') {
        const errorMessage = 'Bạn không có quyền truy cập...';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
    }
    
    // Kiểm tra status
    if (user.status !== 'active') {
        const errorMessage = 'Tài khoản của bạn đã bị khóa...';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
    }
    
    // Nếu đủ điều kiện → Cho phép đăng nhập
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    return { success: true, user };
}
```

#### 💡 Kiến thức cần nắm:
- **useReducer** và **Context API**: Quản lý trạng thái đăng nhập global
- **Conditional Logic**: Kiểm tra điều kiện trước khi cho phép hành động
- **Error Handling**: Xử lý và hiển thị lỗi cho user

---

### **2️⃣ YÊU CẦU 2: THÊM LINK NAVIGATION**

#### 📝 Giải thích:
- Thêm một link mới "User Management" vào thanh điều hướng (Navigation Header)
- Khi click vào link này, chuyển hướng đến trang `/users`

#### 📂 File cần sửa: `src/pages/NavigationHeader.jsx`

#### 🔧 Cách làm:
```javascript
<Nav.Link 
    onClick={() => navigate('/users')}
    active={location.pathname === '/users'}
    className="text-white"
>
    User Management
</Nav.Link>
```

#### 💡 Kiến thức cần nắm:
- **React Router**: `useNavigate()` để chuyển hướng
- **useLocation()**: Kiểm tra URL hiện tại để highlight link active
- **Bootstrap Nav**: Component điều hướng của React Bootstrap

---

### **3️⃣ YÊU CẦU 3: TRANG USERLIST**

#### 📝 Tổng quan:
Trang UserList được chia thành **3 component chính**:

---

#### **A. UserFilter Component** (`src/components/UserFilter.jsx`)

##### 📝 Chức năng:
- **Tìm kiếm**: Theo username hoặc fullName
- **Lọc**: Theo role (admin/user) và status (active/blocked/locked)
- **Sắp xếp**: Theo ID, username, fullName, role, status (tăng/giảm dần)

##### 🎯 Props nhận vào:
```javascript
{
    searchTerm,           // Từ khóa tìm kiếm
    onSearchChange,       // Hàm xử lý khi thay đổi từ khóa
    roleFilter,           // Role đang lọc
    onRoleFilterChange,   // Hàm xử lý khi thay đổi role filter
    statusFilter,         // Status đang lọc
    onStatusFilterChange, // Hàm xử lý khi thay đổi status filter
    sortBy,               // Tiêu chí sắp xếp
    onSortChange,         // Hàm xử lý khi thay đổi tiêu chí sắp xếp
    sortOrder,            // Thứ tự sắp xếp (asc/desc)
    onSortOrderChange     // Hàm xử lý khi thay đổi thứ tự
}
```

##### 💡 Kiến thức cần nắm:
- **Controlled Components**: Input được điều khiển bởi state
- **Props Drilling**: Truyền hàm từ parent xuống child để cập nhật state
- **Bootstrap Form**: InputGroup, Form.Control, Form.Select

---

#### **B. UserTable Component** (`src/components/UserTable.jsx`)

##### 📝 Chức năng:
- Hiển thị danh sách users dưới dạng **bảng** (Table)
- Các cột: ID, Username, Full Name, Role, Status, Action
- **Action buttons**:
  - 👁️ **View Details**: Xem chi tiết user
  - 🚫 **Ban Account**: Khóa tài khoản (nếu status không phải blocked)
  - ✅ **Unban Account**: Mở khóa tài khoản (nếu status là blocked)

##### 🎯 Props nhận vào:
```javascript
{
    users,          // Mảng users đã được lọc và sắp xếp
    onViewDetails,  // Hàm xử lý khi click "View Details"
    onBanUser       // Hàm xử lý khi click "Ban/Unban Account"
}
```

##### 🎨 UI Elements:
- **Badge**: Hiển thị Role (Admin/User) và Status (Active/Blocked/Locked) với màu sắc phù hợp
- **Bootstrap Table**: Bảng responsive, striped, bordered, hover

##### 💡 Kiến thức cần nắm:
- **Array.map()**: Render danh sách từ array
- **Conditional Rendering**: Hiển thị button khác nhau tùy status
- **Bootstrap Badge & Table**: Components hiển thị dữ liệu
- **Event Handling**: Xử lý sự kiện click button

---

#### **C. UserListPage** (`src/pages/UserListPage.jsx`)

##### 📝 Vai trò:
- **Parent Component** chứa và điều phối 3 component con
- Quản lý **tất cả state** cho trang
- Xử lý **logic nghiệp vụ**: Fetch data, Filter, Sort, Ban/Unban

##### 🔄 Flow hoạt động:

```
1. Mount Component
   ↓
2. Fetch Users từ API (useEffect)
   ↓
3. Lưu users vào state
   ↓
4. Áp dụng Filter & Sort (useEffect)
   ↓
5. Hiển thị filteredUsers trong UserTable
   ↓
6. User tương tác (Search, Filter, Sort, View, Ban)
   ↓
7. Update state → Re-render components
```

##### 📊 State Management:

```javascript
// Danh sách users
const [users, setUsers] = useState([]);              // Users gốc từ API
const [filteredUsers, setFilteredUsers] = useState([]); // Users sau khi filter/sort

// Filter & Sort
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('all');
const [statusFilter, setStatusFilter] = useState('all');
const [sortBy, setSortBy] = useState('id');
const [sortOrder, setSortOrder] = useState('asc');

// Modal
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);

// UI State
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
```

##### 🔧 Các hàm quan trọng:

**1. Fetch Users:**
```javascript
const fetchUsers = async () => {
    try {
        setLoading(true);
        const data = await api.getUsers();
        setUsers(data);
    } catch (err) {
        setError('Không thể tải danh sách users...');
    } finally {
        setLoading(false);
    }
};
```

**2. Apply Filters & Sort:**
```javascript
const applyFiltersAndSort = () => {
    let result = [...users];
    
    // Tìm kiếm
    if (searchTerm.trim()) {
        result = result.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Lọc theo role
    if (roleFilter !== 'all') {
        result = result.filter(user => user.role === roleFilter);
    }
    
    // Lọc theo status
    if (statusFilter !== 'all') {
        result = result.filter(user => user.status === statusFilter);
    }
    
    // Sắp xếp
    result.sort((a, b) => {
        // Logic sắp xếp...
    });
    
    setFilteredUsers(result);
};
```

**3. Handle Ban/Unban:**
```javascript
const handleConfirmBanUnban = async () => {
    try {
        if (action === 'ban') {
            await api.banUser(userId);
        } else {
            await api.unbanUser(userId);
        }
        
        // Refresh danh sách
        await fetchUsers();
        
        // Hiển thị thông báo thành công
        setSuccessMessage('Cập nhật thành công!');
    } catch (err) {
        setError('Có lỗi xảy ra...');
    }
};
```

##### 💡 Kiến thức cần nắm:
- **useState**: Quản lý state trong functional component
- **useEffect**: Side effects (fetch data, apply filters)
- **Async/Await**: Xử lý bất đồng bộ
- **Array Methods**: filter(), sort(), map()
- **Component Composition**: Kết hợp nhiều components

---

#### **D. UserDetailsModal** (`src/components/UserDetailsModal.jsx`)

##### 📝 Chức năng:
- Hiển thị chi tiết thông tin user trong một Modal
- Các thông tin: ID, Username, Full Name, Role, Status, Avatar

##### 🎯 Props:
```javascript
{
    show,    // Boolean: Hiển thị/Ẩn modal
    user,    // Object: Thông tin user cần hiển thị
    onHide   // Function: Đóng modal
}
```

---

### **4️⃣ API SERVICE**

#### 📂 File: `src/services/api.js`

#### 📝 Các API mới:

```javascript
// Lấy user theo ID
export const getUserById = async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
};

// Cập nhật user
export const updateUser = async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
};

// Ban user (set status = "blocked")
export const banUser = async (id) => {
    const user = await getUserById(id);
    return await updateUser(id, { ...user, status: 'blocked' });
};

// Unban user (set status = "active")
export const unbanUser = async (id) => {
    const user = await getUserById(id);
    return await updateUser(id, { ...user, status: 'active' });
};
```

#### 💡 Kiến thức cần nắm:
- **Axios**: Library để gọi HTTP request
- **REST API**: GET, PUT methods
- **JSON Server**: Mock API server

---

### **5️⃣ ROUTING**

#### 📂 File: `src/routes/AppRoutes.jsx`

#### 📝 Route mới:

```javascript
<Route 
    path="/users" 
    element={
        <PrivateRoute>
            <UserListPage /> 
        </PrivateRoute>
    } 
/>
```

#### 💡 Kiến thức cần nắm:
- **React Router v6**: Route, Routes, Navigate
- **Protected Routes**: PrivateRoute component
- **Nested Routing**: Route trong Route

---

## 🚀 CÁCH CHẠY DỰ ÁN

### **Bước 1: Cài đặt dependencies**
```bash
npm install
```

### **Bước 2: Chạy JSON Server (Terminal 1)**
```bash
npx json-server --watch db-pt2.json --port 3001
```

### **Bước 3: Chạy React App (Terminal 2)**
```bash
npm start
```

### **Bước 4: Mở trình duyệt**
```
http://localhost:3000
```

---

## 🧪 TEST CÁC TÍNH NĂNG

### **Test 1: Kiểm tra đăng nhập**

#### Test Case 1.1: Admin + Active ✅
- **Username**: `nam123`
- **Password**: `123456`
- **Kết quả**: Đăng nhập thành công

#### Test Case 1.2: Admin + Blocked ❌
- **Username**: `thanh123`
- **Password**: `123456`
- **Kết quả**: "Tài khoản của bạn đã bị khóa..."

#### Test Case 1.3: User + Active ❌
- **Username**: `hainguyen`
- **Password**: `123456`
- **Kết quả**: "Bạn không có quyền truy cập..."

### **Test 2: User Management**

#### Test 2.1: Tìm kiếm
- Nhập "nguyen" → Hiển thị tất cả users có "nguyen" trong username/fullName

#### Test 2.2: Lọc
- Chọn Role = "Admin" → Hiển thị chỉ admin users
- Chọn Status = "Active" → Hiển thị chỉ active users

#### Test 2.3: Sắp xếp
- Sắp xếp theo "Username" + "Tăng dần" → Users sắp xếp A-Z

#### Test 2.4: View Details
- Click "View Details" → Hiển thị modal với thông tin chi tiết

#### Test 2.5: Ban Account
- Click "Ban Account" → Hiển thị confirm modal
- Xác nhận → User status chuyển thành "blocked"
- Kiểm tra: User này không thể đăng nhập

#### Test 2.6: Unban Account
- Click "Unban Account" trên user bị blocked → Hiển thị confirm modal
- Xác nhận → User status chuyển thành "active"
- Kiểm tra: User này có thể đăng nhập lại

---

## 📚 KIẾN THỨC QUAN TRỌNG

### **1. React Hooks**
- `useState`: Quản lý state
- `useEffect`: Side effects
- `useContext`: Sử dụng Context API
- `useReducer`: Quản lý state phức tạp

### **2. React Router**
- `useNavigate`: Chuyển hướng
- `useLocation`: Lấy URL hiện tại
- `PrivateRoute`: Bảo vệ routes

### **3. Component Patterns**
- **Container/Presentational**: UserListPage (Container) vs UserTable (Presentational)
- **Props Drilling**: Truyền props qua nhiều cấp
- **Composition**: Kết hợp nhiều components

### **4. State Management**
- **Local State**: useState
- **Global State**: Context API + useReducer
- **Derived State**: filteredUsers từ users

### **5. API Integration**
- **Axios**: HTTP client
- **Async/Await**: Xử lý bất đồng bộ
- **Error Handling**: try/catch

### **6. Array Methods**
- `filter()`: Lọc dữ liệu
- `sort()`: Sắp xếp
- `map()`: Render list
- `find()`: Tìm phần tử

---

## 💡 MẸO VÀ LƯU Ý

### **1. Debugging**
- Sử dụng `console.log()` để kiểm tra data
- Sử dụng React DevTools để xem state/props
- Kiểm tra Network tab để xem API calls

### **2. Performance**
- Tránh gọi API quá nhiều lần
- Sử dụng `useEffect` dependencies đúng cách
- Memoize expensive computations

### **3. Best Practices**
- Tách components nhỏ, tái sử dụng được
- Đặt tên biến/hàm rõ ràng, có ý nghĩa
- Comment code khi cần thiết
- Xử lý errors đầy đủ

---

## 📖 TÀI LIỆU THAM KHẢO

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Axios Documentation](https://axios-http.com/)
- [JSON Server](https://github.com/typicode/json-server)

---

## 🎯 KẾT LUẬN

Bài tập này giúp sinh viên:
✅ Hiểu rõ về **Authentication & Authorization**
✅ Thực hành **CRUD operations** với API
✅ Làm việc với **React Hooks** (useState, useEffect, useContext)
✅ Xây dựng **Component Architecture** hợp lý
✅ Áp dụng **Filter, Sort, Search** trong React
✅ Xử lý **Modal, Confirm Dialog**
✅ Quản lý **State phức tạp** với multiple filters

**Chúc các bạn học tốt! 🚀**
