import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

const BookmarkedBooks = () => {
    const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem("jwt");
    const uuid = sessionStorage.getItem("userUuid");
    const navigate = useNavigate();

    // 로그인 여부 및 uuid 확인
    useEffect(() => {
        if (!token || !uuid) {
            alert("로그인이 필요합니다.");
            navigate("/login");  // 로그인 페이지로 리디렉션
        }

        setLoading(true);

        // 북마크된 책 목록을 가져오는 API 호출
        axios.get(
            `http://localhost:8080/bookmarks?uuid=${uuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // JWT를 Authorization 헤더에 추가
                },
                withCredentials: true  // ✅ 쿠키 포함하여 요청 (CORS 문제 해결)
            }
        )
            .then((response) => {
                setBookmarkedBooks(response.data); // 북마크된 책들 상태에 저장
            })
            .catch((error) => {
                console.error("북마크된 책 가져오기 실패", error);
                alert("북마크된 책을 가져오는 데 실패했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, uuid, navigate]); // token, uuid, navigate 변경 시마다 다시 실행

    return (
        <div>
            <Nav />
            <h1>내 북마크</h1>
            {loading && <p>불러오는 중...</p>}
            {!loading && bookmarkedBooks.length === 0 && <p>북마크한 책이 없습니다.</p>}
            <ul>
                {bookmarkedBooks.map((bookmark) => {
                    const book = bookmark.book;  // TbBookmark에서 book 객체를 추출
                    return (
                        <li key={book.bookIsbn}>
                            <img src={book.bookImg} alt={book.bookTitle} />
                            <h3>{book.bookTitle}</h3>
                            <p>저자: {book.bookAuthor}</p>
                            <p>출판사: {book.bookPublisher}</p>
                            <p>카테고리: {book.bookCategory}</p>
                            <p>설명: {book.bookDescription}</p>
                            <p>ISBN: {book.bookIsbn}</p>
                            <p>키워드: {book.keywords.join(", ")}</p> {/* keywords가 배열이라면 join으로 표시 */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default BookmarkedBooks;
