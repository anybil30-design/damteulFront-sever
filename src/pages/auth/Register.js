import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/auth.css";
import {closeMobileKeyboard} from "components/closeMobileKeyboard/closeMobileKeyboard";
// axios
import api from "app/api/axios";

export default function Register() {
  // navigate
  const navigate = useNavigate();

  // addressSearch에서 받아온 값 없으면 address로 넘어가게
  const { state } = useLocation();
  const address = state?.address;

  useEffect(()=>{
    if(!address){
      navigate("/address", { replace: true });
    }
  },[address, navigate])


  // 에러 발생시 나오게할 상태값 (phone, name, nick)
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nickError, setNickError] = useState("");

  // 연결 실패 에러 상태값
  const [regError, setRegError] = useState("");

  // 회원가입 폼 상태값
  const [registerForm, setRegisterForm] = useState({
    user_name: "",
    user_nickname: "",
    user_phone: "",
  });

  // 회원가입 폼 변환 상태값
  const onChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 폼입력시 해동 폼 에러 삭제
    if (name === "user_phone") setPhoneError("");
    if (name === "user_name") setNameError("");
    if (name === "user_nickname") setNickError("");
    setRegError("");
  };

  // 전화번호 검증 함수
  const validatePhone = (phone) => {
    if (phone.length === 0) {
      return "* 전화번호를 입력해주세요";
    }

    // 숫자만인지
    if (!/^\d+$/.test(phone)) {
      return "* 전화번호는 숫자만 입력해주세요.";
    }

    // 10~11자리인지
    if (phone.length < 10 || phone.length > 11) {
      return "* 전화번호는 10~11자리여야 합니다.";
    }

    return "";
  };

  // 이름, 닉네임 검증 함수
  const validateText = (text, label) => {
  if (/\s/.test(text)) {
    return "* 띄어쓰기 없이 작성해주세요";
  }
    const v = text.trim();

    if (v.length === 0) return `* ${label}을 입력해주세요`;

    // 한글만
    const koreanRegex = /^[가-힣]+$/;
    // 영어만
    const englishRegex = /^[A-Za-z]+$/;

    // 한글 이름
    if (koreanRegex.test(v)) {
      if (v.length > 25) return "* 한글은 최대 25자까지 입력 가능합니다";
      return "";
    }

    // 영어 이름
    if (englishRegex.test(v)) {
      if (v.length > 50) return "* 영어은 최대 50자까지 입력 가능합니다";
      return "";
    }

    return `* ${label}은 한글만 또는 영어만 입력 가능합니다 (혼합 불가)`;
  };

  // 회원가입 눌렀을때
  const onSubmitRegister = async (e) => {
    e.preventDefault();
    closeMobileKeyboard();
    // 유효성및 작성 검사
    const phoneErr = validatePhone(registerForm.user_phone);
    const nameErr = validateText(registerForm.user_name, "이름");
    const nickErr = validateText(registerForm.user_nickname, "닉네임");

    setPhoneError(phoneErr);
    setNameError(nameErr);
    setNickError(nickErr);

    // 하나라도 있으면
    if (phoneErr || nameErr || nickErr) {
      return;
    }

    try {
      const { data } = await api.post("/api/user/register", {...registerForm,address});

      if (data?.ok) {
        localStorage.setItem('userToken', data.userToken);  // 토큰저장
        // 메인으로 이동
        navigate("/",{ 
          replace: true,
          state: {
            showWelcome: true,
            from:'login'
          }
        });
      }
    } catch (err) {
      if (!err.response) {
        setRegError("* 서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요");
        return;
      }

      const { status, data } = err.response;

      // ✅ 409 중복 에러(동시에 출력)
      if (status === 409 && data?.code === "DUPLICATE") {
        // 서버에서 내려준 errors: { user_phone: "...", user_nickname: "..." }
        const serverErrors = data?.errors || {};

        setPhoneError(serverErrors.user_phone ? `* ${serverErrors.user_phone}` : "");
        setNickError(serverErrors.user_nickname ? `* ${serverErrors.user_nickname}` : "");
        return;
      }

      // 기타 중복(최종 방어선) - 백엔드가 message만 주는 경우 대비
      if (status === 409) {
        setRegError(data?.message ? `* ${data.message}` : "* 이미 사용 중인 값이 있습니다.");
        return;
      }

      setRegError("* 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
    }
  };
  if(!address) return null;
  return (
    <>
    <header className="authPageHeaderStyle">
      <h2>내 정보 입력하기</h2>
    </header>
    <main className="authPageMainStyle">
      <form className="authForm" onSubmit={onSubmitRegister}>
        <legend>회원가입폼</legend>

        <fieldset>
          {/* 이름 */}
          <div className="formTextWrapper">
            <label htmlFor="regUserName">이름</label>
            <input
              type="text"
              id="regUserName"
              name="user_name"
              value={registerForm.user_name}
              onChange={onChangeRegister}
              placeholder="이름을 입력해주세요"
              maxLength={50}
            />
            {nameError && <p className="errMassage">{nameError}</p>}
          </div>

          {/* 닉네임 */}
          <div className="formTextWrapper">
            <label htmlFor="regNickName">닉네임</label>
            <input
              type="text"
              id="regNickName"
              name="user_nickname"
              value={registerForm.user_nickname}
              onChange={onChangeRegister}
              placeholder="사용할 닉네임을 입력해주세요"
              maxLength={50}
            />
            {nickError && <p className="errMassage">{nickError}</p>}
          </div>

          {/* 전화번호 */}
          <div className="formTextWrapper">
            <label htmlFor="regUserPhone">전화번호</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              id="regUserPhone"
              name="user_phone"
              value={registerForm.user_phone}
              onChange={onChangeRegister}
              placeholder="'-'없이 번호만 입력해주세요"
            />
            {phoneError && <p className="errMassage">{phoneError}</p>}
          </div>

          {regError && (
            <p className="errMassage" style={{ textAlign: "center" }}>
              {regError}
            </p>
          )}

          <div className="formButtonWrapper">
            <Link to="/intro" title="처음으로 돌아가기" replace>
              처음으로
            </Link>
            <input type="submit" value="완료" />
          </div>
        </fieldset>
      </form>
    </main>
    </>
  );
}
