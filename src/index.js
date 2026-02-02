import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const ValbackCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logika Swipe: Kanan untuk Next, Kiri untuk Undo
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;

    // SWIPE KANAN -> Ganti ke foto berikutnya
    if (info.offset.x > swipeThreshold && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } 
    // SWIPE KIRI -> Balik ke foto sebelumnya (Undo)
    else if (info.offset.x < -swipeThreshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="vbc-main-container">
      <AnimatePresence mode='popLayout'>
        {images.map((img, index) => {
          // Hanya render kartu yang belum terlewati (currentIndex ke atas)
          if (index < currentIndex) return null;

          const isTop = index === currentIndex;
          const distanceFromTop = index - currentIndex;

          return (
            <motion.div
              key={index}
              className={`vbc-card ${!isTop ? 'vbc-card-back' : ''}`}
              style={{ 
                backgroundImage: `url(${img})`,
                zIndex: images.length - index,
              }}
              // Logic Drag
              drag={isTop ? "x" : false} // Hanya kartu paling depan yang bisa di-swipe
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              
              // Animasi Masuk & Posisi Tumpukan
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ 
                scale: isTop ? 1 : 0.95 - (distanceFromTop * 0.04),
                opacity: 1,
                y: isTop ? 0 : (distanceFromTop * 12), // Turun sedikit per tumpukan
                rotate: isTop ? 0 : (distanceFromTop * 2), // Miring sedikit agar estetik
              }}
              
              // Animasi Keluar (Saat Swipe Kanan)
              exit={{ 
                x: 600, 
                opacity: 0, 
                rotate: 25,
                transition: { duration: 0.4 } 
              }}
              
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 25 
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ValbackCarousel;