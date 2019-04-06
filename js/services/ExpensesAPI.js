import TotoAPI from './TotoAPI';
import moment from 'moment';

/**
 * API to access the /expenses/ Toto API
 */
export default class ExpensesAPI {

  /**
   * Retrieves the month's expenses
   */
  getExpenses(yearMonth) {

    return new TotoAPI().fetch('/expenses/expenses?yearMonth=' + yearMonth + '&sortDate=true&sortDesc=true')
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
  getMonthTotalSpending(yearMonth) {

    return new TotoAPI().fetch('/expenses/expenses/' + yearMonth + '/total')
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each day between dateFrom and dateTo
   */
  getExpensesPerDay(dateFrom, dateTo) {

    let dateToFilter = dateTo == null ? '' : ('&dateTo=' + dateTo);

    return new TotoAPI().fetch('/expenses/stats/expensesPerDay?dateFrom=' + dateFrom + dateToFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each month after yearMonthGte
   */
  getExpensesPerMonth(yearMonthGte) {

    return new TotoAPI().fetch('/expenses/stats/expensesPerMonth?yearMonthGte=' + yearMonthGte)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending categories for the specified month
   */
  getTopSpendingCategoriesOfMonth(yearMonth, maxCategories) {

    let maxCatFilter = maxCategories ? '&maxCategories=' + maxCategories :'';

    return new TotoAPI().fetch('/expenses/stats/topCategoriesOfMonth?yearMonth=' + yearMonth + maxCatFilter)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending categories per month since yearMonthGte
   */
  getTopSpendingCategoriesPerMonth(yearMonthGte) {

    return new TotoAPI().fetch('/expenses/stats/topCategoriesPerMonth?yearMonthGte=' + yearMonthGte)
        .then((response) => response.json());

  }


}
