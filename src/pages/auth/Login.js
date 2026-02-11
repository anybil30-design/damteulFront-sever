import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './css/auth.css';
import {closeMobileKeyboard} from "components/closeMobileKeyboard/closeMobileKeyboard";
// axios
import api from "app/api/axios";

export default function Login() {

  // navigate
  const navigate = useNavigate();

  // 에러 발생시 나오게할 상태값 (phone, name, nick)
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  // 연결 실패 에러 상태값
  const [regError, setRegError] = useState("");

  // 로그인 폼 상택값
  const [loginForm, setLoginForm] = useState({
    user_name: '',
    user_phone: '',
  });

  // input value값 업데이트
  const onChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value
    }));
    // 폼입력시 해동 폼 에러 삭제
    if (name === "user_phone") setPhoneError("");
    if (name === "user_name") setNameError("");
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
  const validateText = (text) => {
    if (/\s/.test(text)) {
      return "* 띄어쓰기 없이 작성해주세요";
    }
    const v = text.trim();

    if (v.length === 0) return `* 이름을 입력해주세요`;

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

    return `* 이름은 한글만 또는 영어만 입력 가능합니다 (혼합 불가)`;
  };

  // 로그인 눌렀을때
  const onSubmitLogin = async (e) => {
    e.preventDefault();
    closeMobileKeyboard();
    // 유효성및 작성 검사
    const phoneErr = validatePhone(loginForm.user_phone);
    const nameErr = validateText(loginForm.user_name);

    setPhoneError(phoneErr);
    setNameError(nameErr);

    // 하나라도 있으면
    if (phoneErr || nameErr) {
      return;
    }
    
    try {
      const { data } = await api.post("/api/user/login", loginForm);
      
      if (data?.ok) {
        localStorage.setItem('userToken', data.userToken);  //토큰 저장
        navigate("/",{
          replace:true,
          state: {
            showWelcome: true,
            from:'login'
          }
        });
      }
    } catch(err){
      if (!err.response) {
        setRegError("* 서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요");
        return;
      }
      const { status, data } = err.response;

      // 409 중복 에러(동시에 출력)
      if (status === 401 && data?.code === "DUPLICATE") {
        setRegError(`*${data.message}`)
      }

      // 기타 중복(최종 방어선) - 백엔드가 message만 주는 겨웅 대비
      if (status === 401) {
        setRegError(data?.message ? `*${data.message}` : "*해당 회원 정보가 조회되지 않습니다. 다시 시도해주세요.");
        return;
      }
      setRegError("* 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
    }
  }
  return (
    <>
    <header className="authPageHeaderStyle">
      <h2>로그인</h2>
    </header>
    <main className="authPageMainStyle">
      {/* 로그인 입력란 */}
      <form className="authForm" onSubmit={onSubmitLogin}>
        <legend>로그인폼</legend>
        <fieldset>
          {/* 이름 */}
          <div className="formTextWrapper">
            <label htmlFor="loginUserName">이름</label>
            <input
            type='text'
            id='loginUserName'
            name='user_name' 
            value={loginForm.user_name} 
            onChange={onChangeLogin} 
            placeholder="이름을 입력해주세요"
            maxLength={50}
            />
            {nameError && <p className="errMassage">{nameError}</p>}
          </div>

          {/* 전화번호 */}
          <div className="formTextWrapper">
            <label htmlFor="loginUserPhone">전화번호</label>
            <input
              type='tel'
              inputMode="numeric"
              maxLength={11}
              id='loginUserPhone'
              name='user_phone'
              value={loginForm.user_phone}
              onChange={onChangeLogin}
              placeholder="'-'없이 번호만 입력해주세요" />
              {phoneError && <p className="errMassage">{phoneError}</p>}
              {regError && (
                <p className="errMassage" style={{ textAlign: "center" }}>
                {regError}
              </p>
              )}
          </div>

          <div className="formButtonWrapper">
            <Link to='/intro' title='처음으로 돌아가기'>
              처음으로
            </Link>
            <input type="submit" value="완료" />
          </div>
        </fieldset>
      </form>
    </main>
    </>
  );
};