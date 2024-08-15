import { showToast } from "../utils";

interface BMCResponse {
  supportersCount: number;
}
/**
 * Function to fetch data from the Buy Me a Coffee API
 * @returns Number of buy me a coffee supporters.
 */
export const fetchBMCInfo = async (): Promise<BMCResponse> => {
  const username = "maciekt07";
  const url = `https://img.buymeacoffee.com/button-api/?&slug=${username}`;
  try {
    // Fetch data from the provided URL
    const response = await fetch(url);
    const html = await response.text();
    // Parse the HTML response using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Find the element containing the number of supporters
    const supportersCountElement = doc.querySelector("text[x='226'][y='39'][text-anchor='middle']");
    if (supportersCountElement) {
      const supportersCount = Number(supportersCountElement.textContent);
      return { supportersCount };
    } else {
      throw new Error("Failed to fetch Buy Me a Coffee API: Supporters count element not found.");
    }
  } catch (error) {
    console.error("Error fetching Buy Me a Coffee API:", error);
    if (navigator.onLine) {
      showToast("Failed to fetch Buy Me a Coffee API.", { type: "error", disableVibrate: true });
    }
    return { supportersCount: 0 };
  }
};
