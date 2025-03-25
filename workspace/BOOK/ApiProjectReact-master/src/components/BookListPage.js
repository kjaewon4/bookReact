import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Book from "../components/Book";
import ReactPaginate from "react-paginate";
import { useBookmarks } from "./BookmarkContext"; // 경로 조정
import "./BookList.css";

const BookListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false); // 북마크만 볼지 여부

  const params = {}; // 필요 시 검색 필터 파라미터 추가

  // 전역 북마크 상태 사용
  const { bookmarks, toggleBookmark } = useBookmarks();

  // 추천 도서 데이터를 불러오는 함수 (페이지네이션 적용)
  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/books", {
        params: { ...params, page, size: 20 },
        withCredentials: true,
      });
      const data = response.data;
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 1);
      setErrorMessage("");
    } catch (error) {
      if (error.response?.status === 404) {
        setBooks([]);
        setErrorMessage("📭 도서 정보를 찾을 수 없습니다.");
      } else {
        console.error("❌ 도서 데이터 불러오기 실패:", error);
        setErrorMessage("🚨 서버 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 전체 도서 데이터를 불러오는 함수 (북마크 모드용)
  // 전체 도서 목록을 불러오기 위해 size 값을 크게 지정합니다.
  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/books", {
        params: { ...params, size: 1100 },
        withCredentials: true,
      });
      const data = response.data;
      setBooks(data.content || []);
      // 전체 데이터를 가져왔으므로 페이지네이션은 사용하지 않습니다.
      setTotalPages(1);
      setErrorMessage("");
    } catch (error) {
      if (error.response?.status === 404) {
        setBooks([]);
        setErrorMessage("📭 도서 정보를 찾을 수 없습니다.");
      } else {
        console.error("❌ 전체 도서 데이터 불러오기 실패:", error);
        setErrorMessage("🚨 서버 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // showBookmarksOnly에 따라 도서 데이터를 불러오는 useEffect
  useEffect(() => {
    if (showBookmarksOnly) {
      fetchAllBooks();
    } else {
      fetchBooks(currentPage);
    }
  }, [currentPage, showBookmarksOnly]);

  // 선택된 도서의 확장/축소 토글
  const handleBookClick = (isbn) => {
    setSelectedBook(selectedBook === isbn ? null : isbn);
  };

  // 페이지 변경 시 현재 페이지 업데이트 (추천 도서일 때만 적용)
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // 북마크 모드에 따라 표시할 도서 필터링  
  // "북마크 도서만 보기" 모드에서는 전체 도서 목록에서 전역 북마크 상태에 포함된 도서만 필터링합니다.
  const displayedBooks = showBookmarksOnly
    ? (books || []).filter((book) => bookmarks.includes(book.bookIsbn))
    : (books || []);

  return (
    <div className="book-list">
      <h2>📚 도서 목록</h2>
      {/* 북마크 보기 토글 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <button style={{ width: "200px" }} onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}>
          {showBookmarksOnly ? "전체 추천 도서 보기" : "북마크 도서만 보기"}
        </button>
      </div>
      {loading ? (
        <p>불러오는 중...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : displayedBooks.length === 0 ? (
        showBookmarksOnly ? (
          <p>북마크된 도서가 없습니다.</p>
        ) : (
          <p>도서가 없습니다.</p>
        )
      ) : (
        <>
          <div className="book-grid">
            {displayedBooks.map((book) => (
              <Book
                key={book.bookIsbn}
                isbn={book.bookIsbn}
                title={book.bookTitle}
                author={book.bookAuthor}
                publisher={book.bookPublisher}
                image={book.bookImg}
                description={book.bookDescription}
                expanded={selectedBook === book.bookIsbn}
                onClick={() => handleBookClick(book.bookIsbn)}
                isBookmarked={bookmarks.includes(book.bookIsbn)}
                onBookmarkToggle={() => toggleBookmark(book.bookIsbn)}
              />
            ))}
          </div>
          {/* 페이징은 추천 도서 모드일 때만 표시 */}
          {!showBookmarksOnly && (
            <ReactPaginate
              previousLabel={"< 이전"}
              nextLabel={"다음 >"}
              breakLabel={"..."}
              pageCount={Math.max(totalPages, 1)}
              forcePage={currentPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookListPage;
