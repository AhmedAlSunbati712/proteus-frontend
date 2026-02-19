import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import FeaturesGrid from './components/FeaturesGrid';
import CTASection from './components/CTASection';
import TechStackStrip from './components/TechStackStrip';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />
      <CTASection />
      <TechStackStrip />
      <Footer />
    </>
  );
}
