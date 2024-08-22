import styles from "./HomePage.module.scss";
import SliderBanner from "../../components/homepage/slider_banner";
import AboutSection from "../../components/homepage/about";
import OfferSection from "../../components/homepage/offer";
import ReasonSection from "../../components/homepage/reason";
import ReviewsSection from "../../components/homepage/reviews";
import NewsSection from "../../components/homepage/news";
import InfoSection from "../../components/homepage/info";
import BookSection from "../../components/homepage/booking";
import { BookingButton } from "../../components/button/button";
import { useRef, useEffect, useState } from "react";

const HomePage = () => {
  const [bookIntersect, setBookIntersect] = useState(false);
  const bookingRef = useRef(null);

  // 監測視窗與booking section重疊，則讓mobile預約按鈕隱藏
  useEffect(() => {
    const observeTarget = bookingRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBookIntersect(true);
        } else {
          setBookIntersect(false);
        }
      },
      { threshold: 0 } // 只要進入視窗即觸發
    );

    if (observeTarget) {
      observer.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        observer.unobserve(observeTarget);
      }
    };
  }, [bookIntersect]);

  return (
    <div className={styles.container}>
      {!bookIntersect && <BookingButton />}
      <SliderBanner />
      <AboutSection />
      <OfferSection />
      <ReasonSection />
      <ReviewsSection />
      <NewsSection />
      <InfoSection />
      <BookSection ref={bookingRef} />
    </div>
  );
};

export default HomePage;