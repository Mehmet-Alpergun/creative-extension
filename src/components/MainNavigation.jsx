import { useEffect, useState } from "react";
import logo from "/images/logo.png";
import stateactive from "/images/State=active.png";
import statedefault from "/images/State=default.png";
import coffeecup from "/images/coffee-cup.png";
import shoppingbag from "/images/shopping-bag.png";

import classes from "./MainNav.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MainNavigation() {
  const cekilenveri = useSelector((state) => state.products.items);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // const [selectedProducts, setSelectedProducts] = useState([]);
  const productNumber = cekilenveri.length;
  const toplamNegotiation = cekilenveri.reduce((acc, item) => {
    return acc + (item.negotiation || 0);
  }, 0);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));

  //   setUser(storedUser);
  // }, []);
  const [ismobilemenuopen, setIsmenuMobilOpen] = useState(false);
  function chagemenuvisibility() {
    setIsmenuMobilOpen((e) => !e);
  }
  const showCartIcon = user || productNumber > 0;

  return (
    <>
      <header>
        <div className={classes.headercontainer}>
          <Link to="/">
            <img src={logo} alt="logo" className={classes.logoimage} />
          </Link>
          {ismobilemenuopen ? (
            <img
              src={stateactive}
              alt="stateactive"
              className={classes.activeimage}
              onClick={() => chagemenuvisibility()}
            />
          ) : (
            <img
              src={statedefault}
              alt="statedefault"
              className={classes.defaultimage}
              onClick={() => chagemenuvisibility()}
            />
          )}
          <div className={classes.desktopnavpart}>
            <ul className={classes.desktopnavpartul}>
              <li>Favorite coffee</li>
              <li>About</li>
              <li>Mobile app</li>
              <Link
                to={"/contactus"}
                style={{ textDecoration: "none", color: "#403f3d" }}
              >
                Contact us
              </Link>
            </ul>
          </div>
          <div className={classes.mobildekicartveindirim}>
            {showCartIcon && (
              <Link to="/order" className={classes.cartsayiveindirim}>
                <img
                  src={shoppingbag}
                  alt="coffeecup"
                  className={classes.desktopdakishop}
                />
                <span>{productNumber > 0 ? productNumber : ""}</span>
                {user ? (
                  <span className={classes.negotiotion}>
                    {toplamNegotiation == 0
                      ? ""
                      : parseFloat(toplamNegotiation).toFixed(2)}
                  </span>
                ) : (
                  ""
                )}
              </Link>
            )}
            <Link to="/products" className={classes.desktopkahveifadesi}>
              <span style={{ fontWeight: "600", color: "#403f3d" }}>Menu</span>
              <img
                src={coffeecup}
                alt="coffeeecup"
                className={classes.desktopcoffecup}
              />
            </Link>
          </div>
        </div>
        {ismobilemenuopen && (
          <nav className={classes.mobilenav}>
            <ul className={classes.mobilenavul}>
              <li>Favorite coffee</li>
              <li>About</li>
              <li>Mobile app</li>
              <li>Contact us</li>
            </ul>
            <Link to="/products" className={classes.menucofeecup}>
              <span>Menu</span>
              <img
                src={coffeecup}
                alt="coffeecup"
                className="mobildekikahveresmi"
              />
            </Link>
            <Link to="/order" className={classes.menucart}>
              <span>Cart</span>
              <img
                src={shoppingbag}
                alt="coffeecup"
                className="mobildekisepetresmi"
              />
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
