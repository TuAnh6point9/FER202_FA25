//ConfirmModal.jsx được dùng để hiển thị một modal xác nhận hành động
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Component ConfirmModal
 * 
 * Props:
 * - show: Boolean để hiển thị/ẩn modal
 * - title: Tiêu đề modal
 * - message: Nội dung thông báo
 * - onConfirm: Hàm xử lý khi nhấn nút xác nhận
 * - onHide: (Optional) Hàm xử lý khi đóng modal
 * - confirmText: (Optional) Text cho nút xác nhận, mặc định là "Xác nhận"
 * - cancelText: (Optional) Text cho nút hủy, mặc định là "Hủy"
 * - confirmVariant: (Optional) Variant cho nút xác nhận, mặc định là "primary"
 * - showCancel: (Optional) Hiển thị nút hủy, mặc định là false
 */
const ConfirmModal = ({ 
    show, 
    title, 
    message, 
    onConfirm, 
    onHide,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    confirmVariant = 'primary',
    showCancel = false
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton={!!onHide}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                {showCancel && onHide && (
                    <Button variant="secondary" onClick={onHide}>
                        {cancelText}
                    </Button>
                )}
                <Button variant={confirmVariant} onClick={onConfirm}>
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;

