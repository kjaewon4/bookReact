import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";

const BookSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // 검색어 가져오기
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");

    // ✅ 쿠키에서 JWT 가져오는 함수
    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
    };

    const jwt = getCookie("jwt");  // JWT 쿠키 가져오기

    // 🔹 책 검색 요청 (JWT 포함)
    useEffect(() => {
        if (!searchQuery) return;  // 검색어 없으면 요청 X
        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/books/search?search=${searchQuery}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`, // ✅ JWT 추가
                    },
                    credentials: "include", // ✅ 쿠키 포함 요청
                });

                if (response.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인하세요.");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setSearchResults(result);
            } catch (error) {
                console.error("검색 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, jwt, navigate]);

    return (
        <div>
            <Nav />
            <h1>검색 결과</h1>
            {loading && <p>검색 중...</p>}
            {!loading && searchResults.length === 0 && <p>검색된 도서가 없습니다.</p>}
            <ul>
                {searchResults.map((book) => (
                    <li key={book.bookIsbn}>
                        <img src={book.bookImg} alt={book.bookTitle} />
                        <h3>{book.bookTitle}</h3>
                        <p>저자: {book.bookAuthor}</p>
                        <p>출판사: {book.bookPublisher}</p>
                        <p>카테고리: {book.bookCategory}</p>
                        <p>설명: {book.bookDescription}</p>
                        <p>ISBN: {book.bookIsbn}</p>
                        <p>키워드: {book.keywords}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookSearch;
