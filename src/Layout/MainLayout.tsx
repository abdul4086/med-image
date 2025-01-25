import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.tsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex-1 dark:bg-black">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
