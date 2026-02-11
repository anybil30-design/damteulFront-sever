import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../admin/styles/EventDetailPage.module.css';
import api from 'app/api/axios';
import { handleDelete } from "./delete/handleDelete";
import { uploadSingleImage } from "../uploadImage/uploadSingleImages";

// 이미지 url상수
import { API_ORIGIN } from "app/api/apiOrigin";

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [defaultStartDate, setDefaultStartDate] = useState();
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
        const getEventDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get(`/api/admin/event/${id}`);

                if (!data?.success) {
                    setError(data?.message || "이벤트 정보를 불러오지 못했습니다.");
                    setEvent(null);
                    return;
                }

                setEvent(data.event);
                setDefaultStartDate(data.event.startDate);
                // 이미지값만 받아오기
                setImageChange({ changed: false, previewUrl: data.event.image, file: null });

            } catch (err) {
                console.error(err);
                setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        if (id) getEventDetail();
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
        return <div className={styles.pageWrapper}>이벤트 정보를 찾을 수 없습니다.</div>;
    }
    if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
    if (error) return <div className={styles.pageWrapper}>{error}</div>;
    if (!event) return <div className={styles.pageWrapper}>이벤트정보를 찾을 수 없습니다.</div>;


    // 저장
    const handleSave = async (e) => {
        e.preventDefault();

        if (!event.title?.trim()) return alert("제목을 입력해주세요");
        if (!event.content?.trim()) return alert("내용을 입력해주세요");
        if (!event.startDate || '') return alert('시작날짜를 선택해주세요');
        if (!event.endDate || '') return alert('종료날짜를 선택해주세요');
        if (!(event.image || imgChange.file)) return alert("이미지를 등록해주세요");

        try {
            let imageUrl = event.image;

            if (imgChange.changed && imgChange.file) {
                imageUrl = await uploadSingleImage(imgChange.file, 'event');
            }

            // 2) 이벤트 업데이트 요청
            const payload = {
                ...event,
                image: imageUrl,
            };

            const { data } = await api.put(`/api/admin/event/${id}`, payload);
            if (!data?.success) throw new Error(data?.message || "저장 실패");
            alert("저장 완료!");
            setEvent(prev => ({ ...prev, image: imageUrl }));
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

        setEvent((prev) => {
            if (!prev) return prev;

            // startDate 바꿀 때: endDate가 startDate보다 빠르면 endDate를 startDate로 보정
            if (name === "startDate") {
                const next = { ...prev, startDate: value };

                if (next.endDate && next.endDate < value) {
                    next.endDate = value;
                }
                return next;
            }

            // endDate 바꿀 때: 혹시 startDate보다 빠르게 선택하려고 하면 startDate로 보정(선택)
            if (name === "endDate") {
                const next = { ...prev, endDate: value };

                if (next.startDate && value < next.startDate) {
                    next.endDate = next.startDate;
                }
                return next;
            }

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



    const toDateOnly = (v) => (v ? String(v).slice(0, 10) : "");

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.wrapper}>
                {/* 헤더 */}
                <div className={styles.adminHeader}>
                    <h2 className={styles.adminTitle}>이벤트 상세 정보</h2>
                    <span className={styles.adminDesc}>
                        이벤트 ID #{id} 상세 정보
                    </span>
                </div>


                {/* 이벤트 카드 */}
                <form onSubmit={handleSave}>
                <div className={styles.eventCard}>
                    <div className={styles.inputGroup}>
                        <label htmlFor='title'>제목</label>
                        <input value={event.title} name='title' id='title' onChange={eventFormChange} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='content'>설명</label>
                        <textarea value={event.content} name='content' id='content' onChange={eventFormChange} rows={4} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='image'>배너 이미지</label>
                        {/* 이미지 */}
                        <img
                            src={resolveImageUrl(
                                imgChange.changed ? imgChange.previewUrl : event.image
                            )}
                            alt={event.title} style={{ width: '100%', borderRadius: '6px' }} />

                        <input type='file' accept="image/*" onChange={eventImageChange} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='startDate'>시작일</label>
                        <input type="date" id='startDate' name='startDate' value={toDateOnly(event.startDate)} onChange={eventFormChange}
                            disabled={event.status !== '예정'} min={toDateOnly(defaultStartDate)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='endDate'>종료일</label>
                        <input type="date" id='endDate' name='endDate' value={toDateOnly(event.endDate)} onChange={eventFormChange} min={toDateOnly(event.startDate)}
                            disabled={event.status === '종료'}
                        />
                    </div>

                    {/* 상태 배지 */}
                    <div className={styles.statusWrapper}>
                        <strong>진행 상태</strong>
                        <span className={`${styles.statusBadge}
                            ${event.status === '진행중' ? styles.start
                                : event.status === '종료' ? styles.end
                                    : styles.new
                            }
                        `}>
                            {event.status}
                        </span>
                    </div>

                    {/* 하단 액션 버튼 */}
                    <div className={styles.actionButtons}>
                        <button type="submit" className={styles.primary}>저장</button>
                        <button type="button" className={styles.danger} onClick={() => handleDelete(Number(id), '이벤트정보를', setError, 'events')}>삭제</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
};

export default EventDetailPage;
