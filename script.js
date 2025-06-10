// Dynamic item management
let items = [];

function renderItems() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    items.forEach((item, idx) => {
        itemsDiv.innerHTML += `
            <div class="item-row">
                <input type="text" placeholder="Description" value="${item.description}" onchange="updateItem(${idx}, 'description', this.value)">
                <input type="number" placeholder="Quantity" min="1" value="${item.qty}" onchange="updateItem(${idx}, 'qty', this.value)">
                <input type="number" placeholder="Unit Price" min="0" value="${item.unit}" onchange="updateItem(${idx}, 'unit', this.value)">
                <button type="button" onclick="removeItem(${idx})">Remove</button>
            </div>
        `;
    });
}

function updateItem(idx, field, value) {
    if (field === 'qty' || field === 'unit') value = parseFloat(value) || 0;
    items[idx][field] = value;
    updatePreview();
}

function removeItem(idx) {
    items.splice(idx, 1);
    renderItems();
    updatePreview();
}

document.getElementById('addItem').onclick = function() {
    items.push({ description: '', qty: 1, unit: 0 });
    renderItems();
    updatePreview();
};

// Image management (logo and signature)
let logoData = '';
let signatureData = '';

document.getElementById('companyLogo').onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            logoData = evt.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
};

document.getElementById('signature').onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            signatureData = evt.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
};

// Dynamic invoice preview
function updatePreview() {
    const companyName = document.getElementById('companyName').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const companyPhone = document.getElementById('companyPhone').value;
    const companyEmail = document.getElementById('companyEmail').value;
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
    const currency = document.getElementById('currency').value;
    let subtotal = 0;
    items.forEach(item => {
        subtotal += (item.qty * item.unit);
    });
    const total = subtotal;
    const balance = total - amountPaid;
    const invoiceNumber = document.getElementById('invoiceNumber').textContent;

    let itemsRows = '';
    items.forEach((item, idx) => {
        itemsRows += `<tr><td>${item.qty}</td><td>${item.description}</td><td>${item.unit.toFixed(2)} ${currency}</td><td>${(item.qty * item.unit).toFixed(2)} ${currency}</td></tr>`;
    });
    
    document.getElementById('invoice-preview').innerHTML = `
    <style>
        .invoice-container {
            max-width: 800px;
            margin: auto;
            font-family: 'Arial', sans-serif;
            color: #111;
            padding: 40px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: #white;
            border-radius: 10px;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }
        .invoice-section {
            margin-bottom: 10px;
            font-weight: bold;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }
        .invoice-table th {
            background: #ccc;
            padding: 10px;
            text-align: left;
        }
        .invoice-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .invoice-summary {
            margin-top: 30px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
        .invoice-summary table {
            width: 300px;
        }
        .invoice-summary td {
            padding: 6px 0;
        }
        .subtotal, .total {
            font-weight: bold;
        }
        .signature-img {
            width: 100%;
            height: 50px;
            background: white;
            border-radius: 8px;
            margin-top: 20px;
        }
        .signature-label {
            text-align: center;
            font-weight: bold;
            margin-top: 5px;
        }
        .footer-note {
            font-size: 12px;
            margin-top: 50px;
            text-align: left;
            font-weight: bold;
        }
        
        /* Responsive */
        
        @media (max-width: 500px) {
            .invoice-table {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
            .invoice-table thead{
                display: flex;
                flex-direction: row;
            }
            .invoice-table tbody{
                display: flex;
                flex-direction: column;
            }   
            .invoice-table, .invoice-table thead, .invoice-table tbody, .invoice-table th, .invoice-table td, .invoice-table tr {
                display: flex;
                flex-direction: column;
                width: 100%;
            }
        }
    </style>

    <div class="invoice-container">
        <div class="invoice-header">
            <div>
                <div class="invoice-title">INVOICE</div>
                <div>
                    ${companyName ? companyName + '<br>' : ''}
                    ${companyAddress ? companyAddress + '<br>' : ''}
                    ${companyPhone ? companyPhone + '<br>' : ''}
                    ${companyEmail ? companyEmail : ''}
                </div>
            </div>
            <div>
                <img src="${logoData}" class="logo" alt="Logo" onerror="this.style.display='none'">
            </div>
        </div>

        <div class="invoice-info">
            <div>
                <div class="invoice-section">BILL TO:</div>
                <div>${clientName ? clientName + '<br>' : ''}${clientAddress ? clientAddress : ''}</div>
            </div>
            <div>
                <div class="invoice-section">INVOICE NO:</div>
                <div><strong>${invoiceNumber}</strong></div>
            </div>
        </div>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th>UNIT PRICE</th>
                    <th>AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>

        <div class="invoice-summary">
            <table>
                <tr><td class="subtotal">Subtotal:</td><td style="text-align:right">${subtotal.toFixed(2)} ${currency}</td></tr>
                <tr><td class="total">Total:</td><td style="text-align:right">${total.toFixed(2)} ${currency}</td></tr>
                <tr><td>Paid:</td><td style="text-align:right">${amountPaid.toFixed(2)} ${currency}</td></tr>
                <tr class="total"><td>Balance Due:</td><td style="text-align:right">${balance.toFixed(2)} ${currency}</td></tr>
                <tr><td colspan="2">
                    <img src="${signatureData}" class="signature-img" alt="Signature" onerror="this.style.display='none'">
                    <div class="signature-label">Authorized Signature</div>
                </td></tr>
            </table>
        </div>

        <div class="footer-note">Powered By Spartan</div>
        <img src="asset/paid.png" alt="Paid" class="paid-stamp" style="display: none;">
    </div>
`;

    // Mettre à jour l'affichage du tampon "Paid" après la génération du HTML
    updatePaidStamp();
}

// Update preview on every field change
['companyName','companyAddress','companyPhone','companyEmail','clientName','clientAddress','amountPaid'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
});

document.getElementById('currency').addEventListener('change', updatePreview);

// Initialization
renderItems();
updatePreview();

// PDF generation
window.jsPDF = window.jspdf.jsPDF;
document.getElementById('generatePDF').onclick = function() {
    const preview = document.getElementById('invoice-preview');
    const clientName = document.getElementById('clientName').value;
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Créer un nom de fichier sécurisé
    const safeClientName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `invoice_${safeClientName}_${dateStr}.pdf`;

    // Forcer le rendu desktop
    preview.classList.add('pdf-export');
    setTimeout(() => {
        html2canvas(preview).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 40;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(fileName);
            // Retirer le mode desktop
            preview.classList.remove('pdf-export');
        });
    }, 100); // Laisser le temps au DOM de s'appliquer
};

function getInvoiceNumber() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const monthNames = ['JA','FE','MA','AP','MY','JN','JL','AU','SE','OC','NO','DE'];
    const monthLetters = monthNames[now.getMonth()];
    const random = Math.floor(100 + Math.random() * 900); // 3 chiffres
    return `${month}${day}${monthLetters}${year}-${random}`;
}

function setInvoiceNumber() {
    const num = getInvoiceNumber();
    document.getElementById('invoiceNumber').textContent = num;
    return num;
}

setInvoiceNumber();

// Animation on scroll (fade/slide-in)
document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    scrollElements.forEach(el => observer.observe(el));
});

// Fonction pour mettre à jour l'affichage du tampon "Paid"
function updatePaidStamp() {
    const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
    let subtotal = 0;
    items.forEach(item => {
        subtotal += (item.qty * item.unit);
    });
    const totalAmount = subtotal;
    const paidStamp = document.querySelector('.paid-stamp');
    
    if (paidStamp) {  // Vérifier si l'élément existe
        if (amountPaid >= totalAmount && totalAmount > 0) {
            paidStamp.style.display = 'block';
        } else {
            paidStamp.style.display = 'none';
        }
    }
}

// Ajouter l'écouteur d'événement pour le champ amountPaid
document.getElementById('amountPaid').addEventListener('input', updatePaidStamp);

// Modifier la fonction calculateTotal
function calculateTotal() {
    let subtotal = 0;
    items.forEach(item => {
        subtotal += (item.qty * item.unit);
    });
    return subtotal;
} 