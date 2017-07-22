/*
 * Adds the menu items to Import KanSAs question from the Google Form into the
 * "Extracted" tab, and another one to Export the modified questions in the
 * "Proposed" tab to the Google Form.
 *
 * Conditional Formatting
 *   Apply to range: A2:A60,C2:E60
 *   Format cell if... "Custom formula is"
 *   =A2<>INDIRECT("Extracted!R" & row() & "C" & COLUMN(), FALSE)
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('KanSAs')
      .addItem('Import questions from Form', 'copyFromForm')
      .addItem('Export questions to Form', 'copyToForm')
      .addSeparator()
      .addToUi();
}

function copyFromForm() {
  var form = FormApp.openById('long_id_of_the_google_form_used_for_kansas');
  var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.setActiveSheet(ss.getSheetByName('Extracted'));
  var row = 2;
  for (var i=0; i<items.length; i++) {
    var item = items[i];
    var titleCell = sheet.getRange(row, 1);
    titleCell.setValue(item.getTitle());
    sheet.getRange(row, 2).setValue(item.getId());
    var choices = item.asMultipleChoiceItem().getChoices();
    var column = 3;
    for (var j=0; j<choices.length; j++) {
      //Logger.log(row, column, j, choices[j]);
      var choice = choices[j];
      var choiceCell = sheet.getRange(row, column);
      choiceCell.setValue(choice.getValue());
      column++;
    }
    row++;
  }
}

function copyToForm() {
  var ss = SpreadsheetApp.getActive();
  var sheetExtracted = ss.setActiveSheet(ss.getSheetByName('Extracted'));
  var sheetProposed = ss.setActiveSheet(ss.getSheetByName('Proposed'));
  var extractedData = sheetExtracted.getDataRange().getValues();
  var proposedData = sheetProposed.getDataRange().getValues();

  var form = FormApp.openById('long_id_of_the_google_form_used_for_kansas');

  for (var row=1; row < proposedData.length; row++) {
    var id = extractedData[row][1];
    var title = proposedData[row][0];
    var answer0 = proposedData[row][2];
    var answer1 = proposedData[row][3];
    var answer2 = proposedData[row][4];
    var item = form.getItemById(id).asMultipleChoiceItem();
    item.setTitle(title);
    if (answer2 != '') {
      item.setChoiceValues([answer0, answer1, answer2]);
    } else {
      item.setChoiceValues([answer0, answer1]);
    }
  }

  var items = form.getItems(FormApp.ItemType.SECTION_HEADER);
  for (var i=0; i < items.length; i++) {
    var text = items[i];
    if (text.asSectionHeaderItem().getTitle() == "Welcome to KanSAs!") {
      var helpText = text.asSectionHeaderItem().getHelpText();
      var today = new Date();
      helpText = helpText.replace(/(Modified on ).*$/m, "$1" + today.toLocaleDateString('en-uk') );
      text.asSectionHeaderItem().setHelpText(helpText);
    }
  }
}
