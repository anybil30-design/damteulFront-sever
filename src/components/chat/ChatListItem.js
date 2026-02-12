import React from "react";
import { Link } from "react-router-dom";
import { API_ORIGIN } from "app/api/apiOrigin";

function truncate(text, max = 28) {
  const s = (text ?? "").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max) + "..." : s;
}

/**
 * ✅ 어떤 환경에서도 동일한 "절대 시각(ms)"으로 변환
 *
 * - 타임존 없는 문자열은 "KST"로 확정해서 epoch로 변환
 * - 타임존 있는 문자열(Z, +09:00 등)은 기본적으로 new Date로 파싱하되,
 *   ✅ "Z인데 실제론 KST"처럼 잘못 직렬화된 케이스는 미래시간이면 KST로 보정
 */
function toEpochMs(v) {
  if (!v) return null;

  // Date 객체면 그대로
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isNaN(t) ? null : t;
  }

  const s = String(v).trim();
  if (!s) return null;

  // ---- 1) "YYYY-MM-DD HH:mm:ss(.SSS)?"  -> KST 확정
  let m = s.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/
  );
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);
    const ms = m[7] ? Number(m[7].padEnd(3, "0")) : 0;

    // KST(+09:00) -> UTC epoch : hour - 9
    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss, ms);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // ---- 2) "YYYY-MM-DDTHH:mm:ss(.SSS)?" (타임존 없음) -> KST 확정
  m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/
  );
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const hh = Number(m[4]);
    const mm = Number(m[5]);
    const ss = Number(m[6]);
    const ms = m[7] ? Number(m[7].padEnd(3, "0")) : 0;

    const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss, ms);
    return Number.isNaN(utcMs) ? null : utcMs;
  }

  // ---- 2-1) "....Z" 형태인데, 이게 DB(KST) 시간을 그대로 가져오며 Z가 붙은 케이스 보정
  // 예: 2026-02-11T15:31:55.000Z  (실제로는 KST 15:31:55인데 Z가 붙음)
  const zMatch = s.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/
  );

  // ---- 3) 타임존이 포함된 ISO/RFC 형태면 new Date로 절대시각 생성
  const dt = new Date(s);
  const t = dt.getTime();
  if (!Number.isNaN(t)) {
    // ✅ 만약 "Z가 붙어있는데" 파싱 결과가 현재보다 미래라면,
    //    Z가 잘못 붙은 KST 직렬화 가능성이 매우 큼 -> KST로 재해석
    if (zMatch) {
      const now = Date.now();
      const diff = t - now;

      // 1분 이상 미래면 "잘못된 Z"로 판단(필요하면 10초/5분으로 조정 가능)
      if (diff > 60 * 1000) {
        const y = Number(zMatch[1]);
        const mo = Number(zMatch[2]);
        const d = Number(zMatch[3]);
        const hh = Number(zMatch[4]);
        const mm = Number(zMatch[5]);
        const ss = Number(zMatch[6]);
        const ms = zMatch[7] ? Number(zMatch[7].padEnd(3, "0")) : 0;

        // "Z"를 무시하고 KST로 확정해서 epoch 계산
        const utcMs = Date.UTC(y, mo - 1, d, hh - 9, mm, ss, ms);
        return Number.isNaN(utcMs) ? t : utcMs;
      }
    }

    return t;
  }

  return null;
}

function timeAgo(dateValue) {
  const t = toEpochMs(dateValue);
  if (!t) return "";

  const diffMs = Date.now() - t;

  // 미래 시간이 들어오면(서버 직렬화 문제로 +9h 등) 최소 방어
  if (diffMs < 0) return "방금 전";

  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "방금 전";

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  return `${day}일 전`;
}

function badgeText(n) {
  const v = Number(n || 0);
  if (v <= 0) return "";
  return v > 99 ? "99+" : String(v);
}

const ChatListItem = ({ room }) => {
  const profileSrc =
    room?.otherProfile !== "defaultProfile.png"
      ? `${API_ORIGIN}${room.otherProfile}`
      : `${process.env.PUBLIC_URL}/images/defaultProfile.png`;

  const badge = badgeText(room?.unreadCount);

  return (
    <li>
      <Link to={`/chat/chatroom/${room.chat_id}`} title="채팅바로가기">
        <div className="chatParent">
          <div className="chatContWrap">
            <div className="chatCont">
              <div className="chatImg">
                <img src={profileSrc} alt="상대 프로필" />
              </div>

              <div className="chatTxt">
                <div>
                  <h3>{room.otherNickname || "상대"}</h3>
                  {/* ✅ "Z가 붙어도" 미래시간이면 KST로 재해석해서 정상 표시 */}
                  <span>{timeAgo(room.lastMessageAt)}</span>
                </div>

                <p>{truncate(room.lastText, 28)}</p>
              </div>
            </div>

            {badge && <span className="chatBadge">{badge}</span>}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ChatListItem;