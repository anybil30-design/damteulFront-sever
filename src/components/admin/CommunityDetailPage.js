// src/components/admin/CommunityDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../admin/styles/CommunityDetailPage.module.css';

import api from "app/api/axios";
// 삭제 로직
import { handleDelete } from "./delete/handleDelete";

const CommunityDetailPage = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

          // 서버에서 유저 상세 불러오기
    useEffect(() => {
        const getCommunityDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.get(`/api/admin/community/${id}`);

            if (!data?.success) {
                setError(data?.message || "게시판 정보를 불러오지 못했습니다.");
                setCommunity(null);
                return;
            }

            setCommunity(data.community);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
        } finally {
            setLoading(false);
        }
        };

        if (id) getCommunityDetail();
    }, [id]);


    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!community) return <div>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>커뮤니티 상세 정보</h2>
                    <span className={styles.adminDesc}>
                        커뮤니티 게시글 ID #{id} 상세 정보
                    </span>
                </div>

                {/* 본문 */}
                <div className={styles.adminBody}>
                    {/* 카테고리 */}
                    <div className={styles.inputGroup}>
                        <label>카테고리</label>
                        <input value={community.category} readOnly />
                    </div>

                    {/* 제목 */}
                    <div className={styles.inputGroup}>
                        <label>제목</label>
                        <input value={community.title} readOnly />
                    </div>

                    {/* 작성자 */}
                    <div className={styles.inputGroup}>
                        <label>작성자</label>
                        <input value={community.author} readOnly />
                    </div>

                    {/* 내용 */}
                    <div className={styles.inputGroup}>
                        <label>내용</label>
                        <textarea
                            value={community.content}
                            readOnly
                            rows={6}
                        />
                    </div>

                    {/* 모임 날짜 */}
                    <div className={styles.inputGroup}>
                        <label>작성일</label>
                        <input type="text" value={community.created_at} readOnly />
                    </div>


                    {/* 저장 버튼 */}
                    <div className={styles.actionButtons}>
                        <button className={styles.danger} onClick={()=>handleDelete(Number(id), '게시물을' ,setError, 'community')}>
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityDetailPage;
