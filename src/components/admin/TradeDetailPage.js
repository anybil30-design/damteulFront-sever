// src/components/admin/TradeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../admin/styles/TradeDetailPage.module.css';
import api from "app/api/axios";
import { handleDelete } from "./delete/handleDelete";

const TradeDetailPage = () => {
    const { id } = useParams();

    const [trade, setTrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getTradeDetail = async () => {
        try {
            setLoading(true);
            setError("");
    
            const { data } = await api.get(`/api/admin/trades/${id}`);
    
            if (!data?.success) {
            setError(data?.message || "거래 정보를 불러오지 못했습니다.");
            setTrade(null);
            return;
            }
    
            setTrade(data.trade);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
        } finally {
            setLoading(false);
        }
        };
    
        if (id) getTradeDetail();
    }, [id]);

    if (!id) {
        return <div className={styles.pageWrapper}>거래 정보를 찾을 수 없습니다.</div>;
    }
    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!trade) return <div className={styles.pageWrapper}>거래정보를 찾을 수 없습니다.</div>;
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>거래 상세 관리</h2>
                    <span className={styles.adminDesc}>
                        거래 ID #{trade.id} 상세 정보
                    </span>
                </div>

                {/* 본문 */}
                <div className={styles.adminBody}>
                    {/* 상품 정보 */}
                    <div className={styles.formGroup}>
                        <label>상품명</label>
                        <input type="text" value={trade.product} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>설명</label>
                        <textarea value={trade.content} readOnly />
                    </div>

                    {/* 거래 정보 */}
                    <div className={styles.formGroup}>
                        <label>판매자</label>
                        <input type="text" value={trade.seller} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label>구매자</label>
                        <input type="text" value={trade.buyer} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label>거래 방식</label>
                        <input type="text" value={trade.method} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label>거래 일시</label>
                        <input type="text" value={trade.created_at} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label>거래 금액</label>
                        <input type="text" value={`${trade.price.toLocaleString()}원`} readOnly />
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className={styles.actionButtons}>

                    <button
                        className={styles.primary}
                        onClick={() => {window.close();}}
                    >
                        확인
                    </button>

                    <button className={styles.danger} onClick={()=>handleDelete(Number(id), '거래정보를', setError, 'trades')}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeDetailPage;
