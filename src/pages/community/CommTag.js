import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AiFillTag } from "react-icons/ai";
import App from 'app/api/axios';
import './styles/commtag.css';
import { getUserId } from 'components/getUserId/getUserId';

const CommTag = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentImages = location.state?.currentImages || [];
  
  const userId = Number(getUserId());
  
  const imgUrl = location.state?.imgUrl || "https://via.placeholder.com/800";

  const [tags, setTags] = useState(location.state?.existingTags || []);
  const [tempPos, setTempPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [myGoods, setMyGoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 내 상품 목록 가져오기 (getUserId로 얻은 userId 활용)
  useEffect(() => {
    const fetchMyGoods = async () => {
      try {
        // 서버 API 구조에 맞춰 내 상품 리스트 호출
        const response = await App.get(`/api/goods?user_id=${userId}`);
        setMyGoods(response.data.list || []);
      } catch (err) {
        console.error("상품 목록 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchMyGoods();
  }, [userId]);

  const handlePhotoClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempPos({ x: x.toFixed(2), y: y.toFixed(2) });
    setShowModal(true);
  };

  // 2. 상품 선택 시 태그 객체 생성
  const selectProduct = (product) => {
    const newTag = {
      id: Date.now(),
      goods_id: product.goods_id,
      x: tempPos.x,
      y: tempPos.y,
      name: product.title,
      price: product.price
    };
    setTags([...tags, newTag]);
    setShowModal(false);
  };

  const handleComplete = () => {
    navigate('/community/write', { 
      state: { 
        updatedTag: { id, tags },
        currentImages: currentImages 
      } 
    });
  };

  const handleGoBack = () => {
    if (tags.length !== (location.state?.existingTags?.length || 0)) {
      if (!window.confirm("변경 사항이 저장되지 않습니다. 정말 돌아가시겠어요?")) return;
    }
    navigate(-1);
  };

  const removeTag = (e, tagId) => {
    e.stopPropagation();
    if (window.confirm("이 태그를 삭제하시겠습니까?")) {
      setTags(tags.filter(tag => tag.id !== tagId));
    }
  };

  return (
    <div className="commTagPage">
      <div className="tagInstruction">
        원하는 위치를 클릭하여<br />태그를 추가해 주세요.
      </div>

      <div className="tagImageContainer" onClick={handlePhotoClick}>
        <img src={imgUrl} alt="편집" className="fullImage" />
        <div className="tagIconOverlay"><AiFillTag /></div>
        
        {tags.map((tag) => (
          <div 
            key={tag.id} 
            className="addedTagMarker" 
            style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
            onClick={(e) => removeTag(e, tag.id)}
          >
            <div className="tagLabel">
              <span className="name">{tag.name}</span>
              <span className="price">{Number(tag.price).toLocaleString()}원</span>
            </div>
          </div>
        ))}
      </div>

      <footer className="tagFooter">
        <button className="backBtn" onClick={handleGoBack}>돌아가기</button>
        <button className="doneBtn" onClick={handleComplete}>완료</button>
      </footer>

      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="tagModalContent" onClick={(e) => e.stopPropagation()}>
            {myGoods.length > 0 ? (
              <>
                <h3>등록할 상품을 정해주세요</h3>
                <div className="goodsListSwipe">
                  {myGoods.map((item) => (
                    <div key={item.goods_id} className="goodsItem" onClick={() => selectProduct(item)}>
                      <img src={item.image_url || "/images/defaultPost.png"} alt={item.title} />
                      <div className="info">
                        <p className="name">{item.title}</p> 
                        <p className="price">{Number(item.price).toLocaleString()}원</p>
                      </div>
                      <div className="radioCircle"></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="noGoodsBox">
                <p>등록된 상품이 없습니다.</p>
                <button className="goTradeBtn" onClick={() => navigate('/goodstrade')}>
                  제품 등록하러 가기 &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommTag;