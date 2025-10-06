// protected.jsx
import { Navigate } from "react-router-dom";
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
// import { Profile } from "app/layouts/MainLayout/Profile";

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
           
             {
              path: "services/:categoryId",
      lazy: async () => ({
        Component: (await import("app/pages/dashboards/services/ServicesPage")).default,
        
      }),
            },
             {
              path: "products/:categoryId",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/products/ProductsPage")
                ).default,
              }),
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              index: true,
              element: <Navigate to="home" />,
            },
          ],
        },
      ],
    },
      // ✅ Dedicated Profile route
//   {
//   Component: AppLayout,
//   children: [
//     {
//       path: "profile",  // accessible at /profile
//       lazy: async () => ({
//         Component: (await import("app/layouts/MainLayout/Profile")).default,
//       }),
//     },
//   ],
// },


    // {
    //   Component: AppLayout,
    //   children: [
    //     {
    //       path: "layouts",
    //       lazy: async () => ({
    //         Component: (await import("app/layouts")).default,
    //       }),
    //       children: [
    //         {
    //           index: true,
    //           element: <Navigate to="/settings/profile" />,
    //         },
    //         {
    //   path: "MainLayout",
    //   lazy: async () => ({
    //     Component: (await import("app/layouts/MainLayout/Profile")).default,
    //   }),
    // },
    //         // {
    //         //   path: "general",
    //         //   lazy: async () => ({
    //         //     Component: (
    //         //       await import("app/pages/settings/sections/General")
    //         //     ).default,
    //         //   }),
    //         // },
    //         // {
    //         //   path: "appearance",
    //         //   lazy: async () => ({
    //         //     Component: (
    //         //       await import(
    //         //         "app/pages/settings/sections/Appearance"
    //         //       )
    //         //     ).default,
    //         //   }),
    //         // },
    //       ],
    //     },
    //   ],
    // },
     {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/General")
                ).default,
              }),
            },
            // {
            //   path: "appearance",
            //   lazy: async () => ({
            //     Component: (
            //       await import(
            //         "app/pages/settings/sections/Appearance"
            //       )
            //     ).default,
            //   }),
            // },
          ],
        },
      ],
    },
    {
  Component: AppLayout,
  children: [
    {
      path: "services",
        Component: (await import("app/pages/services/Layout")).default,

      children: [
        {
          path: "orders",
          lazy: async () => ({
            Component: (await import("app/pages/services/orders/ServiceOrders")).default,
          }),
        },
        {
          path: "list",
          lazy: async () => ({
            Component: (await import("app/pages/services/list/ServiceProviders")).default,
          }),
        },
      ],
    },
  ],
},
 // ✅ Products layout routes (NEW)
    {
      Component: AppLayout,
      children: [
        {
          path: "products",
          Component: (await import("app/pages/products/Layout")).default,
          children: [
            {
              path: "orders",
              lazy: async () => ({
                Component: (
                  await import("app/pages/products/orders/ProductOrders")
                ).default,
              }),
            },
            {
              path: "list",
              lazy: async () => ({
                Component: (
                  await import("app/pages/products/list/ProductVendorsList")
                ).default,
              }),
            },
          ],
        },
         // ✅ Add stock management routes (NEW)
        {
          path: "stock-management",
          lazy: async () => ({
            Component: (await import("app/pages/stock/Layout")).default,
          }),
          children: [
            {
              path: "stock",
              lazy: async () => ({
                Component: (await import("app/pages/stock/stock/StockManagement")).default,
              }),
            },
          
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
