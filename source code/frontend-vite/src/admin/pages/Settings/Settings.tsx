import React, { useEffect } from "react";
import { TextField, Switch, FormControlLabel, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchStoreSettings, updateStoreSettings, resetSaved } from "../../../Redux Toolkit/Admin/adminSettingsSlice";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    fontSize: "0.8rem",
    "& fieldset": { borderColor: "rgba(200,162,74,0.25)" },
    "&:hover fieldset": { borderColor: "#C8A24A" },
    "&.Mui-focused fieldset": { borderColor: "#C8A24A" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#C8A24A" },
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-brand-gold/15 p-6 space-y-4">
    <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/50 border-b border-brand-gold/10 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

const Settings = () => {
  const dispatch = useAppDispatch();
  const { settings, saved } = useAppSelector((s) => s.adminSettings);
  const [form, setForm] = React.useState(settings);

  useEffect(() => {
    dispatch(fetchStoreSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => dispatch(resetSaved()), 3000);
      return () => clearTimeout(t);
    }
  }, [saved, dispatch]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (form) dispatch(updateStoreSettings(form));
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-sans text-xs text-charcoal/40 tracking-wider">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15 flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
            Configuration
          </span>
          <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
            Store Settings
          </h1>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-matte-black text-brand-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-brand-gold hover:text-matte-black transition-all duration-200 border border-transparent"
        >
          Save Settings
        </button>
      </div>

      {saved && (
        <Alert
          severity="success"
          sx={{ borderRadius: 0, border: "1px solid rgba(46, 125, 50, 0.2)", bgcolor: "#f8fdf9", color: "#2e7d32" }}
        >
          Settings saved successfully
        </Alert>
      )}

      {/* Store Info */}
      <SectionCard title="Store Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField fullWidth size="small" sx={fieldSx} label="Store Name" value={form.storeName || ""} onChange={(e) => handleChange("storeName", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="Store Logo URL" value={form.storeLogo || ""} onChange={(e) => handleChange("storeLogo", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="Contact Number" value={form.contactNumber || ""} onChange={(e) => handleChange("contactNumber", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="Support Email" value={form.supportEmail || ""} onChange={(e) => handleChange("supportEmail", e.target.value)} />
        </div>
      </SectionCard>

      {/* Social Media */}
      <SectionCard title="Social Media links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField fullWidth size="small" sx={fieldSx} label="Facebook" value={form.facebookUrl || ""} onChange={(e) => handleChange("facebookUrl", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="Instagram" value={form.instagramUrl || ""} onChange={(e) => handleChange("instagramUrl", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="Twitter" value={form.twitterUrl || ""} onChange={(e) => handleChange("twitterUrl", e.target.value)} />
          <TextField fullWidth size="small" sx={fieldSx} label="YouTube" value={form.youtubeUrl || ""} onChange={(e) => handleChange("youtubeUrl", e.target.value)} />
        </div>
      </SectionCard>

      {/* Payment Gateway */}
      <SectionCard title="Payment Gateways">
        <div className="flex gap-8">
          <FormControlLabel
            control={<Switch checked={form.razorpayEnabled} onChange={(e) => handleChange("razorpayEnabled", e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#C8A24A" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#C8A24A" } }} />}
            label={<span className="font-sans text-xs uppercase tracking-wider text-charcoal font-semibold">Enable Razorpay</span>}
          />
          <FormControlLabel
            control={<Switch checked={form.stripeEnabled} onChange={(e) => handleChange("stripeEnabled", e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#C8A24A" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#C8A24A" } }} />}
            label={<span className="font-sans text-xs uppercase tracking-wider text-charcoal font-semibold">Enable Stripe</span>}
          />
        </div>
      </SectionCard>

      {/* SMTP */}
      <SectionCard title="Email (SMTP) Settings">
        <div className="space-y-4">
          <FormControlLabel
            control={<Switch checked={form.smtpEnabled} onChange={(e) => handleChange("smtpEnabled", e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#C8A24A" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#C8A24A" } }} />}
            label={<span className="font-sans text-xs uppercase tracking-wider text-charcoal font-semibold">Enable SMTP Mail Service</span>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField fullWidth size="small" sx={fieldSx} label="SMTP Host" value={form.smtpHost || ""} onChange={(e) => handleChange("smtpHost", e.target.value)} />
            <TextField fullWidth size="small" sx={fieldSx} label="SMTP Port" type="number" value={form.smtpPort || ""} onChange={(e) => handleChange("smtpPort", Number(e.target.value))} />
            <TextField fullWidth size="small" sx={fieldSx} label="SMTP Username" value={form.smtpUsername || ""} onChange={(e) => handleChange("smtpUsername", e.target.value)} />
            <TextField fullWidth size="small" sx={fieldSx} label="SMTP Password" type="password" value={form.smtpPassword || ""} onChange={(e) => handleChange("smtpPassword", e.target.value)} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default Settings;
