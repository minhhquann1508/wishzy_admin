import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ConfigProvider, App } from "antd";
import "./index.css";
import { color } from "./constants/color.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          direction="ltr"
          theme={{
            token: {
              fontFamily: "Be Vietnam Pro, sans-serif",
              colorPrimary: color["main-orange"],
            },
            components: {
              Menu: {
                itemActiveBg: color.gray,
                itemSelectedBg: color.gray,
                itemSelectedColor: color["main-orange"],
                subMenuItemSelectedColor: color["main-orange"],
              },
              Button: {
                defaultHoverBorderColor: color["main-orange"],
                defaultHoverColor: color["main-orange"],
              },
            },
          }}
        >
          <App>
            <RouterProvider router={router} />
          </App>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
