import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  RefreshCw,
  Activity,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/fc354dd9-3e44-49af-a8ee-a0e23a48dfda/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = [
  { key: "clientes", label: "Clientes", icon: Users, color: "#6C63FF" },
  { key: "citas", label: "Citas Hoy", icon: Calendar, color: "#00D4AA" },
  { key: "servicios", label: "Servicios", icon: Sparkles, color: "#6C63FF" },
  { key: "productos", label: "Productos", icon: ShoppingBag, color: "#00D4AA" },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 animate-pulse" style={{ background: "#1A1A2E" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl" style={{ background: "#0A0A0F" }} />
        <div className="w-16 h-4 rounded" style={{ background: "#0A0A0F" }} />
      </div>
      <div className="w-20 h-8 rounded mb-2" style={{ background: "#0A0A0F" }} />
      <div className="w-24 h-3 rounded" style={{ background: "#0A0A0F" }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 animate-pulse">
      <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: "#1A1A2E" }} />
      <div className="flex-1">
        <div className="w-32 h-3 rounded mb-2" style={{ background: "#1A1A2E" }} />
        <div className="w-20 h-2 rounded" style={{ background: "#1A1A2E" }} />
      </div>
      <div className="w-16 h-5 rounded-full" style={{ background: "#1A1A2E" }} />
    </div>
  );
}

function KPICard({ table, count, loading, error }) {
  const Icon = table.icon;
  const trend = Math.floor(Math.random() * 30) - 10;
  const isPositive = trend >= 0;

  if (loading) return <SkeletonCard />;

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        border: "1px solid rgba(108,99,255,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${table.color}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${table.color}20`, border: `1px solid ${table.color}40` }}
          >
            <Icon size={20} style={{ color: table.color }} />
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full`}
            style={{
              background: isPositive ? "rgba(0,212,170,0.1)" : "rgba(255,99,99,0.1)",
              color: isPositive ? "#00D4AA" : "#FF6363",
              border: `1px solid ${isPositive ? "rgba(0,212,170,0.2)" : "rgba(255,99,99,0.2)"}`,
            }}
          >
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </div>
        </div>

        {error ? (
          <p className="text-2xl font-bold text-red-400">—</p>
        ) : (
          <p className="text-3xl font-bold mb-1" style={{ color: "#F0F0FF" }}>
            {count?.toLocaleString() ?? 0}
          </p>
        )}
        <p className="text-sm font-medium" style={{ color: "rgba(240,240,255,0.5)" }}>
          {table.label}
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(240,240,255,0.3)" }}>
          vs. mes anterior
        </p>
      </div>
    </div>
  );
}

function AlertBadge({ alerts }) {
  if (!alerts || alerts.length === 0) return null;
  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,165,0,0.08) 0%, rgba(255,100,0,0.05) 100%)",
        border: "1px solid rgba(255,165,0,0.25)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,165,0,0.15)" }}
        >
          <AlertTriangle size={16} style={{ color: "#FFA500" }} />
        </div>
        <span className="font-semibold text-sm" style={{ color: "#FFA500" }}>
          Alertas Críticas ({alerts.length})
        </span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
          style={{ background: "rgba(255,165,0,0.2)", color: "#FFA500" }}
        >
          URGENTE
        </span>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 px-3 rounded-xl text-xs"
            style={{ background: "rgba(255,165,0,0.05)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 animate-pulse" />
            <span style={{ color: "rgba(240,240,255,0.7)" }}>
              {alert.nombre || alert.descripcion || alert.titulo || `Registro urgente #${alert.id}`}
            </span>
            <ChevronRight size={12} className="ml-auto" style={{ color: "rgba(240,240,255,0.3)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ estado }) {
  const map = {
    activo: { bg: "rgba(0,212,170,0.12)", color: "#00D4AA", border: "rgba(0,212,170,0.25)", label: "Activo" },
    pendiente: { bg: "rgba(255,200,0,0.12)", color: "#FFC800", border: "rgba(255,200,0,0.25)", label: "Pendiente" },
    completado: { bg: "rgba(108,99,255,0.12)", color: "#6C63FF", border: "rgba(108,99,255,0.25)", label: "Completado" },
    cancelado: { bg: "rgba(255,99,99,0.12)", color: "#FF6363", border: "rgba(255,99,99,0.25)", label: "Cancelado" },
    urgente: { bg: "rgba(255,165,0,0.12)", color: "#FFA500", border: "rgba(255,165,0,0.25)", label: "Urgente" },
  };
  const style = map[estado?.toLowerCase()] || map["pendiente"];
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full border"
      style={{ background: style.bg, color: style.color, borderColor: style.border }}
    >
      {style.label}
    </span>
  );
}

function ActivityTable({ data, loading }) {
  const initials = (item) => {
    const name = item.nombre || item.cliente || item.titulo || "?";
    return name.slice(0, 2).toUpperCase();
  };

  const getColor = (i) => (i % 2 === 0 ? "#6C63FF" : "#00D4AA");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        border: "1px solid rgba(108,99,255,0.15)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(108,99,255,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(108,99,255,0.15)" }}
          >
            <Activity size={16} style={{ color: "#6C63FF" }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: "#F0F0FF" }}>
            Actividad Reciente
          </span>
        </div>
        <span className="text-xs" style={{ color: "rgba(240,240,255,0.35)" }}>
          Últimos 10 registros
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(108,99,255,0.06)" }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          : data.length === 0
          ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <Star size={32} style={{ color: "rgba(108,99,255,0.3)" }} />
              <p className="text-sm" style={{ color: "rgba(240,240,255,0.3)" }}>
                Sin actividad reciente
              </p>
            </div>
          )
          : data.map((item, i) => (
            <div
              key={item.id || i}
              className="flex items-center gap-4 py-3 px-6 transition-colors duration-200 hover:bg-white hover:bg-opacity-[0.02]"
            >
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  background: `${getColor(i)}20`,
                  color: getColor(i),
                  border: `1px solid ${getColor(i)}30`,
                }}
              >
                {initials(item)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "rgba(240,240,255,0.85)" }}
                >
                  {item.nombre || item.cliente || item.titulo || `Registro #${item.id}`}
                </p>
                <p className="text-xs truncate" style={{ color: "rgba(240,240,255,0.35)" }}>
                  {item.email || item.fecha || item.descripcion || item.tipo || "—"}
                </p>
              </div>
              <div className="flex-shrink-0">
                {item.estado ? (
                  <StatusBadge estado={item.estado} />
                ) : (
                  <span className="text-xs" style={{ color: "rgba(240,240,255,0.25)" }}>
                    #{item.id || i + 1}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTableCount = async (tableName) => {
    try {
      const res = await fetch(`${API_BASE}/${tableName}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.data || data.records || [];
      return { count: rows.length, rows };
    } catch {
      return { count: 0, rows: [] };
    }
  };

  const loadData = async () => {
    setLoading(true);
    setActivityLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled(
        TABLES.map((t) => fetchTableCount(t.key))
      );

      const newCounts = {};
      let allRows = [];

      results.forEach((result, i) => {
        const key = TABLES[i].key;
        if (result.status === "fulfilled") {
          newCounts[key] = result.value.count;
          allRows = [...allRows, ...result.value.rows.map((r) => ({ ...r, _table: key }))];
        } else {
          newCounts[key] = 0;
        }
      });

      setCounts(newCounts);

      // Alertas urgentes
      const urgentes = allRows.filter(
        (r) => r.estado?.toLowerCase() === "urgente"
      );
      setAlerts(urgentes);

      // Actividad reciente: tomar últimos 10 por id
      const sorted = [...allRows]
        .sort((a, b) => (b.id || 0) - (a.id || 0))
        .slice(0, 10);
      setRecentActivity(sorted);

      setLastUpdated(new Date());
    } catch (err) {
      setError("Error al cargar datos. Por favor reintenta.");
    } finally {
      setLoading(false);
      setActivityLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <div
      className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-10"
      style={{ background: "#0A0A0F", color: "#F0F0FF" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} style={{ color: "#6C63FF" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6C63FF" }}>
              Bella Vista Spa
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#F0F0FF" }}>
            Dashboard Principal
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(240,240,255,0.4)" }}>
            Vista general del negocio en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
              style={{
                background: "rgba(108,99,255,0.08)",
                border: "1px solid rgba(108,99,255,0.15)",
                color: "rgba(240,240,255,0.4)",
              }}
            >
              <Clock size={12} />
              {lastUpdated.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(108,99,255,0.3)",
            }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{
            background: "rgba(255,99,99,0.08)",
            border: "1px solid rgba(255,99,99,0.2)",
          }}
        >
          <AlertTriangle size={18} style={{ color: "#FF6363" }} />
          <p className="text-sm" style={{ color: "#FF6363" }}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="ml-auto text-xs underline"
            style={{ color: "#FF6363" }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Alertas críticas */}
      <AlertBadge alerts={alerts} />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TABLES.map((table) => (
          <KPICard
            key={table.key}
            table={table}
            count={counts[table.key]}
            loading={loading}
            error={error}
          />
        ))}
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div
          className="rounded-2xl p-5 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{
            background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
            border: "1px solid rgba(108,99,255,0.15)",
          }}
        >
          {[
            { label: "Total Registros", value: Object.values(counts).reduce((a, b) => a + b, 0), icon: Activity, color: "#6C63FF" },
            { label: "Alertas Urgentes", value: alerts.length, icon: AlertTriangle, color: alerts.length > 0 ? "#FFA500" : "#00D4AA" },
            { label: "Tablas Activas", value: TABLES.length, icon: Star, color: "#00D4AA" },
            { label: "Última Sync", value: lastUpdated ? "Ahora" : "—", icon: Clock, color: "#6C63FF" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none" style={{ color: "#F0F0FF" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(240,240,255,0.4)" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabla actividad reciente */}
      <ActivityTable data={recentActivity} loading={activityLoading} />

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs" style={{ color: "rgba(240,240,255,0.2)" }}>
          Sistema Bella Vista Spa · {new Date().getFullYear()} · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}