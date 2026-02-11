import React from 'react';
import { Link } from 'react-router-dom';
import './css/intro.css';

const FirstPage = () => {
  return (
    <>
      <main className='firstPageWrap'>
        <div className='firstPage'>
        {/* 로고 */}
          <h1><img src={`${process.env.PUBLIC_URL}/images/logo1.png`} alt='메인로고' /></h1>
          <div className='firstPageTxt'>
            <h2>동네 이웃들이 잠깐 머무는 공간</h2>
            <p>당신의 일상이 꽃피는 곳,</p>
            <p>담뜰에서 이웃과 함께 이야기 마당을 가꿔보세요</p>
          </div>
        </div>
        <div className='firstPageBtn'>
          <Link to='/login' title='시작하기'>시작하기</Link>
          <Link to='/address' title='가입하기'>가입하기</Link>
        </div>
      </main>
    </>
  );
};

export default FirstPage;