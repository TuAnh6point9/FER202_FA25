# 🎬 Movie Manager - Hệ thống Quản lý Phim với Authentication

## 📋 Tính năng

### 1. **Authentication System**
- ✅ Login với username hoặc email
- ✅ Validation form real-time
- ✅ Đọc accounts từ `db.json` qua json-server API
- ✅ Lưu session vào localStorage
- ✅ Tự động redirect sau login thành công
- ✅ Protected routes (yêu cầu login)
- ✅ Logout và clear session

### 2. **Movie CRUD Operations**
- ✅ **Create**: Thêm phim mới với form validation
- ✅ **Read**: Hiển thị danh sách phim từ API
- ✅ **Update**: Sửa thông tin phim
- ✅ **Delete**: Xóa phim với confirm modal

### 3. **Context Management**
- ✅ **AuthContext**: Quản lý authentication state
- ✅ **MovieContext**: Quản lý movies và genres state
- ✅ Sử dụng useReducer cho complex state logic

### 4. **UI/UX**
- ✅ Header hiển thị thông tin user đang đăng nhập
- ✅ Badge hiển thị role (admin/manager/user)
- ✅ Responsive design với React Bootstrap
- ✅ Loading states và error handling

---

## 🚀 Cách sử dụng

### **Bước 1: Khởi động json-server**
```powershell
cd "d:\FER202\FA25\Code\slot15\movies-json-server"
npx json-server db.json --port 3001
```

**Endpoints:**
- GET `http://localhost:3001/movies` - Lấy danh sách phim
- GET `http://localhost:3001/genres` - Lấy danh sách thể loại
- GET `http://localhost:3001/accounts` - Lấy danh sách tài khoản
- POST/PUT/DELETE `/movies/:id` - CRUD operations

### **Bước 2: Khởi động React App**
```powershell
cd "d:\FER202\FA25\Code\slot15\movies-json-server"
npm start
```

App sẽ mở tại: `http://localhost:3000`

---

## 👤 Test Accounts

### **Admin Account** (Full Access)
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `123456`
- **Role**: `admin`

### **Manager Account** (Full Access)
- **Username**: `manager`
- **Email**: `manager@example.com`
- **Password**: `123456`
- **Role**: `manager`

### **User Account** (Full Access)
- **Username**: `user1`
- **Email**: `user1@example.com`
- **Password**: `123456`
- **Role**: `user`

---

## 🔄 Flow hoạt động

### **Login Flow:**
1. User truy cập `/` → tự động redirect đến `/login`
2. Nhập username/email và password
3. AuthContext gọi API `GET /accounts` để verify credentials
4. Nếu thành công:
   - Lưu user info vào state và localStorage
   - Redirect đến `/movies`
5. Nếu thất bại:
   - Hiển thị error message

### **Protected Route Flow:**
1. User cố truy cập `/movies` khi chưa login
2. ProtectedRoute kiểm tra `isAuthenticated`
3. Nếu false → redirect về `/login`
4. Nếu true → render MovieManager component

### **CRUD Flow:**
1. **Create**: Form → Validate → `POST /movies` → Reload list
2. **Read**: Component mount → `GET /movies` → Display
3. **Update**: Click Edit → Fill form → `PUT /movies/:id` → Reload
4. **Delete**: Click Delete → Confirm → `DELETE /movies/:id` → Reload

---

## 📁 Cấu trúc Project

```
src/
├── api/
│   └── movieAPI.js          # Axios instance
├── components/
│   ├── Header.jsx           # Header với user info
│   ├── LoginForm.jsx        # Login form component
│   ├── MovieForm.jsx        # Create/Update form
│   ├── MovieTable.jsx       # Movies list table
│   └── ProtectedRoute.jsx   # HOC bảo vệ routes
├── contexts/
│   ├── AuthContext.jsx      # Authentication context
│   └── MovieContext.jsx     # Movies state context
├── pages/
│   └── MovieManager.jsx     # Main movies page
├── reducers/
│   └── movieReducers.jsx    # Movie state reducer
├── App.js                   # Router setup
└── index.js                 # App entry point
```

---

## 🎯 Context API Architecture

### **AuthContext**
```javascript
State: {
  user: { id, username, email, role, status } | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}

Actions:
- LOGIN_START
- LOGIN_SUCCESS
- LOGIN_FAILURE
- LOGOUT
- CLEAR_ERROR

Methods:
- login(identifier, password) → Promise
- logout() → void
- clearError() → void
```

### **MovieContext**
```javascript
State: {
  movies: [],
  genres: [],
  currentMovie: {},
  loading: boolean,
  showModal: boolean,
  showDeleteModal: boolean,
  movieToDelete: null,
  isEditing: boolean,
  isEditingId: null
}

Actions:
- SET_MOVIES
- SET_GENRES
- START_LOADING
- OPEN_EDIT_MODAL
- CLOSE_EDIT_MODAL
- OPEN_DELETE_MODAL
- CLOSE_DELETE_MODAL
- RESET_FORM

Methods:
- fetchMovies() → Promise
- fetchGenres() → Promise
- handleCreateOrUpdate(data, isEditing, id) → Promise
- confirmDelete(id) → Promise
```

---

## 🔐 Security Notes

**⚠️ QUAN TRỌNG:** 
- Đây là project demo, password lưu dạng plain text trong `db.json`
- Trong production, phải:
  - Hash password (bcrypt)
  - Sử dụng JWT tokens
  - Implement refresh tokens
  - HTTPS only
  - Rate limiting
  - CORS configuration

---

## 🐛 Troubleshooting

### **Lỗi: "movieApi.get is not a function"**
→ Cài đặt đúng version axios: `npm install axios@1.7.9`

### **Lỗi: "File db.json not found"**
→ Sử dụng đường dẫn tuyệt đối khi chạy json-server

### **Login không redirect**
→ Kiểm tra console, đảm bảo json-server đang chạy trên port 3001

### **Movies không hiển thị**
→ Kiểm tra Network tab, đảm bảo API call thành công

---

## 📝 Test Cases

### **Test 1: Login thành công**
1. Vào `/login`
2. Nhập: `admin` / `123456`
3. Click "Login"
4. ✅ Redirect đến `/movies`
5. ✅ Header hiển thị: "Welcome, admin [admin badge]"

### **Test 2: Login thất bại**
1. Vào `/login`
2. Nhập: `wrong` / `wrong`
3. Click "Login"
4. ✅ Hiển thị: "Invalid username/email or password."

### **Test 3: Protected Route**
1. Logout (nếu đã login)
2. Truy cập trực tiếp: `http://localhost:3000/movies`
3. ✅ Tự động redirect về `/login`

### **Test 4: CRUD Movies**
1. Login thành công
2. Thêm phim mới → ✅ Hiển thị trong list
3. Click "Sửa" → ✅ Form fill data, update thành công
4. Click "Xóa" → ✅ Confirm modal, xóa thành công

### **Test 5: Logout**
1. Login thành công
2. Click "Logout" ở Header
3. ✅ Redirect về `/login`
4. ✅ localStorage cleared

---

## 🎓 Kiến thức áp dụng

- ✅ React Hooks: useState, useReducer, useContext, useEffect
- ✅ Context API pattern
- ✅ React Router v6: BrowserRouter, Routes, Route, Navigate, useNavigate
- ✅ Protected Routes with HOC
- ✅ Form validation real-time
- ✅ Axios HTTP requests
- ✅ localStorage persistence
- ✅ Async/await error handling
- ✅ React Bootstrap components
- ✅ RESTful API integration

---

**🎉 Hoàn thành!** Hệ thống đã ready để test!
