
// ==========================================
// 1. SPENDWISE APPLICATION DATA
// ==========================================

let monthlyBudget = 80000;

let expenses = [];


// ==========================================
// 2. SELECT HTML ELEMENTS
// ==========================================

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const expenseDate = document.getElementById("expense-date");

const totalBudgetDisplay = document.getElementById("total-budget");
const totalSpentDisplay = document.getElementById("total-spent");
const remainingBalanceDisplay = document.getElementById("remaining-balance");
const budgetStatusDisplay = document.getElementById("budget-status");

const expenseList = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");
const feedback = document.getElementById("feedback");


// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

// Format amounts as Kenyan shillings.
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2
    }).format(amount);
}

// Calculate total spending using a loop.
function calculateTotalExpenses() {
    let total = 0;

    for (const expense of expenses) {
        total += expense.amount;
    }

    return total;
}

// Calculate the remaining budget.
function calculateRemainingBalance() {
    return monthlyBudget - calculateTotalExpenses();
}

// Display a feedback message.
function showFeedback(message, type = "info") {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}


// ==========================================
// 4. UPDATE THE SUMMARY CARDS
// ==========================================

function updateDashboard() {
    const totalSpent = calculateTotalExpenses();
    const remaining = calculateRemainingBalance();

    totalBudgetDisplay.textContent = formatCurrency(monthlyBudget);
    totalSpentDisplay.textContent = formatCurrency(totalSpent);
    remainingBalanceDisplay.textContent = formatCurrency(remaining);

    // Make the remaining balance visually meaningful.
    remainingBalanceDisplay.classList.toggle(
        "over-budget",
        remaining < 0
    );

    // Conditional statements determine the budget status.
    if (remaining < 0) {
        budgetStatusDisplay.textContent =
            `Over budget by ${formatCurrency(Math.abs(remaining))}`;

        budgetStatusDisplay.className = "summary-note over-budget";
    } else if (remaining === 0) {
        budgetStatusDisplay.textContent = "Budget fully used";
        budgetStatusDisplay.className = "summary-note";
    } else {
        budgetStatusDisplay.textContent = "Within budget";
        budgetStatusDisplay.className = "summary-note";
    }

    renderExpenses();
}


// ==========================================
// 5. DISPLAY EXPENSES IN THE TABLE
// ==========================================

function renderExpenses() {
    // Clear existing rows before rebuilding the table.
    expenseList.replaceChildren();

    // Show a message when there are no records.
    emptyMessage.hidden = expenses.length > 0;

    // Loop through every expense in the array.
    for (const expense of expenses) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = expense.name;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatCurrency(expense.amount);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        // Store the expense ID on the button.
        deleteButton.dataset.expenseId = expense.id;
        deleteButton.setAttribute(
            "aria-label",
            `Delete expense: ${expense.name}`
        );

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            amountCell,
            categoryCell,
            dateCell,
            actionCell
        );

        expenseList.appendChild(row);
    }
}


// ==========================================
// 6. HANDLE THE BUDGET FORM
// ==========================================

budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newBudget = Number(budgetInput.value);

    if (!Number.isFinite(newBudget) || newBudget <= 0) {
        showFeedback(
            "Please enter a budget greater than zero.",
            "error"
        );
        return;
    }

    monthlyBudget = newBudget;

    updateDashboard();

    showFeedback(
        `Your monthly budget is now ${formatCurrency(monthlyBudget)}.`,
        "success"
    );
});


// ==========================================
// 7. HANDLE THE ADD EXPENSE FORM
// ==========================================

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    // Validate user input before saving.
    if (name === "") {
        showFeedback("Please enter an expense name.", "error");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        showFeedback(
            "Please enter an expense amount greater than zero.",
            "error"
        );
        return;
    }

    if (date === "") {
        showFeedback("Please select an expense date.", "error");
        return;
    }

    // Create a record and store it in the expenses array.
    const newExpense = {
        id: crypto.randomUUID(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(newExpense);

    // Refresh the dashboard and table.
    updateDashboard();

    // Give the user relevant feedback.
    const remaining = calculateRemainingBalance();

    if (remaining < 0) {
        showFeedback(
            `Expense added. You are over budget by ${formatCurrency(Math.abs(remaining))}.`,
            "error"
        );
    } else {
        showFeedback(
            `${name} was added successfully.`,
            "success"
        );
    }

    // Reset the form for the next entry.
    expenseForm.reset();
    setDefaultDate();
});


// ==========================================
// 8. DELETE AN EXPENSE
// ==========================================

// One event listener handles all Delete buttons.
expenseList.addEventListener("click", function (event) {
    if (!event.target.matches(".delete-button")) {
        return;
    }

    const expenseId = event.target.dataset.expenseId;

    // Find the selected record.
    const expenseToDelete = expenses.find(
        expense => expense.id === expenseId
    );

    if (!expenseToDelete) {
        return;
    }

    // Remove the selected record from the array.
    expenses = expenses.filter(
        expense => expense.id !== expenseId
    );

    updateDashboard();

    showFeedback(
        `${expenseToDelete.name} was deleted.`,
        "success"
    );
});


// ==========================================
// 9. SET THE DEFAULT EXPENSE DATE
// ==========================================

function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    expenseDate.value = `${year}-${month}-${day}`;
}


// ==========================================
// 10. INITIALIZE THE DASHBOARD
// ==========================================

budgetInput.value = monthlyBudget;

setDefaultDate();
updateDashboard();

console.log("SpendWise JavaScript loaded successfully.");