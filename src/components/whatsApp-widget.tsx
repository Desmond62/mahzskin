import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
// import { BsEmojiSmile } from "react-icons/bs";
import  {  useRef } from "react";

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

//  Loading state for emoji picker
  const [loadingEmoji, setLoadingEmoji] = useState<boolean>(false);

//   Focus input on mount
   const inputRef = useRef<HTMLInputElement>(null);

 

  const phoneNumber = "2347077723208"; // your real WhatsApp number

// Toggle emoji picker visibility with loading state
  const handleToggleEmoji = () => {
  setLoadingEmoji(true);
  setTimeout(() => {
    setShowEmojiPicker((prev) => !prev);
    setLoadingEmoji(false);
  }, 600); // simulate loading for 600ms
};
    // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setShowEmojiPicker(false); // close emoji picker if chat is closed
  };

  const handleSend = () => {
    // Only send if message has content (not just whitespace)
    if (!message.trim()) {
      return;
    }
    
    const encodedMessage = encodeURIComponent(message.trim());
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
    
    // Clear the message after sending
    setMessage("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

    const handleWhatsAppClick = () => {
    inputRef.current?.focus(); // focus the input when icon is clicked
  };

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer  text-white ${isOpen? " bg-[#a886cd] " : " bg-[#3D4492]"} text-2xl shadow-lg hover:scale-105 transition`}
          aria-label="Toggle WhatsApp Chat"
        >
          {isOpen ? <IoMdClose className="cursor-pointer"/> : <FaWhatsapp className="cursor-pointer"  onClick={handleWhatsAppClick}/>}
        </button>
      </div>

      {/* Chat Box */}
      <div
        className={`fixed bottom-20 right-6 w-80 bg-[#f4f1ea] rounded-xl shadow-2xl overflow-hidden z-40 transition-all duration-300 pb-6 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-[#4aa485] text-white p-3 flex justify-between items-center shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#1faf38"/><stop offset="100%" stopColor="#60d669"/></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#f9f9f9"/><stop offset="100%" stopColor="#fff"/></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/></svg>
          <button onClick={toggleChat} aria-label="Close Chat">
            <IoMdClose className="text-xl" />
          </button>
        </div>

        <div className="bg-[url('https://web.whatsapp.com/img/bg-chat-tile_c68f84b1b9dba0c62b3c91abeb2f0f58.png')] p-4 h-60 text-sm overflow-y-auto">
          <div className="bg-[ghostwhite] rounded-lg p-2 shadow-2xl mb-2 max-w-[75%] ">
            <p>How can I help you? 🙂</p>
            <span className="text-gray-400 text-xs mt-1 block text-right">10:38</span>
          </div>
        </div>

       {/* Emoji Picker with Skeleton Loading */}
        {(loadingEmoji || showEmojiPicker) && (
        <div className="absolute bottom-24 right-6 z-50">
          {loadingEmoji ? (
         <div className="w-80 h-80 bg-gray-200 animate-pulse rounded-lg shadow-lg"></div>
          ) : (
         <EmojiPicker onEmojiClick={handleEmojiClick} />
         )}
        </div>
        )}

        {/* Input Area */}
        <div className="flex items-center px-1 py-2 mx-4 bg-[ghostwhite] relative rounded-[3rem] shadow-2xl">
          <button
          onClick={handleToggleEmoji}            
           className="text-xl text-gray-500 mr-2"
            aria-label="Toggle Emoji Picker"
            
          >
            {/* <BsEmojiSmile className="cursor-pointer" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m3.5 6A1.5 1.5 0 0 1 17 9.5a1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 14 9.5A1.5 1.5 0 0 1 15.5 8m-7 0A1.5 1.5 0 0 1 10 9.5A1.5 1.5 0 0 1 8.5 11A1.5 1.5 0 0 1 7 9.5A1.5 1.5 0 0 1 8.5 8m3.5 9.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.81 2.04-2.78 3.5-5.11 3.5"/></svg>
          </button>

          <input
            type="text"
            value={message}
            ref={inputRef}
            onChange={handleChange}
            placeholder="Write your message..."
            className="grow bg-transparent outline-none text-sm"
            
          />

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`font-bold ml-2 text-xl p-2 rounded-full transition-colors cursor-pointer ${
              message.trim() 
                ? "bg-[#00d084] text-white hover:bg-[#00b37a]" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Send Message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="m4.497 20.835l16.51-7.363c1.324-.59 1.324-2.354 0-2.944L4.497 3.164c-1.495-.667-3.047.814-2.306 2.202l3.152 5.904c.245.459.245 1 0 1.458l-3.152 5.904c-.74 1.388.81 2.87 2.306 2.202"/></svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default WhatsAppWidget;
