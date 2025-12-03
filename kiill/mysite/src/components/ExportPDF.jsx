import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportPDF({ data, filename = 'report' }) {
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(`${filename.replace('-', ' ').toUpperCase()} REPORT`, 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Convert data to table format
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item));

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <button
      className="btn btn-outline"
      onClick={exportToPDF}
      style={{display: 'flex', alignItems: 'center', gap: 8}}
    >
      <Download size={16} />
      Export PDF
    </button>
  );
}
