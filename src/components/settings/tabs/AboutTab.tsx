import { Box, Divider, FormGroup, FormLabel, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import baner from "../../../assets/baner.webp";
import { Inventory2Rounded } from "@mui/icons-material";
import { systemInfo } from "../../../utils";
import { useTranslation } from "react-i18next";

export default function AboutTab() {
  const { t } = useTranslation();
  const [storageUsage, setStorageUsage] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getStorageUsage = async () => {
      const storageUsage = await navigator.storage.estimate();
      setStorageUsage(storageUsage.usage);
    };
    getStorageUsage();
  }, []);

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("aboutTab.description", {
          defaultValue:
            "📝 A simple todo app project made using React.js and MUI with many features, including sharing tasks via link, P2P synchronization using WebRTC, theme customization and offline usage as a Progressive Web App (PWA).",
        })}
      </Typography>
      <img
        src={baner}
        style={{ width: "100%", height: "auto" }}
        alt={t("aboutTab.screenshotAlt", { defaultValue: "Todo App Screenshot" })}
      />
      <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
        {t("aboutTab.createdBy", { defaultValue: "Created by" })}{" "}
        <Link href="https://github.com/maciekt07">maciekt07</Link> <br />
        {t("aboutTab.explore", { defaultValue: "Explore the project on GitHub:" })}
        <Link href="https://github.com/maciekt07/TodoApp" target="_blank" rel="noopener noreferrer">
          {t("aboutTab.repository", { defaultValue: "Todo App Repository" })}
        </Link>
      </Typography>
      {storageUsage !== undefined && storageUsage !== 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <FormGroup>
            <FormLabel sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Inventory2Rounded sx={{ fontSize: "18px" }} />
              {t("aboutTab.storageUsage", { defaultValue: "Storage Usage" })}
            </FormLabel>
            <Box sx={{ mt: "2px" }}>
              {storageUsage ? `${(storageUsage / 1024 / 1024).toFixed(2)} MB` : "0 MB"}
              {systemInfo.os === "iOS" && ` / 50 MB`}
            </Box>
          </FormGroup>
        </>
      )}
    </>
  );
}
