// src/app/pages/stock/Layout.jsx

import { Outlet } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "app/layouts/MainLayout/Sidebar";

export default function StockLayout() {
  return (
    <Page title="Stock Management">
      <Header />
      <main className="main-content">
        {/* All child stock pages will render here */}
        <Outlet />
      </main>
      <Sidebar />
    </Page>
  );
}