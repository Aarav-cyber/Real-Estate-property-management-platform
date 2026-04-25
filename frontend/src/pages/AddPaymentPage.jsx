import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import DashboardLayout from "../components/DashboardLayout";
import { CreditCard, ArrowLeft, Loader2, Save, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

export default function AddPaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenantId: "",
    propertyId: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    status: "paid",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/payments", {
        ...form,
        amount: Number(form.amount)
      });
      alert("Payment added");
      navigate("/payments");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to add payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add Payment">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/payments")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Payments
        </button>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Record Manual Payment</h1>
              <p className="text-gray-400 text-sm">Manually add a payment transaction to the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="add-payment-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Tenant ID *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Tenant's MongoDB ObjectId"
                  value={form.tenantId}
                  onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Property ID *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Property's MongoDB ObjectId"
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Amount (₹) *</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    required
                    type="number"
                    min="1"
                    className="input pl-10"
                    placeholder="e.g. 25000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Payment Date *</label>
                <input
                  required
                  type="date"
                  className="input"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Status</label>
              <select 
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/payments")}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 justify-center shadow-glow-sm"
                id="submit-payment-btn"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Record Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
