// src/pages/MovieManager.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { MovieProvider } from '../contexts/MovieContext';
import MovieForm from '../components/MovieForm';
import MovieTable from '../components/MovieTable';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

// Component con hiển thị nội dung, được bọc bởi Provider
const MovieManagerContent = () => {
    return (
        <>
            <Header />
            <Container className="mt-4" style={{ marginBottom: '4rem' }}>
                {/* Tiêu đề chính với style đẹp */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '2.5rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                    marginBottom: '3rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '2.5rem',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                        marginBottom: '0.5rem'
                    }}>
                        🎬 Quản lý Phim
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1.1rem',
                        marginBottom: 0,
                        fontWeight: '500'
                    }}>
                        Context + useReducer + Axios
                    </p>
                </div>
                
                <MovieForm /> 
                
                <h2 className="mt-5 mb-4 text-center" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800',
                    fontSize: '2rem'
                }}>
                    📋 Danh sách Phim
                </h2>
                
                <SearchBar />
                
                <MovieTable /> 
                
            </Container>
        </>
    );
}

// Component chính cung cấp Context
const MovieManager = () => (
    <MovieProvider>
        <MovieManagerContent />
    </MovieProvider>
);

export default MovieManager;
