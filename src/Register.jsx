import { useState, useEffect } from "react";
import "./Register.css";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    login: z
      .string()
      .min(3, "Login must be at least 3 characters")
      .regex(/^[A-Za-z]+$/, "Login must contain only English letters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    city: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
    houseNumber: z.coerce
      .number({ invalid_type_error: "House number must be a number" })
      .min(2, "House number must be at least 2"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [isFormValid, setIsFormValid] = useState(false); // 🔹 yeni state
  const [apiError, setApiError] = useState(""); // API hatası için
  const [successMessage, setSuccessMessage] = useState(""); // ✅ yeni state
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 yeni state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    confirmPassword: "",
    city: "",
    street: "",
    houseNumber: "",
    paymentMethod: "card",
  });
  const [streets, setStreets] = useState([]);
  const cityStreets = {
    Istanbul: Array.from({ length: 10 }, (_, i) => `Istanbul Street ${i + 1}`),
    Ankara: Array.from({ length: 10 }, (_, i) => `Ankara Street ${i + 1}`),
    Izmir: Array.from({ length: 10 }, (_, i) => `Izmir Street ${i + 1}`),
  };
  const [errors, setErrors] = useState({});
  const handleBlur = (field, value) => {
    if (field === "houseNumber") {
      value = value === "" ? "" : Number(value);
    }
    let parsedData = { ...formData, [field]: value };
    setFormData(parsedData);

    try {
      //registerSchema.pick({ [field]: true }).parse({ [field]: value });
      z.object({ [field]: registerSchema.shape[field] }).parse({
        [field]: value,
      });

      // Özel refine durumu (şifre eşleşmesi) için kontrol
      if (field === "confirmPassword" && value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [field]: err.issues?.[0]?.message || "Invalid input",
      }));
    }
  };

  // 🔽 Şehir değiştiğinde otomatik sokak listesini güncelle
  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city, street: "" }));

    // Şehre göre 10 sokak ekle
    if (city && cityStreets[city]) {
      setStreets(cityStreets[city]);
    } else {
      setStreets([]);
    }

    // Validasyon için blur fonksiyonunu da çağır
  };

  const getInputClass = (field) => {
    if (errors[field]) return "input-error";
    if (formData[field] && !errors[field]) return "input-success";
    return "";
  };

  useEffect(() => {
    try {
      // houseNumber'i number'a çeviriyoruz çünkü input state string döndürüyor
      const dataToValidate = {
        ...formData,
        houseNumber:
          formData.houseNumber === "" ? "" : Number(formData.houseNumber),
      };
      registerSchema.parse(dataToValidate); // parse başarılıysa form geçerli
      setIsFormValid(true);
    } catch (err) {
      setIsFormValid(false); // hata varsa form geçerli değil
    }
  }, [formData]);

  //apiye istek atma durumları
  const handleSubmit = async (e) => {
    e.preventDefault(); // formun reload yapmasını engelle
    if (isSubmitting) return; // 👈 hızlı çift tıklama koruması

    setApiError("");
    setSuccessMessage(""); // önce temizle
    setIsSubmitting(true); // 🔹 butonu disable yap

    try {
      const payload = {
        login: formData.login,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        city: formData.city,
        street: formData.street,
        houseNumber: Number(formData.houseNumber),
        paymentMethod: formData.paymentMethod,
      };

      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccessMessage("✅ Register successfully, redirecting to menu..."); // ✅ mesaj göster

        localStorage.setItem(
          "user",
          JSON.stringify({
            login: formData.login,
            city: formData.city,
            street: formData.street,
            houseNumber: formData.houseNumber,
            paymentMethod: formData.paymentMethod,
          })
        );
        // Kayıt başarılı → menu sayfasına yönlendir
        setIsSubmitting(false);
        navigate("/order");
        window.location.reload();
      } else {
        // API hatası varsa göster
        console.log(data);
        setApiError(data.error || "Registration failed");
        setTimeout(() => {
          setApiError("");
          setIsSubmitting(false);
        }, 3000);
      }
    } catch (err) {
      setApiError("Network error, please try again later");
      setTimeout(() => {
        setApiError("");
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <>
      {" "}
      <div className="genelcontainer">
        <div className="registercontainer">
          <span className="registirationyazisi">Registration</span>
          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="herseydahil">
              <div className="herseydahilalti">
                <div className="uclugrup">
                  <div className="ucunbiri">
                    <label htmlFor="login">Login</label>
                    <input
                      className={`uclununinputu ${getInputClass("login")}`}
                      type="text"
                      id="login"
                      name="login"
                      placeholder="Login"
                      onBlur={(e) => handleBlur("login", e.target.value)}
                    />
                    <span id="loginuyari" className="uyari">
                      {errors.login}
                    </span>
                  </div>
                  <div className="ucunbiri">
                    <label htmlFor="password">Password</label>
                    <input
                      className={`uclununinputu ${getInputClass("password")}`}
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onBlur={(e) => handleBlur("password", e.target.value)}
                    />
                    <span id="passworduyari" className="uyari">
                      {errors.password}
                    </span>
                  </div>
                  <div className="ucunbiri">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      className={`uclununinputu ${getInputClass(
                        "confirmPassword"
                      )}`}
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="confirm Password"
                      onBlur={(e) =>
                        handleBlur("confirmPassword", e.target.value)
                      }
                    />
                    <span id="confirmPassworduyari" className="uyari">
                      {errors.confirmPassword}
                    </span>
                  </div>
                </div>
                <div className="dortlugrup">
                  <div className="dordunbiri">
                    <label htmlFor="city">City</label>
                    <select
                      className={`dorduninputu ${getInputClass("city")}`}
                      id="city"
                      name="city"
                      onChange={handleCityChange}
                      value={formData.city}
                      onBlur={(e) => handleBlur("city", e.target.value)}
                    >
                      <option value="">select a city</option>
                      <option value="Istanbul">Istanbul</option>
                      <option value="Ankara">Ankara</option>
                      <option value="Izmir">Izmir</option>
                    </select>
                    <span id="cityuyari" className="uyari">
                      {errors.city}
                    </span>
                  </div>
                  <div className="dordunbiri">
                    <label htmlFor="street">Street</label>
                    <select
                      className={`dorduninputu ${getInputClass("street")}`}
                      id="street"
                      name="street"
                      onBlur={(e) => handleBlur("street", e.target.value)}
                      value={formData.street} // 🟢 eklendi
                      onChange={(
                        e // 🟢 eklendi
                      ) =>
                        setFormData((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select a street</option>
                      {streets.map((street, index) => (
                        <option key={index} value={street}>
                          {street}
                        </option>
                      ))}
                    </select>
                    <span id="streetuyari" className="uyari">
                      {" "}
                      {errors.street}
                    </span>
                  </div>
                  <div className="dordunbiri">
                    <label htmlFor="houseNumber">House Number</label>
                    <input
                      className={`dorduninputu ${getInputClass("houseNumber")}`}
                      type="number"
                      min="2"
                      id="houseNumber"
                      name="houseNumber"
                      placeholder="House Number"
                      onBlur={(e) => handleBlur("houseNumber", e.target.value)}
                    />
                    <span id="houseNumberuyari" className="uyari">
                      {" "}
                      {errors.houseNumber}
                    </span>
                  </div>
                  <div className="dordunsonu">
                    <legend>Pay by</legend>
                    <div
                      style={{
                        display: "flex",
                        gap: "24px",
                        width: "156px",
                        height: "24px",
                      }}
                    >
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          defaultChecked
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value,
                            }))
                          }
                        />
                        card
                      </label>

                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: e.target.value,
                            }))
                          }
                        />
                        cash
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="butonundivi">
                <button
                  className="kayitolbutonu"
                  type="submit"
                  disabled={!isFormValid || isSubmitting} // 🔹 ekleme
                >
                  Registration
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* <div className="register-result"></div> */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {apiError && <p className="hata">{apiError}</p>}
      </div>
    </>
  );
}
