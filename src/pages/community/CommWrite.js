import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import App from 'app/api/axios';
import './styles/commwrite.css';
import { getUserId } from 'components/getUserId/getUserId';
import { uploadMultiImages } from '../../components/uploadImage/uploadMultiImages';

import { TiPlus } from "react-icons/ti";
import { IoCloseCircle } from "react-icons/io5";

const CommWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData; // ✅ 수정 시 넘어오는 기존 데이터

  // ✅ 수정 모드일 경우 기존 데이터로 초기화, 아니면 빈 값
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState(editData?.post?.title || "");
  const [content, setContent] = useState(editData?.post?.content || "");
  const [selectedCate, setSelectedCate] = useState(editData?.post?.cate || ""); 
  
  const userId = getUserId();

  const IMAGE_BASE_URL = "http://localhost:9070/uploads/community/";

  // ✅ 초기 로드 시 기존 이미지 세팅 (수정 모드일 때)
  useEffect(() => {
    if (editData && editData.images) {
      const existingImages = editData.images.map(img => ({
        id: img.image_id,
        url: `${IMAGE_BASE_URL}${img.image_url}`, // 기존 서버 경로
        savedName: img.image_url, // 서버에 저장된 파일명 유지용
        tags: img.tags || []
      }));
      setImages(existingImages);
    }
  }, [editData]);

  // 태그 정보 업데이트 처리 (CommTag에서 돌아왔을 때)
  useEffect(() => {
    if (location.state?.updatedTag) {
      const { id, tags } = location.state.updatedTag;
      setImages((prev) => 
        prev.map((img) => 
          String(img.id) === String(id) ? { ...img, tags: tags } : img
        )
      );
      window.history.replaceState({}, document.title);
    } 
  }, [location.state]);

  const goToTagPage = (img) => {
    navigate(`/community/tag/${img.id}`, { 
      state: { 
        imgUrl: img.url,
        existingTags: img.tags || [],
        currentImages: images
      } 
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("사진은 최대 10장까지 등록 가능합니다.");
      return;
    }
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
      tags: [] 
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const deleteImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const handleRegister = () => {
    // ✅ 유효성 검사: 로그인 여부 확인 추가
    if (!userId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    if (!selectedCate || !title.trim() || !content.trim()) {
      return alert("모든 항목을 입력해주세요.");
    }
    
    const isEdit = !!editData;
    const apiPath = isEdit ? `/api/community/${editData.post.post_id}` : "/api/community";
    const method = isEdit ? "put" : "post";

    const processPost = (newUploadedUrls = []) => {
      // ✅ 기존 이미지(savedName이 있는 것)와 새로 업로드된 이미지 합치기
      const existingUrls = images.filter(img => !img.file).map(img => img.savedName);
      const allImageUrls = [...existingUrls, ...newUploadedUrls];

      const postData = {
        user_id: Number(userId), // ✅ getUserId로부터 받은 ID 사용
        title, 
        content, 
        cate: selectedCate,
        image_urls: allImageUrls, 
        tags: JSON.stringify(images.map(img => img.tags || []))
      };

      App[method](apiPath, postData)
        .then(() => {
          alert(isEdit ? "수정되었습니다." : "등록되었습니다!");
          navigate('/community');
        })
        .catch(() => alert("저장 실패"));
    };

    const newFiles = images.filter(img => img.file).map(img => img.file);
    
    if (newFiles.length > 0) {
      uploadMultiImages(newFiles, "community").then(files => {
        processPost(files.map(f => f.savedName));
      });
    } else {
      processPost(); 
    }
  };
  
  return (
    <main className="commWritePage">
      <div className="commWriteContainer">
        <section className="imageUploadSection swipeContainer">
          <div className="uploadBtnBox">
            <label htmlFor="fileUpload" className="uploadLabel">
              <TiPlus /><p><span>{images.length}</span>/10</p>
              <input id="fileUpload" type="file" multiple accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          {images.map((img, index) => (
            <div className="previewItem" key={img.id} style={{ position: 'relative', overflow: 'hidden' }}>
              <img 
                src={img.url} 
                alt="미리보기" 
                onClick={() => goToTagPage(img)} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
              />
              {img.tags && img.tags.map((tag) => (
                <div key={tag.id} className="tagDotPreview" style={{ position: 'absolute', left: `${tag.x}%`, top: `${tag.y}%`, width: '8px', height: '8px', background: '#5ba661', borderRadius: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
              ))}
              {index === 0 && <div className="representativeBadge">대표 사진</div>}
              <button type="button" className="deleteBtn" onClick={() => deleteImage(img.id)}>
                <IoCloseCircle />
              </button>
            </div>
          ))}
        </section>

        <section className="contentInputSection">
          <div className="inputGroup">
            <label>카테고리</label>
            <select value={selectedCate} onChange={(e) => setSelectedCate(e.target.value)}>
              <option value="" disabled>카테고리를 선택해주세요.</option>
              <option value="1">티켓/교환권</option>
              <option value="2">의류</option>
              <option value="3">뷰티/미용</option>
              <option value="4">유아용품</option>
              <option value="5">도서</option>
              <option value="6">스포츠/레저</option>
              <option value="7">디지털기기</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>제목</label>
            <input type="text" className="writeTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='제목을 입력해주세요.' />
          </div>
          <div className="inputGroup">
            <label>자세한 설명</label>
            <textarea className="writeContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder='자세한 설명을 입력해주세요.'></textarea>
          </div>
        </section>
      </div>
      <div className="bottomBtn">
        <button type="button" className="commCancelBtn" onClick={() => navigate('/community')}>취소</button>
        <button type="button" className="commAcceptBtn" onClick={handleRegister}>{editData ? "수정완료" : "등록완료"}</button>
      </div>
    </main>
  );
};

export default CommWrite;