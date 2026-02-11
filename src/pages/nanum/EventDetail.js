import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from 'app/api/axios';
import { IoIosMore } from 'react-icons/io';
import { FaUser } from "react-icons/fa";
import './styles/nanumDetail.css';

function EventDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [clearIsOpen, setClearIsOpen] = useState(false);
  
  // URL 파라미터에서 event_id를 가져옵니다.
  const { id } = useParams();
  const [post, setPost] = useState(null);

  // 이벤트 데이터 받아오기
  useEffect(() => {
    const getEventDetail = async () => {
      try {
        // 분리된 이벤트 전용 API 호출
        const response = await api.get(`/api/event/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("이벤트 데이터 로드 실패 : ", err);
      }
    };
    getEventDetail();
  }, [id]);

  if (!post) return <div>로딩중...</div>;

  // 게시 시간 계산 함수
  const getTimeDiff = (date) => {
    const start = new Date(date);
    const now = new Date();
    const diff = (now - start) / 1000 / 60;

    if (diff < 60) return `${Math.floor(diff)}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  };

  // 이벤트 참여 처리 함수 (나눔 응모와 별개)
  const handleEventApply = async () => {
    try {
      const user_id = "11"; 
      const response = await api.post("/api/event/apply", {
        event_id: id,
        user_id: user_id
      });

      if (response.status === 200) {
        setClearIsOpen(true);
      }
    } catch (err) {
      console.error("이벤트 참여 실패 : ", err);
      alert("이미 참여했거나 오류가 발생했습니다.");
    }
  };

  return (
    <main>
      {/* 참여완료 모달 */}
      {clearIsOpen && (
        <div className='clearedModalWrapper'>
          <div className='clearedModal'>
            <p>이벤트 참여가 완료되었습니다!</p>
            <button onClick={() => setClearIsOpen(false)}>확인</button>
          </div>
        </div>
      )}
        
      <section className='nanumDetail'>
        {/* 관리자 정보 영역 */}
        <div className='postUser'>
          <img src='https://placehold.co/100x100' alt='관리자 프로필'/>
          <p>관리자</p> 
          <img src='https://placehold.co/100x100' alt='공식계정'/>
          <IoIosMore className='moreBtn' onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className='moreAction'>
              <p>관심없음</p>
              <span></span>
              <Link to='' title='신고페이지로 이동'>신고하기</Link>
            </div>
          )}
        </div>

        {/* 이미지 영역 */}
        <div className='mainImg swipeContainer'>
          <div className='goodsItem'>
            {/* 이벤트 테이블의 이미지 컬럼명에 맞춰 수정 필요 (예: post.event_img) */}
            <img src='https://placehold.co/390x430' alt={post.title}/>
          </div>
        </div>

        {/* 이벤트 정보 텍스트 영역 */}
        <div className='goodsInfo'>
          <h3>{post.title}</h3>
          <p>{getTimeDiff(post.created_at)} &#10072; 이벤트</p>
          
          <div className='reaction'>
            <p>
              <FaUser /> {post.view_count || 0} {/* 조회수 필드 등 컬럼명 확인 필요 */}
            </p>
          </div>
        </div>

        <div className='usedInfo'>
          <p>{post.content}</p>
        </div>

        <div className='bottomBtn nanumBtnCustom'>
          <button onClick={handleEventApply}>응모하기</button>
        </div>
      </section>
    </main>
  );
}

export default EventDetail;