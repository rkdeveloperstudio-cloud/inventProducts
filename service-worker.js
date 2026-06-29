self.addEventListener("install", event => {
    console.log("PWA Installed");
});

self.addEventListener("fetch", event => {
    // basic offline pass-through
});