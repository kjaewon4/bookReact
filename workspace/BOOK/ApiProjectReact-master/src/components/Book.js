import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bookmark } from "lucide-react";
import axios from "axios";
import "./Book.css";

const Book = ({
  title,
  author,
  publisher,
  image,
  description,
  onClick,
  isbn,
  expanded,
  isBookmarked,
  onBookmarkToggle
}) => {
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [aladdinMode, setAladdinMode] = useState(false); // 알라딘 모드 토글
  const location = useLocation();
  const isPopupMode = location.pathname === "/";

  // 팝업 모드와 확장 모드 모두에서 위치 정보 요청
  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        if (!isbn) return;
        const res = await axios.post("http://localhost:8080/api/bookstores", {
          isbn: isbn,
        });
        if (res.data?.itemOffStoreList?.length > 0) {
          const converted = res.data.itemOffStoreList.map((loc) => ({
            name: loc.offName,
            url: loc.link,
          }));
          setLocations(converted);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("❌ 위치 정보 요청 실패:", error);
        setLocations([]);
      }
    };

    if (showModal || expanded) {
      fetchLocationInfo();
    }
  }, [showModal, expanded, isbn]);
  const handleCloseModal = () => {
    setShowModal(false);
    setAladdinMode(false); // 모달 종료 시 알라딘 모드 초기화
  };
  // 알라딘 정보 토글 버튼 렌더링 함수
  const renderAladdinToggle = () => (
    <button
      style={styles.toggleBtn}
      onClick={(e) => {
        e.stopPropagation();
        setAladdinMode(!aladdinMode);
      }}
    >
      {aladdinMode ? "책 정보 보기" : "알라딘 정보 보기"}
    </button>
  );

  // 알라딘 정보 그리드 렌더링 함수
  const renderAladdinInfo = () => {
    if (locations.length === 0) {
      return <p>알라딘 정보를 찾을 수 없습니다.</p>;
    }
    return (
      <div style={{ ...styles.aladdinGrid, maxHeight: "200px", overflowY: "auto" }}>
        {locations.map((loc, idx) => (
          <div key={idx} style={styles.aladdinCard}>
            <p>{loc.name}</p>
            {loc.url && (
              <a href={loc.url} target="_blank" rel="noopener noreferrer">
                바로가기
              </a>
            )}
          </div>
        ))}
      </div>

    );
  };

  // 스타일 정의 (필요에 따라 Book.css와 조합)
  const styles = {
    description: {
      display: "flex",
      flexDirection: "column",
      width: "100%"
    },
    mainInfoContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      width: "100%"
    },
    extendedContentContainer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      marginTop: "10px",
      borderTop: "1px solid #ccc",
      paddingTop: "10px",
      gap: "10px"
    },
    aladdinGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
      marginTop: "10px"
    },
    aladdinCard: {
      backgroundColor: "#f8f8f8",
      padding: "8px",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "0.9rem"
    },
    toggleBtn: {
      padding: "6px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#eee"
    },
    toggleBtnContainer: {
      textAlign: "right",
      marginTop: "10px"
    }
  };

  // 팝업 모드는 기존 코드 유지 (생략)
  if (isPopupMode) {
    return (
      <>
        <div className="book" onClick={() => setShowModal(true)}>
          <div
            className="bookmark-icon"
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
          >
            {isBookmarked ? (
              <Bookmark size={30} color="#b395d6" fill="#b395d6" />
            ) : (
              <Bookmark size={30} color="#aaa" />
            )}
          </div>
          <img src={image} alt={title} />
          <h3 className="book-title">{title}</h3>
        </div>
        {showModal && (
          <div className="modal-overlay fullscreen" onClick={handleCloseModal}>
            <div className="modal-popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-popup-close" onClick={handleCloseModal}>
                ×
              </button>
              {/* 상단 영역: 이미지와 책 정보 (ROW) */}
              <div style={styles.mainInfoContainer}>
                <div className="popup-book-content">
                  <img src={image} alt={title} className="popup-book-image" />
                  <div className="popup-book-info">
                    <h3>{title}</h3>
                    <p>
                      <strong>저자:</strong> {author}
                    </p>
                    <p>
                      <strong>출판사:</strong> {publisher}
                    </p>
                  </div>
                </div>
              </div>
              {/* 하단 영역: DESCRIPTION과 토글 버튼 (COLUMN) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  marginTop: "10px",
                  gap: "10px"
                }}
              >
                {aladdinMode ? (
                  renderAladdinInfo()
                ) : (
                  <div className="popup-book-description">
                    <p>{description}</p>
                  </div>
                )}
                <div style={styles.toggleBtnContainer}>
                  {renderAladdinToggle()}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  

  // 일반(확장되지 않은) 상태
  if (!expanded) {
    return (
      <div className="book" onClick={onClick}>
        <div
          className="bookmark-icon"
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle();
          }}
        >
          {isBookmarked ? (
            <Bookmark size={30} color="#b395d6" fill="#b395d6" />
          ) : (
            <Bookmark size={30} color="#aaa" />
          )}
        </div>
        <div style={styles.description}>
          <div className="book-content">
            <img src={image} alt={title} />
          </div>
          <h3 className="book-title">{title}</h3>
        </div>
      </div>
    );
  }

  // 확장 모드 (expanded === true)
  return (
    <div className={`book expanded`} onClick={onClick}>
      <div
        className="bookmark-icon"
        onClick={(e) => {
          e.stopPropagation();
          onBookmarkToggle();
        }}
      >
        {isBookmarked ? (
          <Bookmark size={30} color="#f39c12" fill="#f39c12" />
        ) : (
          <Bookmark size={30} color="#aaa" />
        )}
      </div>
      {/* 상단 영역: 이미지와 책 정보 (ROW) */}
      <div style={styles.mainInfoContainer}>
        <div className="book-content">
          <img src={image} alt={title} />
        </div>
        <div className="book-info">
          <h3 className="book-title">{title}</h3>
          <p>
            <strong>저자:</strong> {author}
          </p>
          <p>
            <strong>출판사:</strong> {publisher}
          </p>
        </div>
      </div>
      {/* 하단 영역: DESCRIPTION과 토글 버튼 영역 (COLUMN) */}
      <div className="extended-content-container" style={styles.extendedContentContainer}>
        {aladdinMode ? (
          renderAladdinInfo()
        ) : (
          <div className="book-description">
            <p>{description}</p>
          </div>
        )}
        <div className="toggle-btn-container" style={styles.toggleBtnContainer}>
          {renderAladdinToggle()}
        </div>
      </div>
    </div>
  );
};

export default Book;
