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

  Logger.log(data.report_name);
  Logger.log(data.query_results.row_positions.length);
  Logger.log(data.query_results.values.length);
  Logger.log(data.query_results.row_positions[0].caption);
  Logger.log(data.query_results.values[0][0]);
  Logger.log(data.query_results.values[0][1]);

}
