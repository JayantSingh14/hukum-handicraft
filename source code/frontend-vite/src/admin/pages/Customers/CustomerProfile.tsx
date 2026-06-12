import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchCustomerProfile, blockCustomer, unblockCustomer } from "../../../Redux Toolkit/Admin/adminCustomerSlice";

const StatusBadge = ({ status }: { status: string }) => {
  const cls = status === "BANNED"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`font-sans text-[9px] font-bold tracking-widest uppercase px-3 py-1 border ${cls}`}>
      {status}
    </span>
  );
};

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-brand-gold/15 p-5 space-y-4">
    <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/50 border-b border-brand-gold/10 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

const CustomerProfile = () => {
  const { customerId } = useParams();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((s) => s.adminCustomers);

  useEffect(() => {
    if (customerId) dispatch(fetchCustomerProfile(Number(customerId)));
  }, [dispatch, customerId]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-sans text-xs text-charcoal/40 tracking-wider">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15 flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
            Customer Profile
          </span>
          <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
            {profile.fullName}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={profile.accountStatus} />
          {profile.accountStatus === "BANNED" ? (
            <button
              onClick={() => dispatch(unblockCustomer(profile.id))}
              className="px-5 py-2 border border-emerald-600 text-emerald-600 font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-emerald-50 transition-all duration-200"
            >
              Unblock Customer
            </button>
          ) : (
            <button
              onClick={() => dispatch(blockCustomer(profile.id))}
              className="px-5 py-2 border border-red-600 text-red-600 font-sans text-xs tracking-[0.2em] uppercase font-semibold hover:bg-red-50 transition-all duration-200"
            >
              Block Customer
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-brand-gold/15 p-5 text-center space-y-1">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/50 font-bold">Total Orders</p>
          <p className="font-serif text-3xl font-bold text-matte-black">{profile.totalOrders}</p>
        </div>
        <div className="bg-white border border-brand-gold/15 p-5 text-center space-y-1">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/50 font-bold">Total Spend</p>
          <p className="font-serif text-3xl font-bold text-brand-gold">₹{profile.totalSpend.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-brand-gold/15 p-5 text-center space-y-1">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/50 font-bold">Member Since</p>
          <p className="font-sans text-sm font-semibold text-charcoal py-2">
            {profile.registrationDate ? new Date(profile.registrationDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "—"}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <SectionCard title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm">
          <div>
            <span className="text-charcoal/50 text-xs uppercase tracking-wider block">Email Address</span>
            <span className="font-semibold text-matte-black">{profile.email}</span>
          </div>
          <div>
            <span className="text-charcoal/50 text-xs uppercase tracking-wider block">Mobile Number</span>
            <span className="font-semibold text-matte-black">{profile.mobile || "—"}</span>
          </div>
        </div>
      </SectionCard>

      {/* Order History */}
      <SectionCard title="Order History">
        <div className="space-y-0">
          {profile.orderHistory?.map((order, i) => (
            <div
              key={order.id}
              className={`flex justify-between items-center py-4 ${
                i < (profile.orderHistory?.length || 0) - 1 ? "border-b border-brand-gold/8" : ""
              }`}
            >
              <div className="space-y-1">
                <p className="font-sans font-semibold text-xs text-matte-black">
                  {order.orderId || `#${order.id}`}
                </p>
                <p className="font-sans text-[11px] text-charcoal/50">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-serif font-bold text-sm text-matte-black">₹{order.totalSellingPrice}</p>
                <span className="inline-block font-sans text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 border border-brand-gold/25 bg-brand-gold/8 text-brand-gold">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          ))}
          {(!profile.orderHistory || profile.orderHistory.length === 0) && (
            <p className="font-sans text-xs text-charcoal/40 italic py-2">No orders recorded yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default CustomerProfile;
