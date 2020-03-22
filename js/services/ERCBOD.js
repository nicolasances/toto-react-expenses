import TotoAPI from './TotoAPI';

/**
 * API to access the /erboh model Toto API
 */
export default class ERCBOD {

  /**
   * Predicts the category of the expense
   */
  predictCategory(description, user) {

    // Post the data
    return new TotoAPI().fetch('/model/ercbod/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user, 
        description: description, 
      })
    }).then((response => response.json()));

  }

}
