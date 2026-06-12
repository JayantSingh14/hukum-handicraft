import { useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchDashboard } from "../../../Redux Toolkit/Admin/adminDashboardSlice";
import { CircularProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";
import type { ReactNode } from "react";

// Brand palette for charts
const CHART_GOLD = "#C8A24A";
const CHART_BLACK = "#0F0F0F";
const CHART_CHARCOAL = "#4A4A4A";
const CHART_CHAMPAGNE = "#D8B56A";
const CHART_MUTED = "#8E7B5A";
const PIE_COLORS = [CHART_GOLD, CHART_BLACK, CHART_CHAMPAGNE, CHART_CHARCOAL, CHART_MUTED];

// Shared chart axis/grid styles
const axisStyle = { fontSize: 11, fontFamily: "Inter, sans-serif", fill: "#999" };
const gridStyle = { stroke: "rgba(200,162,74,0.08)" };

// Reusable stat card
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}

const MetricCard = ({ title, value, icon, accent = "#C8A24A" }: MetricCardProps) => (
  <div
    className="bg-white border border-brand-gold/15 p-5 relative overflow-hidden group hover:border-brand-gold/40 transition-all duration-200"
    style={{ borderLeftWidth: "3px", borderLeftColor: accent }}
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/50 font-semibold">
          {title}
        </p>
        <p className="font-serif text-2xl font-bold text-matte-black">{value}</p>
      </div>
      <div
        className="p-2.5 flex items-center justify-center"
        style={{ backgroundColor: accent + "15", color: accent }}
      >
        {icon}
      </div>
    </div>
  </div>
);

// Section card wrapper
const SectionCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="bg-white border border-brand-gold/15 p-5 space-y-4">
    <h2 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-charcoal/50 border-b border-brand-gold/10 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

// Status badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, string> = {
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
    RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  };
  const cls = statusMap[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`text-[9px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 border ${cls}`}>
      {status}
    </span>
  );
};

const AdminDashboardHome = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((s) => s.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size={28} sx={{ color: "#C8A24A" }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-sans text-sm text-red-500">
          {error || "Failed to load dashboard data. Please refresh the page."}
        </p>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-5 border-b border-brand-gold/15">
        <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
          Command Centre
        </span>
        <h1 className="font-serif text-3xl font-semibold text-matte-black uppercase tracking-wide">
          Admin Dashboard
        </h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard title="Total Revenue" value={`₹${metrics.totalRevenue.toLocaleString()}`} icon={<TrendingUpIcon fontSize="small" />} accent={CHART_GOLD} />
        <MetricCard title="Today's Revenue" value={`₹${metrics.todayRevenue.toLocaleString()}`} icon={<TrendingUpIcon fontSize="small" />} accent={CHART_CHAMPAGNE} />
        <MetricCard title="Monthly Revenue" value={`₹${metrics.monthlyRevenue.toLocaleString()}`} icon={<TrendingUpIcon fontSize="small" />} accent="#4A90D9" />
        <MetricCard title="Total Orders" value={metrics.totalOrders} icon={<ShoppingCartIcon fontSize="small" />} accent={CHART_BLACK} />
        <MetricCard title="Pending" value={metrics.pendingOrders} icon={<ShoppingCartIcon fontSize="small" />} accent="#D4A017" />
        <MetricCard title="Delivered" value={metrics.deliveredOrders} icon={<ShoppingCartIcon fontSize="small" />} accent="#2D8A5B" />
        <MetricCard title="Cancelled" value={metrics.cancelledOrders} icon={<ShoppingCartIcon fontSize="small" />} accent="#C0392B" />
        <MetricCard title="Returned" value={metrics.returnedOrders} icon={<ShoppingCartIcon fontSize="small" />} accent="#E67E22" />
        <MetricCard title="Customers" value={metrics.totalCustomers} icon={<PeopleIcon fontSize="small" />} accent="#4A90D9" />
        <MetricCard title="Products" value={metrics.totalProducts} icon={<InventoryIcon fontSize="small" />} accent={CHART_GOLD} />
        <MetricCard title="Categories" value={metrics.totalCategories} icon={<InventoryIcon fontSize="small" />} accent={CHART_CHARCOAL} />
        <MetricCard title="Reviews" value={metrics.totalReviews} icon={<StarIcon fontSize="small" />} accent={CHART_CHAMPAGNE} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Revenue by Month">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.revenueByMonth}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_GOLD} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
              <XAxis dataKey="label" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip
                contentStyle={{ borderRadius: 0, border: "1px solid rgba(200,162,74,0.2)", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="value" stroke={CHART_GOLD} strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Orders by Month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.ordersByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
              <XAxis dataKey="label" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip
                contentStyle={{ borderRadius: 0, border: "1px solid rgba(200,162,74,0.2)", fontSize: 12, fontFamily: "Inter, sans-serif" }}
              />
              <Bar dataKey="value" fill={CHART_BLACK} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Product Sales Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.productSalesDistribution}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={40}
                paddingAngle={2}
              >
                {data.productSalesDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 0, border: "1px solid rgba(200,162,74,0.2)", fontSize: 12, fontFamily: "Inter, sans-serif" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Inter, sans-serif" }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Customer Growth">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
              <XAxis dataKey="label" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip
                contentStyle={{ borderRadius: 0, border: "1px solid rgba(200,162,74,0.2)", fontSize: 12, fontFamily: "Inter, sans-serif" }}
              />
              <Bar dataKey="value" fill={CHART_GOLD} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <SectionCard title="Recent Orders">
          <div className="space-y-0">
            {data.recentOrders.slice(0, 5).map((order, i) => (
              <div
                key={order.id}
                className={`flex justify-between items-center py-3 ${i < 4 ? "border-b border-brand-gold/8" : ""}`}
              >
                <div className="space-y-0.5">
                  <p className="font-sans font-semibold text-xs text-matte-black">
                    {order.orderId || `#${order.id}`}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal/50">
                    {order.user?.fullName || order.user?.email}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-serif font-semibold text-sm text-matte-black">₹{order.totalSellingPrice}</p>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Low Stock */}
        <SectionCard title="Low Stock Alert">
          <div className="space-y-0">
            {data.lowStockProducts.length === 0 ? (
              <p className="font-sans text-xs text-charcoal/40 italic py-2">All products are well stocked.</p>
            ) : (
              data.lowStockProducts.slice(0, 5).map((product, i) => (
                <div
                  key={product.id}
                  className={`flex justify-between items-center py-3 ${i < 4 ? "border-b border-brand-gold/8" : ""}`}
                >
                  <p className="font-sans text-xs text-charcoal truncate flex-1 mr-4">{product.title}</p>
                  <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border bg-red-50 text-red-700 border-red-200 shrink-0">
                    {product.quantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        {/* Top Sellers */}
        <SectionCard title="Top Selling Products">
          <div className="space-y-0">
            {data.topSellingProducts.slice(0, 5).map((product, i) => (
              <div
                key={product.productId}
                className={`flex justify-between items-center py-3 ${i < 4 ? "border-b border-brand-gold/8" : ""}`}
              >
                <p className="font-sans text-xs text-charcoal truncate flex-1 mr-4">{product.productName}</p>
                <span className="font-sans text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border bg-brand-gold/10 text-brand-gold border-brand-gold/25 shrink-0">
                  {product.totalSold} sold
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Customers */}
        <SectionCard title="Recent Customers">
          <div className="space-y-0">
            {data.recentCustomers.slice(0, 5).map((customer, i) => (
              <div
                key={customer.id}
                className={`flex items-center gap-3 py-3 ${i < 4 ? "border-b border-brand-gold/8" : ""}`}
              >
                <div className="w-7 h-7 bg-matte-black text-brand-gold flex items-center justify-center font-serif font-bold text-xs shrink-0">
                  {customer.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <p className="font-sans font-semibold text-xs text-matte-black truncate">{customer.fullName}</p>
                  <p className="font-sans text-[11px] text-charcoal/50 truncate">{customer.email}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
