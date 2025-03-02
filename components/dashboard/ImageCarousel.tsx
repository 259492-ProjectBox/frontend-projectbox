"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Define TypeScript interfaces
interface ImageData {
  src: string;
  alt: string;
  description: string;
}

interface ImageCarouselProps {
  images: ImageData[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // const [descriptions, setDescriptions] = useState<string[]>(
  //   images.map((img) => img.description)
  // );

  // Go to next image
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Auto-rotate every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);


  // Go to previous image
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // // Handle description change
  // const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   const updatedDescriptions = [...descriptions];
  //   updatedDescriptions[currentIndex] = e.target.value;
  //   setDescriptions(updatedDescriptions);
  // };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden rounded-lg shadow-lg">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={700}
            height={400}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-400 p-2 rounded-full text-white hover:bg-gray-600 transition"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-400 p-2 rounded-full text-white hover:bg-gray-600 transition"
        >
          ▶
        </button>
      </div>

      {/* Description */}
      <div className="mt-4 text-gray-300">
        <h3 className="text-xl font-semibold">{images[currentIndex].alt}</h3>
        <p className="mt-2 text-sm">{images[currentIndex].description}</p>
      </div>

      {/* Stepper (Dots Indicator) */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-500 w-6" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
