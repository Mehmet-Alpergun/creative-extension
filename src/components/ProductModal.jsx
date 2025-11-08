import { useDispatch } from "react-redux";
import "./ProductModal.css";
import { useEffect, useState } from "react";
import { addtocart } from "./store/productsSlice";
export default function ProductModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("s");
  const [selectedAdditives, setSelectedAdditives] = useState([]); // additives seçimi

  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${product.id}`
        );
        if (!res.ok) throw new Error("something went wront please try again");
        const json = await res.json();

        const cleanedData = {
          ...json.data,
          imageUrl: json?.data?.name.replace(/\s+/g, ""),
        };

        setProducts(cleanedData);

        //setProducts(data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [product.id]);

  // 🧠 localStorage'dan user bilgisini çek
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // varsayalım kullanıcı JSON olarak kaydedilmiş
    }
  }, []);
  useEffect(() => {
    if (!products) return;

    let originalBasePrice = 0.0; // indirimsiz fiyat
    let discountedBasePrice = 0.0; // indirimli fiyat

    const hasUser = Boolean(user);

    // 🧩 Boyut fiyatı (size)
    const sizeData = products?.sizes[selectedSize];
    if (sizeData) {
      const sizeOriginal = parseFloat(sizeData.price) || 0;
      const sizeDiscounted =
        parseFloat(sizeData.discountPrice ?? sizeData.price) || 0;

      originalBasePrice += sizeOriginal;
      discountedBasePrice += sizeDiscounted;
    }

    // 🍫 Additives fiyatları
    selectedAdditives.forEach((addName) => {
      const add = products.additives.find((a) => a.name === addName);
      if (add) {
        const addOriginal = parseFloat(add.price) || 0;
        const addDiscounted = parseFloat(add.discountPrice ?? add.price) || 0;

        originalBasePrice += addOriginal;
        discountedBasePrice += addDiscounted;
      }
    });

    // 💰 Toplamları 2 ondalığa yuvarla
    const finalOriginal = parseFloat(originalBasePrice.toFixed(2));
    const finalDiscounted = parseFloat(discountedBasePrice.toFixed(2));

    // 🧾 State'leri güncelle
    setTotalPrice(finalOriginal); // indirimsiz toplam
    setDiscountedPrice(finalDiscounted); // indirimli toplam

    console.log("Selected size:", selectedSize);
    console.log("Selected additives:", selectedAdditives);
    console.log("Original price:", finalOriginal);
    console.log("Discounted price:", finalDiscounted);
  }, [selectedSize, selectedAdditives, products, user]);

  const handleAddToCart = () => {
    if (!products) return;

    const stored = localStorage.getItem("selectedProducts");
    const currentCart = stored ? JSON.parse(stored) : [];

    const uniqCartId = `${product.id}-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    const sizeInfo = products.sizes[selectedSize];
    const additivesInfo = products.additives.filter((a) =>
      selectedAdditives.includes(a.name)
    );

    // 🔹 1️⃣ ORİJİNAL FİYAT (indirim yok)
    const originalSizePrice = parseFloat(sizeInfo.price) || 0;
    const originalAdditivesPrice = additivesInfo.reduce(
      (sum, add) => sum + (parseFloat(add.price) || 0),
      0
    );
    const originalTotal = parseFloat(
      (originalSizePrice + originalAdditivesPrice).toFixed(2)
    );

    // 🔹 2️⃣ İNDİRİMLİ FİYAT (discount varsa kullan)
    const discountedSizePrice =
      parseFloat(sizeInfo.discountPrice ?? sizeInfo.price) || 0;

    const discountedAdditivesPrice = additivesInfo.reduce((sum, add) => {
      const addPrice = parseFloat(add.discountPrice ?? add.price) || 0;
      return sum + addPrice;
    }, 0);

    const discountedTotal = parseFloat(
      (discountedSizePrice + discountedAdditivesPrice).toFixed(2)
    );

    // 🔹 3️⃣ NEGOTIATION (fark)
    const negotiation = parseFloat(
      (originalTotal - discountedTotal).toFixed(2)
    );

    // 🔹 Seçilen additives’i her iki fiyatla birlikte kaydet
    const selectedAdditivesData = additivesInfo.map((add) => ({
      name: add.name,
      originalPrice: parseFloat(add.price) || 0,
      discountPrice: parseFloat(add.discountPrice ?? add.price) || 0,
    }));

    // 🆕 Ürün nesnesi
    const newItem = {
      uniqCartId,
      productId: product.id,
      name: product.name,
      imageUrl: products.imageUrl,
      selectedSize: selectedSize,
      sizeLabel: sizeInfo.size,
      selectedAdditives: selectedAdditivesData,
      originalPrice: originalTotal,
      discountPrice: discountedTotal,
      negotiation, // 💰 İndirim miktarı
    };

    // 🛒 LocalStorage’a ekle
    // const updatedCart = [...currentCart, newItem];
    // localStorage.setItem("selectedProducts", JSON.stringify(updatedCart));
    dispatch(addtocart(newItem));

    alert(`${product.name} added to cart!`);
    onClose();
  };

  if (loading) {
    return (
      <div className="modal-container">
        <div className="modal">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="modal-container"
        onClick={(e) => {
          // Eğer tıklama modalın kendisindeyse, yani modalın dışına tıklanmışsa
          if (e.target.classList.contains("modal-container")) {
            onClose();
          }
        }}
      >
        <div className="modalcarpi">
          <img
            src="./images/buttonclose.svg"
            alt="buttonclose"
            className="modalresmi"
            onClick={onClose}
          />
        </div>
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modal-container">
        <div className="modalcarpi">
          <img
            src="./images/buttonclose.svg"
            alt="buttonclose"
            className="modalresmi"
            onClick={onClose}
          />
        </div>
        <div className="modal">
          <div className="resimmodal">
            <img
              src={`./images/${product?.imageUrl}.png`}
              alt={product?.name}
              className="modaldakiresim"
            />
          </div>
          <div className="description-container">
            <div className="infocontainer">
              <span className="infotitle">{product?.name}</span>
              <span className="infodescription">{product?.description}</span>
            </div>
            <div className="sizecontainer">
              <span>size</span>
              <div className="boyutlar">
                {products?.sizes &&
                  Object.entries(products.sizes).map(([key, value]) => (
                    <div
                      key={key}
                      className={`boyut ${
                        selectedSize === key ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(key)}
                    >
                      <div
                        className={`daire ${
                          selectedSize === key ? "selected" : ""
                        }`}
                      >
                        {key}
                      </div>
                      <span
                        className={`miktar ${
                          selectedSize === key ? "selected" : ""
                        }`}
                      >
                        {value.size}
                      </span>
                    </div>
                  ))}
              </div>

              {/* <div className="boyut">
                <div className="daire"></div>
                <span className="miktar">200ml</span>
              </div> */}
            </div>
            <div className="additivescontainer">
              <span>Additives</span>
              <div className="additivies">
                {products?.additives &&
                  products.additives.map((add, index) => (
                    <div
                      key={add.name}
                      className={`boyut ${
                        selectedAdditives.includes(add.name) ? "selected" : ""
                      }`}
                      onClick={() => {
                        if (selectedAdditives.includes(add.name)) {
                          // Eğer zaten seçiliyse, çıkar
                          setSelectedAdditives((prev) =>
                            prev.filter((item) => item !== add.name)
                          );
                        } else {
                          // Seçili değilse, ekle
                          setSelectedAdditives((prev) => [...prev, add.name]);
                        }
                      }}
                    >
                      <div
                        className={`daire ${
                          selectedAdditives.includes(add.name) ? "selected" : ""
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`miktar ${
                          selectedAdditives.includes(add.name) ? "selected" : ""
                        }`}
                      >
                        {add.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {user ? (
              <div className="modaldakifiyatdivi">
                <span className="userligercekfiyat">
                  ${totalPrice?.toFixed(2)}
                </span>
                <span className="userlidisfiyat">
                  ${discountedPrice?.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="modaltotal">
                <span>Total:</span>
                <span>${totalPrice?.toFixed(2)}</span>
              </div>
            )}

            <div className="uyariyazisi">
              <img
                src="./images/infoempty.svg"
                alt="ino"
                style={{ width: "16px", height: "16px" }}
              />
              <span className="uyariyazisininyazisi">
                The cost is not final. Download our mobile app to see the final
                price and place your order. Earn loyalty points and enjoy your
                favorite coffee with up to 20% discount.
              </span>
            </div>
            <button className="addtoproduct" onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
