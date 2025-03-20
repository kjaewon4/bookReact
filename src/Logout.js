import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("http://localhost:8080/logout", {
          method: "POST", // ✅ POST 요청으로 변경
          credentials: "include", // ✅ 쿠키 포함 요청
        });

        if (!response.ok) {
          throw new Error("로그아웃 실패");
        }

        alert("로그아웃 성공!");
      } catch (error) {
        console.error("로그아웃 요청 실패:", error);
        alert("서버 오류 발생!");
      } finally {
        // ✅ JWT 쿠키 삭제 (브라우저에서 직접 삭제 불가능, 쿠키 만료 처리)
        document.cookie = "jwt=; Path=/; HttpOnly; Max-Age=0;";

        // ✅ 로그인 페이지로 강제 이동 (URL 직접 입력 방지)
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return null; // ✅ UI 없이 동작만 수행
};

export default Logout;
