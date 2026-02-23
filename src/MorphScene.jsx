import { useRef, useEffect, useState } from 'react';
import './MorphScene.css';

export default function MorphScene() {

    const [stage, setStage] = useState(1);

    const [guestName, setGuestName] = useState("");
    const [attendance, setAttendance] = useState("");
    const [guestCount, setGuestCount] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [maxGuests, setMaxGuests] = useState(0);

    const [guestData, setGuestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [invalid, setInvalid] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzS06dsX7jCJSkfHZcdXkmLMJIYF0_iDbI5uoPFq2GMIhIzbWjuQEmpsPnVpiMGl6ya/exec";

    const DEADLINE = new Date("2026-05-22T23:59:59");
    const isExpired = new Date() > DEADLINE;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDeadline = DEADLINE.toLocaleDateString('en-US', options);

    const [showGuestName, setShowGuestName] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (!id) {
            setInvalid(true);
            setLoading(false);
            return;
        }

        fetch(`https://script.google.com/macros/s/AKfycbzS06dsX7jCJSkfHZcdXkmLMJIYF0_iDbI5uoPFq2GMIhIzbWjuQEmpsPnVpiMGl6ya/exec?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setInvalid(true);
                } else {
                    setGuestName(data.guest);
                    setMaxGuests(data.maxGuests);

                    setShowGuestName(true);

                    if (data.attendance) {
                        setAlreadySubmitted(true);
                        setSubmitted(true);
                        setAttendance(data.attendance);
                        setGuestCount(data.guestCount ? String(data.guestCount) : "");
                    } else {
                        setAttendance("");
                        setGuestCount("");
                    }
                    setMessage(data.message || "");
                }
                setLoading(false);
            })
            .catch(() => {
                setInvalid(true);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const nextStage = Number(entry.target.dataset.stage);
                    if (!nextStage) return;

                    // Block progression until name is visible
                    if (!guestName && nextStage > 1) return;

                    setStage(nextStage);
                });
            },
            {
                threshold: window.innerWidth < 768 ? 0.2 : 0.5
            }
        );

        document.querySelectorAll('.scroll-trigger')
            .forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [guestName]);


    const handleRSVPSubmit = async (e) => {
        e.preventDefault();
        if (alreadySubmitted) return;

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        const formData = new URLSearchParams();
        formData.append("id", id);
        formData.append("attendance", attendance);
        formData.append("guestCount", guestCount);
        formData.append("message", message);

        await fetch("https://script.google.com/macros/s/AKfycbzS06dsX7jCJSkfHZcdXkmLMJIYF0_iDbI5uoPFq2GMIhIzbWjuQEmpsPnVpiMGl6ya/exec", {
            method: "POST",
            body: formData
        });

        setSubmitted(true);
    };


    return (
        <div className="morph-wrapper">

            {/* STICKY SCENE */}
            <div className="sticky-stage">

                {/* STAGE 1: FLOWERS  */}

                <div className={`flowers-container ${stage > 1 ? 'fade-out' : ''}`}>
                    <img src="/flower1.png" className="flower flower1" alt="flower" />
                    <img src="/flower1.png" className="flower flower2" alt="flower" />
                </div>


                {/* SINGLE MORPH CARD */}
                <div className={`glass-card morph stage-${stage}`}>

                    {stage === 1 && (
                        <div className="invitation" >
                            <h2 className={`guest-name ${guestName ? "visible" : ""}`}>
                                {guestName}
                            </h2>

                            <p className={`invitation-text ${guestName ? "visible" : ""}`}>
                                <span className="line line1">WEDDING INVITATION</span>
                                <span className="line line2">OF</span>
                                <span className="line line3">ISHINI & BUWANEKA</span>
                            </p>

                        </div>
                    )}

                    {stage === 2 && (
                        <div className="details-content animate">
                            <img src="/flower-small.png" className="top-flower" alt="flower" />

                            <div className="dark-glass-card">
                                <p className="wedding-title">
                                    <span className="title-one">THE WEDDING OF</span><br />
                                    <span className="title-two">ISHINI & BUWANEKA</span>
                                </p>
                            </div>

                            <p className="venue">
                                At Samudra Ballroom <br />
                                Taj Samudra <br />
                                Colombo 03
                            </p>

                            <p className="time">Poruwa Ceremony at 09.07 AM</p>

                            <hr className="divider-one" />

                            <p className="inviting-text">
                                Invite you to share in the joy of our<br />
                                marriage on<br />
                                Thursday, June 4th, 2026
                            </p>

                            <hr className="divider-two" />

                        </div>
                    )}

                    {stage === 3 && (
                        (!submitted && !alreadySubmitted) ? (
                            <form className="details-content animate" onSubmit={handleRSVPSubmit}>
                                <h2 className="rsvp-title">RSVP</h2>

                                <p className="rsvp-guest">
                                    Dear {guestName},
                                </p>

                                <p className="attendance-question">Will you attend?</p>

                                <div className="attendance-options">
                                    <button
                                        type="button"
                                        className={attendance === "yes" ? "selected" : ""}
                                        onClick={() => {
                                            setAttendance("yes");
                                            setGuestCount("");
                                        }}
                                        disabled={isExpired}
                                    >
                                        Yes, gladly
                                    </button>

                                    <button
                                        type="button"
                                        className={attendance === "no" ? "selected" : ""}
                                        onClick={() => {
                                            setAttendance("no");
                                            setGuestCount("");
                                        }}
                                        disabled={isExpired}
                                    >
                                        Regretfully No
                                    </button>
                                </div>

                                <div className={`rsvp-field guest-count-container ${attendance === "yes" ? "show" : ""}`}>
                                    <label>Number of guests</label>
                                    <select
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        disabled={attendance !== "yes" || isExpired}
                                    >
                                        <option value="" disabled>Select number of guests</option>
                                        {[...Array(maxGuests)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="rsvp-field message-field">
                                    <label>Message (optional)</label>
                                    <textarea
                                        placeholder="Your wishes..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={isExpired}
                                    />
                                </div>

                                <div className="rsvp-note-container">
                                    <p className={`rsvp-note ${attendance === "yes" ? "show" : ""}`}>
                                        The joy of celebrating with you is all we wish for! <br />
                                        If you would like to give a gift, we kindly ask for monetary contributions only, <br />
                                        as physical gifts are not necessary.
                                    </p>
                                </div>


                                <button
                                    type="submit"
                                    className="rsvp-submit"
                                    disabled={!attendance || (attendance === "yes" && !guestCount) || isExpired}
                                >
                                    {isExpired ? " RSVP Closed" : "Submit"}
                                </button>
                            </form>
                        ) : (
                            <div className="details-content animate rsvp-confirmation">
                                <div className="rsvp-divider"></div>
                                <h2 className="rsvp-confirmation-title">Thank You!</h2>
                                <p className="rsvp-confirmation-text">
                                    Dear {guestName},<br />
                                    Your response has been received.
                                </p>
                                <div className="rsvp-divider"></div>
                            </div>
                        )
                    )}

                    {stage === 4 && (
                        <div className="details-content animate contact-stage">

                            <div className="contact-wrapper">

                                {/* LEFT — Contact details */}
                                <div className="contact-left">
                                    <h2 className="contact-title">Contact Us</h2>

                                    <div className="contact-item">
                                        <span className="contact-label">Bride - Ishini</span>
                                        <span className="contact-number">+94 70 245 0204</span>
                                    </div>

                                    <div className="contact-item">
                                        <span className="contact-label">Groom - Buwaneka</span>
                                        <span className="contact-number">+94 77 260 1316</span>
                                    </div>
                                </div>

                                {/* RIGHT — Flower + dividers + RSVP text */}
                                <div className="contact-right">

                                    {/* Flower */}
                                    <img
                                        src="/f3.png"
                                        alt="Decorative Flower"
                                        className="contact-flower small"
                                    />

                                    {/* Top divider */}
                                    <div className="flower-divider1"></div>

                                    {/* RSVP text */}
                                    <p className="rsvp-text">
                                        RSVP by, <br /> {formattedDeadline}
                                    </p>

                                    {/* Bottom divider */}
                                    <div className="flower-divider2"></div>

                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* SCROLL TRIGGERS */}
            <div className="scroll-trigger" data-stage="1"></div>
            <div className="scroll-trigger" data-stage="2"></div>
            <div className="scroll-trigger" data-stage="3"></div>
            <div className="scroll-trigger" data-stage="4"></div>

        </div>
    );
}