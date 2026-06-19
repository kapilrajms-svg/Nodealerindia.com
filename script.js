const SUPABASE_URL = "https://vzksbpiscgmplgbsgozi.supabase.co";
const SUPABASE_KEY = "sb_publishable_Hm8jYH8uEtR29suCqldB-A_Lf5miwL1";

// Global cache storage to prevent unnecessary API over-fetching
let localFleetState = [];

async function initializeShowroomEngine() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/vehicles?select=*&order=created_at.desc`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });
        localFleetState = await response.json();
        renderDesktopGridCards(localFleetState);
    } catch (e) {
        console.error("Showroom engine failed to boot sync nodes:", e);
    }
}

function renderDesktopGridCards(dataset) {
    const container = document.getElementById("fleetPlacementGrid");
    if (!container) return; // Prevents errors if script runs on pages without this grid
    container.innerHTML = "";

    if (dataset.length === 0) {
        container.innerHTML = `<div class="col-span-1 md:col-span-3 text-center py-12 text-slate-400 font-semibold text-sm">No certified vehicles found matching the current search criteria.</div>`;
        return;
    }

    dataset.forEach(car => {
        const isReserved = car.status === "Reserved";
        
        container.innerHTML += `
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all flex flex-col relative group">
                <!-- Premium Certification Tag Badge -->
                <div class="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                    <span class="bg-emerald-600 text-white text-[9px] font-black tracking-wider px-2.5 py-1 rounded-lg uppercase shadow-sm flex items-center gap-1">
                        ✓ 140-Point Certified
                    </span>
                </div>

                <!-- Reserved Shield Lock Overlay -->
                ${isReserved ? `
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center p-4 text-center">
                    <span class="bg-amber-500 text-slate-950 text-xs font-black tracking-widest px-4 py-2 rounded-xl uppercase shadow-2xl border border-white/20">
                        🔒 Holding Token Secured
                    </span>
                </div>
                ` : ''}

                <!-- Media Section Frame -->
                <div class="aspect-[16/10] w-full bg-gray-100 overflow-hidden relative">
                    <img src="${car.image}" alt="${car.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='car1.jpg'">
                </div>

                <!-- Core Information Layout -->
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            <span>${car.year} Model</span>
                            <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">${car.rto} RTO</span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 tracking-tight mt-1">${car.name}</h3>
                        <p class="text-xs text-gray-500 font-medium mt-0.5">${car.variant}</p>
                    </div>

                    <!-- Micro Specification Blueprint Matrix -->
                    <div class="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center text-[10px] font-bold text-gray-500">
                        <div><span class="block text-gray-400 text-[8px] uppercase">Odometer</span><span class="text-gray-800 text-xs">${formatKms(car.kms)}</span></div>
                        <div><span class="block text-gray-400 text-[8px] uppercase">Fuel</span><span class="text-gray-800 text-xs">${car.fuel}</span></div>
                        <div><span class="block text-gray-400 text-[8px] uppercase">Gearbox</span><span class="text-gray-800 text-xs">${car.transmission}</span></div>
                    </div>

                    <!-- Pricing & Route Action Anchor -->
                    <div class="pt-2 flex items-center justify-between border-t border-gray-100">
                        <div>
                            <span class="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Fixed Price</span>
                            <span class="text-xl font-black text-slate-950">₹${formatPrice(car.price)}</span>
                        </div>
                        <a href="vehicle.html?id=${car.id}" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all">
                            View Inspection Report →
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Multi-Axis Pipeline Engine
function runFilterPipeline() {
    const textSearchQuery = document.getElementById("uiSearchBar").value.toLowerCase().trim();
    const selectedTransmission = document.getElementById("uiFilterTransmission").value;
    const selectedFuel = document.getElementById("uiFilterFuel").value;
    const selectedPriceOrder = document.getElementById("uiFilterPriceSort").value;

    let processedDataset = [...localFleetState];

    // Axis 1: Live Text Input Filter (Matches Name, Variant, or Year)
    if (textSearchQuery !== "") {
        processedDataset = processedDataset.filter(car => 
            car.name.toLowerCase().includes(textSearchQuery) || 
            car.variant.toLowerCase().includes(textSearchQuery) ||
            car.year.toString().includes(textSearchQuery)
        );
    }

    // Axis 2: Transmission Logic Dropdown
    if (selectedTransmission !== "ALL") {
        processedDataset = processedDataset.filter(car => car.transmission === selectedTransmission);
    }

    // Axis 3: Fuel Type Logic Dropdown
    if (selectedFuel !== "ALL") {
        processedDataset = processedDataset.filter(car => car.fuel === selectedFuel);
    }

    // Axis 4: Mathematical Sorting Matrix
    if (selectedPriceOrder === "LOW_TO_HIGH") {
        processedDataset.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedPriceOrder === "HIGH_TO_LOW") {
        processedDataset.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    renderDesktopGridCards(processedDataset);
}

function resetFiltersUI() {
    document.getElementById("uiSearchBar").value = "";
    document.getElementById("uiFilterTransmission").value = "ALL";
    document.getElementById("uiFilterFuel").value = "ALL";
    document.getElementById("uiFilterPriceSort").value = "DEFAULT";
    renderDesktopGridCards(localFleetState);
}

function formatPrice(val) {
    let num = parseFloat(val); if (isNaN(num)) return val;
    if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
    return num.toLocaleString('en-IN');
}

function formatKms(val) {
    let num = parseFloat(val); if (isNaN(num)) return val;
    return (num / 1000).toFixed(0) + "K";
}

window.addEventListener("DOMContentLoaded", initializeShowroomEngine);
