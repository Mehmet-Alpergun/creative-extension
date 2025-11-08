import { useState } from "react";
import "./Cart.css";
export default function Cart({ item, onClick }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(item);

  return (
    <>
      <div className="preview" onClick={onClick}>
        <img
          src={`./images/${item.imageUrl}.png`}
          alt="asdasd"
          className="previewimage"
        />
        <div className="description">
          <div className="titletogether">
            <span className="bigtitle">{item.name}</span>
            <span className="smalltitle">{item.description}</span>
          </div>
          {user ? (
            <div className="cartfiyatdivi">
              <span className="indirimlifiyat">${item.discountPrice}</span>
              <span className="cartgercekfiyat">$ {item.price}</span>
            </div>
          ) : (
            <span className="titleprice">${item.price}</span>
          )}
        </div>
      </div>
    </>
  );
}
