import { Dialog, DialogContent } from "@mui/material";
import { CustomDialogTitle } from "./DialogTitle";
import { QrCodeScannerRounded } from "@mui/icons-material";
import { showToast } from "../utils";
import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <CustomDialogTitle
        title={t("qrScanner.title", { defaultValue: "QR Code Scanner" })}
        subTitle={
          subTitle || t("qrScanner.subtitle", { defaultValue: "Scan a QR code to proceed" })
        }
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
            showToast(
              t("qrScanner.error", { defaultValue: "Error scanning QR code. Please try again." }),
              { type: "error" },
            );
          }}
          {...scannerProps}
        />
      </DialogContent>
    </Dialog>
  );
}
