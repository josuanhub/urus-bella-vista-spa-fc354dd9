import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  CheckCircle,
  XCircle,
  Trash2,
  CloudUpload,
  AlertCircle,
  Table,
  Hash,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/fc354dd9-3e44-49af-a8ee-a0e23a48dfda/upload-data";
const FACTORY_KEY = "factory2026";

const ACCEPTED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
];
const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv", ".pdf", ".png", ".jpg"];

function getFileIcon(file) {
  if (!file) return <File className="w-8 h-8" />;
  const { type, name } = file;
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    name.endsWith(".csv")
  ) {
    return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
  }
  if (type === "application/pdf") {
    return <FileText className="w-8 h-8 text-red-400" />;
  }
  if (type.startsWith("image/")) {
    return <Image className="w-8 h-8 text-blue-400" />;
  }
  return <File className="w-8 h-8 text-gray-400" />;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function isValidFile(file) {
  return (
    ACCEPTED_TYPES.includes(file.type) ||
    ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

export default function ImportarDatos() {
  const [status, setStatus] = useState("idle");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    setValidationError("");
    if (!isValidFile(file)) {
      setValidationError(
        `Tipo de archivo no permitido. Formatos aceptados: ${ACCEPTED_EXTENSIONS.join(", ")}`
      );
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
    setProgress(0);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDraggingOver(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setResult(null);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await new Promise((resolve) => {
        let prog = 0;
        const interval = setInterval(() => {
          prog += Math.random() * 15;
          if (prog >= 85) {
            clearInterval(interval);
            setProgress(85);
            resolve();
          } else {
            setProgress(Math.floor(prog));
          }
        }, 120);
      });

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "x-factory-key": FACTORY_KEY,
        },
        body: formData,
      });

      setProgress(100);

      const contentType = response.headers.get("content-type") || "";
      let data = {};
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text || "Respuesta del servidor recibida." };
        }
      }

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data?.message ||
            data?.error ||
            `Error del servidor: ${response.status} ${response.statusText}`
        );
        return;
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setProgress(0);
      setStatus("error");
      setErrorMessage(
        err?.message || "Error de conexión. Verifica tu red e inténtalo de nuevo."
      );
    }
  }, [selectedFile]);

  const handleClear = useCallback(() => {
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMessage("");
    setValidationError("");
    dragCounterRef.current = 0;
    setIsDraggingOver(false);
  }, []);

  const isUploading = status === "uploading";

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0A0A0F" }}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: "rgba(108,99,255,0.15)" }}
            >
              <CloudUpload className="w-6 h-6" style={{ color: "#6C63FF" }} />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "#ffffff" }}
            >
              Importar Datos
            </h1>
          </div>
          <p className="text-sm sm:text-base ml-1" style={{ color: "#6b7280" }}>
            Arrastra y suelta un archivo o selecciónalo manualmente para importarlo al sistema.
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: isDraggingOver
              ? "rgba(108,99,255,0.12)"
              : "rgba(26,26,46,0.6)",
            borderColor: isDraggingOver
              ? "#6C63FF"
              : status === "success"
              ? "#00D4AA"
              : status === "error"
              ? "#ef4444"
              : selectedFile
              ? "rgba(108,99,255,0.5)"
              : "rgba(108,99,255,0.25)",
            pointerEvents: isUploading ? "none" : "auto",
          }}
        >
          {/* Glow overlay on drag */}
          {isDraggingOver && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, transparent 70%)",
              }}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            {/* Icon */}
            <div
              className="p-4 rounded-2xl transition-transform duration-300"
              style={{
                backgroundColor: isDraggingOver
                  ? "rgba(108,99,255,0.25)"
                  : "rgba(108,99,255,0.1)",
                transform: isDraggingOver ? "scale(1.1)" : "scale(1)",
              }}
            >
              <Upload
                className="w-10 h-10 transition-colors duration-300"
                style={{
                  color: isDraggingOver ? "#6C63FF" : "rgba(108,99,255,0.7)",
                }}
              />
            </div>

            {isDraggingOver ? (
              <div>
                <p className="text-lg font-semibold" style={{ color: "#6C63FF" }}>
                  ¡Suelta el archivo aquí!
                </p>
                <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                  Se cargará automáticamente
                </p>
              </div>
            ) : (
              <div>
                <p className="text-base sm:text-lg font-semibold" style={{ color: "#e5e7eb" }}>
                  Arrastra tu archivo aquí
                </p>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                  o{" "}
                  <span
                    className="font-medium underline underline-offset-2"
                    style={{ color: "#6C63FF" }}
                  >
                    haz clic para seleccionar
                  </span>
                </p>
              </div>
            )}

            {/* Accepted formats */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {ACCEPTED_EXTENSIONS.map((ext) => (
                <span
                  key={ext}
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    backgroundColor: "rgba(108,99,255,0.12)",
                    color: "rgba(108,99,255,0.9)",
                    border: "1px solid rgba(108,99,255,0.2)",
                  }}
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div
            className="mt-4 flex items-start gap-3 p-4 rounded-xl"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{validationError}</p>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div
            className="mt-5 rounded-2xl p-4 sm:p-5 transition-all duration-300"
            style={{
              backgroundColor: "rgba(26,26,46,0.8)",
              border: "1px solid rgba(108,99,255,0.2)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-xl flex-shrink-0"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                {getFileIcon(selectedFile)}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-medium truncate text-sm sm:text-base"
                  style={{ color: "#e5e7eb" }}
                >
                  {selectedFile.name}
                </p>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                  {formatBytes(selectedFile.size)}
                  <span className="mx-2 opacity-50">•</span>
                  {selectedFile.type || "Tipo desconocido"}
                </p>

                {/* Progress Bar */}
                {(isUploading || status === "success") && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs" style={{ color: "#9ca3af" }}>
                        {status === "success" ? "Completado" : "Subiendo..."}
                      </span>
                      <span
                        className="text-xs font-mono font-semibold"
                        style={{
                          color: status === "success" ? "#00D4AA" : "#6C63FF",
                        }}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: "6px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progress}%`,
                          background:
                            status === "success"
                              ? "linear-gradient(90deg, #00D4AA, #00f0c0)"
                              : "linear-gradient(90deg, #6C63FF, #00D4AA)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpload}
              disabled={isUploading || status === "success"}
              className="flex-1 flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  isUploading || status === "success"
                    ? "rgba(108,99,255,0.4)"
                    : "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
                color: "#ffffff",
                boxShadow:
                  isUploading || status === "success"
                    ? "none"
                    : "0 4px 20px rgba(108,99,255,0.35)",
              }}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Subiendo archivo...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Importado exitosamente
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  Importar archivo
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)";
              }}
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        )}

        {/* Success Result */}
        {status === "success" && result && (
          <div
            className="mt-5 rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,212,170,0.25)",
              backgroundColor: "rgba(0,212,170,0.05)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{
                borderBottom: "1px solid rgba(0,212,170,0.15)",
                backgroundColor: "rgba(0,212,170,0.08)",
              }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#00D4AA" }} />
              <p className="font-semibold text-sm sm:text-base" style={{ color: "#00D4AA" }}>
                Importación completada con éxito
              </p>
            </div>

            {/* Result Details */}
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.tabla && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <Table className="w-5 h-5 flex-shrink-0" style={{ color: "#6C63FF" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      Tabla destino
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "#e5e7eb" }}>
                      {result.tabla}
                    </p>
                  </div>
                </div>
              )}

              {result.filas_insertadas !== undefined && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <Hash className="w-5 h-5 flex-shrink-0" style={{ color: "#00D4AA" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      Filas insertadas
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "#00D4AA" }}
                    >
                      {result.filas_insertadas}
                    </p>
                  </div>
                </div>
              )}

              {result.message && !result.tabla && (
                <div className="sm:col-span-2">
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    {result.message}
                  </p>
                </div>
              )}
            </div>

            {/* Errors list */}
            {result.errores && result.errores.length > 0 && (
              <div
                className="px-5 py-4"
                style={{ borderTop: "1px solid rgba(0,212,170,0.1)" }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: "#f87171" }}>
                  Errores detectados ({result.errores.length})
                </p>
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {result.errores.map((err, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "#f87171" }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{typeof err === "string" ? err : JSON.stringify(err)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div
            className="mt-5 rounded-2xl overflow-hidden"
            style={{
              border: "1px solid