import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import './styles/header.css';
import { TbBell } from "react-icons/tb";
import { FaAngleLeft } from "react-icons/fa6";
import { useScrollDirection } from './hooks/useScrollDirection'; 

function AllowHeader() {
  const isVisible = useScrollDirection();
  const navigate = useNavigate();
  
  return (
    <header className={`headerWrap ${isVisible ? '' : 'hide'}`}>
      <div className="headerInner">
        {/* 왼쪽: 전페이지 */}
        <div className="headerLeft">
          <div className="headerIcon" onClick={() => navigate(-1)}>
            <FaAngleLeft />
          </div>
        </div>
        
        {/* 오른쪽: 알림 아이콘 */}
        <div className="headerRight">
          <Link className="headerIcon" to='/alarm' title='알림 페이지로 이동'>
            <TbBell />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AllowHeader