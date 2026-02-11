import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../admin/styles/ReportDetailPage.module.css';
import api from "app/api/axios";
import { handleDelete } from "./delete/handleDelete";

const ReportDetailPage = () => {
    const { id } = useParams();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState();

    // 서버에서 유저 상세 불러오기
    useEffect(() => {
        const getReportDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get(`/api/admin/reports/${id}`);

                if (!data?.success) {
                    setError(data?.message || "신고 정보를 불러오지 못했습니다.");
                    setReport(null);
                    return;
                }

                setReport(data.report);
                setSelectedStatus(data.report?.processing_result ?? "");

            } catch (err) {
                console.error(err);
                setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        if (id) getReportDetail();
    }, [id]);


    if (!id) {
        return <div>신고 데이터를 찾을 수 없습니다.</div>;
    }
    // console.log(report.processing_result);

    // 업데이트
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const statusMap = { "처리중": null, "무효": 0, "경고": 1, "정지": 2 };
            const status = statusMap[selectedStatus] ?? null;

            const { data } = await api.patch(`/api/admin/reports/${id}`, { status });
            if (!data?.success) {
                alert(data?.message || '수정 실패');
                return;
            }
            alert('수정되었습니다.');

            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    { type: "UPDATED", id },
                    window.location.origin
                );
            }
            window.close();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || err?.message || "서버 오류");
        }
    };

    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!report) return <div className={styles.pageWrapper}>사용자를 찾을 수 없습니다.</div>;
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>신고 상세 관리</h2>
                    <span className={styles.adminDesc}>
                        신고 ID #{report.id} 상세 정보
                    </span>
                </div>

                {/* 본문 */}
                <div className={styles.adminBody}>
                    <div className={styles.formGroup}>
                        <label>카테고리</label>
                        <input type="text" value={report.category} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>신고자</label>
                        <input type="text" value={report.reporter} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                        <label>신고 대상</label>
                        <input type="text" value={report.reported} readOnly />
                    </div>

                    {/* 신고 날짜 */}
                    <div className={styles.formGroup}>
                        <label>신고 일시</label>
                        <input type="text" value={report.created_at} readOnly />
                    </div>

                    {/* 신고 상태 */}
                    <div className={styles.formGroup}>
                        <div className={styles.fomrGroupWrap}>
                            <label>신고 상태</label>
                            <section className={styles.formSection}>
                                <span className={`${styles.statusBadge} ${styles[selectedStatus]}`}>
                                    {selectedStatus}
                                </span>
                            </section>
                        </div>
                        {/* 상태 선택 */}
                        <select
                            className={styles.statusSelect}
                            value={selectedStatus}          // useState로 관리
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="처리중">처리중</option>
                            <option value="무효">무효</option>
                            <option value="경고">경고</option>
                            <option value="정지">정지</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>신고 내용</label>
                        <textarea value={report.reason} readOnly />
                    </div>
                </div>

                {/* 하단 상태 변경 영역 */}
                <div className={styles.actionButtons}>

                    {/* 적용 버튼 */}
                    <button
                        className={styles.primary}
                        onClick={handleUpdateStatus}
                    >
                        저장
                    </button>

                    {/* 삭제 버튼 */}
                    <button
                        className={styles.danger}
                        onClick={() => handleDelete(Number(id), '신고정보를', setError, 'reports')}
                    >
                        삭제
                    </button>
                </div>



            </div>
        </div>
    );
};

export default ReportDetailPage;
