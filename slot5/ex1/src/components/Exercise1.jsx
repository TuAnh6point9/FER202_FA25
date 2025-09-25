function Exercise1() {
    
        //tính hàm double
        const hamDouble = (x) => x * 2;
        //ham kiem tra so chan
        const kiemTraSoChan = (x) => x % 2 === 0;
        return (    
        <div>
            <h1>Exercise 1</h1>
            <p>Kết quả hamDouble(5): {hamDouble(5)}</p>
            <p>Kết quả isEven(4): {kiemTraSoChan(4) ? 'số chẵn' : 'số lẻ'}</p>

        </div>
    );
}
export default Exercise1;