import { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import stateactive from "../assets/images/State=active.png";
import statedefault from "../assets/images/State=default.png";
import coffeecup from "../assets/images/coffee-cup.png";
import shoppingbag from "../assets/images/shopping-bag.png";

import classes from "./MainNav.module.css";
import { Link } from "react-router-dom";

export default function MainNavigation() {
  const [user, setUser] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCart =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];

    setUser(storedUser);
    setSelectedProducts(storedCart);
  }, []);
  const [ismobilemenuopen, setIsmenuMobilOpen] = useState(false);
  function chagemenuvisibility() {
    setIsmenuMobilOpen((e) => !e);
  }
  const showCartIcon = user || selectedProducts.length > 0;

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
              <li>Contact us</li>
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
                <span>2</span>
                <span>indi</span>
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
