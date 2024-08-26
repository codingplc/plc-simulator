import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle: any;
  }
}

const AdSense = () => {
  useEffect(() => {
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.style.width = '100%';
    adElement.dataset.adClient = 'ca-pub-6745225928334897';
    adElement.dataset.adSlot = '6535090660';

    document.body.appendChild(adElement);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }

    // Cleanup function
    return () => {
      document.body.removeChild(adElement);
    };
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', height: '95%' }}
      data-ad-client="ca-pub-6745225928334897"
      data-ad-slot="6535090660"
      key={`ad-${Date.now()}`} // Example of using a key to force re-creation
    ></ins>
  );
};

export default AdSense;
