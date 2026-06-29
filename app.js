const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

let codeReader;

// =====================
// SEARCH BY BARCODE
// =====================
async function searchByBarcode() {

    let barcode = document.getElementById("barcodeBox").value;

    let url = `${SUPABASE_URL}/rest/v1/products?barcode=eq.${barcode}&select=*`;

    let res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY
        }
    });

    let data = await res.json();
    showResults(data);
}

// =====================
// SEARCH BY KEYWORD
// =====================
async function searchByKeyword() {

    let keyword = document.getElementById("keywordBox").value;

    let url = `${SUPABASE_URL}/rest/v1/products?or=(description.ilike.*${keyword}*)&select=*`;

    let res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY
        }
    });

    let data = await res.json();
    showResults(data);
}

// =====================
// SHOW RESULTS
// =====================
function showResults(data) {

    let div = document.getElementById("results");
    div.innerHTML = "";

    if (data.length === 0) {
        div.innerHTML = "<p>No results found</p>";
        return;
    }

    data.forEach(p => {

        div.innerHTML += `
            <div>
                <b>${p.description}</b><br>
                Barcode: ${p.barcode}<br>
                Price: ${p.price}<br>
                Cost: ${p.cost}<br>
                Qty: ${p.qty_on_hand}
            </div>
        `;
    });
}

---

# 📷 3. BACK CAMERA SCANNER (IMPORTANT PART)

```javascript
// =====================
// OPEN SCANNER (BACK CAMERA ONLY)
// =====================
async function openScanner() {

    document.getElementById("scannerContainer").style.display = "block";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const devices = await codeReader.listVideoInputDevices();

        // try to select BACK camera
        let backCamera = devices.find(d =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear") ||
            d.label.toLowerCase().includes("environment")
        );

        let deviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;

        await codeReader.decodeFromVideoDevice(
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

    } catch (e) {
        alert("Camera error: " + e);
    }
}

// =====================
// CLOSE SCANNER
// =====================
function closeScanner() {

    if (codeReader) {
        codeReader.reset();
    }

    document.getElementById("scannerContainer").style.display = "none";
}