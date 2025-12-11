import React, { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type Props = {
  targetRef: React.RefObject<HTMLElement>;
  filename?: string;
  className?: string;
  children?: React.ReactNode;
};

const DownloadReportButton: React.FC<Props> = ({ targetRef, filename = "Inda-Report.pdf", className, children }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!targetRef.current || downloading) return;
    setDownloading(true);
    try {
      const element = targetRef.current as HTMLElement;
      const mutated: Array<{ el: HTMLElement; bg?: string; color?: string }> = [];
      const nodes = element.querySelectorAll<HTMLElement>("*");
      nodes.forEach((el) => {
        const cs = getComputedStyle(el);
        const bgImg = cs.backgroundImage || "";
        const color = cs.color || "";
        let changed = false;
        const record: { el: HTMLElement; bg?: string; color?: string } = { el };
        if (bgImg && bgImg.includes("lab(")) {
          record.bg = el.style.backgroundImage;
          el.style.backgroundImage = "none";
          changed = true;
        }
        if (color && color.includes("lab(")) {
          record.color = el.style.color;
          el.style.color = "#101820";
          changed = true;
        }
        if (changed) mutated.push(record);
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
        backgroundColor: "#ffffff",
        foreignObjectRendering: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = position - pageHeight;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);

      // restore mutated styles
      mutated.forEach(({ el, bg, color }) => {
        if (bg !== undefined) el.style.backgroundImage = bg;
        if (color !== undefined) el.style.color = color;
      });
    } catch (e) {
      console.error("Failed to generate PDF", e);
      try {
        window.print();
      } catch {}
    } finally {
      setDownloading(false);
    }
  }, [targetRef, filename, downloading]);

  return (
    <button onClick={handleDownload} className={className} disabled={downloading}>
      {children || (downloading ? "Preparing..." : "Download Report")}
    </button>
  );
};

export default DownloadReportButton;
