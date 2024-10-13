export const loadMidtransScript = () => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    scriptTag.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    document.body.appendChild(scriptTag);
  
    return () => {
      document.body.removeChild(scriptTag);
    };
  };
  