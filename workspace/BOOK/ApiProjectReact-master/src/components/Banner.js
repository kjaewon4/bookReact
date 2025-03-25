import React, { useState } from "react";
import { Link } from "react-router-dom";

const styles = {
  wrapper: {
    background: "black",
    height: "350px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px"
  },

  container: {
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    color: "white",
    gap: "20px"
  },

  bannerInfo: {
    marginBottom: "16px",
    alignItems: "center",
    justifyContent: "center",   // ⬅️ 중앙 정렬 추가
    display: "flex",            // ⬅️ flex 레이아웃 적용
    flexDirection: "column",    // ⬅️ 텍스트와 버튼이 세로로 나열되도록
    textAlign: "center"  
  },

  img: {
    width: "150px",
    height: "auto",
    borderRadius: "8px",
    objectFit : "contain"
  },

  navBtn: {
    fontSize: "24px",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    width : "10px"
  }
};

// 더미 데이터 (배너에 표시할 도서들)
const books = [
    {
        title: "소년이로 <br />(편혜영 소설집)",
        img: "https://shopping-phinf.pstatic.net/main_3243615/32436154262.20221019142158.jpg",
        styles: { backgroundColor: "#222" },
        isbn : "9788932035338"
    },
    {
        title: "82년생 김지영",
        img: "https://shopping-phinf.pstatic.net/main_3246707/32467074651.20231003084626.jpg?type=w300",
        styles: { backgroundColor: "#333" },
        isbn : "9788937473135"
    },
    {
        title: "작별하지 않는다",
        img: "https://shopping-phinf.pstatic.net/main_3243636/32436366634.20231124160335.jpg?type=w300",
        styles: { backgroundColor: "#444" },
        isbn: "9788954682152"
    }
];

function Banner() {
    const [index, setIndex] = useState(0);
    const current = books[index];

    const prev = () => setIndex((index - 1 + books.length) % books.length);
    const next = () => setIndex((index + 1) % books.length);

    return (
    <div style={{ ...styles.wrapper, ...current.styles }}>
        <button onClick={prev} style={styles.navBtn}>{"<"}</button>
        <div style={styles.container}>
            <div style={styles.bannerInfo}>
            <h2 dangerouslySetInnerHTML={{ __html: current.title }} />
                <Link to={`/book/${current.isbn}`} style={{ color: "skyblue" }}>책 보러가기</Link>
            </div>
            <img src={current.img} alt={current.title} style={styles.img} />
        </div>
        <button onClick={next} style={styles.navBtn}>{">"}</button>
    </div>
    );
}

export default Banner;
