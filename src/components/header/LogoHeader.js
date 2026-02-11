import React from 'react'
import './styles/header.css';
import { useNavigate, Link } from 'react-router-dom';
import { TbBell } from "react-icons/tb";
import { useScrollDirection } from './hooks/useScrollDirection'; 

const LogoHeader = () => {
  const isVisible = useScrollDirection();
  const navigate = useNavigate();

  return (
    <header className={`headerWrap ${isVisible ? '' : 'hide'}`}>
      <div className="headerInner">
        {/* 왼쪽: 로고 */}
        <div className="headerLeft">
          <div className="headerIcon" onClick={() => navigate('/')}>
            <img src={`${process.env.PUBLIC_URL}/images/logo1.png`} alt="로고" />
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

export default LogoHeader