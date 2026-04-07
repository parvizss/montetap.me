"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  getDocs,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  User as UserIcon,
  MessageSquare,
  Loader2,
  LogIn,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  participants: string[];
  text: string;
  createdAt: Timestamp | null;
}

interface ChatUser {
  uid: string;
  name?: string;
  email?: string;
  photoURL?: string;
  lastSeen?: Timestamp | null;
}

export default function MessagesPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Auth check
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUsers(user.uid);
        // Google ilə daxil olan istifadəçini Firestore-a yaz/yenilə
        saveUserToFirestore(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const saveUserToFirestore = async (user: User) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastSeen: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Giriş zamanı xəta baş verdi");
    }
  };

  // 2. Fetch all users for the list
  const fetchUsers = async (myUid: string) => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const usersList = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }) as ChatUser)
        .filter((u: ChatUser) => u.uid !== myUid);
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Real-time messages for selected chat
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        // Artıq Firebase Rulesparticipants array-ini yoxlayır,
        // lakin biz burada yalnız seçilmiş istifadəçi ilə olan mesajları göstəririk.
        const allMsgs = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as ChatMessage,
        );
        const chatMsgs = allMsgs.filter((m) =>
          m.participants.includes(selectedUser.uid),
        );
        setMessages(chatMsgs);
        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      },
      (error) => {
        console.error("Firestore subscription error:", error);
        if (error.code === "permission-denied") {
          toast.error(
            "Mesajları oxumaq üçün icazəniz yoxdur. Qaydaları yoxlayın.",
          );
        }
      },
    );

    return () => unsub();
  }, [currentUser, selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !selectedUser) return;

    await addDoc(collection(db, "messages"), {
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      participants: [currentUser.uid, selectedUser.uid],
      text: message,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='animate-spin text-orange-500' size={40} />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 container mx-auto max-w-6xl p-4 md:py-8'>
        <div className='bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden flex h-[70vh]'>
          {/* LEFT PANEL: User List */}
          <div className='w-1/3 border-r border-border bg-muted/20 flex flex-col'>
            <div className='p-6 border-b border-border bg-card'>
              <h2 className='text-xl font-black flex items-center gap-2'>
                <MessageSquare className='text-orange-500' />
                Messages
              </h2>
            </div>
            <div className='flex-1 overflow-y-auto p-2 space-y-1'>
              {users.map((user) => (
                <div
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                    selectedUser?.uid === user.uid
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "hover:bg-muted"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedUser?.uid === user.uid ? "bg-white/20" : "bg-orange-100 text-orange-500"}`}
                  >
                    <UserIcon size={20} />
                  </div>
                  <div className='overflow-hidden'>
                    <p className='font-bold truncate'>
                      {user.name || user.email?.split("@")[0]}
                    </p>
                    <p
                      className={`text-xs truncate ${selectedUser?.uid === user.uid ? "text-orange-100" : "text-muted-foreground"}`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: Chat Window */}
          <div className='flex-1 flex flex-col bg-card'>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className='p-4 border-b border-border bg-card flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500'>
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className='font-black'>
                      {selectedUser.name || selectedUser.email?.split("@")[0]}
                    </p>
                    <p className='text-[10px] text-green-500 font-bold uppercase tracking-wider'>
                      Online
                    </p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5'>
                  {messages.length === 0 && (
                    <div className='h-full flex flex-col items-center justify-center text-muted-foreground opacity-50'>
                      <MessageSquare size={48} className='mb-2' />
                      <p className='font-bold'>Henüz mesaj yoxdur</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentUser?.uid ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl font-medium text-sm shadow-sm ${
                          msg.senderId === currentUser?.uid
                            ? "bg-orange-500 text-white rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={handleSendMessage}
                  className='p-4 border-t border-border flex gap-2 bg-card'
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Mesaj yazın...'
                    className='flex-1 rounded-xl h-12 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-orange-500'
                  />
                  <Button
                    type='submit'
                    className='h-12 w-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white p-0 shadow-lg shadow-orange-500/20'
                  >
                    <Send size={20} />
                  </Button>
                </form>
              </>
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/5'>
                <div className='p-8 rounded-[3rem] bg-card border border-border shadow-inner mb-4'>
                  <MessageSquare size={64} className='text-orange-200' />
                </div>
                <p className='text-xl font-black text-foreground'>
                  Söhbət seçin
                </p>
                <p className='text-sm font-bold'>
                  Mesajlaşmağa başlamaq üçün soldan bir istifadəçi seçin.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
