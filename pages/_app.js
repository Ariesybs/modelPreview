import '../globals.css';

function MyApp({ Component, pageProps }) {
  // 这里可以添加全局逻辑，例如数据获取、全局状态等

  return <Component {...pageProps} />;
}

export default MyApp;
