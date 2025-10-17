// LightSwitch component refactored to use useReducer to toggle light on and off
import React, { useReducer } from 'react';
import Button from 'react-bootstrap/Button';
function LightSwitch() {
    // Khai báo reducer đơn giản cho trạng thái boolean bật/tắt đèn
    const lightReducer = (state, action) => {
        switch (action.type) {
            case 'TOGGLE':
                return !state; // đảo trạng thái hiện tại
            case 'TURN_ON':
                return true;
            case 'TURN_OFF':
                return false;
            default:
                return state;
        }
    };

    // Khởi tạo state với useReducer: isLightOn là boolean, dispatch là hàm gửi action
    const [isLightOn, dispatch] = useReducer(lightReducer, false);

    // Hàm để chuyển đổi trạng thái đèn bằng cách dispatch action
    const toggleLight = () => dispatch({ type: 'TOGGLE' });
    // Style chung cho các button
    const buttonStyle = {  
        margin: '5px',
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    };
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>     
            <h2>Công Tắc Đèn</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Đèn hiện đang: {isLightOn ? 'Bật' : 'Tắt'}  
            </p>
            <Button
                onClick={toggleLight}   
                style={{ 
                    ...buttonStyle,
                    background: isLightOn ? 'red' : 'green',
                    color: 'white'
                }}  
            >
                {isLightOn ? 'Tắt Đèn' : 'Bật Đèn'}  
            </Button>   
        </div>
    );
}
export default LightSwitch;
