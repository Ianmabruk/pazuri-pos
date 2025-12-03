# Cashier Dashboard Features Implementation

## 1. Product Display & Quick Search
- [ ] Create ProductGrid.jsx with product grid (images, names, prices)
- [ ] Add categories at top (Fish, Drinks, Combos, etc.)
- [ ] Implement smart search (instant filter)
- [ ] Add barcode scanner support (optional)

## 2. Cart System
- [ ] Create Cart.jsx component
- [ ] Add items selected display
- [ ] Quantity increase/decrease buttons
- [ ] Remove item functionality
- [ ] Auto calculate total
- [ ] Add tax option
- [ ] Add discount option

## 3. Payment Processing
- [ ] Create PaymentModal.jsx
- [ ] Payment methods: Cash, M-PESA, Bank, Card
- [ ] Split payment support
- [ ] Amount paid, balance due, change calculation
- [ ] Receipt printing (PDF or physical)

## 4. Credit Request
- [x] Already implemented (CreditRequestModal.jsx)

## 5. Live Notifications
- [ ] Add notification bell icon to CashierLayout
- [ ] Create notification popup system
- [ ] Add sound for notifications (Glovo-style)
- [ ] Notifications for: admin credit approval, low stock alerts

## 6. Real-time Inventory Visibility
- [ ] Show stock count in ProductGrid
- [ ] Highlight low stock items (red)
- [ ] Update stock in real-time after sales

## 7. Expense Tracking
- [ ] Add expense tracking to DataContext
- [ ] UI to add expenses (oil, breadcrumbs, etc.)
- [ ] Deduct from profit calculation
- [ ] Send to admin automatically

## 8. Combo Costing
- [ ] Display ingredients cost for combos
- [ ] Show profit per plate
- [ ] Calculate profit margin
- [ ] Use existing combos data in DataContext

## 9. Daily Sales Summary
- [ ] Create sales summary dashboard
- [ ] Show total sales today, transactions, top products
- [ ] Add bar chart and pie chart
- [ ] Display best time of day
- [ ] Show cash collected, M-PESA collected

## 10. Staff Time Tracking
- [ ] Add time tracking to DataContext
- [ ] Clock in/out functionality
- [ ] Auto save time
- [ ] Show total hours worked
- [ ] History of shifts

## 11. Shift Management
- [ ] Start shift with opening float
- [ ] End shift with closing cash
- [ ] Summary of cash collected, M-Pesa collected
- [ ] Differences in cash drawer
- [ ] Time logged
- [ ] Send reports to admin

## 12. Receipt Generator
- [ ] Create ReceiptPrint.jsx component
- [ ] Print receipts functionality
- [ ] Download PDF
- [ ] Reprint old receipts

## 13. Cashier Profile Settings
- [ ] Add profile settings page
- [ ] Update profile picture, name, password, username, email
- [ ] Theme selection (light/dark)

## DataContext Enhancements
- [ ] Add cart state management
- [ ] Add notifications state
- [ ] Add time tracking state
- [ ] Add shift management state
- [ ] Add expense tracking state
- [ ] Add profile settings state

## CashierPOS.jsx Updates
- [ ] Integrate ProductGrid and Cart components
- [ ] Add search functionality
- [ ] Add category filtering
- [ ] Connect cart to payment modal
- [ ] Add credit request integration
