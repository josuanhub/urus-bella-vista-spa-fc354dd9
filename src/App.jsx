import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/importar", label: "Importar Datos", icon: Upload },
  { path: "/configuracion", label: "Configuración", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "#1A1A2E" }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
        >
          <Sparkles size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p
              className="text-sm font-bold leading-tight truncate"
              style={{ color: "#6C63FF" }}
            >
              Bella Vista
            </p>
            <p className="text-xs truncate" style={{ color: "#00D4AA" }}>
              Spa & Estética
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))"
                  : "transparent",
                border: active ? "1px solid rgba(108,99,255,0.4)" : "1px solid transparent",
                color: active ? "#6C63FF" : "#9090b0",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(108,99,255,0.1)";
                  e.currentTarget.style.color = "#c0c0e0";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9090b0";
                }
              }}
            >
              <Icon
                size={18}
                className="flex-shrink-0"
                style={{ color: active ? "#6C63FF" : "inherit" }}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {active && !collapsed && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#00D4AA" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden md:flex px-4 py-4 border-t" style={{ borderColor: "#1A1A2E" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
          style={{ background: "rgba(108,99,255,0.15)", color: "#6C63FF" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108,99,255,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(108,99,255,0.15)")}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* System label */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <p className="text-xs text-center" style={{ color: "#3a3a5a" }}>
            Sistema Bella Vista Spa
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 flex flex-col"
        style={{
          width: "240px",
          background: "#1A1A2E",
          borderRight: "1px solid rgba(108,99,255,0.2)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg"
            style={{ color: "#9090b0" }}
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? "68px" : "220px",
          background: "#1A1A2E",
          borderRight: "1px solid rgba(108,99,255,0.2)",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const current = NAV_ITEMS.find((n) => n.path === location.pathname);

  return (
    <header
      className="flex items-center gap-4 px-4 md:px-6 py-4 border-b sticky top-0 z-30"
      style={{
        background: "rgba(10,10,15,0.95)",
        borderColor: "#1A1A2E",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-2 rounded-lg flex-shrink-0"
        style={{ background: "rgba(108,99,255,0.15)", color: "#6C63FF" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base md:text-lg font-semibold truncate" style={{ color: "#e0e0f5" }}>
          {current?.label || "Bella Vista Spa"}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: "#5a5a7a" }}>
          Sistema Bella Vista Spa — Spa y Estética
        </p>
      </div>

      {/* Status indicator */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0"
        style={{ background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)" }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#00D4AA" }}
        />
        <span className="text-xs font-medium hidden sm:block" style={{ color: "#00D4AA" }}>
          Conectado
        </span>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ background: "#0A0A0F", color: "#e0e0f5" }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/importar" element={<ImportarDatos />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>

        <footer
          className="px-4 md:px-6 py-3 border-t text-center"
          style={{ borderColor: "#1A1A2E" }}
        >
          <p className="text-xs" style={{ color: "#3a3a5a" }}>
            © 2024 Bella Vista Spa — Sistema de Gestión v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}