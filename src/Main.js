import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 훅을 임포트
import Nav from './Nav';

const Main = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();  // 네비게이션을 위한 훅 사용

  
  const token = sessionStorage.getItem("jwt");
  const uuid = sessionStorage.getItem("userUuid");

  useEffect(() => {
    if(!token) {
      alert("로그인이 필요합니다.");
      navigate("/login")
      console.log(uuid);
    } 

  }, [navigate]);

  useEffect(() => {
    // API 호출 예시 (response 변수 정의)
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',  // 요청 헤더 설정
          },
          credentials: true,
          credentials: 'include',  // 쿠키를 포함하여 요청
        });

   
      }catch(error) {

      }
    };

    fetchData();
  }, [navigate]);  // navigate를 의존성 배열에 추가하여 변경 시 useEffect가 실행되도록 함

  return (
    <div>
      <Nav />
      <h1>환영합니다!</h1>
    </div>
  );
};

export default Main;
