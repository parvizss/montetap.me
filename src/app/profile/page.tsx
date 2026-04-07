"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, Toaster } from "react-hot-toast";
import { Camera, Save, Phone, User as UserIcon, Loader2 } from "lucide-react";

interface UserProfileData {
  uid?: string;
  name?: string;
  phone?: string;
  photoURL?: string;
  email?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("382");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          setUser(u);
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data() as UserProfileData;
            setName(data.name || u.displayName || "");
            setPhone(data.phone?.replace("+", "") || "382");
          }
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let finalPhotoURL = user.photoURL || "";

      // Image Upload
      if (imageFile) {
        const fileRef = ref(storage, `avatars/${user.uid}/${Date.now()}`);
        await uploadBytes(fileRef, imageFile);
        finalPhotoURL = await getDownloadURL(fileRef);
      }

      // Update Auth & Firestore
      await updateProfile(user, { displayName: name, photoURL: finalPhotoURL });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone: `+${phone}`,
        photoURL: finalPhotoURL,
        email: user.email,
        updatedAt: new Date()
      }, { merge: true });

      toast.success("Profile updated! Redirecting...");

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (error: unknown) {
      toast.error("Error: " + (error instanceof Error ? error.message : "Bilinməyən xəta"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 text-center mb-8 italic tracking-tight">Edit Profile</h1>
        
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={previewUrl || user?.photoURL || "/default-avatar.png"}
              className="w-28 h-28 rounded-full border-4 border-orange-100 object-cover shadow-xl"
              alt="Profile"
            />
            <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 ml-2 tracking-widest uppercase">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-gray-300" />
              <input
                className="w-full bg-gray-50 border border-gray-100 p-3.5 pl-11 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 ml-2 tracking-widest uppercase">Phone (+382)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 font-bold text-gray-400">+</span>
              <input
                className="w-full bg-gray-50 border border-gray-100 p-3.5 pl-8 rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-mono font-bold text-gray-800 tracking-widest"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.startsWith("382") || val === "") setPhone(val || "382");
                }}
                maxLength={13}
              />
              <Phone className="absolute right-4 top-3.5 w-4 h-4 text-gray-200" />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 mt-6 transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-lg"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}