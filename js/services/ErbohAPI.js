import TotoAPI from './TotoAPI';
import moment from 'moment';
import user from 'TotoReactExpenses/js/User';

/**
 * API to access the /erboh model Toto API
 */
export default class ExpensesAPI {

  /**
   * Put generic app settings
   */
  predictMonthly(expense) {

    // Post the data
    return new TotoAPI().fetch('/model/erboh/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'no-id', 
        amount: expense.amount, 
        user: expense.user, 
        category: expense.category, 
        description: expense.description, 
        date: expense.date
      })
    }).then((response => response.json()));

  }

}
