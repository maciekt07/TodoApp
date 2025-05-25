import { Dialog, DialogContent } from "@mui/material";
import { CustomDialogTitle } from "./DialogTitle";
import { QrCodeScannerRounded } from "@mui/icons-material";
import { showToast } from "../utils";
import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";

interface QRCodeScannerDialogProps extends IScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeScannerDialog({
  isOpen,
  onClose,
  ...scannerProps
}: QRCodeScannerDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <CustomDialogTitle
        title="QR Code Scanner"
        subTitle="Import task by scanning a QR code"
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
