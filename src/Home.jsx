import { Link } from "react-router-dom";
import classes from "./Home.module.css";
// import video from "./assets/images/2909914-uhd_3840_2024_24fps.mp4";
import video from "/images/2909914-uhd_3840_2024_24fps.mp4";

import coffecup from "/images/coffee-cup.png";
import { useEffect, useState } from "react";
import "./sliderSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
// import appleicon from "../src/assets/images/appleicon.svg";
import appleicon from "/images/appleicon.svg";

// import ucgenicon from "../src/assets/images/ucgenicon.svg";
import ucgenicon from "/images/ucgenicon.svg";

import mobilescreens from "/images/mobile-screens.svg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/favorites"
        );
        if (!res.ok) throw new Error("Veri çekilemedi!");
        const json = await res.json();

        const cleanedData = json.data.map((item) => ({
          ...item,
          imageUrl: item.name.replace(/\s+/g, ""),
        }));

        setData(cleanedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  //const resim = "Irishcoffee.png";
  return (
    <>
      <div className={classes.mainpagecontainer}>
        <div className={classes.hero}>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "40px",
              objectFit: "cover",
            }}
          >
            <source src={video} type="video/mp4" />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
          <div className={classes.offer}>
            <div className={classes.offeralt}>
              <div className={classes.offerparagraph}>
                <span style={{ color: "#b0907a" }}>Enjoy </span>{" "}
                <span style={{ color: "#e1d4c9" }}>
                  premium coffee at our charming cafe
                </span>
              </div>
              <span style={{ color: "#e1d4c9", lineHeight: "150%" }}>
                With its inviting atmosphere and delicious coffee options, the
                Coffee House Resource is a popular destination for coffee lovers
                and those seeking a warm and inviting space to enjoy their
                favorite beverage.
              </span>
              <Link className={classes.offermenulink} to={"/products"}>
                menu{" "}
                <img
                  src={coffecup}
                  alt="asd"
                  className={classes.herocoffecup}
                />
              </Link>
            </div>
          </div>
        </div>
        {loading ? (
          <p>⏳ Loading...</p>
        ) : error ? (
          <p
            style={{
              color: "red",
              display: "flex",
              fontSize: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ❌ something went wrong please refresh page!
          </p>
        ) : data && data.length > 0 ? (
          <div className="slidercontainer">
            <span className="sldierfavouritetitle">
              Choose your{" "}
              <span style={{ color: "#b0907a", display: "inline-block" }}>
                favorite
              </span>{" "}
              coffee
            </span>
            <div className="slider">
              <div className="prevBtn">&lt;-</div>
              <div className="swipercontainer">
                <Swiper
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".prevBtn",
                    nextEl: ".nextBtn",
                  }}
                  spaceBetween={30}
                  loop={true}
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  modules={[Pagination, Navigation, Autoplay]}
                  className="mySwiper"
                  breakpoints={{
                    0: { allowTouchMove: true },
                    768: { allowTouchMove: false },
                  }}
                >
                  {data.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="swiperslideici">
                        <img
                          src={`./images/${item.imageUrl}.png`}
                          alt={item.name}
                          className="swiperslideresim"
                        />
                        <div className="sliderdescriptioncontainer">
                          <span className="itemname">{item.name}</span>
                          <span className="itemdescriptipon">
                            {item.description}
                          </span>
                          {user ? (
                            <div className="homesliderfiyat">
                              <span className="homeslidergercekfiyat">
                                ${item.price}
                              </span>
                              <span className="homesliderdisfiyat">
                                $
                                {item.discountPrice
                                  ? item.discountPrice
                                  : item.price}
                              </span>
                            </div>
                          ) : (
                            <span className="itemprice">${item.price}</span>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="nextBtn">-&gt;</div>
            </div>
          </div>
        ) : (
          <p>⚠️ something went wrong please refresh page!</p>
        )}

        <div className={classes.about}>
          <span className={classes.perfectler}>
            Resource is{" "}
            <span style={{ color: "#8d7362" }}>the perfect and cozy place</span>{" "}
            where you can enjoy a variety of hot beverages, relax, catch up with
            friends, or get some work done.
          </span>
          <div className={classes.aboutimages}>
            <div className={classes.aboutimagescolumn1}>
              <div className={classes.column1first}></div>
              <div className={classes.column1second}></div>
            </div>
            <div className={classes.aboutimagescolumn2}>
              <div className={classes.column2first}></div>
              <div className={classes.column2second}></div>
            </div>
          </div>
        </div>
        <div className={classes.mobileapp} id="mobile-app">
          <div className={classes.mobileappoffer}>
            <span className={classes.mobileappdownload}>
              <span style={{ color: "#8d7362" }}>Download</span> our apps to
              start ordering
            </span>
            <span className={classes.mobileappresource}>
              Download the Resource app today and experience the comfort of
              ordering your favorite coffee from wherever you are
            </span>
            <div className={classes.ikiicon}>
              <div className={classes.appleicon}>
                <img
                  src={appleicon}
                  alt="appple"
                  className={classes.appleresim}
                />
                <div className={classes.appleyani}>
                  <span className={classes.appleyaziboyut1}>
                    Available on the
                  </span>
                  <span className={classes.appleyaziboyut2}>App Store</span>
                </div>
              </div>
              <div className={classes.appleicon}>
                <img
                  src={ucgenicon}
                  alt="appple"
                  className={classes.appleresim}
                />
                <div className={classes.appleyani}>
                  <span className={classes.appleyaziboyut1}>
                    Available on the
                  </span>
                  <span className={classes.appleyaziboyut2}>App Store</span>
                </div>
              </div>
            </div>
          </div>
          <img
            src={mobilescreens}
            alt="asdasd"
            className={classes.mobilescreensimage}
          />
        </div>
      </div>
    </>
  );
}
