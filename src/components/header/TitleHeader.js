import React from 'react';
import './styles/header.css';
import { useNavigate, Link } from 'react-router-dom';
import { TbBell } from "react-icons/tb";
import { FaAngleLeft } from "react-icons/fa6";
import { useScrollDirection } from './hooks/useScrollDirection'; 

function TitleHeader({title}) {
  
  const isVisible = useScrollDirection();
  const navigate = useNavigate();
  
  return (
    <header className={`headerWrap ${isVisible ? '' : 'hide'}`}>
      <div className="headerInner">
      {/* 왼쪽: 전페이지로*/}
        <div className="headerLeft">
          <div className="headerIcon" onClick={() => navigate(-1)}>
            <FaAngleLeft />
          </div>
        </div>
      
        {/* 제목 */}
        <div className='headerTitle'>
          <h2>{title}</h2>
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

export default TitleHeader;