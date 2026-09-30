"use client";

const WHATSAPP_NUMBER = "919961109630";
const DEFAULT_MESSAGE =
  "Hi Woosh Support, I would like to know more about your laundry services.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DEFAULT_MESSAGE,
  )}`;

  return (
    // Fixed wrapper with explicit dimensions
    <div className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center">
      {/* Smoother, slower ripple effect (3 seconds instead of 1) */}
      <div className="absolute inset-0 animate-[ping_3s_ease-in-out_infinite] rounded-full bg-[#25D366] opacity-40"></div>

      {/* Main Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Woosh support on WhatsApp"
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-lg
          transition-all
          duration-500
          ease-out
          hover:-translate-y-1
          hover:scale-110
          hover:shadow-[0_10px_20px_rgba(37,211,102,0.4)]
          focus:outline-none
          focus:ring-4
          focus:ring-[#25D366]/30
        "
      >
        {/* Official WhatsApp SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8"
        >
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.55 4.183 1.597 6.002L.038 24l6.147-1.613a11.968 11.968 0 005.846 1.512h.005c6.642 0 12.029-5.385 12.032-12.032A12 12 0 0012.031 0zm0 21.967h-.004a9.927 9.927 0 01-5.068-1.385l-.364-.216-3.766.987 1.004-3.673-.237-.377a9.932 9.932 0 01-1.52-5.333c.001-5.485 4.464-9.948 9.957-9.948 2.658 0 5.155 1.037 7.034 2.917a9.907 9.907 0 012.912 7.042c-.004 5.486-4.467 9.986-9.953 9.986zm5.457-7.45c-.299-.15-1.77-.874-2.043-.974-.274-.1-.473-.15-.673.15-.2.3-.77.974-.943 1.174-.173.2-.347.225-.647.075-.3-.15-1.264-.466-2.406-1.485-.888-.79-1.489-1.767-1.663-2.067-.174-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.673-1.623-.922-2.223-.243-.584-.49-.505-.673-.514a12.92 12.92 0 00-.573-.01c-.2 0-.525.075-.798.375-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.894 1.221 3.094.15.2 2.11 3.22 5.11 4.516.715.309 1.272.493 1.706.63.716.228 1.368.196 1.884.119.576-.086 1.77-.723 2.02-1.423.25-.7.25-1.298.175-1.423-.075-.125-.274-.2-.573-.35z" />
        </svg>

        <span className="sr-only">Chat with Woosh support on WhatsApp</span>
      </a>
    </div>
  );
}
