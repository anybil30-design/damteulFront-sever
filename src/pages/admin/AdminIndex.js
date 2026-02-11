import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from 'components/admin/AdminSidebar';

import 'components/admin/styles/AdminIndex.css';

const AdminIndex = () => {
  return (
    <div className='adminIndex'>
      <div className="adminSidebar">
        <AdminSidebar />
      </div>

      <div className="adminPage">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminIndex;
