import { useEffect, useState } from "react";
import "./Order.css";
import { Link } from "react-router-dom";
export default function Order() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalOriginal, setTotalOriginal] = useState(0);
  const [totalDiscounted, setTotalDiscounted] = useState(0);
  const [message, setMessage] = useState(null); // ✅ bilgi mesajı için state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // varsayalım kullanıcı JSON olarak kaydedilmiş
    }
    console.log(storedUser);
  }, []);

  useEffect(() => {
    const selectedProducts = localStorage.getItem("selectedProducts");
    if (selectedProducts) {
      const parsed = JSON.parse(selectedProducts);

      // Her ürünün fiyatlarını hesapla
      let totalOrg = 0;
      let totalDisc = 0;

      parsed.forEach((pro) => {
        const originalPrice = pro.originalPrice;
        const discountedPrice = pro.discountedPrice || pro.originalPrice; // Eğer indirim yoksa orijinal fiyatı kullan

        totalOrg += originalPrice;
        totalDisc += discountedPrice;
      });

      setProducts(parsed);
      setTotalOriginal(totalOrg);
      setTotalDiscounted(totalDisc);
    }
  }, []);

  const handleConfirm = async () => {
    if (!products || products.length === 0) return;

    // API'ye gönderilecek format
    const requestBody = {
      items: products.map((pro) => ({
        productId: pro.id || pro.productId || 1, // Ürün id varsa onu kullan
        size: pro.sizeLabel?.toLowerCase() || "m",
        additives: pro.additives || [],
        quantity: pro.quantity || 1,
      })),
      totalPrice: user ? totalDiscounted : totalOriginal,
    };

    try {
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/orders/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Bir hata oluştu");
      }

      // ✅ Başarılı olursa
      setMessage(
        "✅Thank you for your order! Our manager will contact you shortly."
      );
      localStorage.removeItem("selectedProducts");
      setProducts([]);
      setTotalDiscounted(0);
      setTotalOriginal(0);
    } catch (error) {
      setMessage(`❌ Something went wrong. Please, try again`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /** */

  const handleDeleteProduct = (uniqCartId) => {
    // uniqCartId'ye göre filtreleme yap
    const updatedProducts = products.filter(
      (pro) => pro.uniqCartId !== uniqCartId
    );

    // state ve localStorage güncelle
    setProducts(updatedProducts);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));

    // toplam fiyatları yeniden hesapla
    let totalOrg = 0;
    let totalDisc = 0;
    updatedProducts.forEach((pro) => {
      const originalPrice = pro.originalPrice;
      const discountedPrice = pro.discountedPrice || pro.originalPrice;
      totalOrg += originalPrice;
      totalDisc += discountedPrice;
    });
    setTotalOriginal(totalOrg);
    setTotalDiscounted(totalDisc);
  };

  return (
    <>
      <div className="ordercontainer">
        <span className="cartyazisi">Cart</span>
        {message && (
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "6px",
            }}
          >
            {message}
          </div>
        )}

        <div className="productscontainer">
          {user
            ? products && products.length > 0
              ? products.map((pro) => (
                  <div className="userliproductcontainer" key={pro.uniqCartId}>
                    <img
                      src="./images/trash.svg"
                      alt="trash"
                      style={{ width: "24px", height: "24px" }}
                      onClick={() => handleDeleteProduct(pro.uniqCartId)}
                    />
                    <img
                      src={`/images/${pro.imageUrl}.png`}
                      alt="image"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div className="userliproductinfoco">
                      <span className="proname">{pro.name}</span>
                      <span>
                        {pro.sizeLabel},{" "}
                        {pro.additives?.map((ad) => ` ${ad}, .`)}
                      </span>
                    </div>
                    <div className="userurunfiyati">
                      <span className="ilkfiyat">
                        ${pro.originalPrice.toFixed(2)}
                      </span>
                      <span className="indirimlifiyat">
                        ${totalDiscounted.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              : ""
            : products && products.length > 0
            ? products.map((pro) => (
                <div className="usersizproductcontianer" key={pro.uniqCartId}>
                  <img
                    src="./images/trash.svg"
                    alt="trash"
                    style={{ width: "24px", height: "24px" }}
                    onClick={() => handleDeleteProduct(pro.uniqCartId)}
                  />
                  <img
                    src={`/images/${pro.imageUrl}.png`}
                    alt="image"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <div className="productinfocontainer">
                    <span className="proname">{pro.name}</span>
                    <span>
                      {pro.sizeLabel}, {pro.additives?.map((ad) => ` ${ad}, .`)}
                    </span>
                  </div>
                  <div className="urunfiyati">
                    <span className="direktfiyat">
                      ${pro.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            : ""}
        </div>
        {user ? (
          <div className="userresultcontainer">
            <div className="usertotalfiyat">
              <span className="usertotalyazisi">Total:</span>
              <div className="hemindirimhemgercek">
                <span className="ilkfiyat">${totalOriginal.toFixed(2)}</span>
                <span className="indirimlifiyat">
                  ${totalDiscounted.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="usertotalfiyatsecond">
              <span>Address:</span>
              <span>
                {user.city}, {user.street},{user.houseNumber}
              </span>
            </div>
            <div className="usertotalfiyatsecond">
              <span>pay by:</span>
              <span>{user.paymentMethod}</span>
            </div>
          </div>
        ) : (
          <div className="resultcontainer">
            <span>Total:</span>
            <span>${totalOriginal.toFixed(2)}</span>
          </div>
        )}
        {user ? (
          products && products.length > 0 ? (
            <div className="confirmbutonu" onClick={handleConfirm}>
              <button className="confirm">Confirm</button>
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="butonlardivi">
            <Link to="/signin" className="signinbutonu">
              Sign in
            </Link>
            <Link to="/register" className="registerbutonu">
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
