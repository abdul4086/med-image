import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout.tsx';
import HomePage from './pages/HomePage.tsx';

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
