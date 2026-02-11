import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import App from 'app/api/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getUserId } from 'components/getUserId/getUserId';

import { IoIosMore } from 'react-icons/io'; 
import { AiFillTag } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";

import 'swiper/css';
import 'swiper/css/pagination';
import './styles/commpost.css';

const gradeIcons = {
  '1': '/images/level01.png', '2': '/images/level02.png', '3': '/images/level03.png',
  '4': '/images/level04.png', '5': '/images/level05.png'
};

const IMAGE_BASE_URL = "https://port-0-damteulback-server-mlhcddsk6f7f8eac.sel3.cloudtype.app/uploads/community/";

const CommPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const userId = getUserId() ? Number(getUserId()) : null;

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(0); 
  const [showTags, setShowTags] = useState(true); 
  const [isOpen, setIsOpen] = useState(false); 
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("익명"); // 댓글 작성자 이름용

  // 사용자 정보 가져오기 (닉네임 표시용)
  useEffect(() => {
    if (userId) {
      App.get(`/api/profile/${userId}`)
        .then(res => {
          if (res.data && res.data.user_nickname) setUserName(res.data.user_nickname);
        })
        .catch(err => console.error(err));
    }
  }, [userId]);

  const fetchPostDetail = useCallback(() => {
    setLoading(true);
    App.get(`/api/community/${id}`)
      .then(res => {
        if (res.data && res.data.post) {
          setDetail(res.data);
          setLikeCount(res.data.post.initial_like_count || 0); 
          // 초기 가상 댓글 세팅
          setComments([
            { comment_id: 1, user_nickname: "담뜰이", content: "정말 예쁜 사진이네요!", user_id: 999 },
            { comment_id: 2, user_nickname: "중고왕", content: "태그된 상품 정보 궁금해요!", user_id: 888 }
          ]);
        }
      })
      .catch(() => navigate('/community'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  // ✅ [수정] DB 저장 없이 화면에만 댓글 추가하는 로직
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    // 새로운 댓글 객체 생성 (임시 ID 부여)
    const tempComment = {
      comment_id: Date.now(), // 겹치지 않게 타임스탬프 사용
      user_nickname: userName,
      user_id: userId,
      content: newComment,
      isTemp: true // 화면 표시용임을 구분
    };

    // 기존 댓글 목록에 추가 (상태 업데이트만 진행)
    setComments([...comments, tempComment]);
    setNewComment(""); // 입력창 비우기
  };

  // ✅ 화면에서만 댓글 삭제
  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(c => c.comment_id !== commentId));
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
  if (!detail || !detail.post) return <div className="loading">데이터가 없습니다.</div>;

  const { post, images } = detail;

  return (
    <div className="bodyParent">
      <main className="commPostPage">
        <header className="postHeader">
          <div className="userInfo">
            <img src={post.profile || "/images/defaultProfile.png"} alt="profile" />
            <div className="nameWrap">
              <span className="nickname">{post.user_nickname}</span>
              <img src={gradeIcons[String(post.level_code)] || gradeIcons['1']} alt="lv" className="gradeBadge" />
            </div>
          </div>
          <div className="menuWrap">
            <IoIosMore onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
              <div className="adminMenu">
                {post.user_id === userId && (
                  <>
                    <button onClick={() => navigate(`/community/write`, { state: { editData: detail } })}>수정하기</button>
                    <button className="deleteText">삭제하기</button>
                  </>
                )}
                <button>신고하기</button>
              </div>
            )}
          </div>
        </header>

        <section className="imageSection">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
            {images.map((img, idx) => (
              <SwiperSlide key={img.image_id || idx}>
                <div className="imgWrap">
                  <img src={`${IMAGE_BASE_URL}${img.image_url}`} alt="post" />
                  <button className="tagToggleBtn" onClick={() => setShowTags(!showTags)}><AiFillTag /></button>
                  {showTags && img.tags?.map((tag, tIdx) => (
                    <div 
                      key={tag.tag_id || tIdx} 
                      className="postTagMarker" 
                      style={{ left: `${tag.x_pos}%`, top: `${tag.y_pos}%` }}
                    >
                      <div className="tagBox">
                        <span>{tag.name}</span>
                        <small>{Number(tag.price).toLocaleString()}원</small>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <div className='goodsInfo'>
          <div className='interactionBar'>
            <div className='iconItem' onClick={handleLikeToggle} style={{cursor:'pointer'}}>
              {isLiked ? <FaHeart className="active" style={{color:'red'}} /> : <FaRegHeart />}
              <span>{likeCount}</span>
            </div>
            <div className='iconItem'>
              <BiMessageSquareDetail />
              <span>{comments.length}</span>
            </div>
          </div>
          <h3>{post.title}</h3>
          <div className='postMainText'><p>{post.content}</p></div>
        </div>

        {/* 댓글 리스트 섹션 */}
        <section className="commentListSection">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="commentItem">
              <div className="commentHeader">
                <span className="commentUser">{comment.user_nickname}</span>
                {(comment.user_id === userId || comment.isTemp) && (
                  <button className="commDelBtn" onClick={() => handleCommentDelete(comment.comment_id)}>삭제</button>
                )}
              </div>
              <p className="commentText">{comment.content}</p>
            </div>
          ))}
        </section>

        <div className="bottomInteractionBar">
          <div className="bottomInner">
            <input 
              type="text" 
              className="commentInput" 
              placeholder="댓글을 남겨보세요" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <button className="sendBtn" onClick={handleCommentSubmit} disabled={!newComment.trim()}>등록</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommPost;