import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Book from "../components/Book";
import ReactPaginate from "react-paginate";
import usePaginatedBooks from "../hooks/usePaginatedBooks";
import { useBookmarks } from "./BookmarkContext"; // 경로 조정
import "./BookList.css";

const BookSearch = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("search");
  const [selectedBook, setSelectedBook] = useState(null);

  // usePaginatedBooks 훅을 통해 검색 결과 도서 데이터 로딩
  const {
    books,
    loading,
    errorMessage,
    currentPage,
    totalPages,
    setCurrentPage,
  } = usePaginatedBooks({
    endpoint: "http://localhost:8080/api/books/search",
    params: { search: query },
    enabled: !!query,
  });

  // 전역 북마크 상태 사용
  const { bookmarks, toggleBookmark } = useBookmarks();

  const navigate = useNavigate();

  const handlePageClick = (data) => {
    console.log("페이지 변경:", data.selected);
    setCurrentPage(data.selected);
  };

  const handleBookClick = (isbn) => {
    setSelectedBook(selectedBook === isbn ? null : isbn);
  };

  return (
    <div className="book-list">
      <h2>검색 결과</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
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
            pageCount={totalPages}
            forcePage={currentPage}
            onPageChange={handlePageClick}
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </>
      )}
    </div>
  );
};

export default BookSearch;
