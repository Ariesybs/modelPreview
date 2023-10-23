import Head from 'next/head';
import Link from 'next/link'
import '../public/home.css';
const HomePage = () => {

  const handleAccountBind = () => {
    window.location.href = '/accountBind'
  };

  const handleAccountUnbind = () => {
    window.location.href = '/accountUnBind'
  };
  const handleNFCManager = ()=>{
    window.location.href = '/NFCManager'
  }
  return (
    <>
      <Head>
      <meta charSet="UTF-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    <title>铅笔视界</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"></link>
    <link rel="icon" href="/img/pen_logo.png"></link>
    
      </Head>
      <div className="header">
        <h1 className="animate__animated animate__fadeInLeft" >铅笔视界</h1>
        <p className="animate__animated animate__fadeInRight">Build Your Oasis World With VR&AR</p>
    </div>

    <div className="button-container">
        <button onClick={handleAccountBind} >
          账户绑定
        </button>
        <button onClick={handleAccountUnbind}>
          账户解绑
        </button>
        <button onClick={handleNFCManager}>
          NFC管理
        </button>
      </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>

    </>
  );
};

export default HomePage;
