import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Contactus.css";
import emailjs from "@emailjs/browser";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(3, "Subject must be at least 3 characters long"),
  email: z.string().email("Please enter a valid email address"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

export default function Contactus() {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    const serviceId = "service_y1zmo98";
    const templateId = "template_klorwbw";
    const publicKey = "uoOQ-R84p0H8ku7ZR";

    const template = {
      subject: data.name,
      from_email: data.email,
      to_name: "dear coffee house",
      message: data.content,
    };
    setIsSending(true);
    setStatusMessage("Sending email...");

    emailjs.send(serviceId, templateId, template, publicKey).then(
      (result) => {
        console.log("Email gönderildi:", result.text);
        // alert("Email successfully sent!");
        setStatusMessage("Email successfully sent!");
        setTimeout(() => {
          setStatusMessage("");
        }, 3000);
        reset(); // formu temizler
        setIsSending(false);
      },
      (error) => {
        console.error("Hata oluştu:", error.text);
        //alert("Failed to send email. Please try again.");
        setStatusMessage("Failed to send email. Please try again.");
        setTimeout(() => {
          setStatusMessage("");
        }, 3000);
        reset(); // formu temizler
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      <span className="cotactyazi">Contact us</span>
      <form onSubmit={handleSubmit(onSubmit)} className="formun">
        <div className="inputdivleri">
          <label htmlFor="name">
            Subject <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="text"
            placeholder="Subject"
            className="subjectinput"
            {...register("name")}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="inputdivleri">
          <label htmlFor="email">
            Email <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="mailinput"
            {...register("email")}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="contnentdivleri">
          <label htmlFor="content">
            Content <span style={{ color: "red" }}> *</span>
          </label>
          <textarea
            placeholder="Content"
            className="contentinput"
            {...register("content")}
            cols={30}
            rows={7}
          ></textarea>
          {errors.content && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.content.message}
            </span>
          )}
        </div>

        <div className="butondivi">
          <button className="butonundur" disabled={isSending}>
            {" "}
            {isSending ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
      {statusMessage && (
        <p
          style={{
            color:
              statusMessage.includes("Failed") ||
              statusMessage.includes("error")
                ? "red"
                : isSending
                ? "blue"
                : "green",
            fontWeight: "500",
            marginTop: "10px",
          }}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
