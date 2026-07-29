/**
 * Real-Time Cloud Sync Engine for LogiExpress SaaS.
 * Synchronizes store database (orders, couriers, clients, products, transactions, admin password hash)
 * seamlessly across Admin PC and Courier Phones over the internet.
 */

export const DEFAULT_CLOUD_BLOB_ID = "logi_express_v2027_sync";
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
    // Quiet handling for offline or initial sync setup
  }
  return null;
}

export async function pushStoreToCloud(storeData, blobId = DEFAULT_CLOUD_BLOB_ID) {
  try {
    const activeId = blobId || DEFAULT_CLOUD_BLOB_ID;
    const payload = {
      app: "LogiExpress SaaS",
      updatedAt: new Date().toISOString(),
      ...storeData
    };

    let res = await fetch(`${CLOUD_API_BASE}/${activeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok && res.status === 404) {
      // Create new blob if not existing
      res = await fetch(CLOUD_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const locationHeader = res.headers.get("Location");
        if (locationHeader) {
          const newId = locationHeader.split("/").pop();
          try {
            localStorage.setItem("rapiconta_cloud_sync_id", newId);
          } catch (e) {}
        }
      }
    }

    return res.ok;
  } catch (err) {
    // Quiet handling for network notice
  }
  return false;
}
