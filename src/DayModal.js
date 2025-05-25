import React, { useState, useEffect, useRef } from "react";
import emailjs from 'emailjs-com';
import "./DayModal.css";

function DayModal({ date, content, onClose }) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (date === "2025-05-25" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [date]);

  useEffect(() => {
    if (date) {
      const saved = localStorage.getItem(`comment-${date}`);
      setComment(saved || "");
      setSent(false); // Reset sent state on new day
    }
  }, [date]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    localStorage.setItem(`comment-${date}`, e.target.value);
  };

  const handleSend = () => {
    if (!comment.trim()) return;
    setSending(true);
    emailjs.send(
      'service_f69boyh',    // Replace with your EmailJS Service ID
      'template_vncp1yt',   // Replace with your EmailJS Template ID
      {
        date,
        comment,
        dayTitle: content.title || `Surprise for ${date}`,
      },
      'L5_gvKb1_pNR5lliD'        // Replace with your EmailJS User ID (public key)
    ).then((result) => {
      setSending(false);
      setSent(true);
    }, (error) => {
      setSending(false);
      alert("Failed to send. Please try again.");
    });
  };

  if (!date || !content) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{content.title || `Surprise for ${date}`}</h2>
        {/* Render paragraphs with spacing */}
        {content.text &&
          content.text.split('\n\n').map((para, idx) => (
            <p key={idx} style={{ marginBottom: "1.2em", whiteSpace: "pre-line" }}>
              {para}
            </p>
          ))
        }
        {content.image && (
          <img
            src={content.image}
            alt=""
            style={{ maxWidth: "100%", borderRadius: "12px", margin: "16px 0" }}
          />
        )}
        {content.playlist && (
          <iframe
            src={content.playlist}
            width="320"
            height="80"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title="Spotify Playlist"
            style={{ borderRadius: 12, margin: "12px 0" }}
          ></iframe>
        )}
        <textarea
          placeholder="Leave a comment for Javi"
          value={comment}
          onChange={handleCommentChange}
          style={{
            width: "100%",
            minHeight: "60px",
            marginTop: "12px",
            boxSizing: "border-box"
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || sent || !comment.trim()}
          style={{
            width: "100%",
            marginTop: "10px",
            background: sent ? "#b6ffb6" : "#ffb7c5",
            color: "#2d1e2f",
            border: "none",
            borderRadius: "8px",
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: sending || sent || !comment.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {sent ? "Sent!" : sending ? "Sending..." : "Send"}
        </button>
        {date === "2025-05-25" && (
          <audio
            ref={audioRef}
            src={process.env.PUBLIC_URL + '/audio/twin-peaks-intro.mp3'}
            autoPlay
            preload="auto"
          />
        )}
      </div>
    </div>
  );
}

export default DayModal;
