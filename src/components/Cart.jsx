import "./Cart.css";
export default function Cart({ item, onClick }) {
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
          <span className="titleprice">${item.price}</span>
        </div>
      </div>
    </>
  );
}
