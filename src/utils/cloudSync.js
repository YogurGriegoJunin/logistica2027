/**
 * Real-Time Cloud Sync Engine for RapiConta Express.
 * Synchronizes store database (orders, couriers, clients, products, transactions, admin password hash)
 * seamlessly across Admin PC and Courier Phones over the internet.
 */

export const DEFAULT_CLOUD_BLOB_ID = "019fa00e-2009-7163-be6a-739e04fe9e08";
export const CLOUD_API_BASE = "https://jsonblob.com/api/jsonBlob";

export async function fetchStoreFromCloud(blobId = DEFAULT_CLOUD_BLOB_ID) {
  try {
    const activeId = blobId || DEFAULT_CLOUD_BLOB_ID;
    const res = await fetch(`${CLOUD_API_BASE}/${activeId}?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("Cloud Sync Fetch Notice:", err);
  }
  return null;
}

export async function pushStoreToCloud(storeData, blobId = DEFAULT_CLOUD_BLOB_ID) {
  try {
    const activeId = blobId || DEFAULT_CLOUD_BLOB_ID;
    const payload = {
      app: "RapiConta Express",
      updatedAt: new Date().toISOString(),
      ...storeData
    };

    const res = await fetch(`${CLOUD_API_BASE}/${activeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn("Cloud Sync Push Notice:", err);
  }
  return false;
}
