const { jsPDF } = window.jspdf;

function generatePDF() {
    console.log("Generating PDF...");
    let doc = new jsPDF();
    doc.text("Invoice", 20, 20);

    let clientName = document.getElementById("client-name")?.value || "N/A";
    let invoiceDate = document.getElementById("invoice-date")?.value || "N/A";
    doc.text(`Client: ${clientName}`, 20, 30);
    doc.text(`Date: ${invoiceDate}`, 20, 40);

    let rows = [];
    document.querySelectorAll("#invoice-body tr").forEach(row => {
        let desc = row.querySelector(".desc")?.value || "N/A";
        let qty = parseFloat(row.querySelector(".qty")?.value) || 0;
        let price = parseFloat(row.querySelector(".price")?.value) || 0;
        let total = qty * price;
        rows.push([desc, qty, price.toFixed(2), total.toFixed(2)]);
    });

    doc.autoTable({
        startY: 50,
        head: [["Description", "Quantity", "Price", "Total"]],
        body: rows
    });

    let totalAmount = document.getElementById("invoice-total")?.textContent || "0";
    let currency = document.getElementById('currency')?.value || 'USD';
    let formattedTotal = formatCurrency(totalAmount, currency);
    
    doc.text(`Total: ${formattedTotal}`, 20, doc.lastAutoTable.finalY + 10);
    doc.save("invoice.pdf");
}

function formatCurrency(amount, currency) {
    switch (currency) {
        case 'USD': return '$' + parseFloat(amount).toFixed(2);
        case 'EUR': return '€' + parseFloat(amount).toFixed(2);
        case 'GBP': return '£' + parseFloat(amount).toFixed(2);
        case 'JPY': return '¥' + parseFloat(amount).toFixed(2);
        case 'AUD': return 'A$' + parseFloat(amount).toFixed(2);
        case 'CAD': return 'C$' + parseFloat(amount).toFixed(2);
        case 'CHF': return 'CHF ' + parseFloat(amount).toFixed(2);
        case 'CNY': return '¥' + parseFloat(amount).toFixed(2);
        case 'SEK': return 'kr ' + parseFloat(amount).toFixed(2);
        case 'NZD': return 'NZ$' + parseFloat(amount).toFixed(2);
        default: return '$' + parseFloat(amount).toFixed(2);
    }
}
