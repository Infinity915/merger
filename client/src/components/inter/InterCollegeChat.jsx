import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const API_BASE = "/api/messages";
const WS_URL = "http://localhost:8080/ws-studcollab";

function useConversations(userId) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_BASE}/conversations/${userId}`).then(res => setConversations(res.data));
  }, [userId]);
  return [conversations, setConversations];
}

function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (!conversationId) return;
    axios.get(`${API_BASE}/conversation/${conversationId}/messages`).then(res => setMessages(res.data));
  }, [conversationId]);
  return [messages, setMessages];
}

export default function InterCollegeChat({ userId }) {
  const [conversations] = useConversations(userId);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useMessages(selected?.id);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    const sock = new SockJS(WS_URL);
    const stomp = over(sock);
    stomp.connect({}, () => {
      setStompClient(stomp);
    });
    return () => stomp.disconnect();
  }, []);

  // Subscribe to selected conversation
  useEffect(() => {
    if (!stompClient || !selected) return;
    const sub = stompClient.subscribe(
      `/topic/conversation.${selected.id}`,
      msg => {
        const message = JSON.parse(msg.body);
        setMessages(prev => [...prev, message]);
      }
    );
    return () => sub.unsubscribe();
  }, [stompClient, selected, setMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const msg = {
      conversationId: selected.id,
      senderId: userId,
      text: input,
      attachmentUrls: attachments,
    };
    if (stompClient) {
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
    }
    setInput("");
    setAttachments([]);
  };

  // Handle file upload (mock, replace with real upload logic)
  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    // TODO: Upload files to server and get URLs
    // For now, just use file names as mock URLs
    setAttachments(files.map(f => f.name));
  };

  // Render
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/3 bg-glass p-4 flex flex-col">
        <div className="font-bold text-cyan-300 text-lg mb-2">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const other = conv.participantIds.find(id => id !== userId);
            // TODO: Fetch user profile for 'other' (name, college, avatar)
            const lastMsg = conv.lastMessage || "";
            const unread = conv.unreadCount || 0;
            return (
              <div
                key={conv.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer ${selected?.id === conv.id ? "bg-cyan-900/40" : "hover:bg-cyan-900/20"}`}
                onClick={() => setSelected(conv)}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {other?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-100">{other || "User"}</div>
                    <div className="text-xs text-cyan-300">College Name</div>
                  </div>
                  {unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unread}</span>
                  )}
                </div>
                <div className="text-xs text-cyan-200 mt-1 truncate">{lastMsg}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 bg-glass-strong p-6 flex flex-col">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {selected.participantIds.find(id => id !== userId)?.[0] || "?"}
                </div>
                <div>
                  <div className="font-semibold text-cyan-100">{selected.participantIds.find(id => id !== userId) || "User"}</div>
                  <div className="text-xs text-cyan-300">Active now</div>
                </div>
              </div>
              <button className="bg-red-700 text-white px-3 py-1 rounded-lg">Report</button>
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-lg ${msg.senderId === userId ? "bg-cyan-400 text-black" : "bg-cyan-900 text-cyan-100"}`}
                  >
                    {msg.text}
                    {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {msg.attachmentUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline text-xs text-cyan-200">Attachment {i + 1}</a>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-cyan-200 mt-1 text-right">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="bg-cyan-800 text-cyan-100 px-3 py-1 rounded-lg cursor-pointer">Attach</label>
              <input
                className="flex-1 px-3 py-2 rounded-lg bg-cyan-950 text-cyan-100 border-none outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-cyan-200">
            <div className="text-5xl mb-4">💬</div>
            <div className="font-bold text-xl mb-2">Select a chat to start messaging</div>
            <div className="text-cyan-400">Choose a conversation from the left to view messages</div>
          </div>
        )}
      </div>
    </div>
  );
}
