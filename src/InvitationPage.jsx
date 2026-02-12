import './InvitationPage.css';
import { useRef, useEffect, useState } from 'react';

export default function InvitationPage({ guestName }) {
  const cardRef = useRef();
  const flowersRef = useRef();
  const [morph, setMorph] = useState(false);

  useEffect(() => {
  let observer;

  const attachObserver = () => {
    const nextPage = document.querySelector('.wedding-details-page');

    if (!nextPage || !flowersRef.current || !cardRef.current) {
      requestAnimationFrame(attachObserver); // wait until DOM is ready
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          flowersRef.current.classList.add('fade-out');
          setMorph(true);
        } else {
          flowersRef.current.classList.remove('fade-out');
          setMorph(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(nextPage);
  };

  attachObserver();

  return () => observer?.disconnect();
}, []);

  return (
    <div className="invitation-page">
      <div
        className={`glass-card ${morph ? 'morph-to-details' : ''}`}
        ref={cardRef}
      >
        <h2 className="guest-name">{guestName}</h2>

        <p className="invitation-text">
          <span className="line line1">WEDDING INVITATION</span>
          <span className="line line2">OF</span>
          <span className="line line3">ISHINI & BUWANEKA</span>
        </p>
      </div>

      <div className="flowers-container" ref={flowersRef}>
        <img src="/flower1.png" className="flower flower1" alt="flower" />
        <img src="/flower1.png" className="flower flower2" alt="flower" />
      </div>
    </div>
  );
}