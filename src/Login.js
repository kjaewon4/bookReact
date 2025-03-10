import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./main.css";
import Nav from "./Nav";

/**
 * JWT 방식 써서 API 요청 보낼 때마다 헤더에 Authorization: Bearer <JWT> 추가해야됨
 const token = localStorage.getItem("token");

axios.get("http://localhost:8080/secure-data", {
    headers: {
        Authorization: `Bearer ${token}`  // JWT 토큰을 헤더에 포함
    }
})
.then(response => {
    console.log("응답:", response.data);
})
.catch(error => {
    console.error("인증 실패:", error);
});
 * 
 */

const Login = () => {
  const [userUuid, setUserUuid] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  // 비밀번호 표시 여부
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const location = useLocation();  // URL 정보를 얻기 위한 Hook
  const navigate = useNavigate();  // 페이지 이동을 위한 Hook

  useEffect(() => {
    // 로그인 실패 시 ?error=true 파라미터를 확인해서 오류 메시지 설정
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('error') === 'true') {
      setErrorMessage(true);
    }
  }, [location]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userUuid || !userPassword) {
      setErrorMessage("아이디와 비밀번호를 입력하세요.")
    } else {
      try {
        const response = await axios.post("http://localhost:8080/login",
          new URLSearchParams({
            userUuid: userUuid,
            userPassword: userPassword,
          }),
          {
            headers: {
              "Content-Type" : "application/json"
              // "Content-Type": "application/x-www-form-urlencoded",  // 폼 로그인 방식 시 형식
            },
            withCredentials: true,  // 세션 쿠키를 포함해서 요청 -> 서버가 쿠키에 세션 ID를 저장하고, 이후 요청에서 이 세션 ID를 사용해서 로그인 상태임을 확인 가능
          }
        )
        .then(response => {
          console.log("로그인 성공: ", response.data);
          localStorage.setItem("token", response.data.token);
        })
        .catch(error => {
          console.error("로그인 실패: ", error);
          setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
          setError(true);
        })
        ;
    
        console.log("로그인 성공:", response.data);

        navigate("/");
      } catch (error) {
        console.error("로그인 실패:", error);
        setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
        setError(true);

      }
    }

    console.log("아이디:", userUuid);
    console.log("비밀번호:", userPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // 비밀번호 표시 상태를 반전
  };

  return (

    <>
      <Nav></Nav>
      <div className="login-container">
        <h2>로그인</h2>
        {error && <div className="error-message">{errorMessage}</div>}  {/* 에러 메시지 출력 */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="userUuid">아이디</label>
            <input
              type="text"
              id="userUuid"
              value={userUuid}
              onChange={(e) => setUserUuid(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="userPassword">비밀번호</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"} // 비밀번호 표시/숨김 토글
                id="userPassword"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
              <span className="password-eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />} {/* 눈 아이콘을 클릭하면 표시/숨김 전환 */}
              </span>
            </div>
          </div>
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>
        <div className="signup-link">
          <p>아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
        </div>
      </div>
    </>
  );
};

export default Login;
