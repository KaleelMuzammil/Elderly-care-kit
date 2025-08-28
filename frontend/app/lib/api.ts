const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// --- Existing medicine functions (unchanged) ---
export async function listMedicines(token: string) {
  const r = await fetch(`${API}/api/medicines`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function addMedicine(token: string, data: any) {
  const r = await fetch(`${API}/api/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function updateMedicine(token: string, id: string, data: any) {
  const r = await fetch(`${API}/api/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function deleteMedicine(token: string, id: string) {
  const r = await fetch(`${API}/api/medicines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// --- New vitals functions ---
export async function getLatestVitals(token: string) {
  const r = await fetch(`${API}/api/vitals/latest`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function ingestVitals(token: string, data: any) {
  const r = await fetch(`${API}/api/vitals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
