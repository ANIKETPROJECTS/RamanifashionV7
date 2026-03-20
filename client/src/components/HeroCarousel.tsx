import { useState, useEffect } from "react";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const cacheBust = Date.now();
    const img = new Image();
    img.onload = () => setHeroImage(`/media/hero-banner.png?t=${cacheBust}`);
    img.src = `/media/hero-banner.png?t=${cacheBust}`;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!heroImage) {
    return (
      <div
        className="w-full bg-pink-50"
        style={{ height: "55vh", maxHeight: "500px" }}
      />
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "55vh", maxHeight: "500px", backgroundColor: "#fff" }}
    >
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <img
            src={heroImage}
            alt="Ramani Fashion Banner"
            className="w-full h-full object-cover object-center"
            data-testid="img-hero-banner-0"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
