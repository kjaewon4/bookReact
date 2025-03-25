import React, { useEffect } from "react";
import Banner from "../components/Banner"; // ✅ `components` 폴더 안에 있는지 확인
import BookRecommendation from "./BookRecommendations"; // ✅ `components` 폴더 안에 있는지 확인
import axios from "axios";
import { useNavigate } from "react-router-dom";


const styles = {
    wrapper : {
        display : "flex",
        flexDirection : "column",
        width : "100%"
    }
}

function Main() {

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await axios.get("http://localhost:8080/", {
              withCredentials: true,
            });
    
            console.log("✅ 인증 성공:", response.data);
          } catch (error) {
            if (error.response) {
              // 서버에서 응답이 왔으나 상태코드가 401, 403 등
              console.error("❌ 인증 실패 - 상태코드:", error.response.status);
              if (error.response.status === 401 || error.response.status === 403) {
                alert("로그인이 필요합니다.");
                navigate("/login");
              } else if(error.response.status === 404){
                console.log("추천 도서가 없음");
              } 
              else {
                alert("서버 오류가 발생했습니다.");
              }
            } else if (error.request) {
              // 요청은 보냈지만 응답이 없음 (서버 다운 등)
              console.error("❌ 서버 응답 없음:", error.request);
              alert("서버에 연결할 수 없습니다.");
            } else {
              // 요청 전에 에러 발생
              console.error("❌ 요청 에러:", error.message);
              alert("알 수 없는 오류가 발생했습니다.");
            }
          }
        };
    
        checkAuth();
      }, [navigate]);

    return (
        <div style={styles.wrapper}>
            <Banner/> {/* 🔥 배너 추가 (항상 보이도록) */}
            <BookRecommendation /> {/* 🔥 추천 도서 */}
        </div>
    );
}

export default Main;
