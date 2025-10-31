// src/components/SearchBar.jsx
import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useMovieState, useMovieDispatch } from '../contexts/MovieContext';

const SearchBar = () => {
    const { searchQuery, searchField } = useMovieState();
    const { dispatch } = useMovieDispatch();

    const handleSearchChange = (e) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
    };

    const handleFieldChange = (e) => {
        dispatch({ type: 'SET_SEARCH_FIELD', payload: e.target.value });
    };

    return (
        <Row className="mb-4">
            <Col md={10} lg={8} className="mx-auto">
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                }}>
                    <h4 style={{ 
                        color: 'white', 
                        marginBottom: '1.5rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        🔍 Tìm kiếm phim
                    </h4>
                    
                    <Row className="g-3">
                        {/* Dropdown chọn trường tìm kiếm */}
                        <Col md={4}>
                            <Form.Select
                                value={searchField}
                                onChange={handleFieldChange}
                                style={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">🎬 Tất cả</option>
                                <option value="title">📽️ Tên phim</option>
                                <option value="description">📝 Mô tả</option>
                                <option value="country">🌍 Quốc gia</option>
                                <option value="year">📅 Năm</option>
                                <option value="genre">🎭 Thể loại</option>
                            </Form.Select>
                        </Col>

                        {/* Input tìm kiếm */}
                        <Col md={8}>
                            <InputGroup>
                                <InputGroup.Text 
                                    style={{
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '12px 0 0 12px',
                                        padding: '0 1rem'
                                    }}
                                >
                                    🔎
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder={`Nhập từ khóa tìm kiếm ${
                                        searchField === 'all' ? 'theo mọi trường...' :
                                        searchField === 'title' ? 'tên phim...' :
                                        searchField === 'description' ? 'mô tả...' :
                                        searchField === 'country' ? 'quốc gia...' :
                                        searchField === 'year' ? 'năm phát hành...' :
                                        'thể loại...'
                                    }`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{
                                        border: 'none',
                                        borderRadius: '0 12px 12px 0',
                                        fontSize: '1rem',
                                        padding: '0.75rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    {/* Hiển thị thông tin tìm kiếm */}
                    {searchQuery && (
                        <div className="text-center mt-3">
                            <small style={{ 
                                color: 'white',
                                background: 'rgba(255,255,255,0.25)',
                                padding: '0.5rem 1.2rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'inline-block',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}>
                                Đang tìm "{searchQuery}" trong {
                                    searchField === 'all' ? 'tất cả trường' :
                                    searchField === 'title' ? 'tên phim' :
                                    searchField === 'description' ? 'mô tả' :
                                    searchField === 'country' ? 'quốc gia' :
                                    searchField === 'year' ? 'năm phát hành' :
                                    'thể loại'
                                }
                            </small>
                        </div>
                    )}
                </div>
            </Col>
        </Row>
    );
};

export default SearchBar;
