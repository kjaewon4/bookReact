import { useState, useEffect } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

const BookmarkedBooks = () => {
    const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 🔹 로그인 여부 확인 후 리디렉션
    useEffect(() => {

        setLoading(true);

        fetch("http://localhost:8080/bookmarks", {
            method: "GET",
            credentials: "include", // ✅ 쿠키 포함 요청
        })
            .then((response) => {
                if (response.status === 401) {
                    alert("jwt가 만료되었습니다. 다시 로그인하세요.");
                    navigate("/login");
                    return;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setBookmarkedBooks(data);
            })
            .catch((error) => {
                console.error("북마크된 책 가져오기 실패", error);
                alert("북마크된 책을 가져오는 데 실패했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // 🔹 북마크 삭제 함수
    const handleDelete = async (isbn) => {
        try {
            const response = await fetch(`http://localhost:8080/bookmarks/${isbn}`, {
                method: "DELETE",
                credentials: "include", // ✅ 쿠키 기반 인증 유지
            });

            if (response.status === 401) {
                alert("jwt가가 만료되었습니다. 다시 로그인하세요.");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert("북마크가 삭제되었습니다.");
            setBookmarkedBooks(bookmarkedBooks.filter(bookmark => bookmark.book.bookIsbn !== isbn));
        } catch (error) {
            console.error("북마크 삭제 실패", error);
            alert("북마크 삭제에 실패했습니다.");
        }
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
