// Local Database Mock Initialization - Loaded with 2 premium placeholders to start
const defaultCertifiedFleet = [
    {
        id: "NDI-1001",
        name: "Toyota Fortuner",
        variant: "Sigma4 4x4 Luxury",
        year: "2021",
        kms: "34,000",
        price: "3650000",
        fuel: "Diesel",
        transmission: "Automatic",
        owners: "1st Owner",
        color: "Phantom Black",
        rto: "DL-3C",
        insurance: "Comprehensive Valid",
        reelLink: "https://instagram.com",
        image: "hero.jpg",
        status: "Available"
    },
    {
        id: "NDI-1002",
        name: "Maruti Suzuki Swift",
        variant: "VXI Premium",
        year: "2019",
        kms: "42,100",
        price: "580000",
        fuel: "Petrol",
        transmission: "Manual",
        owners: "2nd Owner",
        color: "Solid White",
        rto: "HR-26",
        insurance: "Third Party Valid",
        reelLink: "",
        image: "car1.jpg",
        status: "Available"
    }
];

// Fallback Cache Management System
if (!localStorage.getItem("NODEALER_INVENTORY")) {
    localStorage.setItem("NODEALER_INVENTORY", JSON.stringify(defaultCertifiedFleet));
}

let activeInventoryState = JSON.parse(localStorage.getItem("NODEALER_INVENTORY"));

// Render Controller Matrix
function drawShowroomCatalog(dataset) {
    const mainGrid = document.getElementById("fleetPlacementGrid");
    if (!mainGrid) return;
    mainGrid.innerHTML = "";

    if (dataset.length === 0) {
        mainGrid.innerHTML = `
            <div class="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                <p class="text-slate-400 font-medium text-sm">No cars match your search tags right now.</p>
                <button onclick="resetFiltersUI()" class="mt-2 text-xs font-bold text-indigo-600 hover:underline">Show All Stock</button>
            </div>`;
        return;
    }

    dataset.forEach(car => {
        const isReserved = car.status === "Reserved";
        const showroomCardHtml = `
            <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group relative">
                <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    <span class="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-slate-100">100% Certified</span>
                    ${car.reelLink ? `<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-md shadow-md uppercase">As Seen on Reel</span>` : ""}
                </div>
                
                ${isReserved ? `<div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 flex items-center justify-center"><span class="bg-amber-500 text-white text-xs font-black tracking-widest px-4 py-2 rounded-xl shadow-lg uppercase transform -rotate-6 border-2 border-white">Reserved Slot Locked</span></div>` : ""}

                <div class="bg-slate-100 aspect-[16/10] relative overflow-hidden">
                    <img src="${car.image}" alt="${car.name}" class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'">
                </div>

                <div class="p-6 flex flex-col flex-grow space-y-4">
                    <div>
                        <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">${car.year} Model • ${car.rto} RTO</span>
                        <h3 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">${car.name}</h3>
                        <p class="text-xs font-medium text-slate-400 mt-0.5">${car.variant}</p>
                    </div>

                    <div class="flex flex-wrap gap-1 text-slate-600 font-semibold text-[11px]">
                        <span class="bg-slate-100 px-2.5 py-1 rounded-md">${car.kms} KM</span>
                        <span class="bg-slate-100 px-2.5 py-1 rounded-md">${car.fuel}</span>
                        <span class="bg-slate-100 px-2.5 py-1 rounded-md">${car.transmission}</span>
                    </div>

                    <div class="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                        <div>
                            <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">No-Dealer Cost</span>
                            <span class="text-xl font-black text-slate-900">₹${formatIndianCurrency(car.price)}</span>
                        </div>
                        <button onclick="launchVehicleDetailsModal('${car.id}')" class="bg-slate-900 text-white hover:bg-indigo-600 px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm">
                            View Specs
                        </button>
                    </div>
                </div>
            </div>`;
        mainGrid.insertAdjacentHTML('beforeend', showroomCardHtml);
    });
}

function formatIndianCurrency(priceStr) {
    let num = parseFloat(priceStr);
    if (isNaN(num)) return priceStr;
    if (num >= 100000) {
        return (num / 100000).toFixed(2) + " Lakh";
    }
    return num.toLocaleString('en-IN');
}

function runFilterPipeline() {
    const selectedTrans = document.getElementById("uiFilterTransmission").value;
    const selectedFuel = document.getElementById("uiFilterFuel").value;

    const queryResult = activeInventoryState.filter(car => {
        const transMatch = (selectedTrans === "ALL" || car.transmission === selectedTrans);
        const fuelMatch = (selectedFuel === "ALL" || car.fuel === selectedFuel);
        return transMatch && fuelMatch;
    });

    drawShowroomCatalog(queryResult);
}

function resetFiltersUI() {
    document.getElementById("uiFilterTransmission").value = "ALL";
    document.getElementById("uiFilterFuel").value = "ALL";
    drawShowroomCatalog(activeInventoryState);
}

function launchVehicleDetailsModal(targetId) {
    const matchedCar = activeInventoryState.find(c => car.id === targetId || c.id === targetId);
    if (!matchedCar) return;

    const modalWindow = document.getElementById("premiumDetailModal");
    const targetDiv = document.getElementById("modalDynamicTarget");
    const isCarReserved = matchedCar.status === "Reserved";

    targetDiv.innerHTML = `
        <div class="p-6 space-y-6 text-gray-900">
            <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
                <div class="bg-emerald-500 text-white p-2 rounded-xl">✓</div>
                <div>
                    <h4 class="font-bold text-emerald-900 text-sm">100% Certified & Inspected by NoDealerIndia</h4>
                    <p class="text-xs text-emerald-700 font-medium">Chassis structure, engine compression, and mechanics verified passed.</p>
                </div>
            </div>

            <h2 class="text-2xl font-black">${matchedCar.name} <span class="text-sm font-normal text-gray-500">(${matchedCar.variant})</span></h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">Odometer</span><span class="text-sm font-bold">${matchedCar.kms} KMs</span></div>
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">Fuel Setup</span><span class="text-sm font-bold">${matchedCar.fuel}</span></div>
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">Gearbox</span><span class="text-sm font-bold">${matchedCar.transmission}</span></div>
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">Ownership</span><span class="text-sm font-bold">${matchedCar.owners}</span></div>
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">Color</span><span class="text-sm font-bold">${matchedCar.color}</span></div>
                <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-slate-400 font-bold uppercase text-[9px]">RTO</span><span class="text-sm font-bold">${matchedCar.rto}</span></div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="https://wa.me/919999999999?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(matchedCar.name)}%20(${matchedCar.id})" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-all">
                    Discuss on WhatsApp
                </a>
                <button onclick="triggerPhonePeLockPipe('${matchedCar.id}')" ${isCarReserved ? "disabled" : ""} class="flex-1 ${isCarReserved ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"} font-bold py-3.5 rounded-xl text-sm transition-all">
                    ${isCarReserved ? "Slot Already Reserved" : "Reserve via PhonePe (₹4,999)"}
                </button>
            </div>
        </div>`;

    modalWindow.classList.remove("hidden");
}

function closeDetailedModal() {
    document.getElementById("premiumDetailModal").classList.add("hidden");
}

function triggerPhonePeLockPipe(vehicleId) {
    alert(`[PhonePe Gateway Loading...]\nConnecting to secure PhonePe Business Network.`);
    const paymentCompletedSuccessfully = confirm(`Authorize reservation transaction code for ₹4,999 to lock ${vehicleId}?`);
    
    if (paymentCompletedSuccessfully) {
        activeInventoryState = activeInventoryState.map(car => {
            if (car.id === vehicleId) { return { ...car, status: "Reserved" }; }
            return car;
        });
        localStorage.setItem("NODEALER_INVENTORY", JSON.stringify(activeInventoryState));
        alert(`Success! Payment Received.\nStock Slot ${vehicleId} is now locked. Check your email/admin dashboard.`);
        closeDetailedModal();
        drawShowroomCatalog(activeInventoryState);
    }
}

window.addEventListener("DOMContentLoaded", () => { drawShowroomCatalog(activeInventoryState); });
