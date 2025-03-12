import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";


const BookSearch = () => {
    const location = useLocation(); // 현재 위치 정보 가져오기
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    // 쿼리 파라미터에서 search 값을 추출
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");

    const token = sessionStorage.getItem("token");
    const uuid = sessionStorage.getItem("userUuid");

    useEffect(() => {
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login")
            console.log(uuid);
        }

    }, [navigate]);

    
    const handleBookmark = (isbn) => {
        // 북마크 추가 API 호출
        axios
            .post(
                `http://localhost:8080/bookmarks/${isbn}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    }
                }
            )
            .then((response) => {
                alert("북마크에 추가되었습니다.");
            })
            .catch((error) => {
                console.error("북마크 추가 실패", error);
                alert("북마크 추가에 실패했습니다.");
            });
    };



    useEffect(() => {
        if (searchQuery) {
            console.log("searchQuery" + searchQuery);
            setLoading(true);
            // 서버에서 검색 결과를 받아오는 API 호출
            axios.get(`http://localhost:8080/books/search?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // 헤더에 JWT 토큰 추가
                }
            })
                .then((response) => {
                    // alert(searchQuery);
                    console.log(response.data);
                    setSearchResults(response.data);
                })
                .catch((error) => {
                    console.error("검색 실패", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [searchQuery]); // 검색어가 변경되면 다시 검색

    return (
        <div>
        <Nav></Nav>
        <h1>검색 결과</h1>
        {loading && <p>검색 중...</p>}
        {!loading && searchResults.length === 0 && <p>검색된 도서가 없습니다.</p>}
        <ul>
            {searchResults.map((book) => (
                <li key={book.bookIsbn}>
                    <img src={book.bookImg} alt={book.bookTitle}></img>
                    <h3>{book.bookTitle}</h3>
                    <p>저자: {book.bookAuthor}</p>
                    <p>출판사: {book.bookPublisher}</p>
                    <p>카테고리: {book.bookCategory}</p>
                    <p>설명: {book.bookDescription}</p>
                    <p>isbn: {book.bookIsbn}</p>
                    <p>키워드: {book.keywords}</p>
                    {/* 북마크 버튼 추가 */}
                    <button onClick={() => handleBookmark(book.bookIsbn)}>북마크</button>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default BookSearch;
