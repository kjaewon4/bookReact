import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate"; // ✅ 페이지네이션 라이브러리 추가
import Nav from "./Nav";
import "./main.css"; // ✅ 페이지네이션 스타일 추가

const BookSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // ✅ 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 개수
    const pageSize = 20; // 한 페이지당 데이터 개수

    // 검색어 가져오기
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");

    // 🔹 책 검색 요청 (페이지네이션 포함)
    useEffect(() => {
        if (!searchQuery) return;
        setLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/books/search?search=${searchQuery}&page=${currentPage}&size=${pageSize}`,
                    {
                        method: "GET",
                        credentials: "include", // ✅ 쿠키 인증 포함 (필요한 경우)
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 401) {
                    alert("JWT가 만료되었습니다. 다시 로그인하세요.");
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setSearchResults(result.content); // ✅ 책 리스트 업데이트
                setTotalPages(result.totalPages); // ✅ 전체 페이지 개수 설정
            } catch (error) {
                console.error("검색 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, currentPage, navigate]); // ✅ currentPage 변경 시 API 호출

    // ✅ 페이지 변경 핸들러
    const handlePageClick = (data) => {
        setCurrentPage(data.selected); // 선택한 페이지로 변경
    };

    return (
        <div>
            <Nav />
            <h1>검색 결과</h1>
            {loading && <p>검색 중...</p>}
            {!loading && searchResults.length === 0 && <p>검색된 도서가 없습니다.</p>}
            <ul>
                {searchResults.map((book) => (
                    <li key={book.bookIsbn}>
                        <img src={book.bookImg} alt={book.bookTitle} width="100" />
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

            {/* ✅ 페이지네이션 UI */}
            <ReactPaginate
                previousLabel={"< 이전"}
                nextLabel={"다음 >"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
            />
        </div>
    );
};

export default BookSearch;
