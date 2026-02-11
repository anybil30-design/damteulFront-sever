// src/components/admin/PostDetailPage.js
import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../admin/styles/PostDetailPage.module.css";
// import { samplePosts } from "./data/samplePosts";
import api from "app/api/axios";
// 삭제 로직
import { handleDelete } from "./delete/handleDelete";
const PostDetailPage = () => {
    const { cate, id } = useParams();          // URL 파라미터
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

      // 서버에서 유저 상세 불러오기
    useEffect(() => {
        const getPostDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.get(`/api/admin/${cate}/${id}`);

            if (!data?.success) {
            setError(data?.message || "게시판 정보를 불러오지 못했습니다.");
            setPost(null);
            return;
            }

            setPost(data.post);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
        } finally {
            setLoading(false);
        }
        };

        if (id) getPostDetail();
    }, [id, cate]);
    
    if (!id) {
        return (
            <div className={styles.wrapper}>
                <p>존재하지 않는 게시글입니다.</p>
                <button onClick={() => navigate("/admin/posts")}>
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!post) return <div className={styles.pageWrapper}>사용자를 찾을 수 없습니다.</div>;
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 1. 관리자 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>게시글 상세 관리</h2>
                    <span className={styles.adminDesc}>
                        {cate==='nanum'?'나눔':'중고'}게시글 ID #{post.id} 상세 정보
                    </span>
                </div>

                {/* 2. 본문 */}
                <div className={styles.adminBody}>
                    <div className={styles.formGroup}>
                        <label>제목</label>
                        <input type="text" value={post.title} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>작성자</label>
                        <input type="text" value={post.author} readOnly />
                    </div>


                    <div className={styles.formGroup}>
                        <label>내용</label>
                        <textarea value={post.content} rows={8} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>작성일</label>
                        <input type="text" value={post.created_at} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>상품 상태</label>
                        <input type="text" value={post.product_state} readOnly />
                    </div>


                </div>

                {/* 3. 하단 버튼 */}
                <div className={styles.actionButtons}>

                    <button className={styles.danger}
                    onClick={()=>handleDelete(Number(id), '게시물을', setError, cate)}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
