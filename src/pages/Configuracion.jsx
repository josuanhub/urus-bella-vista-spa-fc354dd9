import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  RefreshCw,
  Package,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/fc354dd9-3e44-49af-a8ee-a0e23a48dfda/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/fc354dd9-3e44-49af-a8ee-a0e23a48dfda/upload-data";
const HEADERS = { "Content-Type": "application/json", "x-factory-key": "factory2026" };
const TABLE = "configuracion";
const PAGE_SIZE = 20;

// Toast
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
        >
          {t.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Skeleton Row
function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-white/5 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// Confirm Modal
function ConfirmModal({ open, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Confirmar eliminación</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">
          ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Configuracion() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLE}`, { headers: HEADERS });
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || data.records || data.items || [];
      setRecords(list);
      if (list.length > 0) {
        const keys = Object.keys(list[0]).filter((k) => k !== "id" && k !== "__v" && k !== "createdAt" && k !== "updatedAt");
        setColumns(keys);
      }
    } catch {
      addToast("Error al cargar los registros", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openNew = () => {
    setEditRecord(null);
    setForm({});
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (rec) => {
    setEditRecord(rec);
    setForm({ ...rec });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditRecord(null);
    setForm({});
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    columns.forEach((col) => {
      if (!form[col] || String(form[col]).trim() === "") {
        errs[col] = "Este campo es requerido";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const isEdit = !!editRecord;
      const url = isEdit ? `${API_BASE}/${TABLE}/${editRecord.id}` : `${API_BASE}/${TABLE}`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      addToast(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente");
      closeModal();
      fetchRecords();
    } catch {
      addToast("Error al guardar el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLE}/${confirmId}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!res.ok) throw new Error();
      addToast("Registro eliminado correctamente");
      setConfirmId(null);
      fetchRecords();
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = records.filter((r) => {
    if (!search) return true;
    return Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const displayCols = columns.slice(0, 4);

  const formatValue = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "boolean") return val ? "Sí" : "No";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  const labelFor = (col) =>
    col
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmModal
        open={!!confirmId}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <Settings size={20} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Configuración</h1>
              <p className="text-xs text-white/40 hidden sm:block">Configuración del sistema</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              className="p-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all"
              title="Refrescar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white text-sm font-medium transition-all shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs mb-1">Total registros</p>
            <p className="text-2xl font-bold text-white">{loading ? "—" : records.length}</p>
          </div>
          <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs mb-1">Filtrados</p>
            <p className="text-2xl font-bold text-[#00D4AA]">{loading ? "—" : filtered.length}</p>
          </div>
          <div className="hidden sm:block bg-[#1A1A2E] border border-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs mb-1">Tabla</p>
            <p className="text-sm font-semibold text-[#6C63FF] font-mono">{TABLE}</p>
          </div>
        </div>

        {/* Search / Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar en configuración..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#1A1A2E] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#6C63FF]/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm px-3 py-2.5 bg-[#1A1A2E] border border-white/10 rounded-xl">
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Columnas: {columns.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {loading ? (
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <th key={i} className="px-4 py-3 text-left">
                          <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                        </th>
                      ))}
                      <th className="px-4 py-3" />
                    </>
                  ) : (
                    <>
                      {displayCols.map((col) => (
                        <th key={col} className="px-4 py-3 text-left text-white/50 font-medium text-xs uppercase tracking-wider">
                          {labelFor(col)}
                        </th>
                      ))}
                      {columns.length > 4 && (
                        <th className="px-4 py-3 text-left text-white/30 font-medium text-xs">
                          +{columns.length - 4} más
                        </th>
                      )}
                      <th className="px-4 py-3 text-right text-white/50 font-medium text-xs uppercase tracking-wider">
                        Acciones
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} cols={Math.min(displayCols.length || 4, 4)} />
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={displayCols.length + 2} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-[#6C63FF]/10 rounded-2xl">
                          <Package size={32} className="text-[#6C63FF]/60" />
                        </div>
                        <div>
                          <p className="text-white/60 font-medium mb-1">
                            {search ? "Sin resultados" : "Sin registros"}
                          </p>
                          <p className="text-white/30 text-xs mb-4">
                            {search
                              ? "Prueba con otro término de búsqueda"
                              : "Comienza agregando tu primer registro de configuración"}
                          </p>
                          {!search && (
                            <button
                              onClick={openNew}
                              className="px-4 py-2 bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
                            >
                              <Plus size={14} />
                              Crear primer registro
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((rec, idx) => (
                    <tr
                      key={rec.id || idx}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                    >
                      {displayCols.map((col) => (
                        <td key={col} className="px-4 py-3.5 text-white/70 max-w-[200px]">
                          <span className="block truncate" title={formatValue(rec[col])}>
                            {formatValue(rec[col])}
                          </span>
                        </td>
                      ))}
                      {columns.length > 4 && (
                        <td className="px-4 py-3.5 text-white/30 text-xs">
                          {columns.length - 4} campos
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(rec)}
                            className="p-1.5 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] hover:bg-[#6C63FF]/20 transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmId(rec.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between gap-4">
              <p className="text-white/40 text-xs">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          page === p
                            ? "bg-[#6C63FF] text-white"
                            : "text-white/40 hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}