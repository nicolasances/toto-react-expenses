import TotoAPI from './TotoAPI';
import moment from 'moment';
import user from 'TotoReactExpenses/js/User';

/**
 * API to access the /expenses/ Toto API
 */
export default class ExpensesAPI {

  /**
   * Get generic app settings
   * from the /app/expenses microservice
   */
  getAppSettings(userEmail) {

    return new TotoAPI().fetch('/app/expenses/settings?user=' + userEmail)
        .then((response) => response.json());

  }

  /**
   * Put generic app settings
   */
  putAppSettings(settings) {

    // Post the data
    return new TotoAPI().fetch('/app/expenses/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    }).then((response => response.json()));


  }

  /**
   * Retrieves the month's expenses
   */
  getExpenses(userEmail, yearMonth) {

    return new TotoAPI().fetch('/expenses/expenses?yearMonth=' + yearMonth + '&sortDate=true&sortDesc=true&user=' + userEmail)
        .then((response) => response.json());

  }

  /**
   * Posts an expense
   */
  postExpense(ex) {

    // Post the data
    return new TotoAPI().fetch('/expenses/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ex)
    }).then((response => response.json()));

  }

  /**
   * Deletes an expense
   */
  deleteExpense(exId) {

    // Post the data
    return new TotoAPI().fetch('/expenses/expenses/' + exId, {method: 'DELETE'}).then((response => response.json()));

  }

  /**
   * Updates an expense
   */
  putExpense(exId, ex) {

    // Post the data
    return new TotoAPI().fetch('/expenses/expenses/' + exId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ex)
    }).then((response => response.json()));

  }

  /**
   * Marks an expense as conolidated
   */
  consolidateExpense(exId) {

    // Post the data
    return new TotoAPI().fetch('/expenses/expenses/' + exId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({consolidated: true})
    }).then((response => response.json()));

  }

  /**
   * Retrieves the month total spending
   * - yearMonth : the ym to consider
   */
  getMonthTotalSpending(userEmail, yearMonth, targetCurrency) {

    let query = '';
    if (targetCurrency) query = '&targetCurrency=' + targetCurrency;

    return new TotoAPI().fetch('/expenses/expenses/' + yearMonth + '/total?user=' + userEmail + query)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each day between dateFrom and dateTo
   */
  getExpensesPerDay(userEmail, dateFrom, dateTo, targetCurrency) {

    let dateToFilter = dateTo == null ? '' : ('&dateTo=' + dateTo);
    let currencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : '';

    return new TotoAPI().fetch('/expenses/stats/expensesPerDay?user=' + userEmail + '&dateFrom=' + dateFrom + dateToFilter + currencyFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each month after yearMonthGte
   */
  getExpensesPerMonth(userEmail, yearMonthGte, targetCurrency) {

    let targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetch('/expenses/stats/expensesPerMonth?user=' + userEmail + '&yearMonthGte=' + yearMonthGte + targetCurrencyFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each year
   */
  getExpensesPerYear(userEmail, targetCurrency) {

    let targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetch('/expenses/stats/expensesPerYear?user=' + userEmail + targetCurrencyFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending categories for the specified month
   */
  getTopSpendingCategoriesOfMonth(userEmail, yearMonth, maxCategories, targetCurrency) {

    let maxCatFilter = maxCategories ? '&maxCategories=' + maxCategories :'';
    let targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetch('/expenses/stats/topCategoriesOfMonth?user=' + userEmail + '&yearMonth=' + yearMonth + maxCatFilter + targetCurrencyFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending categories per month since yearMonthGte
   */
  getTopSpendingCategoriesPerMonth(userEmail, yearMonthGte, targetCurrency) {

    let targetCurrencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : ''

    return new TotoAPI().fetch('/expenses/stats/topCategoriesPerMonth?user=' + userEmail + '&yearMonthGte=' + yearMonthGte + targetCurrencyFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the settings
   */
  getSettings(userEmail) {

    return new TotoAPI().fetch('/expenses/settings?user=' + userEmail)
        .then((response) => response.json());

  }

  /**
   * Updates the settings
   */
  putSettings(settings) {

    // Post the data
    return new TotoAPI().fetch('/expenses/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    }).then((response => response.json()));

  }


}
