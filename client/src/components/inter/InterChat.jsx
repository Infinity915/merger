import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";

const API_BASE = "/api/messages";
const WS_URL = "http://localhost:8080/ws-studcollab";

// Hook to fetch conversations for a user
function useConversations(userId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`${API_BASE}/conversations/${userId}`)
      .then(res => setConversations(res.data || []))
      .catch(err => console.error("Failed to fetch conversations:", err))
      .finally(() => setLoading(false));
  }, [userId]);
  
  return [conversations, setConversations, loading];
}

// Hook to fetch messages for a conversation
function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    axios.get(`${API_BASE}/conversation/${conversationId}/messages`)
      .then(res => setMessages(res.data || []))
      .catch(err => console.error("Failed to fetch messages:", err))
      .finally(() => setLoading(false));
  }, [conversationId]);
  
  return [messages, setMessages, loading];
}

// Main InterChat Component
export default function InterChat({ user }) {
  const userId = user?.id;
  const [conversations, , convLoading] = useConversations(userId);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages, msgLoading] = useMessages(selected?.id);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    const sock = new SockJS(WS_URL);
    const stomp = over(sock);
    
    stomp.connect({}, () => {
      console.log("WebSocket connected");
      setStompClient(stomp);
      setIsConnected(true);
    }, (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });
    
    return () => {
      if (stomp.connected) {
        stomp.disconnect(() => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        });
      }
    };
  }, []);

  // Subscribe to selected conversation
  useEffect(() => {
    if (!stompClient?.connected || !selected) return;
    
    const sub = stompClient.subscribe(
      `/topic/conversation.${selected.id}`,
      msg => {
        try {
          const message = JSON.parse(msg.body);
          console.log("Received message:", message);
          setMessages(prev => [...prev, message]);
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
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
    if (!stompClient?.connected || !selected) {
      alert("WebSocket not connected. Please wait...");
      return;
    }

    const msg = {
      conversationId: selected.id,
      senderId: userId,
      text: input,
      attachmentUrls: attachments.length > 0 ? attachments : null,
    };
    
    try {
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
      setInput("");
      setAttachments([]);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  // Get other participant info
  const getOtherUserInfo = (conv) => {
    if (!conv || !conv.participantIds) return { name: "Unknown", college: "Unknown", id: null };
    const otherId = conv.participantIds.find(id => id !== userId);
    // TODO: Fetch user profile from API
    return { name: otherId || "User", college: "College", id: otherId };
  };

  // Render
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">💬 Inter-College Chats</h2>
        <p className="text-muted-foreground">Direct messaging with students across colleges</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
        {/* Conversations Sidebar */}
        <Card className="p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Messages</h3>
            {convLoading && <span className="text-xs text-muted-foreground">Loading...</span>}
          </div>

          <div className="space-y-2">
            {conversations.map((conv) => {
              const other = getOtherUserInfo(conv);
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selected?.id === conv.id
                      ? 'bg-primary/10 border-2 border-primary/20'
                      : 'hover:bg-muted/50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                      {other.name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{other.name}</div>
                      <div className="text-xs text-muted-foreground">{other.college}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {conversations.length === 0 && !convLoading && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-muted-foreground text-sm">No conversations yet</p>
            </div>
          )}
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 flex flex-col">
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    {getOtherUserInfo(selected).name?.[0] || "?"}
                  </div>
                  <div>
                    <h4 className="font-semibold">{getOtherUserInfo(selected).name}</h4>
                    <div className="text-sm text-muted-foreground">{getOtherUserInfo(selected).college} • Active now</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-600">
                  🚨 Report
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {msgLoading ? (
                  <div className="text-center text-muted-foreground py-8">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {msg.attachmentUrls.map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline text-xs">
                                Attachment {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${
                          msg.senderId === userId ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    disabled={!isConnected}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!isConnected || (!input.trim() && attachments.length === 0)}>
                    Send
                  </Button>
                </div>
                <div className="text-xs mt-2 text-muted-foreground">
                  {isConnected ? "🟢 Connected" : "🔴 Connecting..."}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="font-semibold text-lg mb-2">Select a chat to start messaging</h3>
                <p className="text-muted-foreground">Choose a conversation from the left to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}