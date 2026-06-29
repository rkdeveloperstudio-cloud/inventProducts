const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

let codeReader;

// ==========================
// SEARCH PRODUCTS
// ==========================
async function searchProducts() {

    let keyword = document.getElementById("searchBox").value;

    let url = `${SUPABASE_URL}/rest/v1/products?or=(barcode.ilike.*${keyword}*,description.ilike.*${keyword}*)&select=*`;

    let response = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: "Bearer " + SUPABASE_KEY
        }
    });

    let data = await response.json();

    showResults(data);
}

// ==========================
// SHOW RESULTS
// ==========================
function showResults(data) {

    let div = document.getElementById("results");
    div.innerHTML = "";

    if (data.length === 0) {
        div.innerHTML = "<p>No products found</p>";
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

// ==========================
// START CAMERA SCANNER
// ==========================
async function startScanner() {

    const video = document.getElementById("video");
    video.style.display = "block";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const devices = await codeReader.listVideoInputDevices();

        const backCamera = devices[0].deviceId;

        await codeReader.decodeFromVideoDevice(
            backCamera,
            "video",
            (result, err) => {

                if (result) {

                    document.getElementById("searchBox").value = result.text;

                    stopScanner();

                    searchProducts();
                }
            }
        );

    } catch (e) {
        alert("Camera error: " + e);
    }
}

// ==========================
// STOP CAMERA
// ==========================
function stopScanner() {

    if (codeReader) {
        codeReader.reset();
    }

    document.getElementById("video").style.display = "none";
}