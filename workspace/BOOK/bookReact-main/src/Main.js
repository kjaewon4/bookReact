import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Main = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // 🔹 API 요청 (메인 데이터 가져오기)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/", {
          method: "GET",
          credentials: "include", // JWT 쿠키 자동 포함
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
        setData(result);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      <Nav />
      <h1>환영합니다!</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>로딩 중...</p>}
    </div>
  );
};

export default Main;
