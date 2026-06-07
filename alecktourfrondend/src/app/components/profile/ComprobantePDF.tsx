import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { reservaService, ReservaDetail, PagoResponse } from "../../services/reserva.service";
import { ClienteResponse } from "../../services/cliente.service";

import jsPDF from "jspdf";

interface Props {
  reservaId: number;
  clienteData: ClienteResponse;
}

export default function ComprobantePDF({ reservaId, clienteData }: Props) {
  const [loading, setLoading] = useState(false);

  const generarPDF = async () => {
    setLoading(true);
    try {
      const [detalle, pagos] = await Promise.all([
        reservaService.getDetail(reservaId),
        reservaService.getPagos(reservaId).catch(() => [] as PagoResponse[]),
      ]);
      descargarPDF(detalle, pagos ?? []);
    } catch (err) {
      console.error("Error generando PDF", err);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = (detalle: ReservaDetail, pagos: PagoResponse[] = []) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    let y = 0;

    // HEADER
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, W, 45, "F");
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 38, W, 7, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("AlecTours", margin, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Comprobante de Reserva", margin, 27);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`, margin, 34);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`#${String(detalle.id_reserva).padStart(6, "0")}`, W - margin, 22, { align: "right" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("N° RESERVA", W - margin, 28, { align: "right" });

    y = 58;

    // ESTADO
    const estadoColors: Record<string, [number, number, number]> = {
      confirmada: [22, 163, 74], pendiente: [234, 88, 12],
      cancelada: [220, 38, 38], finalizada: [107, 114, 128],
    };
    const [r, g, b] = estadoColors[detalle.estado] ?? [107, 114, 128];
    doc.setFillColor(r, g, b);
    doc.roundedRect(margin, y - 6, 35, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(detalle.estado.toUpperCase(), margin + 17.5, y, { align: "center" });
    y += 12;

    const drawSection = (titulo: string, yPos: number): number => {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, W - margin * 2, 7, "F");
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(titulo.toUpperCase(), margin + 3, yPos + 5);
      return yPos + 12;
    };

    const drawRow = (label: string, value: string, yPos: number, col = 0): void => {
      const x = col === 0 ? margin : W / 2 + 5;
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(label, x, yPos);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(value || "—", x, yPos + 5);
    };

    // CLIENTE
    y = drawSection("Información del Cliente", y);
    drawRow("Nombre completo", `${clienteData.nombre} ${clienteData.apellido}`, y, 0);
    drawRow("Cédula", clienteData.cedula, y, 1);
    y += 12;
    drawRow("Correo electrónico", clienteData.correo, y, 0);
    drawRow("Celular", clienteData.celular || "—", y, 1);
    y += 12;
    drawRow("Ciudad", `${clienteData.ciudad || "—"}, ${clienteData.pais || "—"}`, y, 0);
    y += 14;

    // RESERVA
    y = drawSection("Detalle de la Reserva", y);
    const fechaInicio = new Date(detalle.fecha_inicio).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    const fechaFin = new Date(detalle.fecha_fin).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    const noches = Math.max(1, Math.ceil((new Date(detalle.fecha_fin).getTime() - new Date(detalle.fecha_inicio).getTime()) / 86400000));
    const fechaReserva = new Date(detalle.fecha_reserva).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

    drawRow("Fecha de reserva", fechaReserva, y, 0);
    drawRow("N° de personas", String(detalle.numero_personas), y, 1);
    y += 12;
    drawRow("Check-in", fechaInicio, y, 0);
    drawRow("Check-out", fechaFin, y, 1);
    y += 12;
    drawRow("Duración", `${noches} noches`, y, 0);
    drawRow("ID Paquete", `#${detalle.id_paquete}`, y, 1);
    y += 14;

    // PAQUETE / HOTEL
    if (detalle.paquete) {
      y = drawSection("Alojamiento", y);
      const hotel = detalle.paquete.hotel;
      drawRow("Paquete", detalle.paquete.nombre_paquete || `Paquete #${detalle.id_paquete}`, y, 0);
      drawRow("Precio por persona", `$${detalle.paquete.precio_por_persona?.toLocaleString("es-CO") || "—"}`, y, 1);
      y += 12;
      if (hotel) {
        drawRow("Hotel", hotel.nombre_hotel, y, 0);
        drawRow("Ubicación", `${hotel.ciudad}, ${hotel.pais}`, y, 1);
        y += 12;
        drawRow("Calificación", `${"★".repeat(hotel.calificacion || 0)} (${hotel.calificacion}/5)`, y, 0);
      }
      y += 14;
    }

    // PAGOS
    if (pagos.length > 0) {
      y = drawSection("Historial de Pagos", y);
      let totalPagado = 0;

      pagos.forEach((pago, i) => {
        const fechaPago = new Date(pago.fecha_pago).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
        const estadoPagoColors: Record<string, [number, number, number]> = {
          pagado: [22, 163, 74], pendiente: [234, 88, 12], rechazado: [220, 38, 38],
        };
        const [pr, pg, pb] = estadoPagoColors[pago.estado] ?? [107, 114, 128];

        doc.setFillColor(i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
        doc.rect(margin, y - 4, W - margin * 2, 10, "F");

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(`${pago.metodo_pago?.nombre_metodo || "—"}`, margin + 2, y + 2);
        doc.text(fechaPago, margin + 50, y + 2);
        doc.text(`Ref: ${pago.referencia || "—"}`, margin + 90, y + 2);

        doc.setFillColor(pr, pg, pb);
        doc.roundedRect(margin + 125, y - 3, 22, 7, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(pago.estado.toUpperCase(), margin + 136, y + 2, { align: "center" });

        doc.setTextColor(37, 99, 235);
        doc.setFontSize(9);
        doc.text(`$${pago.monto?.toLocaleString("es-CO")}`, W - margin, y + 2, { align: "right" });

        totalPagado += pago.monto || 0;
        y += 11;
      });

      y += 3;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.5);
      doc.line(margin, y, W - margin, y);
      y += 6;
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Total pagado:", margin, y);
      doc.setTextColor(37, 99, 235);
      doc.text(`$${totalPagado.toLocaleString("es-CO")}`, W - margin, y, { align: "right" });
    }

    // FOOTER
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 280, W, 17, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Este documento es un comprobante oficial de AlecTours.", W / 2, 286, { align: "center" });
    doc.text("Para soporte: soporte@alectours.com", W / 2, 291, { align: "center" });

    doc.save(`Comprobante_Reserva_${detalle.id_reserva}.pdf`);
  };

  return (
    <button
      onClick={generarPDF}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? "Generando..." : "Descargar comprobante"}
    </button>
  );
}