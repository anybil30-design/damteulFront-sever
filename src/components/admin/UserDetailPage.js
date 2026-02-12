import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../admin/styles/UserDetailPage.module.css";
import { gradeInfo } from "./constants/gradeInfo";
import api from "app/api/axios";
import { handleDelete } from "./delete/handleDelete";

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 서버에서 유저 상세 불러오기
  useEffect(() => {
    const getUserDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/api/admin/users/${user_id}`);

        if (!data?.success) {
          setError(data?.message || "유저 정보를 불러오지 못했습니다.");
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err?.message || "서버 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    if (user_id) getUserDetail();
  }, [user_id]);


  // 상태 배지 클래스


  if (loading) return <div className={styles.pageWrapper}>로딩중...</div>;
  if (error) return <div className={styles.pageWrapper}>{error}</div>;
  if (!user) return <div className={styles.pageWrapper}>사용자를 찾을 수 없습니다.</div>;

  // ✅ 서버 데이터 키 맞추기
  const idValue = user.user_id ?? user.id;
  const nicknameValue = user.user_nickname ?? user.nickname;
  const reportValue = user.reported_count ?? user.reportScore ?? 0;
  const createdAtValue = user.created_at ?? user.createdAt;
  const statusValue = user.status;
  console.log(statusValue);
  // ✅ 등급 값 (level_code 기준)
  const levelCodeValue = String(user.level_code ?? user.grade ?? ""); // '0'~'5' 형태로 맞춤
  const currentGradeData = gradeInfo[levelCodeValue]; // 이미지/이름 가져오기
  const gradeNameValue = currentGradeData?.name ?? levelCodeValue; // 혹시 gradeInfo에 없으면 코드라도 표시

  const statusKey =
    statusValue === "활동중"
      ? "ingUser"
      : statusValue === "정지"
        ? "stopUser"
        : "noUser";
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        {/* 헤더 */}
        <div className={styles.adminHeader}>
          <h2 className={styles.adminTitle}>사용자 상세 정보</h2>
          <span className={styles.adminDesc}>회원 user_id #{idValue} 상세 정보</span>
        </div>

        {/* 카드 영역 */}
        <div className={styles.userEditCard}>
          {/* 프로필 */}
          <div className={styles.profile}>
            <img
              src="/images/defaultProfile.png"
              alt="user"
              className={styles.profileImg}
            />
            <div>
              <strong>ID</strong> {idValue} <br />
              <strong>닉네임</strong> {nicknameValue}
            </div>
          </div>

          {/* 기본 정보 */}
          <section className={styles.formSection}>
            <h4>기본 정보</h4>

            <div className={styles.inputGroup}>
              <strong>ID:</strong>
              <input value={idValue} disabled className={styles.disabledInput} />
            </div>

            <div className={styles.inputGroup}>
              <strong>닉네임</strong>
              <input value={nicknameValue} disabled className={styles.disabledInput} />
            </div>

            {/* ✅ 등급: select 제거 → input으로 출력 */}
            <div className={styles.inputGroup}>
              <strong>등급</strong>
              <input
                type="text"
                value={gradeNameValue}
                disabled
                className={styles.disabledInput}
              />

              {currentGradeData && (
                <div className={styles.userSummary}>
                  <img
                    src={currentGradeData.img}
                    alt={gradeNameValue}
                    className={styles.gradeImg}
                  />
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <strong>신고 점수</strong>
              <input
                type="number"
                value={reportValue}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <strong>가입일</strong>
              <input
                type="text"
                value={(createdAtValue || "").slice(0, 10)}
                disabled
                className={styles.disabledInput}
              />
            </div>
          </section>
        </div>

        <section className={styles.formSection}>
          <strong>계정 상태</strong>
          <div className={styles.statusWrapper}>
            <span
              className={`${styles.statusBadge} ${styles[statusKey]}`}
            >
              {statusValue}
            </span>
          </div>
        </section>

        {/* ✅ 하단 버튼: 저장 → 확인 */}
        <div className={styles.actionButtons}>
          <button
            className={styles.primary}
            onClick={() => { window.close(); }}
          >
            확인
          </button>

          {/* 삭제 기능도 없앨 거면 이 버튼과 handleDelete 함수도 같이 삭제 */}
          <button className={styles.danger} onClick={() => handleDelete(Number(user_id), '유저정보를', setError, 'users')}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
