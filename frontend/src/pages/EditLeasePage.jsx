import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { leasesAPI } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { FileText, ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditLeasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tenantId: "",
    propertyId: "",
    startDate: "",
    endDate: "",
    status: "active"
  });

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      const res = await leasesAPI.getById(id);
      const lease = res.data.data;
      setForm({
        tenantId: lease.tenant?._id || lease.tenant || "",
        propertyId: lease.property?._id || lease.property || "",
        startDate: lease.startDate ? lease.startDate.split('T')[0] : "",
        endDate: lease.endDate ? lease.endDate.split('T')[0] : "",
        status: lease.status || "active"
      });
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load lease data");
      navigate("/leases");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leasesAPI.update(id, form);
      toast.success("Lease updated successfully!");
      navigate("/leases");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to update lease");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Lease">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-primary-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Lease">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/leases")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Leases
        </button>

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Edit Lease Agreement</h1>
              <p className="text-gray-400 text-sm">Modify terms or status of the existing lease</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="edit-lease-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Tenant ID *</label>
                <input
                  required
                  type="text"
                  className="input"
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

            <div>
              <label className="label">Status</label>
              <select 
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
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
                disabled={submitting}
                className="btn-primary flex-1 justify-center shadow-glow-sm"
                id="update-lease-btn"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
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
