import { useState } from "react";
import { Search, Bookmark, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css";

export default function Nav() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // navigate 훅 사용

  // 검색창에서 Enter 키를 누를 때 실행되는 함수
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      console.log(search);
      // 검색어가 있으면 BookSearch 페이지로 검색어를 쿼리 파라미터로 넘김
      navigate(`/booksearch?search=${search}`);
    }
  };

  return (
    <nav className="navbar">
      {/* 로고 */}
      <Link to="/" className="logo">MyLogo</Link>

      {/* 검색창 */}
      <div className="search-container">
        <input
          type="text"
          placeholder="검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch} // Enter 키 눌렀을 때 처리
          className="search-input"
        />
        <Search className="search-icon" size={18} />
      </div>

      {/* 타이틀 */}
      <h1 className="navbar-title">내비게이션 바</h1>

      {/* 네비게이션 버튼 */}
      <div className="nav-links">
        <Link to="/bookmark" className="nav-link">
          <Bookmark size={18} /> 북마크
        </Link>
        <Link to="/login" className="nav-link">
          <LogIn size={18} /> 로그인
        </Link>
        <Link to="/signup" className="nav-link">회원가입</Link>
      </div>
    </nav>
  );
}
