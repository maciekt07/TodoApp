export const getProfilePicture = async (profilePicture: string | null): Promise<string | null> => {
  if (!profilePicture) return null;

  // ff it's a local file fetch from IndexedDB
  if (profilePicture.startsWith("LOCAL_FILE")) {
    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("profilePictureDB", 1);

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(["pictures"], "readonly");
          const store = transaction.objectStore("pictures");

          const getRequest = store.get("profilePicture");

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
  }

  // else return as is
  return profilePicture;
};
