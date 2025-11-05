//api.js chứa các hàm gọi API tới JSON Server
import axios from 'axios';
// Cấu hình Base URL cho JSON Server
// Giả định JSON Server đang chạy trên cổng 3001 
const API = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async () => {
    try {
        const response = await API.get('/users');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

//2. Payment API Functions

// Get all payments
export const getPayments = async () => {
    try {
        const response = await API.get('/payments');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch payments');
    }
};

// Get payment by ID
export const getPaymentById = async (id) => {
    try {
        const response = await API.get(`/payments/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch payment with ID: ${id}`);
    }
};

// Create new payment
export const createPayment = async (paymentData) => {
    try {
        const response = await API.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create payment');
    }
};

// Update payment
export const updatePayment = async (id, paymentData) => {
    try {
        const response = await API.put(`/payments/${id}`, paymentData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update payment with ID: ${id}`);
    }
};

// Delete payment
export const deletePayment = async (id) => {
    try {
        await API.delete(`/payments/${id}`);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete payment with ID: ${id}`);
    }
};

//3. Các hàm API khác có thể được thêm vào đây
