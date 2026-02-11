// src/components/admin/NoticeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../admin/styles/NoticeDetailPage.module.css';
import api from 'app/api/axios';
import { handleDelete } from "./delete/handleDelete";
import { API_ORIGIN } from "app/api/apiOrigin";
import { uploadSingleImage } from "../uploadImage/uploadSingleImages";

const NoticeDetailPage = () => {
    
    const { id } = useParams();


    // 🔹 상태값 초기화
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [imgChange, setImageChange] = useState({
        changed: false,
        previewUrl: "",  // 미리보기용
        file: null,      // 실제 업로드할 파일
    });

    const resolveImageUrl = (p) => {
        if (!p) return "";
        if (p.startsWith("blob:")) return p;
        if (/^https?:\/\//i.test(p)) return p;
        return `${API_ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`;
    };

    useEffect(() => {
        const getNoticeDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get(`/api/admin/notice/${id}`);

                if (!data?.success) {
                    setError(data?.message || "이벤트 정보를 불러오지 못했습니다.");
                    setNotice(null);
                    return;
                }

                setNotice(data.event);
                // 이미지값만 받아오기
                setImageChange({ changed: false, previewUrl: data.event.image, file: null });

            } catch (err) {
                console.error(err);
                setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        if (id) getNoticeDetail();
    }, [id]);

    // url쌓임 방지 -> 임시 url일때만
    useEffect(() => {
        return () => {
            if (imgChange.previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(imgChange.previewUrl);
            }
        };
    }, [imgChange.previewUrl]);


    if (!id) {
        return <div className={styles.pageWrapper}>공지사항 정보를 찾을 수 없습니다.</div>;
    }
    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!notice) return <div className={styles.pageWrapper}>공지사항정보를 찾을 수 없습니다.</div>;


    // 저장
    const handleSave = async (e) => {
        e.preventDefault();

        if (!notice.title?.trim()) return alert("제목을 입력해주세요");
        if (!notice.content?.trim()) return alert("내용을 입력해주세요");
        if (!(notice.image || imgChange.file)) return alert("이미지를 등록해주세요");

        try {
            let imageUrl = notice.image;

            if (imgChange.changed && imgChange.file) {
                imageUrl = await uploadSingleImage(imgChange.file, 'notice');
            }

            // 2) 이벤트 업데이트 요청
            const payload = {
                ...notice,
                image: imageUrl,
            };

            const { data } = await api.put(`/api/admin/notice/${id}`, payload);
            if (!data?.success) throw new Error(data?.message || "저장 실패");
            alert("저장 완료!");
            setNotice(prev => ({ ...prev, image: imageUrl }));
            setImageChange({ changed: false, previewUrl: imageUrl, file: null });

            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    { type: "UPDATED", id },
                    window.location.origin
                );
            }
            window.close();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || err.message || "서버 오류");
        }
    };

    // 폼체인지
    const eventFormChange = (e) => {
        const { name, value } = e.target;

        setNotice((prev) => {
            if (!prev) return prev;
            return { ...prev, [name]: value };
        });
    };

    // 이미지 변경시 
    const eventImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(file);

        setImageChange({
            changed: true,
            previewUrl,
            file,
        });
        e.target.value = "";
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>공지사항 상세 정보</h2>
                    <span className={styles.adminDesc}>
                        공지사항 ID #{id} 상세 정보
                    </span>
                </div>

                <form onSubmit={handleSave}>
                {/* 본문 */}
                <div className={styles.adminBody}>
                    {/* 제목 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor='title'>제목</label>
                        <input id='title' name='title' value={notice.title} onChange={eventFormChange} />
                    </div>

                    {/* 설명 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor='content'>설명</label>
                        <textarea value={notice.content} name='content' id='content' onChange={eventFormChange} rows={4} />
                    </div>

                    {/* 사진 첨부 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor='image'>이미지</label>
                        {/* 이미지 */}
                        <img
                            src={resolveImageUrl(
                                imgChange.changed ? imgChange.previewUrl : notice.image
                            )}
                            alt={notice.title} style={{ width: '100%', borderRadius: '6px' }} />

                        <input type='file' accept="image/*" onChange={eventImageChange} />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor='created_at'>게시일</label>
                        <input type='text' id='created_at' value={notice.created_at} readOnly />
                    </div>

                    {/* 액션 버튼 */}
                    <div className={styles.actionButtons}>
                        <button type='submit' className={styles.primary}>저장</button>
                        <button type='button' className={styles.danger} onClick={()=>handleDelete(Number(id), '공지사항을', setError, 'notice')}>삭제</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeDetailPage;
