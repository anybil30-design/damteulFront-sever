import React from 'react';
import { Outlet } from 'react-router-dom';

import LogoHeader from '../components/header/LogoHeader'
import HaveNavi from '../components/nav/HaveNavi'

const TabsLogoLayout = () => {
  return (
    <div className='bodyParent'>
      <div className='bodyChild'>
      {/* 로고 헤더가 있는 */}
      <LogoHeader />

        <Outlet />

      {/* 푸터가 있는 */}
      <HaveNavi />
      </div>
    </div>
  );
};

export default TabsLogoLayout;