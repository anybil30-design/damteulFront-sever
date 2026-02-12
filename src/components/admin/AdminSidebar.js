import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import '../admin/styles/AdminSidebar.css';

function AdminSidebar() {

  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("admin_info") || "{}");

  // 로그아웃
  const handleLogout = () => {
    if(window.confirm('로그아웃 하시겠습니까?')){
      localStorage.removeItem("admin_info");
      localStorage.removeItem("admin_token");
      // window.location.href = "/admin/login";
      navigate('/admin/login', {replace:true});
    }
  };

  return (
    <>
    <aside className="sidebar">

      <NavLink 
        to="/admin" 
        className={({ isActive }) =>
           // isActive === true면 현재 경로와 to 경로가 일치
          isActive ? 'active' : ''} // 경로가 일치하면 'active' 클래스 적용, 아니면 빈 문자열
      >
        <div className="sidebar-logo">
        <img src={`${process.env.PUBLIC_URL}/images/logo1.png`} alt="Logo" />
      </div>
      </NavLink>
      


      <div className="sidebar-profile">
        <img src={`${process.env.PUBLIC_URL}/images/defaultProfile.png`} alt="admin" className="profile-img" />
        <div className="profile-info">
          <p className="name">{adminInfo.admin_name}</p>
          <p className="role">관리자</p>
        </div>
      </div>

      <nav className="sidebar-menu">
  <ul>
    {/* NavLink: 클릭 시 해당 페이지로 이동, isActive: 현재 선택된 링크 표시 */}
    <li>
      <NavLink 
        to="/admin" 
        className={({ isActive }) =>
           // isActive === true면 현재 경로와 to 경로가 일치
          isActive ? 'active' : ''} // 경로가 일치하면 'active' 클래스 적용, 아니면 빈 문자열
      >
        대시보드
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="users" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        사용자 관리
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="posts" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        게시글 관리
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="reports" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        신고 관리
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="trades" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        거래 관리
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="events" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        이벤트 관리 / 공지사항
      </NavLink>
    </li>

    <li>
      <NavLink 
        to="community" 
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        커뮤니티 관리
      </NavLink>
    </li>
  </ul>
</nav>


      <div className="sidebar-bottom">
        <ul>
          <li className="settings">⚙️ 환경설정</li>
          <li>
            <button className="logout" onClick={handleLogout}>로그아웃</button>
          </li>
        </ul>
      </div>
    </aside>
    </>
  );
}

export default AdminSidebar;
