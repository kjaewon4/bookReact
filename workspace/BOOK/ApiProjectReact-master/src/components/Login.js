import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./components.css";
import Footer from "./Footer";
import axios from "axios";

const Login = () => {
  const [userUuid, setUserUuid] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("error") === "true") {
      setErrorMessage("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
  }, [location]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userUuid || !userPassword) {
      setErrorMessage("아이디와 비밀번호를 입력하세요.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          userUuid,
          userPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키 포함 (세션 또는 JWT 쿠키 대응)
        }
      );
  
      // 성공 시 처리
      console.log("로그인 성공! JWT:", response.data.token);
      alert("로그인 성공!");
      navigate("/");
      window.location.href = "/";
    } catch (error) {
      console.error("서버 요청 오류:", error);
  
      if (error.response?.status === 401) {
        setErrorMessage("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
      } else {
        setErrorMessage("서버 오류 발생! 관리자에게 문의하세요.");
      }
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!userUuid || !userPassword) {
  //     setErrorMessage("아이디와 비밀번호를 입력하세요.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:8080/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userUuid, userPassword }),
  //       credentials: "include", // 쿠키 기반 인증 유지
  //     });

  //     if (!response.ok) {
  //       setErrorMessage("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
  //       return;
  //     }

  //     // 응답이 JSON 형식이 아닐 경우 대비 (빈 응답 방지)
  //     const text = await response.text();
  //     const data = text ? JSON.parse(text) : {};

  //     console.log("로그인 성공! JWT:", data.token);
  //     alert("로그인 성공!");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("서버 요청 오류:", error);
  //     setErrorMessage("서버 오류 발생! 관리자에게 문의하세요.");
  //   }
  // };

  return (
    <>
      <div className="login-page-wrapper">
        <div className="login-container">
          <h2 className="login-title">로그인</h2>
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}{" "}
          {/* 에러 메시지 출력 */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="userUuid">아이디</label>
              <input
                className="sign-input"
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
                  className="sign-input"
                  type={showPassword ? "text" : "password"}
                  id="userPassword"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
                <span
                  className="password-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">
              로그인
            </button>
          </form>
          <div className="sign-link">
            <p>
              아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default Login;
