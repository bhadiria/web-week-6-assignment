## 1. Improvements Made This Week

This week, I improved SpendWise by adding JavaScript functionality to make the application interactive.
The improvements include:

- Added a form for setting and updating the monthly budget.
- Added a form for entering expenses, including the expense name, amount, category, and date.
- Used JavaScript to calculate total expenses and the remaining budget.
- Updated the dashboard automatically when expenses are added or deleted.
- Added a dynamic expense table to display user-entered expenses.
- Added a delete button for removing expenses.
- Added validation to prevent invalid budget and expense amounts.
- Displayed feedback messages to inform users when actions succeed or errors occur.
- Added budget status messages to indicate whether the user is within budget, has used the full budget, or has exceeded it.

## 2. How Conditionals Are Used

Conditionals are used to make decisions based on user input and the current financial data.

For example, SpendWise checks whether the remaining balance is negative. If it is, the application displays an over-budget message. If the remaining balance is zero, it displays a message indicating that the budget has been fully used. Otherwise, it displays “Within budget.”
Conditionals are also used to validate user input. For example, the application checks that the expense name is not empty and that the amount is greater than zero before adding an expense.

## 3. How Arrays Are Used to Store Data

SpendWise uses an array named `expenses` to store expense records entered by the user.
Each expense is stored as an object containing an ID, name, amount, category, and date.
## 4. How the DOM Is Updated
The Document Object Model (DOM) allows JavaScript to access and modify HTML elements on the webpage.
SpendWise updates the DOM to display the current budget, total expenses, remaining balance, budget status, and expense records.
## 5. How User Interactions Are Handled Through Events
SpendWise uses JavaScript event listeners to respond to user interactions.
### Budget form submission
The `submit` event allows users to update their monthly budget. The application validates the entered amount, updates the budget variable, and refreshes the dashboard.
### Expense form submission
The expense form's `submit` event collects the expense details, validates the input, and adds the new expense to the array. The dashboard and expense table are then updated.
### Deleting expenses
A `click` event listener on the expense table detects when a delete button is clicked. The selected expense is removed from the array, and the dashboard is refreshed.
