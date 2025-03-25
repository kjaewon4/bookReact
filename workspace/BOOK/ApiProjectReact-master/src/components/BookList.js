import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Book from "./Book";
import ReactPaginate from "react-paginate";
import usePaginatedBooks from "../hooks/usePaginatedBooks";
import "./BookList.css";
import { useBookmarks } from "./BookmarkContext"; // 전역 상태 훅 사용

const BookList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);

  // usePaginatedBooks 훅으로 책 데이터 로딩
  const { books, loading, errorMessage, currentPage, totalPages, setCurrentPage } =
    usePaginatedBooks({
      endpoint: `http://localhost:8080/api/recommend/category/${category}`,
      params: {},
      enabled: true,
    });

  // 전역 북마크 상태 사용
  const { bookmarks, toggleBookmark } = useBookmarks();

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [category, setCurrentPage]);

  // 선택된 도서의 확장/축소 토글
  const handleBookClick = (isbn) => {
    setSelectedBook(selectedBook === isbn ? null : isbn);
  };

  // 페이지 변경 시 현재 페이지 업데이트
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="book-list">
      <h2>{category ? `${category} 관련 도서` : "📚 전체 추천 도서"}</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : books.length === 0 ? (
        <p>해당 카테고리에 대한 추천 도서가 없습니다.</p>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
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
        </>
      )}
    </div>
  );
};

export default BookList;
