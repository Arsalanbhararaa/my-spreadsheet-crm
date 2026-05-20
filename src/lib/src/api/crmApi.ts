const APPS_SCRIPT_URL = "YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE";

export async function fetchCrmHubData() {
  const res = await fetch(`${APPS_SCRIPT_URL}?action=getAllData`);
  if (!res.ok) throw new Error("Failed fetching CRM hub data rows");
  return res.json();
}

export async function submitClientUpdate(clientData: any) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "saveClient", client: clientData }),
  });
  return res.json();
}

export async function submitTransaction(txData: any) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "saveTransaction", transaction: txData }),
  });
  return res.json();
}