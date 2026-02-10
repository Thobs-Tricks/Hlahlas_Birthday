// ============================================
// RSVP TRACKER FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Set up tracker if we're on the generator page
    if (isGeneratorPage()) {
        setupTracker();
    }
});

function setupTracker() {
    const trackerToggle = document.getElementById('tracker-toggle');
    const trackerSection = document.getElementById('tracker-section');
    const refreshButton = document.getElementById('refresh-tracker');
    const exportButton = document.getElementById('export-data');
    const clearButton = document.getElementById('clear-data');
    
    let currentRSVPData = [];
    
    // Toggle tracker visibility
    if (trackerToggle) {
        trackerToggle.addEventListener('click', async function() {
            trackerSection.classList.toggle('active');
            
            if (trackerSection.classList.contains('active')) {
                // Load data when opening tracker
                await loadTrackerData();
                
                // Scroll to tracker
                trackerSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Refresh tracker data
    if (refreshButton) {
        refreshButton.addEventListener('click', async function() {
            this.innerHTML = '<span class="spinner"></span> Refreshing...';
            await loadTrackerData();
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
        });
    }
    
    // Export data to CSV
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            exportToCSV(currentRSVPData);
        });
    }
    
    // Clear local data
    if (clearButton) {
        clearButton.addEventListener('click', clearLocalData);
    }
    
    // Function to load tracker data
    async function loadTrackerData() {
        const result = await fetchRSVPData();
        
        if (result.success) {
            currentRSVPData = result.data;
            updateTrackerUI(result.data, result.stats);
        } else {
            const tableBody = document.getElementById('rsvp-table-body');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="no-data">
                            <i class="fas fa-exclamation-triangle" style="color: #ffabab; font-size: 2rem; margin-bottom: 15px; display: block;"></i>
                            <div>Error loading data: ${result.error}</div>
                            <div style="margin-top: 10px; font-size: 1rem;">
                                Check your Firebase connection and security rules.
                            </div>
                        </td>
                    </tr>
                `;
            }
        }
    }
}

async function fetchRSVPData() {
    if (!isFirebaseInitialized()) {
        return { success: false, error: "Database not connected" };
    }
    
    try {
        const querySnapshot = await getFirestore().collection("Birthday RSVP").get();
        
        const rsvpData = [];
        let totalGuests = 0;
        let attendingCount = 0;
        let notAttendingCount = 0;
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            rsvpData.push({
                id: doc.id,
                ...data,
                formattedDate: data.DataSubmitted ? 
                    new Date(data.DataSubmitted.toDate()).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Not set'
            });
            
            const numGuests = parseInt(data.NumGuest) || 1;
            totalGuests += numGuests;
            
            if (data.WillAttend === true) {
                attendingCount++;
            } else {
                notAttendingCount++;
            }
        });
        
        return {
            success: true,
            data: rsvpData,
            stats: {
                total: rsvpData.length,
                attending: attendingCount,
                notAttending: notAttendingCount,
                totalGuests: totalGuests
            }
        };
        
    } catch (error) {
        console.error("Error fetching RSVP data:", error);
        return { success: false, error: error.message };
    }
}

function updateTrackerUI(rsvpData, stats) {
    // Update stats
    const totalRSVPs = document.getElementById('total-rsvps');
    const attendingCount = document.getElementById('attending-count');
    const notAttendingCount = document.getElementById('not-attending-count');
    const totalGuests = document.getElementById('total-guests');
    
    if (totalRSVPs) totalRSVPs.textContent = stats.total;
    if (attendingCount) attendingCount.textContent = stats.attending;
    if (notAttendingCount) notAttendingCount.textContent = stats.notAttending;
    if (totalGuests) totalGuests.textContent = stats.totalGuests;
    
    // Update table
    const tableBody = document.getElementById('rsvp-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (rsvpData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 15px; display: block; color: var(--silver);"></i>
                    <div>No RSVPs yet. Invite some guests!</div>
                    <div style="margin-top: 10px; font-size: 1rem; color: var(--text-gray);">
                        Create invitation links above and share them with guests.
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    rsvpData.sort((a, b) => {
        const dateA = a.DataSubmitted ? a.DataSubmitted.toDate() : new Date(0);
        const dateB = b.DataSubmitted ? b.DataSubmitted.toDate() : new Date(0);
        return dateB - dateA;
    });
    
    // Populate table
    rsvpData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        const statusClass = item.WillAttend ? 'attending-yes' : 'attending-no';
        const statusText = item.WillAttend ? 'Attending' : 'Not Attending';
        
        // Create message bubble with click functionality
        let messageCell = 'No message';
        if (item.Message && item.Message.trim() !== '') {
            const shortMessage = item.Message.length > 50 ? 
                item.Message.substring(0, 50) + '...' : item.Message;
            
            messageCell = `
                <div class="message-bubble" data-index="${index}" data-full-message="${encodeURIComponent(item.Message)}">
                    ${shortMessage}
                    ${item.Message.length > 50 ? '<br><small style="color: var(--silver);">Click to read more</small>' : ''}
                </div>
            `;
        }
        
        row.innerHTML = `
            <td><strong>${item.Fullnames || 'No name'}</strong></td>
            <td>${item.PhoneNumber || 'Not provided'}</td>
            <td>${item.Email || 'Not provided'}</td>
            <td>${item.NumGuest || 1}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${item.formattedDate || 'Not set'}</td>
            <td>${messageCell}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add click event listeners to message bubbles
    document.querySelectorAll('.message-bubble').forEach(bubble => {
        bubble.addEventListener('click', function() {
            const fullMessage = decodeURIComponent(this.getAttribute('data-full-message'));
            showMessageModal(fullMessage);
        });
    });
}

function exportToCSV(rsvpData) {
    if (rsvpData.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Create CSV header
    let csv = 'Full Name,Phone,Email,Guests,Status,Date Submitted,Message\n';
    
    // Add data rows
    rsvpData.forEach((item) => {
        const status = item.WillAttend ? 'Attending' : 'Not Attending';
        const message = (item.Message || '').replace(/"/g, '""'); // Escape quotes
        
        csv += `"${item.Fullnames || ''}","${item.PhoneNumber || ''}","${item.Email || ''}",${item.NumGuest || 1},"${status}","${item.formattedDate || ''}","${message}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bohlale-21st-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show confirmation
    alert(`Exported ${rsvpData.length} RSVPs to CSV file`);
}

function clearLocalData() {
    if (confirm('Are you sure you want to clear all locally stored RSVP data? This will not affect data in Firebase.')) {
        localStorage.removeItem('bohlale21RSVPs');
        alert('Local RSVP data cleared successfully!');
    }
}