import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from 'app/api/axios';
import './styles/community.css';
import WriteBtn from '../../components/writeBtn/WriteBtn';
import { getUserId } from 'components/getUserId/getUserId';

import { HiOutlineTicket, HiTicket } from "react-icons/hi2";
import { TbShirt, TbShirtFilled } from "react-icons/tb";
import { IoDiamondOutline, IoDiamond, IoBookOutline, IoBookSharp } from "react-icons/io5";
import { PiBaby ,PiBabyFill, PiMonitor, PiMonitorFill } from "react-icons/pi";
import { CiDumbbell } from "react-icons/ci";
import { FaDumbbell } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { PiChatCircleTextFill } from "react-icons/pi";

const IMAGE_BASE_URL = "https://port-0-damteulback-server-mlhcddsk6f7f8eac.sel3.cloudtype.app/uploads/community/";

const Community = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('/ticket');
  const [feeds, setFeeds] = useState([]);
  const [userName, setUserName] = useState("사용자");
  const listRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      App.get(`/api/profile/${getUserId()}`)
        .then(res => {
          if (res.data && res.data.user_nickname) {
            setUserName(res.data.user_nickname);
          }
        })
        .catch(err => console.error("사용자 정보 로딩 실패:", err));
    }
  }, []);

  const categoryMap = {
    "/ticket": "1",
    "/clothes": "2",
    "/beauty": "3",
    "/baby": "4",
    "/book": "5",
    "/sports": "6",
    "/digit": "7"
  };

  const commCatea = [
    { to: "/ticket", label: "티켓/교환권", icon: <HiOutlineTicket />, activeIcon: <HiTicket /> },
    { to: "/clothes", label: "의류", icon: <TbShirt />, activeIcon: <TbShirtFilled /> },
    { to: "/beauty", label: "뷰티/미용", icon: <IoDiamondOutline />, activeIcon: <IoDiamond /> },
    { to: "/baby", label: "유아용품", icon: <PiBaby />, activeIcon: <PiBabyFill /> },
    { to: "/book", label: "도서", icon: <IoBookOutline />, activeIcon: <IoBookSharp /> },
    { to: "/sports", label: "스포츠/레저", icon: <CiDumbbell />, activeIcon: <FaDumbbell /> },
    { to: "/digit", label: "디지털기기", icon: <PiMonitor />, activeIcon: <PiMonitorFill /> }
  ];

  const currentCategoryLabel = commCatea.find(item => item.to === selectedCategory)?.label || "커뮤니티";

  const fetchFeeds = () => {
    App.get("/api/community")
      .then((res) => { 
        setFeeds(Array.isArray(res.data) ? res.data : []); 
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleFeedClick = (e, feed) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (feed && feed.id) {
      navigate(`/community/post/${feed.id}`); 
    } else {
      console.error("ID missing in feed data:", feed);
      alert("게시글 정보를 불러올 수 없습니다.");
    }
  };

  const filteredFeeds = feeds.filter(feed => String(feed.cate) === categoryMap[selectedCategory]);
  
  return (
    <main className="communityContainer">
      <div className="commBaseLayout">
        <section className="commRecSection">
          <h2><span style={{fontWeight: 'bold'}}>{userName}</span>님에게 추천드리는 {currentCategoryLabel}</h2>
        </section>
        
        <nav className='commCateList'>
          {commCatea.map((item) => (
            <div 
              key={item.to} 
              className={`commCate ${selectedCategory === item.to ? "active" : ""}`}
              onClick={() => setSelectedCategory(item.to)}
            >
              <div className='commCateWrap'>
                <div className="commCateIcon">
                  {selectedCategory === item.to ? item.activeIcon : item.icon}
                </div>
                <span className="commCateLabel">{item.label}</span>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <section className="comFeedSection" ref={listRef}>
        <ul className="comFeedWrap">
          {filteredFeeds.length > 0 ? (
            filteredFeeds.map(feed => {
              if (!feed.image_url) return null;

              return (
                <li 
                  key={feed.id} 
                  className="comFeedItem" 
                  onClick={(e) => handleFeedClick(e, feed)}
                >
                  <div className="imgBox">
                    <img 
                      src={`${IMAGE_BASE_URL}${feed.image_url}`}
                      alt={feed.title}
                      onError={(e) => { e.target.src = "/images/defaultPost.png"; }}
                    />
                    <div className="feedInfo">
                      <span><IoMdHeart /> {feed.heart || 0}</span>
                      <span><PiChatCircleTextFill /> {feed.chat || 0}</span>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="noFeed">게시글이 없습니다.</p>
          )}
        </ul>
      </section>
      <WriteBtn />
    </main>
  );
};

export default Community;