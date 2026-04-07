"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Send, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: { seconds: number; nanoseconds: number } | number;
  isTranslated?: boolean;
}

export function Chat({
  chatId,
  receiverId,
}: {
  chatId: string;
  receiverId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgData);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Point 7: Avtomatik Dil Tərcüməsi
  const handleTranslate = async (msgId: string, text: string) => {
    setTranslatingId(msgId);
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Bu mesajı Azərbaycan dilinə tərcümə et: "${text}"`,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, text: data.response, isTranslated: true }
              : m,
          ),
        );
        toast.success("Tərcümə edildi");
      }
    } catch (err) {
      toast.error("Tərcümə zamanı xəta.");
    } finally {
      setTranslatingId(null);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      receiverId: receiverId,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className='flex flex-col h-[400px] w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
      <div className='p-4 border-b bg-gray-50 font-bold text-sm text-gray-700'>
        Satıcı ilə söhbət
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.senderId === user?.uid
                  ? "bg-orange-500 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
              {msg.senderId !== user?.uid && !msg.isTranslated && (
                <button
                  onClick={() => handleTranslate(msg.id, msg.text)}
                  className='mt-1 text-[9px] font-bold opacity-50 hover:opacity-100 flex items-center gap-1'
                >
                  {translatingId === msg.id ? (
                    <Loader2 size={10} className='animate-spin' />
                  ) : (
                    <Languages size={10} />
                  )}
                  Tərcümə et
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className='p-4 border-t flex gap-2'>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Mesaj yazın...'
          className='rounded-xl'
        />
        <Button
          type='submit'
          size='icon'
          className='bg-orange-500 rounded-xl shrink-0'
        >
          <Send className='h-4 w-4' />
        </Button>
      </form>
    </div>
  );
}
