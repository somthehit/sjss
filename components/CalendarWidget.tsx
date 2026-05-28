"use client";
import { useState, useRef, useEffect } from "react";

export default function CalendarWidget() {
  const [show, setShow] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (show && iframeRef.current) {
      iframeRef.current.setAttribute("allowtransparency", "true");
    }
  }, [show]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setShow(!show)}
        className="px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
        style={{ background: '#1a3a2a', color: '#c9a227', border: '1px solid #c9a227' }}
      >
        {show ? "Hide Nepali Calendar" : "📅 Nepali Calendar"}
      </button>
      {show && (
        <div className="mt-4">
          <iframe
            ref={iframeRef}
            src="https://www.ashesh.com.np/calendar-widget/calendar.php?tithi=1&header_color=default&api=872156q120"
            frameBorder="0"
            scrolling="no"
            marginWidth={0}
            marginHeight={0}
            style={{ border: "none", overflow: "hidden", width: 370, height: 333, borderRadius: 5 }}
          />
        </div>
      )}
    </div>
  );
}
