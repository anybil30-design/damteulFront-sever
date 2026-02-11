import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles/nav.css';

import { GoHome, GoHomeFill } from "react-icons/go";
import { PiNoteDuotone, PiNoteFill } from "react-icons/pi";
import { IoGiftOutline, IoGift  } from "react-icons/io5";
import { PiChatTeardropText, PiChatTeardropTextFill  } from "react-icons/pi";
import { PiUser,PiUserFill } from "react-icons/pi";


const HaveNavi = () => {
  // 메뉴들을 배열화 해주기
  const navItems = [
    { to: "/", label: "홈", 
      icon: <GoHome />, activeIcon: <GoHomeFill /> },
    { to: "/community", label: "커뮤니티", 
      icon: <PiNoteDuotone />, activeIcon: <PiNoteFill /> },
    { to: "/nanum", label: "나눔/이벤트", 
      icon: <IoGiftOutline />, activeIcon: <IoGift /> },
    { to: "/chat", label: "대화", 
      icon: <PiChatTeardropText />, activeIcon: <PiChatTeardropTextFill /> },
    { to: "/mypage", label: "내 정보", 
      icon: <PiUser />, activeIcon: <PiUserFill /> },
  ];

  return (
    <footer>
      <nav className="naviContainer">
        <div className="naviInner">
          {navItems.map((item) => ( //navItems(홈, 커뮤, 나눔, 대화, 내정보)를 하나씩 반복
            <NavLink //누르면 해당 장소로 이동
              key={item.to} //이름표
              to={item.to} //클릭시 도착할 목적지
              className={({ isActive }) => isActive ? "navItem active" : "navItem"}
            >
              {({ isActive }) => (
                <div className='naviWrap'>
                  <div className="navIcon"> {/* 아이콘 */}
                    {/* 내가 선택한 메뉴에 있다면 fillicon보여주고 아니면 그냥icon */}
                    {isActive ? item.activeIcon : item.icon}
                  </div>
                  <span className="navLabel">{item.label}</span> {/* 탭 이름 */}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </footer>
  );
};

export default HaveNavi;