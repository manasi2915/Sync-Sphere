import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { auth } from "../utils/auth";
import { apiRequest } from "../utils/api";

export default function Chat() {
  const user = auth.user();
  const socketRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [rooms] = useState(["study", "events", "random"]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // -----------------------------
  // CONNECT SOCKET.IO
  // -----------------------------
  useEffect(() => {
    socketRef.current = io("http://localhost:5001", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to chat");
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);
  
  // -----------------------------
  // LOAD CHAT USERS (Admin, Alice, Bob)
  // -----------------------------
  useEffect(() => {
    async function loadUsers() {
      try {
        const list = await apiRequest("/api/chat/users");
        setUsers(list);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    loadUsers();
  }, []);

  // -----------------------------
  // JOIN ROOM + LOAD HISTORY
  // -----------------------------
  useEffect(() => {
    if (!currentRoom) return;

    socketRef.current.emit("joinRoom", currentRoom);

    async function loadHistory() {
      try {
        const history = await apiRequest(`/api/chat/messages/${currentRoom}`);
        setMessages(history);
      } catch (err) {
        console.error("Load history failed:", err);
      }
    }

    loadHistory();
  }, [currentRoom]);

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  async function sendMessage() {
    if (!text.trim()) return;

    const payload = {
      room: currentRoom,
      senderId: user.id,
      text,
    };

    // 1. save to DB
    await apiRequest("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify(payload),
    });

   

    setText("");
  }

  // -----------------------------
  // AUTO SCROLL
  // -----------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------
  // USER SELECT FOR PRIVATE DM
  // -----------------------------
  function openPrivateChat(otherUser) {
    const roomId = [user.id, otherUser._id].sort().join("_");
    setCurrentRoom(roomId);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT SIDEBAR */}
      <div className="card p-4 h-full">
        <h2 className="text-xl font-bold mb-4">Chats</h2>

        <p className="text-sm text-gray-500 mb-2">Group Rooms</p>
        {rooms.map((r) => (
          <div
            key={r}
            onClick={() => setCurrentRoom(r)}
            className={`p-3 mb-2 rounded cursor-pointer ${
              currentRoom === r ? "bg-blue-100" : "bg-white"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </div>
        ))}

        <p className="text-sm text-gray-500 mt-4 mb-2">People</p>
        {users
          .filter((u) => u.email !== user.email)
          .map((u) => (
            <div
              key={u._id}
              onClick={() => openPrivateChat(u)}
              className={`p-3 mb-2 rounded cursor-pointer flex items-center gap-3 ${
                currentRoom?.includes(u._id) ? "bg-blue-100" : "bg-white"
              }`}
            >
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-semibold">
                {u.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-gray-500">{u.role}</div>
              </div>
            </div>
          ))}
      </div>

      {/* CHAT AREA */}
      <div className="col-span-2 card p-6 flex flex-col h-[80vh]">
        <h2 className="text-xl font-semibold mb-2">
          {currentRoom ? "Direct Message" : "Select a chat"}
        </h2>

        <div className="flex-1 overflow-y-auto bg-white/30 rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No messages yet
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    msg.senderId === user.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* INPUT BOX */}
        {currentRoom && (
          <div className="mt-4 flex gap-3">
            <input
              className="flex-1 p-3 border rounded-xl"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="px-6 bg-blue-500 text-white rounded-xl"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
