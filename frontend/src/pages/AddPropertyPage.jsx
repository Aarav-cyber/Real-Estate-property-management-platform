import { useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Loader2, Building2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    rent: "",
    amenities: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.rent || form.rent <= 0) newErrors.rent = "Rent must be greater than 0";
    if (!form.amenities.trim()) newErrors.amenities = "Amenities are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        rent: Number(form.rent),
      };
      await axios.post("/properties", payload);
      toast.success("Property added successfully!");
      navigate("/properties");
    } catch (err) {
      console.error("Error response:", err.response);
      const errorMessage = err.response?.data?.message || "Failed to add property";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add Property">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/properties")}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            id="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display font-bold text-3xl text-white flex items-center gap-2">
              <Building2 size={28} className="text-primary-500" />
              Add New Property
            </h1>
            <p className="text-gray-400 text-sm mt-1">Create a new property listing in the system</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6" id="add-property-form">
            {/* Title Field */}
            <div>
              <label className="label">Property Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Luxury 3BHK Apartment"
                className={`input ${errors.title ? "border-red-500/50 bg-red-500/5" : ""}`}
                id="property-title"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Location Field */}
            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Koramangala, Bangalore"
                className={`input ${errors.location ? "border-red-500/50 bg-red-500/5" : ""}`}
                id="property-location"
              />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Rent Field */}
            <div>
              <label className="label">Monthly Rent (₹) *</label>
              <input
                type="number"
                name="rent"
                value={form.rent}
                onChange={handleChange}
                placeholder="e.g. 25000"
                min="0"
                className={`input ${errors.rent ? "border-red-500/50 bg-red-500/5" : ""}`}
                id="property-rent"
              />
              {errors.rent && <p className="text-red-400 text-sm mt-1">{errors.rent}</p>}
            </div>

            {/* Amenities Field */}
            <div>
              <label className="label">Amenities *</label>
              <textarea
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g. Swimming Pool, Gym, Parking, Security"
                rows="4"
                className={`input resize-none ${errors.amenities ? "border-red-500/50 bg-red-500/5" : ""}`}
                id="property-amenities"
              />
              {errors.amenities && <p className="text-red-400 text-sm mt-1">{errors.amenities}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/properties")}
                className="btn-secondary flex-1 justify-center"
                id="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 justify-center shadow-glow-sm"
                id="submit-button"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Building2 size={16} />
                    <span>Add Property</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-sm">
            <span className="font-semibold">Tip:</span> Make sure all fields are filled correctly. You can edit this property later from the Properties page.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}