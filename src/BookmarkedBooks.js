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
            navigate("/login");
        }

        setLoading(true);

        axios.get(
            `http://localhost:8080/bookmarks?uuid=${uuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            }
        )
            .then((response) => {
                setBookmarkedBooks(response.data);
            })
            .catch((error) => {
                console.error("북마크된 책 가져오기 실패", error);
                alert("북마크된 책을 가져오는 데 실패했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, uuid, navigate]);

    // 북마크 삭제 함수
    const handleDelete = (isbn) => {
        axios.delete(`http://localhost:8080/bookmarks/${isbn}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            data: { userUuid: uuid } // DELETE 요청 시 body에 데이터 포함
        })
        .then(() => {
            alert("북마크가 삭제되었습니다.");
            setBookmarkedBooks(bookmarkedBooks.filter(bookmark => bookmark.book.bookIsbn !== isbn));
        })
        .catch((error) => {
            console.error("북마크 삭제 실패", error);
            alert("북마크 삭제에 실패했습니다.");
        });
    };

    return (
        <div>
            <Nav />
            <h1>내 북마크</h1>
            {loading && <p>불러오는 중...</p>}
            {!loading && bookmarkedBooks.length === 0 && <p>북마크한 책이 없습니다.</p>}
            <ul>
                {bookmarkedBooks.map((bookmark) => {
                    const book = bookmark.book;
                    return (
                        <li key={book.bookIsbn}>
                            <img src={book.bookImg} alt={book.bookTitle} />
                            <h3>{book.bookTitle}</h3>
                            <p>저자: {book.bookAuthor}</p>
                            <p>출판사: {book.bookPublisher}</p>
                            <p>카테고리: {book.bookCategory}</p>
                            <p>설명: {book.bookDescription}</p>
                            <p>ISBN: {book.bookIsbn}</p>
                            <p>키워드: {book.keywords.join(", ")}</p>
                            <button onClick={() => handleDelete(book.bookIsbn)}>삭제</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default BookmarkedBooks;
