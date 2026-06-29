const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

let codeReader = null;

// =====================
// BARCODE SEARCH
// =====================
async function searchByBarcode() {

    const barcode = document.getElementById("barcodeBox").value.trim();
    if (!barcode) return;

    const url = `${SUPABASE_URL}/rest/v1/products?barcode=eq.${barcode}&select=*`;

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

    const url = `${SUPABASE_URL}/rest/v1/products?description=ilike.*${keyword}*&select=*`;

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

                <div><b>${p.barcode ?? ""}</b></div>

                <div style="font-size:16px; font-weight:bold; margin-top:4px;">
                    ${p.description ?? ""}
                </div>

                <div style="margin-top:6px;">
                    <div>Cost: ${formatMoney(p.cost)}</div>
                    <div>Price: ${formatMoney(p.price)}</div>
                    <div>Qty: ${parseInt(p.qty_on_hand || 0)} pcs</div>
                </div>

            </div>
        `;
    });
}// =====================
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