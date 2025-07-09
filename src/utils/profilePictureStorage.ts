import { generateUUID } from ".";
import { PFP_MAX_SIZE } from "../constants";

// we cant store base64 directly in localStorage because it may cause performance issues

const DB_NAME = "profilePictureDB";
const STORE_NAME = "pictures";
const PROFILE_PICTURE_KEY = "profilePicture";

// initialize the database
export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

// get profile picture from IndexedDB
export const getProfilePictureFromDB = async (
  profilePicture: string | null,
): Promise<string | null> => {
  if (!profilePicture) return null;

  // If it's not a local file return as is
  if (!profilePicture.startsWith("LOCAL_FILE")) {
    return profilePicture;
  }

  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);

        const getRequest = store.get(PROFILE_PICTURE_KEY);

        getRequest.onsuccess = () => {
          resolve(getRequest.result || null);
        };

        getRequest.onerror = () => {
          reject(new Error("Failed to fetch profile picture from IndexedDB"));
        };
      };

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };
    });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
};

// save profile picture to IndexedDB
export const saveProfilePictureInDB = async (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const putRequest = store.put(base64Image, PROFILE_PICTURE_KEY);

      putRequest.onsuccess = () => {
        resolve("LOCAL_FILE_" + generateUUID()); // add uuid so image would update automatically
      };

      putRequest.onerror = () => {
        reject(new Error("Failed to save profile picture"));
      };
    };

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };
  });
};

// completely reset the IndexedDB by deleting and recreating it to ensure no corrupted or broken profile images remain
export const deleteProfilePictureFromDB = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // delete the entire database
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

    deleteRequest.onsuccess = () => {
      console.log("IndexedDB deleted successfully");

      // recreate the DB
      const openRequest = indexedDB.open(DB_NAME, 1);

      openRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      openRequest.onsuccess = () => {
        openRequest.result.close(); // close the connection immediately
        console.log("IndexedDB recreated empty");
        resolve();
      };

      openRequest.onerror = () => {
        console.error("Failed to recreate IndexedDB");
        reject(new Error("Failed to recreate IndexedDB"));
      };
    };

    deleteRequest.onerror = () => {
      console.error("Failed to delete IndexedDB");
      reject(new Error("Failed to delete IndexedDB"));
    };

    deleteRequest.onblocked = () => {
      console.warn("Deletion blocked. Close all other tabs using the DB.");
      reject(new Error("IndexedDB deletion blocked"));
    };
  });
};

/**
 * Optimizes profile pictire with centered square crop and dynamic scaling (2x–3x of largest displayed pfp) based on device pixel ratio.
 * @param {File} file - Input image
 * @returns {Promise<Blob>} Optimized image
 */
export function optimizeProfilePicture(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const baseSize = 96; // largest displayed size of pfp in the ui (96x96)
    const dpr = window.devicePixelRatio > 2 ? 3 : 2;
    const targetSize = Math.round(baseSize * Math.min(dpr, 3)); // cap at 3x to avoid overscaling

    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const offsetX = (img.width - side) / 2;
      const offsetY = (img.height - side) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context failed");

      ctx.imageSmoothingQuality = "high"; // improve downscaling quality
      ctx.drawImage(img, offsetX, offsetY, side, side, 0, 0, targetSize, targetSize);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject("Blob creation failed");
        },
        file.type || "image/webp",
        0.85,
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export const ALLOWED_PFP_TYPES = ["image/png", "image/jpeg", "image/webp"];
// helper to validate file size
export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Please upload an image file.";
  }

  if (!ALLOWED_PFP_TYPES.includes(file.type)) {
    const allowedFormats = ALLOWED_PFP_TYPES.map((type) =>
      type.replace("image/", "").toUpperCase(),
    ).join(", ");
    return `Unsupported image format: ${file.type}. Allowed formats: ${allowedFormats}.`;
  }

  if (file.size > PFP_MAX_SIZE) {
    const formatMB = new Intl.NumberFormat("en-US", {
      style: "unit",
      unit: "megabyte",
      maximumFractionDigits: 2,
    });

    const fileSizeMB = file.size / (1024 * 1024);
    const maxSizeMB = PFP_MAX_SIZE / (1024 * 1024);
    return `File size is too large (${formatMB.format(fileSizeMB)}/${formatMB.format(maxSizeMB)})`;
  }

  return null;
};

// helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
