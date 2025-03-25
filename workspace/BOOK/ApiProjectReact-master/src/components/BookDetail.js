import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookDetail() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [locations, setLocations] = useState([]);
  const [aladdinMode, setAladdinMode] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/books/book/${isbn}`);
        setBook(res.data);
      } catch (err) {
        console.error("책 정보 로딩 실패:", err);
      }
    };

    fetchBook();
  }, [isbn]);

  useEffect(() => {
    const fetchAladdin = async () => {
      try {
        const res = await axios.post("http://localhost:8080/api/bookstores", { isbn });
        if (res.data?.itemOffStoreList?.length > 0) {
          const stores = res.data.itemOffStoreList.map((loc) => ({
            name: loc.offName,
            url: loc.link
          }));
          setLocations(stores);
        } else {
          setLocations([]);
        }
      } catch (err) {
        console.error("알라딘 정보 로딩 실패:", err);
        setLocations([]);
      }
    };

    fetchAladdin();
  }, [isbn]);

  if (!book) return <div>책 정보를 불러오는 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{book.bookTitle}</h2>
      <img src={book.bookImg} alt={book.bookTitle} style={{ width: "200px" }} />
      <p><strong>저자:</strong> {book.bookAuthor}</p>
      <p><strong>출판사:</strong> {book.bookPublisher}</p>
      <p><strong>카테고리:</strong> {book.bookCategory}</p>

      {aladdinMode ? (
        locations.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginTop: "20px"
          }}>
            {locations.map((loc, idx) => (
              <div key={idx} style={{
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <p>{loc.name}</p>
                <a href={loc.url} target="_blank" rel="noopener noreferrer">바로가기</a>
              </div>
            ))}
          </div>
        ) : (
          <p>알라딘 매장 정보가 없습니다.</p>
        )
      ) : (
        <p>{book.bookDescription}</p>
      )}

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          onClick={() => setAladdinMode(!aladdinMode)}
          style={{
            padding: "6px 12px",
            border: "none",
            backgroundColor: "#ddd",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {aladdinMode ? "책 정보 보기" : "알라딘 정보 보기"}
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
