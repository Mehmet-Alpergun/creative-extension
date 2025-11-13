import { useState, useEffect } from "react";
import "./Signin.css";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
const signinschema = z.object({
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
});
export default function Signin() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // 🔹 yeni state
  const [apiError, setApiError] = useState(""); // API hatası için
  const [successMessage, setSuccessMessage] = useState(""); // ✅ yeni state
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 yeni state

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleBlur = (field, value) => {
    let parsedData = { ...formData, [field]: value };
    setFormData(parsedData);

    try {
      //registerSchema.pick({ [field]: true }).parse({ [field]: value });
      z.object({ [field]: signinschema.shape[field] }).parse({
        [field]: value,
      });

      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [field]: err.issues?.[0]?.message || "Invalid input",
      }));
    }
  };
  const getInputClass = (field) => {
    if (errors[field]) return "input-error";
    if (formData[field] && !errors[field]) return "input-success";
    return "";
  };
  useEffect(() => {
    try {
      // houseNumber'i number'a çeviriyoruz çünkü input state string döndürüyor
      // const dataToValidate = {
      //   ...formData,
      //   houseNumber:
      //     formData.houseNumber === "" ? "" : Number(formData.houseNumber),
      // };
      signinschema.parse(formData); // parse başarılıysa form geçerli
      setIsFormValid(true);
    } catch (err) {
      setIsFormValid(false); // hata varsa form geçerli değil
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setApiError("");
    setSuccessMessage(""); // önce temizle
    setIsSubmitting(true); // 🔹 butonu disable yap

    try {
      const payload = {
        login: formData.login,
        password: formData.password,
      };
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log("burrrrrrrrr");
      console.log(data.data.user);
      if (response.ok) {
        const user = data.data.user;
        // if (!user) throw new Error("User object missing");
        setSuccessMessage("✅ Login successfully, redirecting to menu..."); // ✅ mesaj göster

        localStorage.setItem("user", JSON.stringify(user));

        setIsSubmitting(false);
        navigate("/order");
        window.location.reload();
      } else {
        setApiError(data.error || "Registration failed");
        setTimeout(() => {
          setApiError("");
          setIsSubmitting(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Something went wrong. Please try again.");
      setTimeout(() => {
        setApiError("");
        setIsSubmitting(false);
      }, 3000);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="yazidadahil">
          <span
            style={{ fontSize: "60px", fontWeight: "600", color: "#403f3d" }}
          >
            Sign in
          </span>
          <div className="formustu">
            <form
              autoComplete="off"
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
              onSubmit={handleSubmit}
            >
              <div className="formalti">
                <div className="signlogin">
                  <label htmlFor="login">Login</label>
                  <input
                    // className="signlogininput"
                    className={`signlogininput ${getInputClass("login")}`}
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
                <div className="siginpassword">
                  <label htmlFor="password">Password</label>
                  <input
                    // className="siginpasswordinput"
                    className={`siginpasswordinput ${getInputClass(
                      "password"
                    )}`}
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
              </div>
              <div className="butonundivi">
                <button
                  className="kayitolbutonu"
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {apiError && <p className="hata">{apiError}</p>}
        </div>
      </div>
    </>
  );
}
