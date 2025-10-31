// src/components/MovieTable.jsx
import React from 'react';
import { Table, Button, Image, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import { useMovieState, useMovieDispatch } from '../contexts/MovieContext';

const MovieTable = () => {
  const state = useMovieState();
  // Lấy confirmDelete từ Context (chứa logic xóa phim)
  const { dispatch, confirmDelete } = useMovieDispatch(); 
  
  const { movies, genres, loading, movieToDelete, showDeleteModal, showDetailModal, movieDetail, searchQuery, searchField } = state;

  // Tạo genre map từ dữ liệu API
  const genreMap = genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});

  // Hàm lọc phim dựa trên searchQuery và searchField
  const filteredMovies = movies.filter(movie => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    switch (searchField) {
      case 'title':
        return (movie.title || '').toLowerCase().includes(query);
      
      case 'description':
        return (movie.description || '').toLowerCase().includes(query);
      
      case 'country':
        return (movie.country || '').toLowerCase().includes(query);
      
      case 'year':
        return (movie.year || '').toString().includes(query);
      
      case 'genre':
        const genreName = genreMap[movie.genreId] || '';
        return genreName.toLowerCase().includes(query);
      
      case 'all':
      default:
        // Tìm trong tất cả các trường
        const title = (movie.title || '').toLowerCase();
        const description = (movie.description || '').toLowerCase();
        const country = (movie.country || '').toLowerCase();
        const year = (movie.year || '').toString();
        const genre = (genreMap[movie.genreId] || '').toLowerCase();
        
        return title.includes(query) || 
               description.includes(query) || 
               country.includes(query) || 
               year.includes(query) ||
               genre.includes(query);
    }
  });

  // Hàm để lấy màu badge theo danh mục
  const getCategoryBadgeVariant = (genreName) => {
    const categoryColors = {
      'Sci-Fi': 'primary',
      'Comedy': 'warning',
      'Drama': 'info', 
      'Horror': 'dark',
      'Romance': 'danger',
      'Action': 'success',
      'Thriller': 'secondary'
    };
    return categoryColors[genreName] || 'secondary';
  };

  const handleEditClick = (movie) => {
      // Mở Modal Sửa và gán dữ liệu vào state
      dispatch({ type: 'OPEN_EDIT_MODAL', payload: movie });
  };
  
  const handleDeleteClick = (movie) => {
      // Mở Modal Xác nhận Xóa và gán phim vào movieToDelete
      dispatch({ type: 'OPEN_DELETE_MODAL', payload: movie });
  };

  const handleDetailClick = (movie) => {
      // Mở Modal Chi Tiết
      dispatch({ type: 'OPEN_DETAIL_MODAL', payload: movie });
  };

  return (
    <>
      {loading && movies.length === 0 ? (
          <div className="text-center my-4">
              <Spinner animation="border" role="status" variant="primary" className="me-2" />
              <Alert variant="info" className="mt-3">Đang tải dữ liệu phim...</Alert>
          </div>
      ) : (
        <>
          {/* Thông báo kết quả tìm kiếm */}
          {searchQuery && (
            <Alert 
              variant="info" 
              className="mb-3"
              style={{
                borderRadius: '15px',
                border: 'none',
                boxShadow: '0 5px 15px rgba(0,123,255,0.2)'
              }}
            >
              <strong>🔍 Kết quả tìm kiếm:</strong> Tìm thấy <strong>{filteredMovies.length}</strong> phim 
              {searchField !== 'all' && ` trong trường "${
                searchField === 'title' ? 'Tên phim' :
                searchField === 'description' ? 'Mô tả' :
                searchField === 'country' ? 'Quốc gia' :
                searchField === 'year' ? 'Năm' :
                'Thể loại'
              }"`} khớp với từ khóa "<strong>{searchQuery}</strong>"
            </Alert>
          )}

          {/* Thông báo không tìm thấy */}
          {filteredMovies.length === 0 ? (
            <Alert 
              variant="warning" 
              className="text-center"
              style={{
                borderRadius: '15px',
                border: 'none',
                boxShadow: '0 5px 15px rgba(255,193,7,0.2)',
                padding: '2rem'
              }}
            >
              <h5>❌ Không tìm thấy phim nào!</h5>
              <p className="mb-0">Không có phim nào phù hợp với từ khóa tìm kiếm của bạn.</p>
            </Alert>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <Table striped bordered hover responsive className="mt-2 mb-0">
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Avatar</th>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>ID</th>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Tên Phim</th>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Danh mục</th>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Thời lượng</th>
                    <th style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.map((movie, index) => {
                const genreName = genreMap[movie.genreId] || 'Unknown';
                const imageUrl = movie.poster || movie.avatar || '/images/placeholder.jpg';
                
                return (
                  <tr key={movie.id} style={{
                    transition: 'all 0.3s ease',
                    background: index % 2 === 0 ? '#f8f9fa' : 'white'
                  }}>
                    <td>
                      <Image 
                        src={imageUrl} 
                        alt={movie.title} 
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          borderRadius: '10px',
                          boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                        }} 
                      />
                    </td>
                    <td style={{ verticalAlign: 'middle', fontWeight: '600', color: '#667eea' }}>
                      #{movie.id}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <strong style={{ 
                        fontSize: '1.05rem',
                        color: '#2d3748'
                      }}>
                        {movie.title}
                      </strong>
                      <br />
                      <small style={{ 
                        color: '#718096',
                        fontSize: '0.85rem'
                      }}>
                        📅 {movie.year}
                      </small>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <Badge 
                        bg={getCategoryBadgeVariant(genreName)}
                        style={{
                          padding: '0.5rem 0.8rem',
                          fontSize: '0.85rem',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {genreName}
                      </Badge>
                    </td>
                    <td style={{ verticalAlign: 'middle', fontWeight: '600', color: '#4a5568' }}>
                      ⏱️ {movie.duration} phút
                    </td>
                   
                    <td style={{ verticalAlign: 'middle' }}>
                      <Button 
                        size="sm" 
                        onClick={() => handleDetailClick(movie)} 
                        className="me-2 mb-1"
                        style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.8rem',
                          fontWeight: '600',
                          boxShadow: '0 3px 10px rgba(79, 172, 254, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        👁️ Chi Tiết
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleEditClick(movie)} 
                        className="me-2 mb-1"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.8rem',
                          fontWeight: '600',
                          boxShadow: '0 3px 10px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDeleteClick(movie)}
                        className="mb-1"
                        style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.4rem 0.8rem',
                          fontWeight: '600',
                          boxShadow: '0 3px 10px rgba(245, 87, 108, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🗑️ Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
          )}
        </>
      )}

      {/* MODAL XÁC NHẬN XÓA - STYLE ĐẸP */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })}
        centered
      >
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderBottom: 'none',
            padding: '1.5rem'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ⚠️ Xác nhận Xóa Phim
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem',
          background: 'linear-gradient(to bottom, #fff5f5 0%, #ffffff 100%)'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(245, 87, 108, 0.2)',
            border: '2px solid rgba(245, 87, 108, 0.3)'
          }}>
            <p style={{ 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              color: '#2d3748'
            }}>
              Bạn có chắc chắn muốn xóa phim:
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '1rem',
              borderRadius: '10px',
              color: 'white',
              marginBottom: '1rem'
            }}>
              <strong style={{ fontSize: '1.2rem' }}>"{movieToDelete?.title}"</strong>
              <br />
              <small>ID: #{movieToDelete?.id}</small>
            </div>
            <p style={{ 
              color: '#e53e3e',
              fontWeight: '600',
              marginBottom: 0,
              fontSize: '0.95rem'
            }}>
              ⚠️ Hành động này không thể hoàn tác!
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{
          background: 'linear-gradient(to right, #f8f9fa 0%, #e9ecef 100%)',
          borderTop: '1px solid rgba(245, 87, 108, 0.2)',
          padding: '1.5rem'
        }}>
          <Button 
            variant="light"
            onClick={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })}
            style={{
              borderRadius: '25px',
              padding: '0.6rem 2rem',
              fontWeight: '600',
              border: '2px solid #6c757d',
              transition: 'all 0.3s ease'
            }}
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={() => confirmDelete(movieToDelete.id)}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '25px',
              padding: '0.6rem 2rem',
              fontWeight: '600',
              boxShadow: '0 5px 15px rgba(245, 87, 108, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            🗑️ Xác nhận Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CHI TIẾT PHIM - THIẾT KẾ ĐẸP MẮT */}
      <Modal 
        show={showDetailModal} 
        onHide={() => dispatch({ type: 'CLOSE_DETAIL_MODAL' })} 
        size="xl"
        centered
        scrollable
      >
        <Modal.Header 
          closeButton 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderBottom: 'none',
            padding: '1.5rem'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
          }}>
            🎬 Chi Tiết Phim
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
          style={{ 
            maxHeight: '75vh', 
            overflowY: 'auto',
            background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
            padding: '2rem'
          }}
        >
          {movieDetail && (
            <div className="container-fluid">
              <div className="row">
                {/* Cột ảnh với shadow đẹp */}
                <div className="col-md-4 text-center mb-4">
                  <div style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease',
                  }}>
                    <Image 
                      src={movieDetail.poster || movieDetail.avatar || '/images/placeholder.jpg'} 
                      alt={movieDetail.title}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Cột thông tin */}
                <div className="col-md-8">
                  <h2 style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800',
                    fontSize: '2.2rem',
                    marginBottom: '1rem'
                  }}>
                    {movieDetail.title}
                  </h2>
                  
                  <div className="mb-4">
                    <Badge 
                      bg={getCategoryBadgeVariant(genreMap[movieDetail.genreId] || 'Unknown')} 
                      className="me-2"
                      style={{ 
                        fontSize: '1rem', 
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      🎭 {genreMap[movieDetail.genreId] || 'Unknown'}
                    </Badge>
                    <Badge 
                      bg="dark" 
                      style={{ 
                        fontSize: '1rem', 
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      📅 {movieDetail.year}
                    </Badge>
                  </div>

                  {/* Grid thông tin với card gradient */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 5px 15px rgba(240, 147, 251, 0.4)',
                        transition: 'transform 0.3s ease'
                      }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🌍 Quốc gia</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                          {movieDetail.country || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 5px 15px rgba(79, 172, 254, 0.4)',
                        transition: 'transform 0.3s ease'
                      }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>⏱️ Thời lượng</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                          {movieDetail.duration} phút
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 5px 15px rgba(250, 112, 154, 0.4)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🆔 Mã phim</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>#{movieDetail.id}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>📅 Năm phát hành</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{movieDetail.year}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần mô tả đầy đủ - hiển thị ở dưới với width full */}
              <div className="row mt-4">
                <div className="col-12">
                  <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '2rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <h4 style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      fontSize: '1.5rem'
                    }}>
                      📝 Nội dung phim
                    </h4>
                    <div style={{
                      height: '3px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '3px',
                      marginBottom: '1.5rem',
                      width: '100px'
                    }}></div>
                    <p style={{ 
                      textAlign: 'justify', 
                      lineHeight: '2',
                      fontSize: '1.1rem',
                      color: '#2d3748',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      letterSpacing: '0.3px'
                    }}>
                      {movieDetail.description || 'Chưa có mô tả cho phim này.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{
          background: 'linear-gradient(to right, #f8f9fa 0%, #e9ecef 100%)',
          borderTop: '1px solid rgba(102, 126, 234, 0.2)',
          padding: '1.5rem'
        }}>
          <Button 
            variant="light" 
            onClick={() => dispatch({ type: 'CLOSE_DETAIL_MODAL' })}
            style={{
              borderRadius: '25px',
              padding: '0.6rem 2rem',
              fontWeight: '600',
              border: '2px solid #6c757d',
              transition: 'all 0.3s ease'
            }}
          >
            Đóng
          </Button>
          <Button 
            onClick={() => {
              dispatch({ type: 'CLOSE_DETAIL_MODAL' });
              handleEditClick(movieDetail);
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '25px',
              padding: '0.6rem 2rem',
              fontWeight: '600',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            ✏️ Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MovieTable;
