import "./shapeDivider.css";
import SliderImage from "@/components/index/sliderImageSection";
import HeroSection from "@/components/index/HeroSection";
import LiveInfoAirplane from "@/components/index/LiveInfo";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* End Hero Section */}
      {/* Slider Section */}
      <SliderImage />
      {/* End Slider Section */}
      {/* Section Info Penerbangan */}
      <LiveInfoAirplane />
      {/* End Section Live Penerbangan */}
    </>
  );
}
