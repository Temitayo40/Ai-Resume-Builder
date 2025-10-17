import Banner from "../components/Home/Banner";
import Features from "../components/Home/Features";
import Hero from "../components/Home/Hero";
import Testimonials from "../components/Home/Testimonials";
import CallToAction from "../components/Home/CallToAction";
import Footer from "../components/Home/Footer";

const Home = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
