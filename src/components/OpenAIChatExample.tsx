"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Loader2 } from "lucide-react";

export function OpenAIChatExample() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response);
      } else {
        setError(data.error || "Bilinməyən xəta baş verdi.");
      }
    } catch (err) {
      console.error(err);
      setError("Serverlə əlaqə qurularkən xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4'>
      <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
        <MessageSquare className='h-5 w-5 text-orange-500' />
        AI ilə Söhbət (Nümunə)
      </h3>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <Input
          type='text'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='AI-yə bir sual verin...'
          className='flex-1 rounded-xl'
          disabled={loading}
        />
        <Button
          type='submit'
          disabled={loading}
          className='bg-orange-500 hover:bg-orange-600'
        >
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : "Göndər"}
        </Button>
      </form>
      {response && (
        <div className='mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm'>
          <p className='font-bold mb-1'>AI Cavabı:</p>
          <p>{response}</p>
        </div>
      )}
      {error && (
        <div className='mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm'>
          <p className='font-bold mb-1'>Xəta:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
