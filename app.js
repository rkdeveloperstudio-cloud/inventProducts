const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

let codeReader = null;

// =====================
// BARCODE SEARCH
// =====================
async function searchByBarcode() {

    try {
        const barcode = document.getElementById("barcodeBox").value.trim();

        const url = `${SUPABASE_URL}/rest/v1/products?barcode=eq.${barcode}&select=*`;

        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY
            }
        });

        const data = await res.json();
        showResults(data);

    } catch (err) {
        console.error(err);
        alert("Barcode search failed");
    }
}

// =====================
// KEYWORD SEARCH
// =====================
async function searchByKeyword() {

    try {
        const keyword = document.getElementById("keywordBox").value.trim();

        const url = `${SUPABASE_URL}/rest/v1/products?description=ilike.*${encodeURIComponent(keyword)}*&select=*`;

        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: "Bearer " + SUPABASE_KEY
            }
        });

        const data = await res.json();
        showResults(data);

    } catch (err) {
        console.error(err);
        alert("Keyword search failed");
    }
}

// =====================
// SHOW RESULTS
// =====================
function showResults(data) {

    const div = document.getElementById("results");
    div.innerHTML = "";

    if (!data || data.length === 0) {
        div.innerHTML = "<p>No results found</p>";
        return;
    }

    data.forEach(p => {

        div.innerHTML += `
            <div class="product">
                <b>${p.description ?? ""}</b><br>
                Barcode: ${p.barcode ?? ""}<br>
                Price: ${p.price ?? 0}<br>
                Cost: ${p.cost ?? 0}<br>
                Qty: ${p.qty_on_hand ?? 0}
            </div>
        `;
    });
}

// =====================
// OPEN SCANNER (BACK CAMERA)
// =====================
async function openScanner() {

    try {

        if (!window.ZXing) {
            alert("ZXing library not loaded");
            return;
        }

        document.getElementById("scannerContainer").style.display = "block";

        codeReader = new ZXing.BrowserMultiFormatReader();

        const devices = await codeReader.listVideoInputDevices();

        if (!devices.length) {
            alert("No camera found");
            return;
        }

        let backCamera = devices.find(d =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear") ||
            d.label.toLowerCase().includes("environment")
        );

        let deviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;

        codeReader.decodeFromVideoDevice(
            deviceId,
            "scannerVideo",
            (result, err) => {

                if (result) {
                    document.getElementById("barcodeBox").value = result.text;
                    closeScanner();
                    searchByBarcode();
                }
            }
        );

    } catch (err) {
        console.error(err);
        alert("Camera error: " + err);
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