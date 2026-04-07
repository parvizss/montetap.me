"use client";

import React, { useState, useEffect } from "react";
import { Camera, X, UploadCloud, RotateCw, ShieldAlert } from "lucide-react";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  // Point 31: Avtomatik Moderasiya üçün:
  // Bu hissədə yüklənən şəkillər AI tərəfindən yoxlanılmalı və nalayiq kontent bloklanmalıdır.
  // Məsələn, şəkil yükləndikdən sonra bir API-yə göndərilə bilər.
}

export function ImageUpload({ onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<Blob[]>([]);
  const [metadataWarning, setMetadataWarning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const addWatermark = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");

          // Point 32: Automatic image optimization (Resizing)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);

          // Watermark style improvement (Point 5)
          ctx.font = `bold ${img.width / 20}px Arial`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.textAlign = "right";
          ctx.fillText("montetap.me", canvas.width - 20, canvas.height - 20);

          canvas.toBlob((blob) => resolve(blob || file), file.type);
        };
      };
    });
  };

  // Şəkil Redaktoru: Döndərmə funksiyası (Point 4)
  const rotateImage = async (index: number) => {
    const src = images[index];
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          const newUrl = URL.createObjectURL(blob);
          setImages((prev) => {
            const updated = [...prev];
            updated[index] = newUrl;
            return updated;
          });
          setFiles((prev) => {
            const updated = [...prev];
            updated[index] = blob;
            return updated;
          });
        }
      }, "image/jpeg");
    };
  };

  // Notify parent of file changes
  useEffect(() => {
    onImagesChange(files as File[]);
  }, [files, onImagesChange]);

  // Müvəqqəti URL-ləri təmizləmək üçün (Memory leak qarşısını almaq)
  useEffect(() => {
    return () => {
      images.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [images]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    // Point 15: Meta-məlumat yoxlanışı (Süni nümunə)
    // Real tətbiqdə 'exif-js' kimi kitabxana ilə GPS koordinatları oxunmalıdır.
    const hasLocation = Array.from(files).some(file => file.size > 0); 
    if (!hasLocation) {
      setMetadataWarning(true);
    } else {
      setMetadataWarning(false);
    }

    const processedBlobs = await Promise.all(
      Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => addWatermark(file)),
    );

    const newUrls = processedBlobs.map((blob) => URL.createObjectURL(blob));

    setImages((prev) => [...prev, ...newUrls].slice(0, 10));
    setFiles((prev) => [...prev, ...processedBlobs].slice(0, 10));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_: string, i: number) => i !== index));
    setFiles((prev) => prev.filter((_: Blob, i: number) => i !== index));
  };

  return (
    <div className='space-y-4'>
      <div
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
          isDragging
            ? "border-orange-500 bg-orange-50 scale-[1.01]"
            : "border-gray-200 hover:border-orange-300 bg-gray-50/50"
        }`}
      >
        <input
          type='file'
          multiple
          accept='image/*'
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          className={`p-4 rounded-full ${isDragging ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500"}`}
        >
          <UploadCloud className='h-8 w-8' />
        </div>
        <div className='text-center'>
          <p className='text-lg font-bold text-gray-700'>
            Şəkilləri bura dartın və ya klikləyin
          </p>
          <p className='text-sm text-gray-500 mt-1'>
            Maksimum 10 şəkil əlavə edə bilərsiniz (JPG, PNG)
          </p>
        </div>
      </div>

      {metadataWarning && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-pulse">
          <ShieldAlert size={16} />
          Şəkil meta-məlumatları elan yeri ilə uyğun gəlmir. Zəhmət olmasa real şəkillər yükləyin.
        </div>
      )}

      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4'>
          {images.map((src, index) => (
            <div
              key={index}
              className='relative group aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm'
            >
              <img
                src={src}
                className='w-full h-full object-cover'
                alt={`Önizləmə ${index}`}
              />
              <button
                type='button'
                onClick={() => removeImage(index)}
                className='absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
              >
                <X className='h-3 w-3' />
              </button>
              <button
                type='button'
                onClick={() => rotateImage(index)}
                className='absolute top-1 left-1 p-1.5 bg-orange-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
              >
                <RotateCw className='h-3 w-3' />
              </button>
              {index === 0 && (
                <div className='absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold'>
                  ƏSAS ŞƏKİL
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
