"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { db, auth, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";

export default function CreateListing() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    location: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error(t.auth_login || "Please login first.");
      return;
    }

    if (
      !formData.title ||
      !formData.price ||
      !formData.category ||
      !formData.location
    ) {
      toast.error(t.error_fill_all || "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrls: string[] = [];

      // Bütün şəkilləri paralel olaraq yükləyirik
      if (images.length > 0) {
        uploadedImageUrls = await Promise.all(
          images.map(async (file) => {
            const fileRef = ref(
              storage,
              `listings/${auth.currentUser?.uid}/${Date.now()}_${file.name}`,
            );
            await uploadBytes(fileRef, file);
            return getDownloadURL(fileRef);
          }),
        );
      }

      await addDoc(collection(db, "listings"), {
        ...formData,
        price: Number(formData.price),
        userId: auth.currentUser.uid,
        status: "pending",
        views: 0,
        createdAt: serverTimestamp(),
        image: uploadedImageUrls[0] || "", // Əsas şəkil
        images: uploadedImageUrls, // Bütün şəkillər
      });

      toast.success(t.success_listing || "Listing created successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 container mx-auto px-4 py-12 max-w-2xl'>
        <div className='bg-card p-8 rounded-[2.5rem] border border-border shadow-xl'>
          <h1 className='text-3xl font-black mb-8 text-center'>
            {t.new_listing_title}
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-bold ml-2'>
                {t.profile_image}
              </label>
              <ImageUpload onImagesChange={(files) => setImages(files)} />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold ml-2'>
                {t.listing_title_label} *
              </label>
              <Input
                placeholder={t.listing_title_placeholder}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className='rounded-2xl h-12'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-bold ml-2'>
                  {t.price_label} *
                </label>
                <Input
                  type='number'
                  placeholder='0.00'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className='rounded-2xl h-12'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-bold ml-2'>
                  {t.category_label} *
                </label>
                <select
                  className='flex h-12 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value=''>{t.view_all}</option>
                  <option value='transport'>{t.cats.neqliyyat}</option>
                  <option value='real-estate'>{t.cats.dasinmaz_emlak}</option>
                  <option value='electronics'>{t.cats.elektronika}</option>
                  <option value='services'>{t.cats.xidmetler}</option>
                </select>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold ml-2'>{t.city_label} *</label>
              <Input
                placeholder={t.city_placeholder}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className='rounded-2xl h-12'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold ml-2'>
                {t.description_label}
              </label>
              <Textarea
                placeholder={t.description_placeholder}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='rounded-2xl min-h-[120px]'
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-lg font-bold shadow-lg shadow-orange-500/20'
            >
              {loading ? t.loading : t.submit_btn}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
