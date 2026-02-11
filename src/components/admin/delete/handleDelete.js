import api from "app/api/axios";

// id - 각 테이블 id값
// confirmTxt - ??? 삭제하시겠습니까?
// setError("")
// url에 들어갈 값 ex)users

export const handleDelete = async (id, confirmTxt, setError, url) => {
    if (!window.confirm(`${confirmTxt} 삭제하시겠습니까?`)) return;

    try {
        setError("");
        const { data } = await api.put(`/api/admin/${url}/${id}/delete`);
        
        if (!data?.success) {
        alert(data?.message || "삭제 실패");
        return;
        }

        alert("삭제되었습니다.");

        // ✅ 부모(목록) 창에 "삭제됐으니 다시 조회" 신호 보내기
        if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
            { type: "DELETED", id },
            window.location.origin
        );
        }

        // ✅ 새창 닫기 (유지)
        window.close();
    } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || err?.message || "서버 오류");
    }
};