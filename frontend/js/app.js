// LogStream Dashboard

const API_URL =
    "https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/logs";

// Auto refresh every 30 seconds
const REFRESH_INTERVAL = 30000;

// GLOBAL VARIABLES
let logs = [];
let filteredLogs = [];
let severityChart = null;
let sourceChart = null;

// DOM ELEMENTS
const totalLogs = document.getElementById("totalLogs");
const errorLogs = document.getElementById("errorLogs");
const warningLogs = document.getElementById("warningLogs");
const criticalLogs = document.getElementById("criticalLogs");
const searchInput = document.getElementById("searchInput");
const severityFilter = document.getElementById("severityFilter");
const sourceFilter = document.getElementById("sourceFilter");
const logsTable = document.getElementById("logsTable");
const emptyState = document.getElementById("emptyState");
const refreshBtn = document.getElementById("refreshBtn");
const logDetails = document.getElementById("logDetails");

// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    registerEvents();
    loadLogs();
    setInterval(loadLogs, REFRESH_INTERVAL);
});

// EVENTS
function registerEvents() {
    refreshBtn.addEventListener("click", refreshDashboard);
    searchInput.addEventListener("input", filterLogs);
    severityFilter.addEventListener("change", filterLogs);
    sourceFilter.addEventListener("change", filterLogs);
}

// API
async function loadLogs() {
    logsTable.innerHTML = "";
    emptyState.style.display = "none";
    showLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch logs");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            logs = data;
        }

        else if (data.logs) {
            logs = data.logs;
        }

        else {
            logs = [];
        }
        filteredLogs = [...logs];
        sortLogsByTime();
        populateSourceFilter();
        updateDashboard();
        renderLogs();
        updateCharts();
    }
    catch (error) {
        console.error(error);
        showError();
    }
}

// LOADING
function showLoading() {
    logsTable.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:40px;">
                <div class="loader"></div>
            </td>
        </tr>
    `;
}

function showError() {
    logsTable.innerHTML = "";
    emptyState.style.display = "block";

    emptyState.innerHTML = `
        <h3>Unable to Load Logs</h3>
        <p>Please check your API Gateway, Lambda, or network connection.</p>
    `;

    filteredLogs = [];
    updateDashboard();
    updateCharts();
}

// DASHBOARD
function updateDashboard() {
    totalLogs.textContent = filteredLogs.length;
    errorLogs.textContent = filteredLogs.filter(
        log => log.level === "ERROR"
    ).length;

    warningLogs.textContent = filteredLogs.filter(
        log => log.level === "WARNING"
    ).length;

    criticalLogs.textContent = filteredLogs.filter(
        log => log.level === "CRITICAL"
    ).length;
}

// SOURCE FILTER
function populateSourceFilter() {
    const current = sourceFilter.value;
    sourceFilter.innerHTML = `
        <option value="">All Sources</option>
    `;

    const sources = [
        ...new Set(
            logs.map(
                log => log.source
            )
        )
    ];
    sources.sort();

    sources.forEach(source => {
        const option = document.createElement("option");
        option.value = source;
        option.textContent = source;
        sourceFilter.appendChild(option);
    });
    sourceFilter.value = current;
}

// SEARCH & FILTERS

function filterLogs() {
    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const severity = severityFilter.value;
    const source = sourceFilter.value;
    filteredLogs = logs.filter(log => {
        const matchSearch =

            (log.message || "")
                .toLowerCase()
                .includes(searchText)

            ||

            (log.category || "")
                .toLowerCase()
                .includes(searchText)

            ||

            (log.source || "")
                .toLowerCase()
                .includes(searchText)

            ||

            (log.level || "")
                .toLowerCase()
                .includes(searchText);

        const matchSeverity =
            severity === "" ||
            log.level === severity;

        const matchSource =
            source === "" ||
            log.source === source;

        return (
            matchSearch &&
            matchSeverity &&
            matchSource
        );
    });

    updateDashboard();
    renderLogs();
    updateCharts();
}

// TABLE
function renderLogs() {
    logsTable.innerHTML = "";

    if (filteredLogs.length === 0) {
        emptyState.style.display = "block";
        emptyState.innerHTML = `
        <h3>No Logs Found</h3>
            <p>There are currently no logs available.</p>
        `;
        return;
    }

    emptyState.style.display = "none";
    filteredLogs.forEach(log => {
        const row = document.createElement("tr");
        row.style.cursor = "pointer";
        row.innerHTML = `
            <td>${formatDate(log.timestamp)}</td>
            <td>${log.source || "-"}</td>
            <td>${severityBadge(log.level)}</td>
            <td>${log.category || "-"}</td>
            <td>${truncate(log.message || "-", 80)}</td>
        `;

        row.addEventListener(
            "click",
            () => showLogDetails(log)
        );
        logsTable.appendChild(row);
    });
}

// DETAILS PANEL
function showLogDetails(log) {
    logDetails.innerHTML = `
        <h3>Log Information</h3>
        <hr>

        <p>
            <strong>Timestamp</strong>
            <br>
            ${formatDate(log.timestamp)}
        </p>
        <br>

        <p>
            <strong>Source</strong>
            <br>
            ${log.source || "-"}
        </p>
        <br>

        <p>
            <strong>Severity</strong>
            <br>
            ${severityBadge(log.level)}
        </p>

        <br>

        <p>
            <strong>Category</strong>
            <br>
            ${log.category || "-"}
        </p>

        <br>

        <p>
            <strong>Message</strong>
            <br>
            ${log.message || "-"}
        </p>
    `;
}

// BADGE
function severityBadge(level) {
    if (level === "ERROR") {
        return `<span class="badge error">ERROR</span>`;
    }

    if (level === "WARNING") {
        return `<span class="badge warning">WARNING</span>`;
    }

    if (level === "CRITICAL") {
        return `<span class="badge critical">CRITICAL</span>`;
    }
    return `<span class="badge info">INFO</span>`;
}

// DATE FORMAT
function formatDate(date) {
    return date || "-";
}

// MESSAGE
function truncate(text, length) {
    if (!text) return "";
    if (text.length <= length)
        return text;
    return text.substring(0, length) + "...";
}

// CHARTS
function updateCharts() {
    if (typeof Chart === "undefined") return;
    updateSeverityChart();
    updateSourceChart();
}

function updateSeverityChart() {

    const severityCount = {
        INFO: 0,
        WARNING: 0,
        ERROR: 0,
        CRITICAL: 0
    };

    filteredLogs.forEach(log => {

        if (severityCount[log.level] !== undefined) {
            severityCount[log.level]++;
        }
    });

    const ctx = document
        .getElementById("severityChart")
        .getContext("2d");

    if (severityChart) {
        severityChart.destroy();
    }

    severityChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "INFO",
                "WARNING",
                "ERROR",
                "CRITICAL"
            ],

            datasets: [{
                data: [
                    severityCount.INFO,
                    severityCount.WARNING,
                    severityCount.ERROR,
                    severityCount.CRITICAL
                ],

                backgroundColor: [
                    "#3b82f6",
                    "#f59e0b",
                    "#ef4444",
                    "#991b1b"
                ],

                borderWidth: 0
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function updateSourceChart() {
    const sourceData = {};
    filteredLogs.forEach(log => {
        if (!sourceData[log.source]) {
            sourceData[log.source] = 0;
        }

        sourceData[log.source]++;
    });

    const ctx = document
        .getElementById("sourceChart")
        .getContext("2d");

    if (sourceChart) {
        sourceChart.destroy();
    }

    sourceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(sourceData),
            datasets: [{
                label: "Logs",
                data: Object.values(sourceData),
                backgroundColor: "#4f8cff",
                borderRadius: 10,
                maxBarThickness: 60
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// REFRESH
async function refreshDashboard() {
    refreshBtn.disabled = true;
    await loadLogs();
    refreshBtn.disabled = false;
}

// RESET FILTERS
function resetFilters() {
    searchInput.value = "";
    severityFilter.value = "";
    sourceFilter.value = "";
    filteredLogs = [...logs];
    updateDashboard();
    renderLogs();
    updateCharts();
}

// SORT LOGS
function sortLogsByTime() {
    filteredLogs.sort((a, b) => {
        return new Date(b.timestamp) -
            new Date(a.timestamp);
    });
}

// EXPORT (Future Use)
function exportLogs() {
    console.log("Export feature coming soon.");
}

// DEBUG
console.info("LogStream Dashboard Ready");
