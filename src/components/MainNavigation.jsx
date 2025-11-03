import { useState } from "react";
import logo from "../assets/images/logo.png";
import stateactive from "../assets/images/State=active.png";
import statedefault from "../assets/images/State=default.png";
import coffeecup from "../assets/images/coffee-cup.png";
import shoppingbag from "../assets/images/shopping-bag.png";

import classes from "./MainNav.module.css";

export default function MainNavigation() {
  const [ismobilemenuopen, setIsmenuMobilOpen] = useState(false);
  function chagemenuvisibility() {
    setIsmenuMobilOpen((e) => !e);
  }
  return (
    <>
      <header>
        <div className={classes.headercontainer}>
          <img src={logo} alt="logo" className={classes.logoimage} />
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
            <div className={classes.cartsayiveindirim}>
              <img
                src={shoppingbag}
                alt="coffeecup"
                className={classes.desktopdakishop}
              />
              <span>2</span>
              <span>indi</span>
            </div>
            <div className={classes.desktopkahveifadesi}>
              <span style={{ fontWeight: "600", color: "#403f3d" }}>Menu</span>
              <img
                src={coffeecup}
                alt="coffeeecup"
                className={classes.desktopcoffecup}
              />
            </div>
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
            <div className={classes.menucofeecup}>
              <span>Menu</span>
              <img
                src={coffeecup}
                alt="coffeecup"
                className="mobildekikahveresmi"
              />
            </div>
            <div className={classes.menucart}>
              <span>Cart</span>
              <img
                src={shoppingbag}
                alt="coffeecup"
                className="mobildekisepetresmi"
              />
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
