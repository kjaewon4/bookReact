import React, { useState, useEffect } from "react";
import { Search, Bookmark, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import "./components.css";
import axios from "axios";

// hooks/usePaginatedBooks.js
function usePaginatedBooks({ endpoint, params = {}, enabled = true }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        params: { ...params, page, size: 20 },
        withCredentials: true,
      });
      const data = response.data;
      setBooks(data.content);
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

  useEffect(() => {
    if (enabled) fetchBooks(currentPage); // ✅ 현재 페이지에 따라 호출
  }, [currentPage, endpoint, JSON.stringify(params), enabled]);

  return {
    books,
    loading,
    errorMessage,
    currentPage,
    totalPages,
    setCurrentPage, // ✅ 클릭 시 여기로 전달
  };
}

export default usePaginatedBooks;