import { Dialog, DialogContent } from "@mui/material";
import { CustomDialogTitle } from "./DialogTitle";
import { QrCodeScannerRounded } from "@mui/icons-material";
import { showToast } from "../utils";
import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";

interface QRCodeScannerDialogProps extends IScannerProps {
  open: boolean;
  onClose: () => void;
  subTitle?: string;
}

export default function QRCodeScannerDialog({
  open,
  onClose,
  subTitle,
  ...scannerProps
}: QRCodeScannerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <CustomDialogTitle
        title="QR Code Scanner"
        subTitle={subTitle || "Scan a QR code to proceed"}
        icon={<QrCodeScannerRounded />}
        onClose={onClose}
      />
      <DialogContent>
        <Scanner
          sound={false}
          styles={{
            container: {
              borderRadius: "16px",
            },
          }}
          classNames={{
            container: "scanner-container",
            video: "scanner-video",
          }}
          onError={(error) => {
            console.error("QR Scanner Error:", error);
            showToast("Error scanning QR code. Please try again.", { type: "error" });
          }}
          {...scannerProps}
        />
      </DialogContent>
    </Dialog>
  );
}
