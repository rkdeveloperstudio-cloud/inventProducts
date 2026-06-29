const SUPABASE_URL = "https://ibmwrbpucbbflnxopfwm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXdyYnB1Y2JiZmxueG9wZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NjczNjgsImV4cCI6MjA5ODI0MzM2OH0.hAf6u1Vb8Z45jC2kCLHI3pZvDk2GMNBWY6mfwcCbUts";

async function searchProducts() {

    let query = document.getElementById("searchBox").value;

    let url = `${SUPABASE_URL}/rest/v1/products?or=(barcode.ilike.*${query}*,description.ilike.*${query}*)&select=*`;

    let res = await fetch(url, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY
        }
    });

    let data = await res.json();

    displayResults(data);
}

function displayResults(items) {

    let html = "";

    items.forEach(p => {
        html += `
        <div style="border:1px solid #ccc;margin:5px;padding:10px">
            <b>${p.barcode}</b><br>
            ${p.description}<br>
            Price: ${p.price} | Stock: ${p.qty_on_hand}
        </div>`;
    });

    document.getElementById("results").innerHTML = html;
}