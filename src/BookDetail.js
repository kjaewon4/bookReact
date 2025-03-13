import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import "./main.css";

const BookDetail = () => {
    const { bookIsbn } = useParams(); // URL에서 bookIsbn을 추출
    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("jwt");
    const uuid = sessionStorage.getItem("userUuid");

    useEffect(() => {
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login")
            console.log(uuid);
        }

    }, [navigate]);

    useEffect(() => {
        if (bookIsbn) {
            setLoading(true);
            // 책 상세 정보를 불러오는 API 호출
            axios.get(`http://localhost:8080/book/${bookIsbn}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // 헤더에 JWT 토큰 추가
                },
            })
                .then((response) => {
                    setBookDetail(response.data); // 책 상세 정보 설정
                })
                .catch((error) => {
                    console.error("상세 정보 불러오기 실패", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [bookIsbn, token]); // bookIsbn 변경 시마다 재요청

    if (loading) {
        return <p>상세 정보를 불러오는 중...</p>;
    }

    if (!bookDetail) {
        return <p>책 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div>
            <Nav />
            <div className="detail-container">
                <h1>{bookDetail.bookTitle}</h1>
                <p>저자: {bookDetail.bookAuthor}</p>
                <p>출판사: {bookDetail.bookPublisher}</p>
                <p>카테고리: {bookDetail.bookCategory}</p>
                <p>설명: {bookDetail.bookDescription}</p>
                <p>ISBN: {bookDetail.bookIsbn}</p>
                <img src={bookDetail.bookImg} alt={bookDetail.bookTitle} />

                <h4>서점 정보</h4>
                {bookDetail.bookStores && bookDetail.bookStores.length > 0 ? (
                    <ul>
                        {bookDetail.bookStores.map((store, index) => (
                            <li key={index}>
                                <p>서점 이름: {store.offName}</p>
                                <a href={store.link} target="_blank" rel="noopener noreferrer">
                                    링크: {store.link}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>서점 정보가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default BookDetail;
