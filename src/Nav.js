import { useState } from "react";
import { Search, Bookmark, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import "./main.css";

export default function Nav() {
  const [search, setSearch] = useState("");

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
