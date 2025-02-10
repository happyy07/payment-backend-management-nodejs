// Function to process each record
function processDateRecord(record) {
  // Parse the payee_added_date_utc as a Unix timestamp
  const timestamp = parseInt(record.payee_added_date_utc, 10) * 1000; // Convert to milliseconds
  const date = new Date(timestamp);

  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    // Convert to ISO 8601 format
    record.payee_added_date_utc = date.toISOString();
  } else {
    // Handle invalid date
    console.error(`Invalid date: ${record.payee_added_date_utc}`);
  }

  return record;
}

// Function to update payment status based on due date
function updatePaymentStatus(record) {
  const dueTimestamp = parseInt(record.payee_due_date, 10) * 1000; // Convert to milliseconds
  const dueDate = new Date(dueTimestamp);
  const today = new Date();

  if (!isNaN(dueDate.getTime())) {
    // Check if payee_due_date is today
    if (dueDate.toDateString() === today.toDateString()) {
      record.payee_payment_status = "due_now";
    } else if (dueDate < today) {
      record.payee_payment_status = "overdue";
    }
  } else {
    console.error(`Invalid due date: ${record.payee_due_date}`);
  }

  return record;
}

// Function to calculate total due
function calculateTotalDue(record) {
  const dueAmount = parseFloat(record.due_amount) || 0;
  const discount = parseFloat(record.discount) || 0;
  const tax = parseFloat(record.tax) || 0;

  record.total_due = dueAmount - discount + tax;

  return record;
}

module.exports = { processDateRecord, updatePaymentStatus, calculateTotalDue };
