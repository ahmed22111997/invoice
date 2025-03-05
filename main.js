// إضافة صف جديد
function addRow() {
    let tableBody = document.getElementById("invoice-body");
    let row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="desc"></td>
        <td><input type="number" class="qty" value="1" oninput="updateTotal()"></td>
        <td><input type="number" class="price" value="0" step="0.01" oninput="updateTotal()"></td>
        <td class="total">$0.00</td>
        <td><button type="button" onclick="removeRow(this)">❌</button></td>
    `;
    tableBody.appendChild(row);
    updateTotal(); // تحديث الإجمالي بعد إضافة الصف
}

// إزالة الصف
function removeRow(button) {
    button.parentElement.parentElement.remove();
    updateTotal(); // تحديث الإجمالي بعد إزالة الصف
}

// تحديث الإجمالي
function updateTotal() {
    let rows = document.querySelectorAll("#invoice-body tr");
    let total = 0;
    rows.forEach(row => {
        let qty = parseFloat(row.querySelector(".qty").value) || 0; // معالجة للقيمة الفارغة
        let price = parseFloat(row.querySelector(".price").value) || 0; // معالجة للقيمة الفارغة
        let rowTotal = qty * price;
        row.querySelector(".total").textContent = formatCurrency(rowTotal, document.getElementById('currency').value);
        total += rowTotal;
    });
    document.getElementById("invoice-total").textContent = total.toFixed(2);
    document.querySelector("h3 span").textContent = formatCurrency(total, document.getElementById('currency').value);
}

// توليد PDF
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
