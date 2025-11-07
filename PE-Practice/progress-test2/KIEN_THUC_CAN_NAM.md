# 📚 KIẾN THỨC CẦN NẮM - USER MANAGEMENT PROJECT

## 🎯 MỤC TIÊU HỌC TẬP

Sau khi hoàn thành bài tập này, sinh viên sẽ:
1. Hiểu rõ về **Authentication & Authorization**
2. Biết cách xây dựng **Component Architecture** hợp lý
3. Thành thạo **React Hooks** cơ bản và nâng cao
4. Làm việc với **API** và xử lý **bất đồng bộ**
5. Áp dụng **Filter, Sort, Search** trong React
6. Quản lý **State phức tạp** với nhiều điều kiện

---

## 📖 I. REACT HOOKS

### 1. **useState** - Quản lý State cục bộ

#### Khái niệm:
- Hook để tạo và quản lý state trong functional component
- Trả về một mảng gồm 2 phần tử: `[state, setState]`

#### Cú pháp:
```javascript
const [state, setState] = useState(initialValue);
```

#### Ví dụ trong dự án:
```javascript
// State đơn giản
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// State phức tạp (object, array)
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);

// Cập nhật state
setLoading(true);
setUsers([...newUsers]);
```

#### Lưu ý:
- **Immutable**: Không được modify state trực tiếp
- **Async**: setState là bất đồng bộ
- **Functional update**: Dùng khi update dựa trên state cũ

```javascript
// ❌ Sai
users.push(newUser);

// ✅ Đúng
setUsers([...users, newUser]);
setUsers(prevUsers => [...prevUsers, newUser]);
```

---

### 2. **useEffect** - Side Effects

#### Khái niệm:
- Hook để xử lý side effects (fetch data, subscriptions, DOM manipulation)
- Chạy sau khi component render

#### Cú pháp:
```javascript
useEffect(() => {
    // Effect code
    return () => {
        // Cleanup function (optional)
    };
}, [dependencies]);
```

#### Các trường hợp sử dụng:

**Case 1: Chạy một lần khi mount**
```javascript
useEffect(() => {
    fetchUsers(); // Chạy 1 lần khi component mount
}, []); // Dependencies rỗng
```

**Case 2: Chạy khi dependencies thay đổi**
```javascript
useEffect(() => {
    applyFiltersAndSort(); // Chạy mỗi khi users, searchTerm, ... thay đổi
}, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);
```

**Case 3: Cleanup function**
```javascript
useEffect(() => {
    const timer = setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
    
    return () => clearTimeout(timer); // Cleanup khi unmount
}, [successMessage]);
```

#### Lưu ý:
- ⚠️ Tránh infinite loop: Không update state trong useEffect mà không có dependencies
- ⚠️ Dependencies đầy đủ: ESLint sẽ cảnh báo nếu thiếu

---

### 3. **useContext** - Context API

#### Khái niệm:
- Hook để truy cập Context value
- Dùng để chia sẻ data giữa nhiều components (global state)

#### Cách sử dụng:

**Bước 1: Tạo Context**
```javascript
const AuthContext = createContext();
```

**Bước 2: Tạo Provider**
```javascript
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
```

**Bước 3: Sử dụng Context**
```javascript
const { user, login, logout } = useContext(AuthContext);
```

#### Ví dụ trong dự án:
```javascript
// AuthContext cung cấp:
const { isAuthenticated, user, loading, error, login, logout } = useAuth();
```

---

### 4. **useReducer** - State phức tạp

#### Khái niệm:
- Alternative của useState cho state logic phức tạp
- Giống Redux nhưng cục bộ hơn

#### Cú pháp:
```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

#### Ví dụ:
```javascript
// 1. Initial State
const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

// 2. Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false, isAuthenticated: true, user: action.payload };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...initialState };
        default:
            return state;
    }
};

// 3. Sử dụng
const [state, dispatch] = useReducer(authReducer, initialState);

// 4. Dispatch actions
dispatch({ type: 'LOGIN_START' });
dispatch({ type: 'LOGIN_SUCCESS', payload: user });
```

---

### 5. **useNavigate & useLocation** - React Router

#### useNavigate:
```javascript
const navigate = useNavigate();

// Chuyển hướng
navigate('/users');
navigate('/home', { replace: true });
```

#### useLocation:
```javascript
const location = useLocation();

// Lấy pathname hiện tại
console.log(location.pathname); // "/users"

// Highlight active link
active={location.pathname === '/users'}
```

---

## 🧩 II. COMPONENT ARCHITECTURE

### 1. **Container vs Presentational Pattern**

#### Container Component:
- Quản lý **logic** và **state**
- Fetch data, handle events
- Ví dụ: `UserListPage`

```javascript
const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    
    const fetchUsers = async () => { /* ... */ };
    const handleBanUser = () => { /* ... */ };
    
    return (
        <UserTable users={filteredUsers} onBanUser={handleBanUser} />
    );
};
```

#### Presentational Component:
- Nhận **props** và **render UI**
- Không có logic phức tạp, không quản lý state
- Ví dụ: `UserTable`, `UserFilter`

```javascript
const UserTable = ({ users, onViewDetails, onBanUser }) => {
    return (
        <Table>
            {users.map(user => (
                <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                        <Button onClick={() => onViewDetails(user)}>
                            View Details
                        </Button>
                    </td>
                </tr>
            ))}
        </Table>
    );
};
```

### 2. **Props Drilling**

#### Vấn đề:
- Truyền props qua nhiều cấp components
- Code dài, khó maintain

#### Giải pháp:
- **Context API**: Chia sẻ data toàn cục
- **Component Composition**: Kết hợp components hợp lý

---

## 🔄 III. ARRAY METHODS

### 1. **filter()** - Lọc mảng

```javascript
// Lọc users theo role
const admins = users.filter(user => user.role === 'admin');

// Lọc theo nhiều điều kiện
const activeAdmins = users.filter(user => 
    user.role === 'admin' && user.status === 'active'
);

// Tìm kiếm
const results = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 2. **sort()** - Sắp xếp mảng

```javascript
// Sắp xếp tăng dần
users.sort((a, b) => a.id - b.id);

// Sắp xếp string
users.sort((a, b) => {
    if (a.username < b.username) return -1;
    if (a.username > b.username) return 1;
    return 0;
});

// Sắp xếp động
users.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
});
```

⚠️ **Lưu ý**: `sort()` modify mảng gốc → Nên copy trước:
```javascript
const sortedUsers = [...users].sort(...);
```

### 3. **map()** - Render list

```javascript
{users.map(user => (
    <tr key={user.id}>
        <td>{user.username}</td>
        <td>{user.fullName}</td>
    </tr>
))}
```

⚠️ **Lưu ý**: Luôn có `key` prop (unique)

### 4. **find()** - Tìm phần tử

```javascript
const user = users.find(u => u.id === userId);
const admin = users.find(u => u.role === 'admin');
```

---

## 🌐 IV. API & ASYNC/AWAIT

### 1. **Axios Basics**

```javascript
import axios from 'axios';

// Tạo instance
const API = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' }
});

// GET request
const users = await API.get('/users');

// POST request
const newUser = await API.post('/users', { username: 'test', ... });

// PUT request (update)
const updatedUser = await API.put(`/users/${id}`, userData);

// DELETE request
await API.delete(`/users/${id}`);
```

### 2. **Async/Await Pattern**

```javascript
const fetchUsers = async () => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await api.getUsers();
        setUsers(response);
    } catch (err) {
        setError('Không thể tải dữ liệu');
        console.error(err);
    } finally {
        setLoading(false);
    }
};
```

### 3. **Error Handling**

```javascript
try {
    const result = await api.banUser(userId);
    setSuccessMessage('Thành công!');
} catch (error) {
    if (error.response) {
        // Server responded with error
        setError(error.response.data.message);
    } else if (error.request) {
        // No response from server
        setError('Không thể kết nối server');
    } else {
        // Other errors
        setError('Có lỗi xảy ra');
    }
}
```

---

## 🎨 V. BOOTSTRAP COMPONENTS

### 1. **Form Components**

```javascript
<Form.Group>
    <Form.Label>Username</Form.Label>
    <Form.Control
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        isInvalid={!!errors.username}
    />
    <Form.Control.Feedback type="invalid">
        {errors.username}
    </Form.Control.Feedback>
</Form.Group>
```

### 2. **Table**

```javascript
<Table striped bordered hover responsive>
    <thead className="table-dark">
        <tr>
            <th>ID</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        {users.map(user => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
            </tr>
        ))}
    </tbody>
</Table>
```

### 3. **Modal**

```javascript
<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
        <Modal.Title>Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </Modal.Footer>
</Modal>
```

### 4. **Badge**

```javascript
<Badge bg="success">Active</Badge>
<Badge bg="danger">Blocked</Badge>
<Badge bg="warning" text="dark">Locked</Badge>
```

### 5. **Alert**

```javascript
<Alert variant="success" dismissible onClose={() => setMessage('')}>
    {message}
</Alert>
```

---

## 🔐 VI. AUTHENTICATION & AUTHORIZATION

### 1. **Authentication** (Xác thực)
- Kiểm tra **username/password** có đúng không
- Trả lời câu hỏi: "Bạn là ai?"

```javascript
const user = users.find(u => 
    u.username === username && u.password === password
);
if (user) {
    // Authenticated
}
```

### 2. **Authorization** (Phân quyền)
- Kiểm tra user có **quyền** làm gì không
- Trả lời câu hỏi: "Bạn có được phép làm điều này không?"

```javascript
if (user.role !== 'admin') {
    // Not authorized
    return { error: 'Bạn không có quyền truy cập' };
}

if (user.status !== 'active') {
    // Account blocked
    return { error: 'Tài khoản đã bị khóa' };
}
```

### 3. **Protected Routes**

```javascript
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Sử dụng
<Route path="/users" element={
    <PrivateRoute>
        <UserListPage />
    </PrivateRoute>
} />
```

---

## 💡 VII. BEST PRACTICES

### 1. **State Management**
- ✅ Đặt state ở component **thấp nhất** cần nó
- ✅ Lift state up khi nhiều components cần share
- ✅ Dùng Context cho global state

### 2. **Component Design**
- ✅ Một component chỉ làm **một việc**
- ✅ Tái sử dụng components
- ✅ Đặt tên rõ ràng, có ý nghĩa

### 3. **Performance**
- ✅ Tránh render không cần thiết
- ✅ Sử dụng `key` prop đúng cách
- ✅ Dependencies của useEffect chính xác

### 4. **Error Handling**
- ✅ Luôn có try/catch cho async code
- ✅ Hiển thị error messages cho user
- ✅ Log errors ra console để debug

### 5. **Code Style**
- ✅ Consistent naming convention
- ✅ Comment code phức tạp
- ✅ Format code đẹp, dễ đọc

---

## 🎓 VIII. CÂU HỎI ÔN TẬP

### Câu hỏi lý thuyết:
1. useState và useReducer khác nhau như thế nào? Khi nào nên dùng cái nào?
2. useEffect chạy khi nào? Dependencies là gì?
3. Context API giải quyết vấn đề gì?
4. Phân biệt Authentication và Authorization?
5. Protected Route hoạt động như thế nào?

### Câu hỏi thực hành:
1. Làm thế nào để filter mảng theo nhiều điều kiện?
2. Cách sắp xếp mảng theo field động?
3. Cách xử lý API error trong React?
4. Làm sao để update một phần tử trong mảng state?
5. Cách tránh infinite loop trong useEffect?

---

## 📚 IX. TÀI LIỆU HỌC THÊM

### Official Docs:
- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)

### Video Tutorials:
- [React Hooks Tutorial](https://www.youtube.com/results?search_query=react+hooks+tutorial)
- [React Authentication](https://www.youtube.com/results?search_query=react+authentication)

### Practice:
- Thử implement thêm chức năng: Edit User, Add User, Delete User
- Thử thêm pagination cho bảng users
- Thử implement real authentication với JWT token

---

**🎉 Chúc bạn học tốt và thành công!**
