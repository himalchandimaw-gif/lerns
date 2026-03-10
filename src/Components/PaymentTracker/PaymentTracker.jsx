"use client";
import { useState, useEffect } from "react";
import "./PaymentTracker.css";

export default function PaymentTracker({ student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!student?.nic) return;
    fetchPayments();
  }, [student?.nic]);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/payments?nic=${student.nic}`);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Fetch payments error:", err);
    }
  };

  const isPaid = (installment) => payments.some((p) => p.installment === installment);

  const getWhatsappStatus = (installment) => {
    const payment = payments.find((p) => p.installment === installment);
    return payment?.whatsappStatus || "pending"; // pending / sent / failed
  };

  const handlePay = async (installment) => {
    const amount = parseFloat(prompt(`Enter amount for installment ${installment}:`));
    if (!amount || isNaN(amount)) return alert("Enter a valid amount");

    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nic: student.nic, installment, amount }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert("❌ " + data.error);
      } else {
        await fetchPayments();
        alert(`✅ Payment recorded. WhatsApp notification attempted.`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (installment) => {
    if (!confirm(`Cancel payment for installment ${installment}?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nic: student.nic, installment }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert("❌ " + data.error);
      } else {
        await fetchPayments();
      }
    } catch (err) {
      console.error("Cancel payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-tracker">
      <h4>
        {student.name} ({student.nic})
      </h4>
      <p>
        <strong>Total Paid:</strong> Rs{" "}
        {payments.reduce((sum, p) => sum + p.amount, 0)}
      </p>

      <div className="installments">
        {[1, 2, 3].map((i) => {
          const paid = isPaid(i);
          const whatsappStatus = getWhatsappStatus(i);

          return (
            <div key={i} className="installment-row">
              <button
                onClick={() => (paid ? null : handlePay(i))}
                disabled={loading || paid}
                className={`installment-btn ${paid ? "paid" : "unpaid"}`}
              >
                {paid
                  ? `Installment ${i} ✓`
                  : `Pay Installment ${i}`}
              </button>

              {paid && (
                <>
                  <button
                    onClick={() => handleCancel(i)}
                    disabled={loading}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <span className={`whatsapp-status ${whatsappStatus}`}>
                    {whatsappStatus === "sent"
                      ? "✅ WhatsApp sent"
                      : whatsappStatus === "failed"
                      ? "❌ WhatsApp failed"
                      : "⚠️ Pending"}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
