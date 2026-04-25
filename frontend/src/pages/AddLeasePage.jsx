import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { leasesAPI } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { FileText, ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AddLeasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenantId: "",
    propertyId: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leasesAPI.create(form);
      toast.success("Lease created successfully!");
      navigate("/leases");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to create lease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add Lease">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/leases")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Leases
        </button>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Create New Lease</h1>
              <p className="text-gray-400 text-sm">Assign a tenant to a property with an agreement</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="add-lease-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Tenant ID *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="MongoDB ObjectId"
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
                  placeholder="MongoDB ObjectId"
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Start Date *</label>
                <input
                  required
                  type="date"
                  className="input"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="label">End Date *</label>
                <input
                  required
                  type="date"
                  className="input"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/leases")}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 justify-center shadow-glow-sm"
                id="submit-lease-btn"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Create Lease</span>
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
