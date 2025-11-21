import classes from "./Footer.module.css";
import twitter from "/images/twitter.png";
import instagram from "/images/instagram.png";
import facebook from "/images/facebook.png";
import konum from "/images/konum.png";
import phone from "/images/phone.png";
import clock from "/images/clock.png";

export default function Footer() {
  return (
    <>
      <footer
        style={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className={classes.footerContainer}>
          <div className={classes.offer}>
            <div className="footerspanyazisi">
              <span className={classes.offersipyazisi}>Sip, Savor, Smile.</span>{" "}
              <br className={classes.footerbr} />
              <span className={classes.offercofeeyazisi}>
                It’s coffee time!
              </span>
            </div>
            <div className={classes.socials}>
              <img src={twitter} alt="twitter" />
              <img src={instagram} alt="instagram" />
              <img src={facebook} alt="facebook" />
            </div>
          </div>
          <div className={classes.contactsinfo}>
            <span className={classes.contactus}>Contact us</span>
            <div className={classes.contacs}>
              <a
                className={classes.konumcontainer}
                href="https://www.google.com/maps/place/Levent,+34330+Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul/@41.082451,29.0057013,15z/data=!3m1!4b1!4m6!3m5!1s0x14cab66eb1aaff27:0x306025824b2de11e!8m2!3d41.0818288!4d29.0183512!16zL20vMGJ0MzA5?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={konum} alt="konum" />
                <span>8558 Green Rd., LA</span>
              </a>
              <a className={classes.phonecontainer} href="tel:+905313297984">
                <img src={phone} alt="phone" />
                <span>+1 (603) 555-0123</span>
              </a>
              <a className={classes.clockcontainer}>
                <img src={clock} alt="clock" />
                <span>Mon-Sat: 9:00 AM - 23:00 PM</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
