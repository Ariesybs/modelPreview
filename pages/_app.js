// import "../globals.css";
import "../public/base.css";
import { ThemeProvider } from "next-themes";
function MyApp({ Component, pageProps }) {
  // 这里可以添加全局逻辑，例如数据获取、全局状态等

  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
