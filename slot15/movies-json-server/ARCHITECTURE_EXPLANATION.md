# 📖 GIẢI THÍCH CHI TIẾT NGUYÊN LÝ HOẠT ĐỘNG

## 🎯 Tổng quan kiến trúc

```
User Browser
    ↓
React Router (App.js)
    ↓
AuthProvider (bọc toàn bộ app)
    ↓
    ├─→ LoginForm (public route)
    └─→ ProtectedRoute 
            ↓
         MovieProvider
            ↓
         MovieManager
            ↓
         ├─→ Header (hiển thị user info)
         ├─→ MovieForm (CRUD form)
         └─→ MovieTable (danh sách phim)
```

---

## 1️⃣ **AuthContext.jsx** - Quản lý Authentication State

### **Mục đích:**
Tạo một "kho lưu trữ" trung tâm cho trạng thái authentication, cho phép tất cả components con truy cập và cập nhật thông tin user mà không cần truyền props.

---

### **📦 1. Tạo Context**
```javascript
const AuthContext = createContext();
```
**Giải thích:**
- `createContext()` tạo một Context object
- Context là "cầu nối" để chia sẻ dữ liệu giữa các components mà không cần truyền props qua nhiều cấp
- Giống như "kênh radio" - các component "nghe" kênh này để nhận thông tin

---

### **🔢 2. Khởi tạo State**
```javascript
const initialState = { 
  user: null,              // Thông tin user hiện tại
  loading: false,          // Đang xử lý login?
  error: null,             // Thông báo lỗi
  isAuthenticated: false   // Đã đăng nhập chưa?
};
```
**Giải thích:**
- `user: null` - Ban đầu chưa có user nào đăng nhập
- `loading: false` - Không trong quá trình xử lý
- `error: null` - Không có lỗi
- `isAuthenticated: false` - Chưa xác thực

---

### **💾 3. Load User từ localStorage**
```javascript
const loadUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      return {
        ...initialState,
        user: JSON.parse(savedUser),
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return initialState;
};
```

**Giải thích từng bước:**

1. **`localStorage.getItem('currentUser')`**
   - Đọc dữ liệu từ localStorage (lưu trữ trình duyệt)
   - localStorage giống "hộp lưu trữ" trong máy tính user
   - Dữ liệu vẫn còn khi đóng browser và mở lại

2. **`JSON.parse(savedUser)`**
   - localStorage chỉ lưu string
   - `JSON.parse()` chuyển string → object JavaScript
   - Ví dụ: `'{"id":1,"name":"admin"}'` → `{id:1, name:"admin"}`

3. **`...initialState`**
   - Spread operator - "rải" tất cả properties của initialState
   - Đảm bảo có đầy đủ các field cần thiết

4. **`try...catch`**
   - Bảo vệ khỏi lỗi nếu localStorage bị corrupt
   - Nếu lỗi → trả về initialState rỗng

**Tại sao cần?**
- User đăng nhập → đóng browser → mở lại
- Không cần đăng nhập lại (session persistence)

---

### **⚙️ 4. Reducer Function**
```javascript
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { 
        ...state, 
        loading: true,    // Bắt đầu loading
        error: null       // Xóa lỗi cũ
      };
    
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload,      // Lưu thông tin user
        loading: false,            // Dừng loading
        error: null,               // Không có lỗi
        isAuthenticated: true      // Đánh dấu đã login
      };
    
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        user: null,                // Xóa user
        loading: false,            // Dừng loading
        error: action.payload,     // Lưu thông báo lỗi
        isAuthenticated: false     // Chưa authenticated
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };
    
    default: 
      return state;
  }
}
```

**Giải thích Reducer Pattern:**

**Reducer là gì?**
- Hàm nhận 2 tham số: `(currentState, action)`
- Trả về `newState` dựa trên `action.type`
- Giống "máy bán hàng tự động":
  - Input: Đồng xu (action) + Trạng thái hiện tại
  - Output: Sản phẩm mới (new state)

**Tại sao dùng Reducer thay vì useState?**
- State phức tạp với nhiều fields liên quan
- Logic update state phức tạp (nhiều điều kiện)
- Dễ debug (tất cả changes qua một chỗ)
- Dễ test (pure function)

**Flow của mỗi action:**

1. **LOGIN_START:**
   - User click "Login" button
   - Hiển thị spinner (loading = true)
   - Xóa error cũ để không hiển thị lỗi cũ

2. **LOGIN_SUCCESS:**
   - API trả về user hợp lệ
   - Lưu user info vào state
   - Tắt loading spinner
   - Set isAuthenticated = true → ProtectedRoute cho phép vào

3. **LOGIN_FAILURE:**
   - API trả về lỗi hoặc credentials không đúng
   - Xóa user (đảm bảo không còn user cũ)
   - Tắt loading
   - Hiển thị error message

4. **LOGOUT:**
   - User click "Logout"
   - Reset tất cả về trạng thái ban đầu

5. **CLEAR_ERROR:**
   - User bắt đầu gõ lại form
   - Xóa error message để không làm phiền user

---

### **🏭 5. Provider Component**
```javascript
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, loadUserFromStorage());
```

**Giải thích:**

**`useReducer(authReducer, loadUserFromStorage())`**
- `useReducer` = useState phiên bản nâng cao
- Tham số 1: reducer function (xử lý logic)
- Tham số 2: initial state (từ localStorage)
- Trả về: `[state, dispatch]`
  - `state`: Trạng thái hiện tại
  - `dispatch`: Hàm để gửi actions

**`children` prop:**
- Tất cả components được bọc bởi `<AuthProvider>`
- Ví dụ:
  ```jsx
  <AuthProvider>
    <App />  {/* children */}
  </AuthProvider>
  ```

---

### **💾 6. useEffect - Sync với localStorage**
```javascript
useEffect(() => {
  if (state.user) {
    localStorage.setItem('currentUser', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('currentUser');
  }
}, [state.user]);
```

**Giải thích từng bước:**

1. **`useEffect(() => {...}, [state.user])`**
   - Chạy mỗi khi `state.user` thay đổi
   - Dependency array `[state.user]` = "theo dõi state.user"

2. **`if (state.user)`**
   - Nếu có user (đã login)
   - → Lưu vào localStorage

3. **`JSON.stringify(state.user)`**
   - Chuyển object → string để lưu
   - Ví dụ: `{id:1}` → `'{"id":1}'`

4. **`localStorage.removeItem('currentUser')`**
   - Khi logout (user = null)
   - → Xóa khỏi localStorage

**Tại sao cần sync?**
- User login → Đóng browser → Mở lại
- localStorage giữ data → Tự động login lại
- User logout → Xóa data → Không auto-login

---

### **🔐 7. Hàm login() - Logic đăng nhập**
```javascript
async function login(identifier, password) {
  dispatch({ type: 'LOGIN_START' });

  try {
    // Bước 1: Lấy danh sách accounts từ API
    const response = await movieApi.get('/accounts');
    const accounts = response.data;

    // Bước 2: Kiểm tra identifier là email hay username
    const isEmail = identifier.includes('@');
    
    // Bước 3: Tìm account phù hợp
    const account = accounts.find(acc => {
      if (isEmail) {
        return acc.email === identifier && acc.password === password;
      } else {
        return acc.username === identifier && acc.password === password;
      }
    });

    // Bước 4: Validate kết quả
    if (!account) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Invalid username/email or password.' 
      });
      return { ok: false, message: '...' };
    }

    if (account.status === 'locked') {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Account is locked. Please contact administrator.' 
      });
      return { ok: false, message: '...' };
    }

    // Bước 5: Login thành công
    const userInfo = {
      id: account.id,
      username: account.username,
      email: account.email,
      role: account.role,
      status: account.status
      // ⚠️ KHÔNG lưu password!
    };

    dispatch({ type: 'LOGIN_SUCCESS', payload: userInfo });
    return { ok: true, user: userInfo };

  } catch (error) {
    console.error('Login error:', error);
    dispatch({ 
      type: 'LOGIN_FAILURE', 
      payload: 'Failed to connect to server. Please try again.' 
    });
    return { ok: false, message: '...' };
  }
}
```

**Giải thích chi tiết từng bước:**

**Bước 1: Gọi API lấy accounts**
```javascript
const response = await movieApi.get('/accounts');
const accounts = response.data;
```
- `movieApi.get('/accounts')` → `GET http://localhost:3001/accounts`
- `await` = đợi API trả về kết quả (async/await)
- `response.data` = array của accounts từ db.json

**Bước 2: Phát hiện email vs username**
```javascript
const isEmail = identifier.includes('@');
```
- Email luôn có ký tự `@`
- Username không có `@`
- Đơn giản nhưng hiệu quả!

**Bước 3: Tìm account**
```javascript
const account = accounts.find(acc => {
  if (isEmail) {
    return acc.email === identifier && acc.password === password;
  } else {
    return acc.username === identifier && acc.password === password;
  }
});
```
- `Array.find()` duyệt từng account
- So sánh email/username VÀ password
- Trả về account đầu tiên khớp hoặc `undefined`

**Bước 4: Validation**
- Kiểm tra `!account` = không tìm thấy
- Kiểm tra `status === 'locked'` = tài khoản bị khóa
- Dispatch action tương ứng

**Bước 5: Thành công**
- Tạo object `userInfo` (không có password!)
- Dispatch `LOGIN_SUCCESS` với payload = userInfo
- Return object `{ok: true}` để component biết thành công

**Error Handling:**
- `try...catch` bắt lỗi network (server down, timeout)
- Hiển thị message thân thiện cho user

---

### **🚪 8. Hàm logout()**
```javascript
function logout() {
  dispatch({ type: 'LOGOUT' });
}
```

**Giải thích:**
- Đơn giản: gửi action `LOGOUT`
- Reducer xử lý: reset state về initialState
- useEffect tự động xóa localStorage (vì user = null)

**Flow:**
1. User click "Logout" button
2. Component gọi `logout()`
3. Dispatch action `LOGOUT`
4. Reducer reset state
5. useEffect phát hiện user = null → xóa localStorage
6. Component re-render → hiển thị trạng thái logged out

---

### **🧹 9. Hàm clearError()**
```javascript
function clearError() {
  dispatch({ type: 'CLEAR_ERROR' });
}
```

**Giải thích:**
- Xóa error message
- Dùng khi:
  - User bắt đầu gõ lại form
  - User dismiss error alert

---

### **📤 10. Context Value**
```javascript
const value = {
  user: state.user,
  loading: state.loading,
  error: state.error,
  isAuthenticated: state.isAuthenticated,
  login,
  logout,
  clearError
};

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

**Giải thích:**

**Object `value`:**
- Chứa TẤT CẢ thứ mà components con cần:
  - **State**: user, loading, error, isAuthenticated
  - **Methods**: login(), logout(), clearError()

**`<AuthContext.Provider>`:**
- "Nhà cung cấp" dữ liệu
- Prop `value` = dữ liệu được chia sẻ
- `children` = tất cả components con

**Cách hoạt động:**
```
<AuthProvider>           ← Provider cấp dữ liệu
  <App>                  ← Có thể dùng useAuth()
    <LoginForm>          ← Có thể dùng useAuth()
      <Button />         ← Có thể dùng useAuth()
    </LoginForm>
  </App>
</AuthProvider>
```

Bất kỳ component nào trong cây đều có thể:
```javascript
const { user, login } = useAuth();
```

---

### **🎣 11. Custom Hook useAuth()**
```javascript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Giải thích:**

**`useContext(AuthContext)`:**
- Lấy giá trị từ Context gần nhất
- Trả về `value` object từ Provider

**Error checking:**
```javascript
if (!context) {
  throw new Error('useAuth must be used within AuthProvider');
}
```
- Nếu component dùng `useAuth()` ngoài `<AuthProvider>`
- → Throw error rõ ràng (giúp debug)

**Tại sao cần custom hook?**
- Code ngắn gọn: `useAuth()` thay vì `useContext(AuthContext)`
- Error handling tập trung
- Dễ refactor sau này

**Cách dùng trong component:**
```javascript
function LoginForm() {
  const { user, login, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.ok) {
      // Success!
    }
  };
  
  return (
    <div>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSubmit}>...</form>
    </div>
  );
}
```

---

## 2️⃣ **LoginForm.jsx** - Component Form Đăng Nhập

### **Mục đích:**
- Hiển thị form login với validation
- Xử lý user input
- Gọi API login qua AuthContext
- Redirect sau login thành công

---

### **📦 State Management với useReducer**

```javascript
const initialFormState = {
  identifier: '',  // Username hoặc email
  password: '',
  errors: {}       // Object chứa validation errors
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message }
      };
    
    case 'CLEAR_ERROR':
      const { [action.field]: removed, ...restErrors } = state.errors;
      return {
        ...state,
        errors: restErrors
      };
    
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    
    case 'RESET_FORM':
      return initialFormState;
    
    default:
      return state;
  }
}
```

**Giải thích Reducer Actions:**

**1. SET_FIELD - Cập nhật giá trị input**
```javascript
case 'SET_FIELD':
  return {
    ...state,
    [action.field]: action.value
  };
```
- `[action.field]` = computed property name
- Ví dụ: `action = {type: 'SET_FIELD', field: 'identifier', value: 'admin'}`
- → `state.identifier = 'admin'`

**2. SET_ERROR - Thêm lỗi cho một field**
```javascript
case 'SET_ERROR':
  return {
    ...state,
    errors: { ...state.errors, [action.field]: action.message }
  };
```
- Merge error mới vào errors object
- Giữ lại errors cũ của fields khác

**3. CLEAR_ERROR - Xóa lỗi của một field**
```javascript
case 'CLEAR_ERROR':
  const { [action.field]: removed, ...restErrors } = state.errors;
  return {
    ...state,
    errors: restErrors
  };
```
- **Destructuring trick:**
  - `{ [action.field]: removed, ...restErrors }` 
  - Tách field cần xóa ra biến `removed`
  - Lấy phần còn lại vào `restErrors`
- Ví dụ:
  ```javascript
  // errors = { identifier: 'Required', password: 'Too short' }
  // Xóa 'identifier'
  const { identifier: removed, ...restErrors } = errors;
  // restErrors = { password: 'Too short' }
  ```

**4. SET_ERRORS - Set nhiều lỗi cùng lúc**
- Dùng khi validate toàn bộ form
- Replace toàn bộ errors object

**5. RESET_FORM - Reset về trạng thái ban đầu**
- Xóa sạch form
- Dùng sau khi login thành công hoặc user click Reset

---

### **🎯 Component Logic**

```javascript
function LoginForm() {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect nếu đã authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/movies');
    }
  }, [isAuthenticated, navigate]);
```

**Giải thích:**

**useReducer cho local form state:**
- State form riêng (identifier, password, errors)
- Không cần lưu vào Context (chỉ component này dùng)

**useAuth cho global auth state:**
- Lấy methods: login, clearError
- Lấy state: loading, error, isAuthenticated

**useNavigate để chuyển trang:**
- Hook từ React Router
- `navigate('/movies')` = chuyển đến trang /movies

**useEffect auto-redirect:**
```javascript
useEffect(() => {
  if (isAuthenticated) {
    navigate('/movies');
  }
}, [isAuthenticated, navigate]);
```
- Chạy khi `isAuthenticated` thay đổi
- Nếu `true` → tự động chuyển trang
- User không thấy LoginForm nữa

---

### **✅ Validation Logic**

```javascript
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (v) => v.includes('@');

const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Cập nhật giá trị
  dispatch({ type: 'SET_FIELD', field: name, value });
  
  // Clear auth error
  clearError();

  // Validation real-time
  if (name === 'identifier') {
    if (!value.trim()) {
      dispatch({ type: 'SET_ERROR', field: name, message: 'Username or Email is required.' });
    } else if (isEmail(value) && !emailRe.test(value)) {
      dispatch({ type: 'SET_ERROR', field: name, message: 'Email is invalid format.' });
    } else {
      dispatch({ type: 'CLEAR_ERROR', field: name });
    }
  }

  if (name === 'password') {
    if (!value.trim()) {
      dispatch({ type: 'SET_ERROR', field: name, message: 'Password is required.' });
    } else {
      dispatch({ type: 'CLEAR_ERROR', field: name });
    }
  }
};
```

**Giải thích Real-time Validation:**

**1. Lấy name và value:**
```javascript
const { name, value } = e.target;
// name = 'identifier' hoặc 'password'
// value = giá trị user đang gõ
```

**2. Cập nhật state:**
```javascript
dispatch({ type: 'SET_FIELD', field: name, value });
```
- Lưu giá trị mới vào state
- Re-render input với giá trị mới

**3. Clear auth error:**
```javascript
clearError();
```
- User đang gõ lại → xóa error từ lần submit trước
- Không làm phiền user với error cũ

**4. Validate identifier:**
```javascript
if (name === 'identifier') {
  if (!value.trim()) {
    // Trống → lỗi
    dispatch({ type: 'SET_ERROR', field: name, message: '...' });
  } else if (isEmail(value) && !emailRe.test(value)) {
    // Có @ nhưng format email sai → lỗi
    dispatch({ type: 'SET_ERROR', field: name, message: '...' });
  } else {
    // Hợp lệ → xóa lỗi
    dispatch({ type: 'CLEAR_ERROR', field: name });
  }
}
```

**Email Regex explained:**
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```
- `^` = bắt đầu string
- `[^\s@]+` = một hoặc nhiều ký tự (không phải space/@ )
- `@` = ký tự @
- `[^\s@]+` = một hoặc nhiều ký tự
- `\.` = dấu chấm (escaped)
- `[^\s@]+` = một hoặc nhiều ký tự
- `$` = kết thúc string

Ví dụ:
- ✅ `admin@example.com`
- ❌ `admin@` (thiếu domain)
- ❌ `@example.com` (thiếu local part)

---

### **📝 Form Validation Function**

```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formState.identifier.trim()) {
    errors.identifier = 'Username or Email is required.';
  } else if (isEmail(formState.identifier) && !emailRe.test(formState.identifier)) {
    errors.identifier = 'Email is invalid format.';
  }
  
  if (!formState.password.trim()) {
    errors.password = 'Password is required.';
  }
  
  return errors;
};
```

**Giải thích:**
- Validate TẤT CẢ fields cùng lúc
- Trả về object errors
- Empty object `{}` = không có lỗi
- Dùng trước khi submit

---

### **🚀 Submit Handler**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  clearError();
  
  // Validate toàn bộ form
  const validationErrors = validateForm();
  dispatch({ type: 'SET_ERRORS', errors: validationErrors });
  
  if (Object.keys(validationErrors).length > 0) {
    return; // Có lỗi → dừng
  }

  try {
    // Gọi login từ AuthContext
    const result = await login(formState.identifier.trim(), formState.password);
    
    if (result.ok) {
      // Success → useEffect sẽ redirect
      console.log('Login successful, redirecting...');
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};
```

**Giải thích từng bước:**

**1. Prevent default:**
```javascript
e.preventDefault();
```
- Ngăn form submit mặc định (reload trang)

**2. Clear auth error cũ:**
```javascript
clearError();
```

**3. Validate form:**
```javascript
const validationErrors = validateForm();
dispatch({ type: 'SET_ERRORS', errors: validationErrors });
```
- Lấy tất cả lỗi
- Hiển thị trong UI

**4. Check có lỗi không:**
```javascript
if (Object.keys(validationErrors).length > 0) {
  return;
}
```
- `Object.keys(obj)` = array các keys
- Nếu length > 0 = có lỗi → dừng

**5. Gọi API login:**
```javascript
const result = await login(formState.identifier.trim(), formState.password);
```
- `.trim()` xóa khoảng trắng đầu/cuối
- `await` đợi kết quả

**6. Handle success:**
```javascript
if (result.ok) {
  console.log('Login successful, redirecting...');
}
```
- AuthContext đã set `isAuthenticated = true`
- useEffect tự động redirect
- Không cần navigate() ở đây

---

## 3️⃣ **ProtectedRoute.jsx** - Bảo vệ Routes

```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" 
                 style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Giải thích Logic:**

**1. Check loading:**
```javascript
if (loading) {
  return <Spinner />;
}
```
- Khi app mới load, đang check localStorage
- Hiển thị spinner thay vì redirect ngay
- Tránh "flash" chuyển trang

**2. Check authenticated:**
```javascript
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```
- Nếu chưa login → redirect về /login
- `replace` = thay thế history (không thêm vào back stack)

**3. Render children:**
```javascript
return children;
```
- Nếu đã login → cho phép truy cập
- Render component con (MovieManager)

**Cách dùng:**
```jsx
<Route 
  path="/movies" 
  element={
    <ProtectedRoute>
      <MovieManager />
    </ProtectedRoute>
  } 
/>
```

**Flow:**
1. User truy cập `/movies`
2. ProtectedRoute check `isAuthenticated`
3. Nếu false → `<Navigate to="/login" />`
4. Nếu true → render `<MovieManager />`

---

## 4️⃣ **Header.jsx** - Hiển thị User Info

```javascript
function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand>🎬 Movie Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {isAuthenticated && user ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, <strong>{user.username}</strong>{' '}
                  <Badge bg={
                    user.role === 'admin' ? 'danger' : 
                    user.role === 'manager' ? 'warning' : 
                    'info'
                  }>
                    {user.role}
                  </Badge>
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
```

**Giải thích Logic:**

**1. Lấy user info:**
```javascript
const { user, isAuthenticated, logout } = useAuth();
```

**2. Conditional rendering:**
```javascript
{isAuthenticated && user ? (
  // Hiển thị user info + logout button
) : (
  // Hiển thị login button
)}
```

**3. Badge màu theo role:**
```javascript
<Badge bg={
  user.role === 'admin' ? 'danger' :     // Đỏ
  user.role === 'manager' ? 'warning' :   // Vàng
  'info'                                  // Xanh dương
}>
  {user.role}
</Badge>
```
- Ternary operator lồng nhau
- Admin = quan trọng nhất → màu đỏ
- Manager = trung gian → màu vàng
- User = thông thường → màu xanh

**4. Logout handler:**
```javascript
const handleLogout = () => {
  logout();           // Clear state + localStorage
  navigate('/login'); // Chuyển về trang login
};
```

---

## 5️⃣ **App.js** - Router Setup

```javascript
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route 
              path="/movies" 
              element={
                <ProtectedRoute>
                  <MovieManager />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
```

**Giải thích Cấu trúc:**

**1. Router bọc ngoài cùng:**
```javascript
<Router>
```
- Cung cấp routing context
- Cho phép sử dụng useNavigate, Link, Navigate

**2. AuthProvider bọc bên trong:**
```javascript
<AuthProvider>
```
- Cung cấp auth context
- Tất cả routes có thể dùng useAuth()

**3. Routes definition:**

**Route 1: Home redirect**
```javascript
<Route path="/" element={<Navigate to="/login" replace />} />
```
- `/` → redirect to `/login`
- User vào app → luôn bắt đầu từ login

**Route 2: Login page**
```javascript
<Route path="/login" element={<LoginForm />} />
```
- Public route
- Không cần authentication

**Route 3: Movies page (protected)**
```javascript
<Route 
  path="/movies" 
  element={
    <ProtectedRoute>
      <MovieManager />
    </ProtectedRoute>
  } 
/>
```
- Private route
- Phải login mới vào được

**Route 4: 404 fallback**
```javascript
<Route path="*" element={<Navigate to="/login" replace />} />
```
- `*` = match tất cả paths không match ở trên
- Redirect về login

---

## 6️⃣ **MovieContext.jsx** - Quản lý Movies State

```javascript
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialMovieState);

  const fetchMovies = useCallback(async () => {
    dispatch({ type: 'START_LOADING' });
    try {
      const response = await movieApi.get('/movies');
      dispatch({ type: 'SET_MOVIES', payload: response.data });
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
      dispatch({ type: 'SET_MOVIES', payload: [] });
    }
  }, []);

  const handleCreateOrUpdate = useCallback(async (dataToSend, isEditing, isEditingId) => {
    dispatch({ type: 'START_LOADING' });
    
    try {
      if (isEditing) {
        await movieApi.put(`/movies/${isEditingId}`, dataToSend);
      } else {
        await movieApi.post('/movies', dataToSend);
      }
      
      dispatch({ type: 'RESET_FORM' });
      fetchMovies();
      return true;
    } catch (error) {
      console.error("Lỗi thao tác CREATE/UPDATE:", error);
      fetchMovies();
      return false;
    }
  }, [fetchMovies]);

  const confirmDelete = useCallback(async (id) => {
    dispatch({ type: 'CLOSE_DELETE_MODAL' });
    dispatch({ type: 'START_LOADING' });

    try {
      await movieApi.delete(`/movies/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      fetchMovies();
    }
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [fetchMovies, fetchGenres]);
```

**Giải thích CRUD Operations:**

**1. fetchMovies (READ):**
```javascript
const response = await movieApi.get('/movies');
dispatch({ type: 'SET_MOVIES', payload: response.data });
```
- GET request
- Lưu array movies vào state

**2. handleCreateOrUpdate (CREATE + UPDATE):**
```javascript
if (isEditing) {
  await movieApi.put(`/movies/${isEditingId}`, dataToSend);
} else {
  await movieApi.post('/movies', dataToSend);
}
```
- `isEditing = true` → PUT (update)
- `isEditing = false` → POST (create)
- Sau đó gọi `fetchMovies()` để reload list

**3. confirmDelete (DELETE):**
```javascript
await movieApi.delete(`/movies/${id}`);
fetchMovies();
```
- DELETE request với ID
- Reload list để cập nhật UI

**useCallback explained:**
```javascript
const fetchMovies = useCallback(async () => {
  // ...
}, []);
```
- Memoize function (tránh tạo lại function mỗi lần render)
- Dependency array `[]` = function không đổi
- Optimize performance

---

## 🎯 **Flow Tổng Thể**

### **Kịch bản 1: User Login thành công**

```
1. User mở browser → http://localhost:3000
   ↓
2. App.js render → Router check path "/"
   ↓
3. Match route "/" → Navigate to "/login"
   ↓
4. Render LoginForm component
   ↓
5. LoginForm render:
   - AuthContext load từ localStorage (chưa có user)
   - isAuthenticated = false
   - Hiển thị form
   ↓
6. User nhập "admin" + "123456" → click Login
   ↓
7. handleSubmit triggered:
   - validateForm() → no errors
   - Gọi login('admin', '123456')
   ↓
8. AuthContext.login():
   - Dispatch LOGIN_START → loading = true
   - GET /accounts từ API
   - Find account với username = 'admin'
   - Validate password, status, role
   - Dispatch LOGIN_SUCCESS → user = {...}, isAuthenticated = true
   - useEffect save to localStorage
   ↓
9. LoginForm useEffect phát hiện isAuthenticated = true
   ↓
10. navigate('/movies') triggered
   ↓
11. Router render route "/movies"
    ↓
12. ProtectedRoute check:
    - isAuthenticated = true ✅
    - Render children (MovieManager)
    ↓
13. MovieManager render:
    - Header hiển thị: "Welcome, admin [admin badge]"
    - MovieContext fetchMovies() + fetchGenres()
    - MovieTable hiển thị danh sách phim
```

---

### **Kịch bản 2: User reload page (đã login)**

```
1. User đang ở /movies → F5 reload
   ↓
2. App.js mount → AuthProvider init
   ↓
3. loadUserFromStorage() triggered:
   - localStorage.getItem('currentUser')
   - Found user object
   - Return { user: {...}, isAuthenticated: true }
   ↓
4. useReducer init với state từ localStorage
   ↓
5. Router render route "/movies"
   ↓
6. ProtectedRoute check:
   - isAuthenticated = true ✅
   - Render MovieManager
   ↓
7. User vẫn đăng nhập, không cần login lại!
```

---

### **Kịch bản 3: Unauthenticated user cố vào /movies**

```
1. User chưa login → truy cập trực tiếp http://localhost:3000/movies
   ↓
2. Router render route "/movies"
   ↓
3. ProtectedRoute check:
   - isAuthenticated = false ❌
   - Return <Navigate to="/login" replace />
   ↓
4. Router redirect về "/login"
   ↓
5. Render LoginForm
   ↓
6. User phải login trước
```

---

### **Kịch bản 4: CRUD Movie**

**CREATE:**
```
1. User click "Thêm phim" button
   ↓
2. MovieForm hiển thị modal
   ↓
3. User điền form → click "Lưu"
   ↓
4. handleSubmit:
   - Validate form
   - Gọi handleCreateOrUpdate(data, false, null)
   ↓
5. MovieContext.handleCreateOrUpdate():
   - isEditing = false
   - POST /movies với data
   - fetchMovies() reload list
   ↓
6. MovieTable re-render với phim mới
```

**UPDATE:**
```
1. User click button "Sửa" ở một movie
   ↓
2. Dispatch OPEN_EDIT_MODAL với movie data
   ↓
3. MovieForm hiển thị với data fill sẵn
   ↓
4. User sửa → click "Lưu"
   ↓
5. MovieContext.handleCreateOrUpdate():
   - isEditing = true
   - PUT /movies/:id với data mới
   - fetchMovies() reload list
   ↓
6. MovieTable re-render với data updated
```

**DELETE:**
```
1. User click button "Xóa" ở một movie
   ↓
2. Dispatch OPEN_DELETE_MODAL với movie
   ↓
3. Confirm Modal hiển thị
   ↓
4. User click "Confirm"
   ↓
5. MovieContext.confirmDelete(id):
   - DELETE /movies/:id
   - fetchMovies() reload list
   ↓
6. MovieTable re-render, movie đã bị xóa
```

---

## 🎓 **Concepts Quan Trọng**

### **1. Context API Pattern**
- **Tại sao dùng:** Chia sẻ state giữa nhiều components mà không props drilling
- **Khi nào dùng:** State cần dùng ở nhiều nơi (auth, theme, language)
- **Khi nào KHÔNG dùng:** State chỉ dùng trong 1-2 components

### **2. useReducer vs useState**
**useState:** State đơn giản, ít logic
```javascript
const [count, setCount] = useState(0);
setCount(count + 1);
```

**useReducer:** State phức tạp, nhiều actions
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT' });
```

### **3. Protected Routes**
- **Mục đích:** Bảo vệ pages khỏi unauthenticated users
- **Cách hoạt động:** HOC (Higher-Order Component) check auth trước khi render

### **4. localStorage Persistence**
- **Tại sao:** Giữ session khi reload page
- **Cách sync:** useEffect theo dõi user state
- **Security note:** Không lưu sensitive data (tokens nên dùng httpOnly cookies)

### **5. Async/Await Error Handling**
```javascript
try {
  const result = await apiCall();
  // Success
} catch (error) {
  // Error handling
}
```
- Bắt lỗi network, timeout, server errors
- Hiển thị message thân thiện cho user

---

## 🐛 **Common Pitfalls & Solutions**

### **1. Infinite re-render loop**
**Vấn đề:**
```javascript
useEffect(() => {
  fetchData();
}, [fetchData]); // ❌ fetchData recreated mỗi render
```

**Giải pháp:**
```javascript
const fetchData = useCallback(() => {
  // ...
}, []); // ✅ Memoize function

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### **2. Stale closure trong async**
**Vấn đề:**
```javascript
const handleClick = async () => {
  await delay(1000);
  console.log(count); // ❌ count cũ
};
```

**Giải pháp:** Dùng ref hoặc functional update

### **3. Forgot to await async functions**
**Vấn đề:**
```javascript
const result = login(user, pass); // ❌ Missing await
if (result.ok) { } // result là Promise, không phải object
```

**Giải pháp:**
```javascript
const result = await login(user, pass); // ✅
```

---

**🎉 Hoàn thành! Giải thích chi tiết toàn bộ hệ thống!**
