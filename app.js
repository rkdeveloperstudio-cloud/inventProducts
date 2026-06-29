const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

let codeReader = null;

// =====================
// BARCODE SEARCH
// =====================
async function searchByBarcode() {

    const barcode = document.getElementById("barcodeBox").value.trim();
    if (!barcode) return;

    const url =
`${SUPABASE_URL}/rest/v1/products?barcode=eq.${encodeURIComponent(barcode)}&select=*`;

    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY
        }
    });

    const data = await res.json();
    showResults(data);
}

// =====================
// KEYWORD SEARCH
// =====================
async function searchByKeyword() {

    const keyword = document.getElementById("keywordBox").value.trim();
    if (!keyword) return;

    const url =
`${SUPABASE_URL}/rest/v1/products?description=ilike.*${encodeURIComponent(keyword)}*&select=*`;

    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY
        }
    });

    const data = await res.json();
    showResults(data);
}

// =====================
// SHOW RESULTS
// =====================
function formatMoney(value) {
    return parseFloat(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function formatDate(value) {

    if (!value)
        return "-";

    const d = new Date(value);

    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

}
function showResults(data) {

    const div = document.getElementById("results");
    div.innerHTML = "";

    if (!data || data.length === 0) {
        div.innerHTML = "<p>No results</p>";
        return;
    }

    data.forEach(p => {

       div.innerHTML += `
<div class="product">

    <div style="font-size:15px;font-weight:bold;color:#1565c0;">
        ${p.barcode ?? ""}
    </div>

    <div style="font-size:18px;font-weight:bold;margin:8px 0;">
        ${p.description ?? ""}
    </div>

    <hr>

   <div><b>Cost :</b> ${formatMoney(p.cost)}</div>

<div><b>Price :</b> ${formatMoney(p.price)}</div>

<div>
    <b>Qty :</b>
    <span style="color:${qtyColor}; font-weight:bold;">
        ${qty}
    </span>
</div>

    <div><b>Supplier :</b> ${p.latest_supplier ?? "-"}</div>

    <div><b>Latest Purchase :</b> ${formatDate(p.latest_purchase_date)}</div>

</div>
`;
    });
}
// =====================
// OPEN CAMERA SCANNER
// =====================
async function openScanner() {

    try {

        if (!window.ZXing) {
            alert("ZXing not loaded");
            return;
        }

        document.getElementById("scannerContainer").style.display = "block";

        codeReader = new ZXing.BrowserMultiFormatReader();

        const devices = await codeReader.listVideoInputDevices();

        if (!devices.length) {
            alert("No camera found");
            return;
        }

        // prefer back camera
        let back = devices.find(d =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear") ||
            d.label.toLowerCase().includes("environment")
        );

        const deviceId = back ? back.deviceId : devices[0].deviceId;

        codeReader.decodeFromVideoDevice(deviceId, "scannerVideo", (result) => {

            if (result) {
                document.getElementById("barcodeBox").value = result.text;

                closeScanner();
                searchByBarcode();
            }
        });

    } catch (e) {
        alert("Camera error: " + e.message);
    }
}

// =====================
// CLOSE SCANNER
// =====================
function closeScanner() {

    if (codeReader) {
        codeReader.reset();
        codeReader = null;
    }

    document.getElementById("scannerContainer").style.display = "none";
}