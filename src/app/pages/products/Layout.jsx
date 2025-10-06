// src/app/pages/products/Layout.jsx

import { Outlet } from "react-router";
import { Page } from "components/shared/Page";
import { Header } from "app/layouts/MainLayout/Header";
import { Sidebar } from "app/layouts/MainLayout/Sidebar";

export default function ProductsLayout() {
  return (
    <Page title="Products">
      <Header />
      <main className="main-content">
        {/* All child product pages (list, orders) will render here */}
        <Outlet />
      </main>
      <Sidebar />
    </Page>
  );
}
