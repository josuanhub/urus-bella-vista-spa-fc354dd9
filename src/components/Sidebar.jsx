import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  ShoppingBag,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Citas",
    path: "/citas",
    icon: Calendar,
  },
  {
    label: "Clientes",
    path: "/clientes",
    icon: Users,
  },
  {
    label: "Servicios",
    path: "/servicios",
    icon: Scissors,
  },
  {
    label: "Productos",
    path: "/productos",
    icon: ShoppingBag,
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: BarChart2,
  },
  {
    label: "Configuración",
    path: "/configuracion",
    icon: Settings,
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30
          flex flex-col
          transition-all duration-300 ease-in-out
          border-r border-white/5
          ${collapsed ? "w-[70px]" : "w-[240px]"}
        `}
        style={{ background: "#0A0A0F" }}
      >
        {/* Gradient top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, #6C63FF, #00D4AA)",
          }}
        />

        {/* Logo / Header */}
        <div
          className={`
            flex items-center gap-3 px-4 py-5
            border-b border-white/5
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Icon */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
              }}
            >
              <Sparkles size={18} className="text-white" />
            </div>

            {/* Logo Text */}
            {!collapsed && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-[11px] font-semibold leading-tight truncate"
                  style={{ color: "#00D4AA" }}>
                  Sistema
                </p>
                <p className="text-[13px] font-bold leading-tight truncate text-white">
                  Bella Vista Spa
                </p>
              </div>
            )}
          </div>

          {/* Toggle button — visible on desktop */}
          <button
            onClick={onToggle}
            className={`
              hidden lg:flex flex-shrink-0
              w-7 h-7 rounded-lg items-center justify-center
              text-white/40 hover:text-white
              transition-all duration-200
              hover:bg-white/10
              ${collapsed ? "mx-auto mt-1" : ""}
            `}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`
                  group relative flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  transition-all duration-200 cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${
                    active
                      ? "text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,170,0.1))",
                        boxShadow: "inset 0 0 0 1px rgba(108,99,255,0.3)",
                      }
                    : {}
                }
              >
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #6C63FF, #00D4AA)",
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    active ? "" : "group-hover:scale-110"
                  }`}
                  style={active ? { color: "#6C63FF" } : {}}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                </span>

                {/* Label */}
                {!collapsed && (
                  <span
                    className={`text-[13.5px] font-medium leading-none truncate transition-all duration-200 ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}

                {/* Tooltip on collapsed */}
                {collapsed && (
                  <span
                    className="
                      absolute left-full ml-3 px-2.5 py-1.5
                      text-xs font-medium text-white
                      rounded-lg whitespace-nowrap
                      pointer-events-none
                      opacity-0 group-hover:opacity-100
                      translate-x-1 group-hover:translate-x-0
                      transition-all duration-200
                      shadow-xl z-50
                    "
                    style={{ background: "#1A1A2E", border: "1px solid rgba(108,99,255,0.3)" }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — Company name */}
        <div className="border-t border-white/5 px-3 py-4">
          {collapsed ? (
            <div className="flex justify-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
                }}
              >
                BV
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(108,99,255,0.08)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
                }}
              >
                BV
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white truncate leading-tight">
                  Bella Vista Spa
                </p>
                <p className="text-[10px] text-white/40 truncate leading-tight mt-0.5">
                  Spa & Estética
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}