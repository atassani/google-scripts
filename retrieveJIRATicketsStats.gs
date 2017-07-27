function printError(error, explicit) {
  Logger.log(explicit ? 'EXPLICIT:' + error.name : 'INEXPLICIT:' + error.message);
}

function retrieveDataFromEazyBi(url) {
    var params =
      {
        "headers": {"Authorization": "Basic asdhfoidhasfoidhuodu"}
      }
      var response = UrlFetchApp.fetch(url, params);
      var json = response.getContentText();
      try {
        var data = JSON.parse(json);
      } catch (e) {
        if (e instanceof SyntaxError) {
          printError(e, true);
        } else {
          printError(e, false);
        }
      }
      return data;
    }

    // Main function
    function retrieveJIRATicketsStats() {
      var eazybiBaseURL = 'https://jira.odigeo.com/plugins/servlet/eazybi';
      var accountId = 80;
      var reportId = 3105;
      var format = 'json';
      var data = retrieveDataFromEazyBi(eazybiBaseURL + "/accounts/" + accountId + "/export/report/" + reportId + "." + format);
      var numItems = data.query_results.row_positions.length;
      var dataValues = [];
      for (var i=0; i<numItems; i++) {
        dataValues[i] = [];
        dataValues[i][0] = data.query_results.row_positions[i][0].caption;
        dataValues[i][1] = new Date(data.query_results.values[i][0]);
        dataValues[i][2] = data.query_results.values[i][1];
        dataValues[i][3] = data.query_results.values[i][2];
        dataValues[i][4] = new Date(data.query_results.values[i][3]);
        dataValues[i][5] = data.query_results.values[i][4];
        dataValues[i][6] = data.query_results.values[i][5];
      }
      var sheet = SpreadsheetApp.getActive().getSheetByName('Experiment');
      sheet.getRange('A2:G' + (numItems+1)).setValues(dataValues);
    }
