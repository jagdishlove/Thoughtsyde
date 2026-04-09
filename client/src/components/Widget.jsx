import { useState, useEffect, useRef } from "react";
import supabase from "../supabaseClient";

export const Widget = ({ projectId }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const widgetRef = useRef(null);

  const storageKey = `feedback_submitted_${projectId || "default"}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setAlreadySubmitted(true);
    }
  }, [storageKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && isOpen) {
        const path = event.composedPath();
        const isInsideWidget = path.some((element) => widgetRef.current.contains(element));
        if (!isInsideWidget) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  const checkExistingSubmission = async (email) => {
    try {
      const { data, error, count } = await supabase
        .from("feedbacks")
        .select("id", { count: "exact" })
        .eq("user_email", email)
        .eq("project_id", projectId)
        .limit(1);

      if (error) {
        console.error("Supabase query error:", error);
        return false;
      }

      return (count || 0) > 0;
    } catch (err) {
      console.error("Check failed:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (alreadySubmitted) {
      return;
    }

    setIsLoading(true);
    const form = e.target;
    const email = form.email.value;

    const alreadyExists = await checkExistingSubmission(email);
    
    if (alreadyExists) {
      localStorage.setItem(storageKey, "true");
      setAlreadySubmitted(true);
      setIsLoading(false);
      return;
    }

    const data = {
      p_project_id: projectId,
      p_user_name: form.name.value,
      p_user_email: email,
      p_message: form.feedback.value,
      p_rating: rating,
    };

    const { error } = await supabase.rpc("add_feedback", data);
    
    setIsLoading(false);

    if (error) {
      console.error("Submit error:", error);
      return;
    }

    localStorage.setItem(storageKey, "true");
    setSubmitted(true);
  };

  return (
    <div ref={widgetRef}>
      <button className="widget-btn" onClick={() => setIsOpen(!isOpen)}>
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
        Feedback
      </button>

      {isOpen && (
        <div className="widget-popover">
          {submitted ? (
            <div className="thank-you">
              <h3>Thank you for your feedback!</h3>
              <p>We appreciate your feedback. It helps us improve our product and provide better service to our customers.</p>
            </div>
          ) : alreadySubmitted ? (
            <div className="thank-you">
              <h3>Feedback Already Submitted</h3>
              <p>You have already submitted feedback for this project. Thank you!</p>
            </div>
          ) : (
            <form className="widget-form" onSubmit={handleSubmit}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", textAlign: "center" }}> We'd love your feedback!</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input className="form-input" id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input className="form-input" id="email" name="email" type="email" placeholder="Your email" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedback">Feedback</label>
                <textarea className="form-textarea" id="feedback" name="feedback" placeholder="Tell us what you think..." required />
              </div>

              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`star ${rating > index ? "star-filled" : "star-empty"}`}
                    onClick={() => onSelectStar(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Checking..." : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
