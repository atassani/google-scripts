function assigneeFromJira(jiraId) {
  var url = 'https://jira.odigeo.com/rest/api/latest/issue/'+jiraId;
  var params =
      {
        // username:password in Base64
        "headers": {"Authorization": "Basic ASDFADSFDASFDS"}
      }
  var response = UrlFetchApp.fetch(url, params);
  var json = response.getContentText();
  var data = JSON.parse(json);

  var corporateITBcn = [
    "name.surname1",
    "name.surname2"
    ];
  Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
  };
  // From comments we extract the last person in BCN the team who wrote a comment.
  // If no-one from BCN team, then last person who is not the author neither 'corporate.jira'
  // If there's no-one with that characteristic, then the last person who wrote a comment.
  var comments = data.fields.comment.comments;
  var commentsFromCorporateIt = comments.filter(function (elem) { return corporateITBcn.contains(elem.author.name) } );
  var commentsToExtract;
  if (commentsFromCorporateIt.length > 0)
    commentsToExtract = commentsFromCorporateIt;
  else {
    var commentsNotFromReporter = comments.filter(function (elem) { return elem.author.name != 'corporate.jira' && elem.author.name != data.fields.reporter.name});
    if (commentsNotFromReporter.length > 0)
      commentsToExtract = commentsNotFromReporter;
    else
      commentsToExtract = comments;
  }
  assignee = commentsToExtract.reverse()[0].author.name;

  var customFieldAssignee = data.fields.customfield_20300;

  return {
    assignee: assignee,
    customFieldAssignee: customFieldAssignee,
    summary: data.fields.summary
  };
}

function fillJiraInformation() {
  //var start = new Date();
  var sheet = SpreadsheetApp.getActiveSheet();
  var jiraIds = sheet.getRange('H1:H' + sheet.getLastRow()).getValues();
  var assignees= sheet.getRange('K1:K' + sheet.getLastRow()).getValues();
  for (var i=1; i < jiraIds.length; i++) {
    if (assignees[i] == '') {
      var assigneeFromJiraResult = assigneeFromJira(jiraIds[i]);
      sheet.getRange('K' + (i+1)).setValue( assigneeFromJiraResult.customFieldAssignee );
      sheet.getRange('L' + (i+1)).setValue( assigneeFromJiraResult.assignee );
      sheet.getRange('M' + (i+1)).setValue( assigneeFromJiraResult.summary );
    }
  }
  //var diff = new Date().getTime() - start.getTime();
  //Logger.log(Utilities.formatDate(new Date(diff), "GMT", "HH:mm:ss"));
}
