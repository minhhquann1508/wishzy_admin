import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ConfigProvider } from "antd";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Be Vietnam Pro, sans-serif",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
