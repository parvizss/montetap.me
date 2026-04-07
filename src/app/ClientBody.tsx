"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOffline, setIsOffline] = useState(false);

  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    // body.className-i tamamilə dəyişmək əvəzinə, sadəcə lazım olanları saxlayırıq
    if (!document.body.classList.contains("antialiased")) {
      document.body.classList.add("antialiased");
    }

    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Yenidən onlaynsınız!");
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("İnternet kəsildi. Offline rejim aktivdir.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <div className='antialiased'>{children}</div>;
}
