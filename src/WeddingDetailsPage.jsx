import './WeddingDetailsPage.css';
import { useEffect, useRef, useState } from 'react';

export default function WeddingDetailsPage() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wedding-details-page ${visible ? 'animate' : ''}`}
    >
      <div className="glass-card">
        <img src="/flower-small.png" alt="flower" className="top-flower" />
        <p className="date">4th June 2026</p>
        <div className="dark-glass-card">
          <p className="wedding-title">
            <span className="title-one">THE WEDDING OF </span><br />
            <span className="title-two">ISHINI & BUWANEKA</span>
          </p>
        </div>
        <p className="venue">
          At Samudra Ballroom <br />
          Taj Samudra <br />
          Colombo 07
        </p>
        <hr className="divider-one" />
        <p className="invitation-text">
          Invite you to share in the joy of our<br />marriage on<br />
          Thursday, June 4th, 2026
        </p>
        <hr className="divider-two" />
      </div>
    </div>
  );
}