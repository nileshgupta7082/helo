/**
 * VaultFlow — Next-Gen Personal Expense & Balance Tracker
 * Complete State, Analytics, and Reactive Financial Engine
 */

(function () {
  'use strict';

  // Category Configuration with thematic colors and icons
  const CATEGORY_MAP = {
    'Food & Dining': { icon: '🍔', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    'Housing & Rent': { icon: '🏠', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    'Tech & Gadgets': { icon: '💻', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    'Transportation': { icon: '🚗', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    'Entertainment': { icon: '🎬', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    'Shopping': { icon: '🛍️', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
    'Utilities & Bills': { icon: '⚡', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
    'Health & Fitness': { icon: '💪', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    'Salary': { icon: '💼', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    'Freelance': { icon: '🚀', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    'Investments': { icon: '📈', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    'Other': { icon: '📦', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' }
  };

  const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  // Pre-seeded starter transactions for a rich initial experience
  const DEFAULT_SAMPLE_DATA = [
    {
      id: 'tx_demo_1',
      title: 'Senior Developer Monthly Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
      date: getRelativeDateString(-9),
      notes: 'Direct deposit from TechCorp'
    },
    {
      id: 'tx_demo_2',
      title: 'Modern High-Rise Apartment Rent',
      amount: 24000,
      type: 'expense',
      category: 'Housing & Rent',
      date: getRelativeDateString(-8),
      notes: 'September rent + maintenance'
    },
    {
      id: 'tx_demo_3',
      title: 'Freelance Web Design Retainer',
      amount: 28000,
      type: 'income',
      category: 'Freelance',
      date: getRelativeDateString(-6),
      notes: 'Milestone 2 for Fintech client'
    },
    {
      id: 'tx_demo_4',
      title: 'Mechanical Keyboard & 4K Monitor',
      amount: 14500,
      type: 'expense',
      category: 'Tech & Gadgets',
      date: getRelativeDateString(-5),
      notes: 'Ergonomic workspace upgrade'
    },
    {
      id: 'tx_demo_5',
      title: 'Whole Foods & Gourmet Supermarket',
      amount: 5200,
      type: 'expense',
      category: 'Food & Dining',
      date: getRelativeDateString(-4),
      notes: 'Weekly groceries & provisions'
    },
    {
      id: 'tx_demo_6',
      title: 'High-Speed Fiber Gigabit Internet',
      amount: 1499,
      type: 'expense',
      category: 'Utilities & Bills',
      date: getRelativeDateString(-3),
      notes: 'Monthly ISP bill'
    },
    {
      id: 'tx_demo_7',
      title: 'Artisan Bistro & Espresso Bar',
      amount: 1850,
      type: 'expense',
      category: 'Food & Dining',
      date: getRelativeDateString(-2),
      notes: 'Team dinner & coffee'
    },
    {
      id: 'tx_demo_8',
      title: 'Annual Gym & Crossfit Pass',
      amount: 3200,
      type: 'expense',
      category: 'Health & Fitness',
      date: getRelativeDateString(-1),
      notes: 'Membership renewal'
    },
    {
      id: 'tx_demo_9',
      title: 'Netflix 4K & Spotify Family',
      amount: 999,
      type: 'expense',
      category: 'Entertainment',
      date: getRelativeDateString(0),
      notes: 'Digital subscriptions'
    }
  ];

  function getRelativeDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  // Application State
  const state = {
    transactions: [],
    currency: 'INR',
    budget: 60000,
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      sort: 'date-desc'
    },
    lastDeleted: null
  };

  // DOM Elements Cache
  const DOM = {
    // Header
    currentDateBadge: document.getElementById('live-date-text'),
    currencySelector: document.getElementById('currency-selector'),
    btnBudgetModal: document.getElementById('btn-budget-modal'),
    btnDataMenu: document.getElementById('btn-data-menu'),
    dataDropdownMenu: document.getElementById('data-dropdown-menu'),
    btnExportCsv: document.getElementById('btn-export-csv'),
    btnExportJson: document.getElementById('btn-export-json'),
    jsonImportInput: document.getElementById('json-import-input'),
    btnSeedSample: document.getElementById('btn-seed-sample'),
    btnClearAll: document.getElementById('btn-clear-all'),
    btnOpenAddModal: document.getElementById('btn-open-add-modal'),

    // KPI Card Elements
    totalBalanceAmount: document.getElementById('total-balance-amount'),
    balanceSymbol: document.getElementById('kpi-balance-symbol'),
    balanceIncomeBar: document.getElementById('balance-income-bar'),
    balanceExpenseBar: document.getElementById('balance-expense-bar'),
    savingsRateBadge: document.getElementById('savings-rate-badge'),
    balanceStatusText: document.getElementById('balance-status-text'),

    totalIncomeAmount: document.getElementById('total-income-amount'),
    incomeSymbol: document.getElementById('kpi-income-symbol'),
    incomeCountText: document.getElementById('income-count-text'),

    totalExpenseAmount: document.getElementById('total-expense-amount'),
    expenseSymbol: document.getElementById('kpi-expense-symbol'),
    expenseCountText: document.getElementById('expense-count-text'),

    budgetLimitDisplay: document.getElementById('budget-limit-display'),
    budgetSymbol: document.getElementById('kpi-budget-symbol'),
    budgetStatusPill: document.getElementById('budget-status-pill'),
    budgetProgressBar: document.getElementById('budget-progress-bar'),
    budgetSpentSubtext: document.getElementById('budget-spent-subtext'),
    budgetRemainingSubtext: document.getElementById('budget-remaining-subtext'),

    // Analytics / Charts
    chartTotalExpenses: document.getElementById('chart-total-expenses'),
    categoryDonutChart: document.getElementById('category-donut-chart'),
    topCategoryName: document.getElementById('top-category-name'),
    topCategoryPct: document.getElementById('top-category-pct'),
    chartLegendContainer: document.getElementById('chart-legend-container'),
    monthlyBarChart: document.getElementById('monthly-bar-chart'),
    smartInsightsList: document.getElementById('smart-insights-list'),

    // Feed & Toolbar
    searchTransactions: document.getElementById('search-transactions'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    filterCategorySelect: document.getElementById('filter-category-select'),
    sortTransactionsSelect: document.getElementById('sort-transactions-select'),
    filteredCountBadge: document.getElementById('filtered-count-badge'),
    transactionListContainer: document.getElementById('transaction-list-container'),
    emptyStateView: document.getElementById('empty-state-view'),
    btnEmptyAdd: document.getElementById('btn-empty-add'),

    // Modals
    transactionModal: document.getElementById('transaction-modal'),
    modalTitle: document.getElementById('modal-title'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    transactionForm: document.getElementById('transaction-form'),
    formEditId: document.getElementById('form-edit-id'),
    formTitle: document.getElementById('form-title'),
    formAmount: document.getElementById('form-amount'),
    formDate: document.getElementById('form-date'),
    formCategory: document.getElementById('form-category'),
    formNotes: document.getElementById('form-notes'),
    radioExpense: document.getElementById('radio-expense'),
    radioIncome: document.getElementById('radio-income'),
    formCurrencySymbols: document.querySelectorAll('.form-currency-symbol'),

    budgetModal: document.getElementById('budget-modal'),
    budgetForm: document.getElementById('budget-form'),
    budgetInput: document.getElementById('budget-input'),
    btnCloseBudgetModal: document.getElementById('btn-close-budget-modal'),
    btnCancelBudget: document.getElementById('btn-cancel-budget'),

    toastContainer: document.getElementById('toast-container')
  };

  // =========================================================================
  // Storage & Initialization
  // =========================================================================

  function loadStateFromStorage() {
    try {
      const storedTx = localStorage.getItem('vaultflow_transactions');
      const storedCurrency = localStorage.getItem('vaultflow_currency');
      const storedBudget = localStorage.getItem('vaultflow_budget');

      if (storedTx) {
        state.transactions = JSON.parse(storedTx);
      } else {
        // Initialize with rich sample data on first visit
        state.transactions = [...DEFAULT_SAMPLE_DATA];
        saveTransactionsToStorage();
      }

      if (storedCurrency && CURRENCY_SYMBOLS[storedCurrency]) {
        state.currency = storedCurrency;
        DOM.currencySelector.value = storedCurrency;
      }

      if (storedBudget) {
        state.budget = parseFloat(storedBudget) || 60000;
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      state.transactions = [...DEFAULT_SAMPLE_DATA];
    }
  }

  function saveTransactionsToStorage() {
    try {
      localStorage.setItem('vaultflow_transactions', JSON.stringify(state.transactions));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  function savePreferencesToStorage() {
    try {
      localStorage.setItem('vaultflow_currency', state.currency);
      localStorage.setItem('vaultflow_budget', state.budget.toString());
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  }

  // =========================================================================
  // Formatting Utilities
  // =========================================================================

  function getCurrencySymbol() {
    return CURRENCY_SYMBOLS[state.currency] || '₹';
  }

  function formatMoney(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatDateHuman(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  // =========================================================================
  // Core Render Engine
  // =========================================================================

  function renderAll() {
    updateHeaderDate();
    updateCurrencySymbols();
    renderKpiMetrics();
    renderCategoryChart();
    renderMonthlyChart();
    renderSmartInsights();
    renderTransactionFeed();
  }

  function updateHeaderDate() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    DOM.currentDateBadge.textContent = now.toLocaleDateString('en-US', options);
  }

  function updateCurrencySymbols() {
    const sym = getCurrencySymbol();
    DOM.balanceSymbol.textContent = sym;
    DOM.incomeSymbol.textContent = sym;
    DOM.expenseSymbol.textContent = sym;
    DOM.budgetSymbol.textContent = sym;

    DOM.formCurrencySymbols.forEach(el => {
      el.textContent = sym;
    });
  }

  // 1. KPI Cards Computation
  function renderKpiMetrics() {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    state.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
        incomeCount++;
      } else {
        totalExpense += amt;
        expenseCount++;
      }
    });

    const netBalance = totalIncome - totalExpense;

    // Balance Card
    DOM.totalBalanceAmount.textContent = formatMoney(netBalance);
    DOM.totalIncomeAmount.textContent = formatMoney(totalIncome);
    DOM.totalExpenseAmount.textContent = formatMoney(totalExpense);

    DOM.incomeCountText.textContent = incomeCount;
    DOM.expenseCountText.textContent = expenseCount;

    // Savings Rate
    let savingsRate = 0;
    if (totalIncome > 0) {
      savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100);
    }
    DOM.savingsRateBadge.textContent = `${savingsRate}%`;

    if (savingsRate >= 40) {
      DOM.savingsRateBadge.className = 'text-emerald';
      DOM.balanceStatusText.textContent = 'Excellent Savings';
    } else if (savingsRate > 10) {
      DOM.savingsRateBadge.className = 'text-amber';
      DOM.balanceStatusText.textContent = 'Moderate Savings';
    } else if (savingsRate >= 0) {
      DOM.savingsRateBadge.className = 'text-slate';
      DOM.balanceStatusText.textContent = 'Break-even';
    } else {
      DOM.savingsRateBadge.className = 'text-rose';
      DOM.balanceStatusText.textContent = 'Deficit / Overspent';
    }

    // Balance Ratio Bar
    const totalFlow = totalIncome + totalExpense;
    if (totalFlow > 0) {
      const incPct = Math.min(100, Math.max(0, (totalIncome / totalFlow) * 100));
      const expPct = 100 - incPct;
      DOM.balanceIncomeBar.style.width = `${incPct}%`;
      DOM.balanceExpenseBar.style.width = `${expPct}%`;
    } else {
      DOM.balanceIncomeBar.style.width = '50%';
      DOM.balanceExpenseBar.style.width = '50%';
    }

    // Monthly Budget Cap
    const currentMonthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentMonthExpenses = state.transactions
      .filter(tx => tx.type === 'expense' && tx.date && tx.date.startsWith(currentMonthPrefix))
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    const budgetLimit = state.budget;
    DOM.budgetLimitDisplay.textContent = formatMoney(budgetLimit);

    const budgetPct = budgetLimit > 0 ? Math.round((currentMonthExpenses / budgetLimit) * 100) : 0;
    DOM.budgetSpentSubtext.textContent = `${budgetPct}% used (${getCurrencySymbol()}${formatMoney(currentMonthExpenses)})`;

    const remainingBudget = budgetLimit - currentMonthExpenses;
    if (remainingBudget >= 0) {
      DOM.budgetRemainingSubtext.textContent = `${getCurrencySymbol()}${formatMoney(remainingBudget)} left`;
    } else {
      DOM.budgetRemainingSubtext.textContent = `${getCurrencySymbol()}${formatMoney(Math.abs(remainingBudget))} over cap`;
    }

    const clampedBar = Math.min(100, budgetPct);
    DOM.budgetProgressBar.style.width = `${clampedBar}%`;

    // Dynamic warning states
    DOM.budgetProgressBar.classList.remove('warning', 'danger');
    if (budgetPct >= 100) {
      DOM.budgetProgressBar.classList.add('danger');
      DOM.budgetStatusPill.className = 'badge badge-danger';
      DOM.budgetStatusPill.textContent = 'Exceeded';
    } else if (budgetPct >= 80) {
      DOM.budgetProgressBar.classList.add('warning');
      DOM.budgetStatusPill.className = 'badge badge-warning';
      DOM.budgetStatusPill.textContent = 'Alert 80%+';
    } else {
      DOM.budgetStatusPill.className = 'badge badge-success';
      DOM.budgetStatusPill.textContent = 'Safe';
    }
  }

  // 2. Category Donut Chart
  function renderCategoryChart() {
    const expenses = state.transactions.filter(tx => tx.type === 'expense');
    const totalExp = expenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    DOM.chartTotalExpenses.textContent = `${getCurrencySymbol()}${formatMoney(totalExp)}`;

    if (totalExp === 0) {
      DOM.categoryDonutChart.innerHTML = `
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="20" />
      `;
      DOM.topCategoryName.textContent = 'No Data';
      DOM.topCategoryPct.textContent = '0%';
      DOM.chartLegendContainer.innerHTML = '<p class="text-dim text-center" style="grid-column: span 2;">No expenses logged</p>';
      return;
    }

    // Group by category
    const catMap = {};
    expenses.forEach(tx => {
      const cat = tx.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + (Number(tx.amount) || 0);
    });

    const sortedCategories = Object.keys(catMap)
      .map(cat => ({
        name: cat,
        amount: catMap[cat],
        pct: (catMap[cat] / totalExp) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    // Update center callout
    const topCat = sortedCategories[0];
    DOM.topCategoryName.textContent = topCat ? topCat.name : 'None';
    DOM.topCategoryPct.textContent = topCat ? `${Math.round(topCat.pct)}%` : '0%';

    // Build SVG Donut Slices
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPct = 0;
    let slicesSvg = '';

    sortedCategories.forEach(item => {
      const catConfig = CATEGORY_MAP[item.name] || CATEGORY_MAP['Other'];
      const strokeLength = (item.pct / 100) * circumference;
      const strokeDashoffset = -((accumulatedPct / 100) * circumference);

      slicesSvg += `
        <circle class="donut-slice"
          cx="100" cy="100" r="${radius}"
          stroke="${catConfig.color}"
          stroke-dasharray="${strokeLength} ${circumference}"
          stroke-dashoffset="${strokeDashoffset}"
          data-cat="${item.name}"
          data-amount="${item.amount}">
          <title>${item.name}: ${getCurrencySymbol()}${formatMoney(item.amount)} (${item.pct.toFixed(1)}%)</title>
        </circle>
      `;

      accumulatedPct += item.pct;
    });

    DOM.categoryDonutChart.innerHTML = slicesSvg;

    // Render Legend Items (Top 6)
    const legendItems = sortedCategories.slice(0, 6).map(item => {
      const catConfig = CATEGORY_MAP[item.name] || CATEGORY_MAP['Other'];
      return `
        <div class="legend-item" title="${item.name}: ${getCurrencySymbol()}${formatMoney(item.amount)}">
          <div class="legend-meta">
            <span class="legend-color-dot" style="background-color: ${catConfig.color};"></span>
            <span class="legend-name">${catConfig.icon} ${item.name}</span>
          </div>
          <span class="legend-pct">${Math.round(item.pct)}%</span>
        </div>
      `;
    }).join('');

    DOM.chartLegendContainer.innerHTML = legendItems;
  }

  // 3. Monthly Inflows vs Outflows Bar Chart
  function renderMonthlyChart() {
    // Generate past 5 months array
    const months = [];
    const now = new Date();

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7); // YYYY-MM
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      months.push({ key, label, income: 0, expense: 0 });
    }

    state.transactions.forEach(tx => {
      if (!tx.date) return;
      const txMonth = tx.date.slice(0, 7);
      const targetMonth = months.find(m => m.key === txMonth);
      if (targetMonth) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') targetMonth.income += amt;
        else targetMonth.expense += amt;
      }
    });

    // Find max value for scaling bar heights
    let maxVal = 1000;
    months.forEach(m => {
      if (m.income > maxVal) maxVal = m.income;
      if (m.expense > maxVal) maxVal = m.expense;
    });

    const barHtml = months.map(m => {
      const incHeight = Math.max(4, Math.round((m.income / maxVal) * 115));
      const expHeight = Math.max(4, Math.round((m.expense / maxVal) * 115));

      return `
        <div class="bar-month-group">
          <div class="bars-wrapper">
            <div class="chart-bar bar-income" style="height: ${m.income > 0 ? incHeight : 4}px;"
              title="${m.label} Income: ${getCurrencySymbol()}${formatMoney(m.income)}"></div>
            <div class="chart-bar bar-expense" style="height: ${m.expense > 0 ? expHeight : 4}px;"
              title="${m.label} Expense: ${getCurrencySymbol()}${formatMoney(m.expense)}"></div>
          </div>
          <span class="month-label">${m.label}</span>
        </div>
      `;
    }).join('');

    DOM.monthlyBarChart.innerHTML = barHtml;
  }

  // 4. Financial Health Signals / Smart Insights
  function renderSmartInsights() {
    const expenses = state.transactions.filter(tx => tx.type === 'expense');
    const incomes = state.transactions.filter(tx => tx.type === 'income');

    const totalExp = expenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const totalInc = incomes.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    const insights = [];

    // Insight 1: Highest Single Expense
    if (expenses.length > 0) {
      const highest = [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
      insights.push({
        icon: '⚡',
        html: `Major outflow: <strong>${escapeHtml(highest.title)}</strong> at <strong>${getCurrencySymbol()}${formatMoney(highest.amount)}</strong> (${highest.category}).`
      });
    }

    // Insight 2: Inflow to Outflow Ratio
    if (totalInc > 0 && totalExp > 0) {
      const ratio = ((totalExp / totalInc) * 100).toFixed(0);
      if (ratio < 50) {
        insights.push({
          icon: '💎',
          html: `High liquidity: You are spending only <strong>${ratio}%</strong> of total earned revenues.`
        });
      } else if (ratio <= 80) {
        insights.push({
          icon: '📊',
          html: `Healthy spending: Outflows are at <strong>${ratio}%</strong> of cumulative income.`
        });
      } else {
        insights.push({
          icon: '⚠️',
          html: `Cash flow alert: Spending has hit <strong>${ratio}%</strong> of all recorded income.`
        });
      }
    }

    // Insight 3: Daily Average
    if (expenses.length > 0) {
      const avg = totalExp / (expenses.length || 1);
      insights.push({
        icon: '🎯',
        html: `Average cost per logged expense: <strong>${getCurrencySymbol()}${formatMoney(avg)}</strong> across ${expenses.length} entries.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        html: 'Log your first income and expense transactions to reveal live financial intelligence.'
      });
    }

    DOM.smartInsightsList.innerHTML = insights.map(item => `
      <div class="insight-item">
        <span class="insight-icon">${item.icon}</span>
        <div class="insight-content">${item.html}</div>
      </div>
    `).join('');
  }

  // 5. Interactive Ledger & Transaction Feed
  function renderTransactionFeed() {
    let filtered = [...state.transactions];

    // Filter by Search Query
    if (state.filters.search.trim()) {
      const query = state.filters.search.toLowerCase().trim();
      filtered = filtered.filter(tx => {
        const titleMatch = (tx.title || '').toLowerCase().includes(query);
        const notesMatch = (tx.notes || '').toLowerCase().includes(query);
        const catMatch = (tx.category || '').toLowerCase().includes(query);
        return titleMatch || notesMatch || catMatch;
      });
    }

    // Filter by Type (All / Income / Expense)
    if (state.filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === state.filters.type);
    }

    // Filter by Category
    if (state.filters.category !== 'all') {
      filtered = filtered.filter(tx => tx.category === state.filters.category);
    }

    // Sorting
    filtered.sort((a, b) => {
      const amtA = Number(a.amount) || 0;
      const amtB = Number(b.amount) || 0;
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      switch (state.filters.sort) {
        case 'date-asc':
          return dateA - dateB;
        case 'amount-desc':
          return amtB - amtA;
        case 'amount-asc':
          return amtA - amtB;
        case 'date-desc':
        default:
          return dateB - dateA;
      }
    });

    // Update Counter Badge
    DOM.filteredCountBadge.textContent = `${filtered.length} record${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      DOM.transactionListContainer.innerHTML = '';
      DOM.emptyStateView.classList.remove('hidden');
      return;
    }

    DOM.emptyStateView.classList.add('hidden');

    const html = filtered.map(tx => {
      const catConfig = CATEGORY_MAP[tx.category] || CATEGORY_MAP['Other'];
      const isIncome = tx.type === 'income';
      const sign = isIncome ? '+' : '-';
      const amountClass = isIncome ? 'amount-income' : 'amount-expense';

      return `
        <div class="tx-item" data-id="${tx.id}">
          <div class="tx-left">
            <div class="tx-icon-badge" style="background-color: ${catConfig.bg}; border-color: ${catConfig.color}40;">
              ${catConfig.icon}
            </div>
            <div class="tx-details">
              <span class="tx-title" title="${escapeHtml(tx.title)}">${escapeHtml(tx.title)}</span>
              <div class="tx-meta">
                <span>${formatDateHuman(tx.date)}</span>
                <span>•</span>
                <span class="tx-category-badge">${escapeHtml(tx.category)}</span>
                ${tx.notes ? `<span>•</span><span class="tx-notes-hint" title="${escapeHtml(tx.notes)}">${escapeHtml(tx.notes)}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="tx-right">
            <div class="tx-amount ${amountClass}">
              ${sign}${getCurrencySymbol()}${formatMoney(tx.amount)}
            </div>
            <div class="tx-actions">
              <button class="btn-tx-action btn-tx-edit" data-id="${tx.id}" title="Edit Transaction">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-tx-action btn-tx-delete" data-id="${tx.id}" title="Delete Transaction">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    DOM.transactionListContainer.innerHTML = html;
  }

  // =========================================================================
  // Transaction CRUD & Modals
  // =========================================================================

  function openAddModal(isEdit = false, txData = null) {
    DOM.transactionForm.reset();
    DOM.formEditId.value = '';

    if (isEdit && txData) {
      DOM.modalTitle.textContent = 'Edit Transaction';
      DOM.formEditId.value = txData.id;
      DOM.formTitle.value = txData.title || '';
      DOM.formAmount.value = txData.amount || '';
      DOM.formDate.value = txData.date || '';
      DOM.formCategory.value = txData.category || 'Food & Dining';
      DOM.formNotes.value = txData.notes || '';

      if (txData.type === 'income') {
        DOM.radioIncome.checked = true;
      } else {
        DOM.radioExpense.checked = true;
      }
    } else {
      DOM.modalTitle.textContent = 'New Transaction';
      DOM.radioExpense.checked = true;
      DOM.formDate.value = new Date().toISOString().split('T')[0];
    }

    DOM.transactionModal.classList.remove('hidden');
    DOM.transactionModal.setAttribute('aria-hidden', 'false');
    DOM.formTitle.focus();
  }

  function closeAddModal() {
    DOM.transactionModal.classList.add('hidden');
    DOM.transactionModal.setAttribute('aria-hidden', 'true');
    DOM.transactionForm.reset();
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const editId = DOM.formEditId.value;
    const title = DOM.formTitle.value.trim();
    const amount = parseFloat(DOM.formAmount.value);
    const date = DOM.formDate.value;
    const category = DOM.formCategory.value;
    const notes = DOM.formNotes.value.trim();
    const type = DOM.radioIncome.checked ? 'income' : 'expense';

    if (!title || isNaN(amount) || amount <= 0 || !date) {
      showToast('Please verify all required fields with a valid amount.', 'warning');
      return;
    }

    if (editId) {
      // Update existing
      const index = state.transactions.findIndex(t => t.id === editId);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          title,
          amount,
          date,
          category,
          notes,
          type
        };
        showToast(`Updated "${title}" successfully.`);
      }
    } else {
      // Create new
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title,
        amount,
        date,
        category,
        notes,
        type
      };
      state.transactions.unshift(newTx);
      showToast(`Added ${type === 'income' ? 'income' : 'expense'} "${title}".`);
    }

    saveTransactionsToStorage();
    renderAll();
    closeAddModal();
  }

  function deleteTransaction(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (!tx) return;

    state.lastDeleted = { ...tx };
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveTransactionsToStorage();
    renderAll();

    showToast(`Deleted "${tx.title}"`, 'info', true);
  }

  function undoDelete() {
    if (state.lastDeleted) {
      state.transactions.unshift(state.lastDeleted);
      const title = state.lastDeleted.title;
      state.lastDeleted = null;
      saveTransactionsToStorage();
      renderAll();
      showToast(`Restored "${title}"`);
    }
  }

  // =========================================================================
  // Budget Modal
  // =========================================================================

  function openBudgetModal() {
    DOM.budgetInput.value = state.budget;
    DOM.budgetModal.classList.remove('hidden');
    DOM.budgetModal.setAttribute('aria-hidden', 'false');
    DOM.budgetInput.focus();
  }

  function closeBudgetModal() {
    DOM.budgetModal.classList.add('hidden');
    DOM.budgetModal.setAttribute('aria-hidden', 'true');
  }

  function handleBudgetSubmit(e) {
    e.preventDefault();
    const val = parseFloat(DOM.budgetInput.value);
    if (!isNaN(val) && val > 0) {
      state.budget = val;
      savePreferencesToStorage();
      renderAll();
      closeBudgetModal();
      showToast(`Monthly budget updated to ${getCurrencySymbol()}${formatMoney(val)}`);
    }
  }

  // =========================================================================
  // Export & Import Management
  // =========================================================================

  function exportCSV() {
    if (state.transactions.length === 0) {
      showToast('No transactions available to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Notes'];
    const rows = state.transactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.date || ''}"`,
      `"${tx.type}"`,
      `"${tx.category || ''}"`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      Number(tx.amount).toFixed(2),
      `"${state.currency}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vaultflow_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ledger exported as CSV successfully.');
  }

  function exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      version: '1.0',
      currency: state.currency,
      budget: state.budget,
      transactions: state.transactions
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vaultflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('VaultFlow backup downloaded as JSON.');
  }

  function handleJSONImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        const txList = Array.isArray(parsed) ? parsed : parsed.transactions;

        if (Array.isArray(txList)) {
          state.transactions = txList;
          if (parsed.currency && CURRENCY_SYMBOLS[parsed.currency]) {
            state.currency = parsed.currency;
            DOM.currencySelector.value = parsed.currency;
          }
          if (parsed.budget) {
            state.budget = Number(parsed.budget) || state.budget;
          }
          saveTransactionsToStorage();
          savePreferencesToStorage();
          renderAll();
          showToast(`Imported ${txList.length} transactions successfully.`);
        } else {
          showToast('Invalid JSON file format.', 'warning');
        }
      } catch (err) {
        console.error('Import error', err);
        showToast('Failed to parse JSON file.', 'warning');
      }
      e.target.value = ''; // Reset input
    };
    reader.readAsText(file);
  }

  function loadSampleData() {
    if (confirm('Load sample demonstration data? Your active transactions will be replaced with rich demo records.')) {
      state.transactions = [...DEFAULT_SAMPLE_DATA];
      saveTransactionsToStorage();
      renderAll();
      showToast('Sample dataset loaded.');
    }
  }

  function clearAllData() {
    if (confirm('Are you sure you want to clear ALL transactions? This cannot be undone unless you have an export.')) {
      state.transactions = [];
      saveTransactionsToStorage();
      renderAll();
      showToast('Ledger cleared.');
    }
  }

  // =========================================================================
  // Toast Notifications
  // =========================================================================

  function showToast(message, type = 'success', withUndo = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
      <div class="toast-body">
        <span>${icon}</span>
        <span>${escapeHtml(message)}</span>
      </div>
      ${withUndo ? '<button class="toast-action-btn" id="toast-undo-btn">Undo</button>' : ''}
    `;

    DOM.toastContainer.appendChild(toast);

    if (withUndo) {
      const undoBtn = toast.querySelector('#toast-undo-btn');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          undoDelete();
          toast.remove();
        });
      }
    }

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================

  function setupEventListeners() {
    // Currency Switcher
    DOM.currencySelector.addEventListener('change', (e) => {
      state.currency = e.target.value;
      savePreferencesToStorage();
      renderAll();
      showToast(`Currency changed to ${getCurrencySymbol()} ${state.currency}`);
    });

    // Add Modal Triggers
    DOM.btnOpenAddModal.addEventListener('click', () => openAddModal());
    DOM.btnEmptyAdd.addEventListener('click', () => openAddModal());
    DOM.btnCloseModal.addEventListener('click', closeAddModal);
    DOM.btnCancelModal.addEventListener('click', closeAddModal);
    DOM.transactionModal.addEventListener('click', (e) => {
      if (e.target === DOM.transactionModal) closeAddModal();
    });
    DOM.transactionForm.addEventListener('submit', handleFormSubmit);

    // Budget Modal
    DOM.btnBudgetModal.addEventListener('click', openBudgetModal);
    DOM.btnCloseBudgetModal.addEventListener('click', closeBudgetModal);
    DOM.btnCancelBudget.addEventListener('click', closeBudgetModal);
    DOM.budgetModal.addEventListener('click', (e) => {
      if (e.target === DOM.budgetModal) closeBudgetModal();
    });
    DOM.budgetForm.addEventListener('submit', handleBudgetSubmit);

    // Data Options Menu Dropdown
    DOM.btnDataMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.btnDataMenu.parentElement.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    });

    DOM.btnExportCsv.addEventListener('click', exportCSV);
    DOM.btnExportJson.addEventListener('click', exportJSON);
    DOM.jsonImportInput.addEventListener('change', handleJSONImport);
    DOM.btnSeedSample.addEventListener('click', loadSampleData);
    DOM.btnClearAll.addEventListener('click', clearAllData);

    // Feed Search
    DOM.searchTransactions.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      if (e.target.value.length > 0) {
        DOM.btnClearSearch.classList.remove('hidden');
      } else {
        DOM.btnClearSearch.classList.add('hidden');
      }
      renderTransactionFeed();
    });

    DOM.btnClearSearch.addEventListener('click', () => {
      DOM.searchTransactions.value = '';
      state.filters.search = '';
      DOM.btnClearSearch.classList.add('hidden');
      renderTransactionFeed();
    });

    // Type Filter Tabs
    DOM.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.filters.type = tab.dataset.type;
        renderTransactionFeed();
      });
    });

    // Category Filter Select
    DOM.filterCategorySelect.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      renderTransactionFeed();
    });

    // Sort Select
    DOM.sortTransactionsSelect.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      renderTransactionFeed();
    });

    // Delegated Edit / Delete Actions on Transaction List
    DOM.transactionListContainer.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-tx-edit');
      const deleteBtn = e.target.closest('.btn-tx-delete');

      if (editBtn) {
        const id = editBtn.dataset.id;
        const tx = state.transactions.find(t => t.id === id);
        if (tx) openAddModal(true, tx);
      } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteTransaction(id);
      }
    });

    // Keyboard accessibility: Escape to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!DOM.transactionModal.classList.contains('hidden')) closeAddModal();
        if (!DOM.budgetModal.classList.contains('hidden')) closeBudgetModal();
      }
    });
  }

  // =========================================================================
  // Bootstrap Application
  // =========================================================================

  function init() {
    loadStateFromStorage();
    setupEventListeners();
    renderAll();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
