/**
 *  Function to handle downloading QR code as PNG image
 */
export const saveQRCode = (taskName: string) => {
  taskName = taskName.length > 32 ? taskName.substring(0, 32) + "..." : taskName;
  const svgElement = document.getElementById("QRCodeShare") as SVGElement | null;
  if (!svgElement) {
    console.error("QR Code not found.");
    return;
  }

  // clone the svg to not modify the ui
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  clonedSvg.style.padding = "0";
  clonedSvg.style.borderRadius = "0";

  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not supported.");
    return;
  }

  const img = new Image();
  img.onload = () => {
    const canvasWidth = img.width + 20;
    const canvasHeight = img.height + 70;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // Draw QR code
    const qrCodeX = (canvasWidth - img.width) / 2;
    const qrCodeY = 10;
    ctx.drawImage(img, qrCodeX, qrCodeY);
    // Draw task name
    ctx.font = "bold 20px Poppins";
    const textWidth = ctx.measureText(taskName).width;
    const centerX = (canvasWidth - textWidth) / 2;
    const bottomY = canvasHeight - 35;

    ctx.fillStyle = "black";
    ctx.fillText(taskName, centerX, bottomY);
    // Draw attribution text
    const text2 = "Todo App by github.com/maciekt07";
    ctx.font = "14px Poppins";
    const text2Width = ctx.measureText(text2).width;
    const text2X = (canvasWidth - text2Width) / 2;
    const text2Y = canvasHeight - 10;
    ctx.fillText(text2, text2X, text2Y);
    // Convert canvas to PNG data URL
    const pngFile = canvas.toDataURL("image/png");
    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.download = `QRCode${taskName ? " " + taskName : ""}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };
  // Load SVG data into image element
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
};
