import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Book from "../components/Book";
import { useBookmarks } from "../components/BookmarkContext";
import "../components/BookList.css";

function BookList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 전역 북마크 상태 사용
  const { bookmarks, toggleBookmark } = useBookmarks();

  const styles = {
    wrapper: {
      overflowY: "hidden",
      padding: 0,
      width: "100%",
    },
    categorySection: {
      marginBottom: "32px",
      padding: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    categoryTitle: {
      marginBottom: "12px",
      fontSize: "1.25rem",
      fontWeight: "bold",
      borderBottom: "1px solid #ccc",
      paddingBottom: "4px",
    },
    horizontalScroll: {
      display: "flex",
      overflowX: "auto",
      gap: "16px",
      padding: 0,
      margin: 0,
      listStyle: "none",
      scrollBehavior: "smooth",
    },
    bookItem: {
      flex: "0 0 auto",
      height: "320px",
    },
  };

  // 도서 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books/recommend")
      .then((res) => {
        console.log("📦 API 응답:", res.data);
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ API 오류:", err);
        setErrorMessage("도서를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, []);

  // 선택된 도서의 확장/축소 토글
  const handleBookClick = (isbn) => {
    setSelectedBook(selectedBook === isbn ? null : isbn);
  };

  // 북마크 토글은 전역 Context의 toggleBookmark 함수를 그대로 사용

  if (loading) return <p>⏳ 불러오는 중...</p>;

  const categories = ["인문과학", "사회과학", "자연과학", "어문학", "미분류"];

  return (
    <div style={styles.wrapper}>
      <h2>📚 도서 목록</h2>
      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : (
        <>
          {categories.map((category) => {
            const filteredBooks = books.filter(
              (book) => book.bookCategory === category
            );

            if (filteredBooks.length === 0) return null;

            return (
              <div key={category} style={styles.categorySection}>
                <h3 style={styles.categoryTitle}>📖 {category}</h3>
                <ul style={styles.horizontalScroll}>
                  {filteredBooks.map((book) => (
                    <li key={book.bookIsbn} style={styles.bookItem}>
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
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default BookList;
