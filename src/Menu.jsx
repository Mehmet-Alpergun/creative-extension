import { useEffect, useState } from "react";
import "./Menu.css";
import Cart from "./components/Cart";
import ProductModal from "./components/ProductModal";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("coffee"); // default coffee
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products"
        );
        if (!res.ok) throw new Error("Veri çekilemedi!");

        const json = await res.json();
        const cleanedData = json.data.map((item) => ({
          ...item,
          imageUrl: item.name.replace(/\s+/g, ""),
        }));

        setProducts(cleanedData);
        console.log(cleanedData);
        //setProducts(data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => p.category === category);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="menu-container">
          <div className="offering">
            <span className="offering-text">
              <span className="line">Behind each of our</span>
              <br className="brulan" />
              <span className="line">cups hides an</span>{" "}
              <br className="brulan" />
              <span className="line-accent">amazing surprise</span>
            </span>
            <div className="tab-container">
              <div
                id="coffeebtn"
                className={`coffee-container ${
                  category === "coffee" ? "active" : ""
                }`}
                onClick={() => setCategory("coffee")}
              >
                <div
                  className={`coffee-round ${
                    category === "coffee" ? "active" : ""
                  }`}
                >
                  <img
                    src="./images/cofferound.png"
                    alt="beyaz"
                    //   style="width: 20px; height: 20px"
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>
                <span
                  className={`coffee-text ${
                    category === "coffee" ? "active" : ""
                  }`}
                >
                  coffee
                </span>
              </div>
              <div
                id="teabutton"
                className={`tea-container ${
                  category === "tea" ? "active" : ""
                }`}
                onClick={() => setCategory("tea")}
              >
                <div
                  className={`tea-round ${category === "tea" ? "active" : ""}`}
                >
                  <img
                    src="./images/beyaztepot.png"
                    alt="beyaz"
                    //   style="width: 20px; height: 20px"
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>
                <span
                  className={`tea-text ${category === "tea" ? "active" : ""}`}
                >
                  Tea
                </span>
              </div>
              <div
                id="dessertbtn"
                className={`dessert-container ${
                  category === "dessert" ? "active" : ""
                }`}
                onClick={() => setCategory("dessert")}
              >
                <div
                  className={`dessert-round ${
                    category === "dessert" ? "active" : ""
                  }`}
                >
                  <img
                    src="./images/dessertround.png"
                    alt="beyaz"
                    //   style="width: 20px; height: 20px"
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>
                <span
                  className={`dessert-text ${
                    category === "dessert" ? "active" : ""
                  }`}
                >
                  Dessert
                </span>
              </div>
            </div>
          </div>
          {/* ajsd */}
          {loading && <p>Loading...</p>}
          {error && <p>Something went wrong! please refresh page</p>}
          <div className="menu-products">
            {!loading && !error && (
              <>
                {filteredProducts.map((p) => (
                  <Cart
                    key={p.id}
                    item={p}
                    onClick={() => setSelectedProduct(p)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div></div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
