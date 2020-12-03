// load data from jsom file
var myArray;
jQuery.getJSON('/rushing.json', function(data) {
  myArray = data;
  buildTable(myArray)
});


$('#search-input').on('keyup', function(){
  var value = $('#search-input').val()
  var data = search(value, myArray)
  buildTable(data)
})

function search(value, data){
  var filteredData = []

  for (var i=0; i < data.length; i++) {
    value = value.toLowerCase()
    var playerName = data[i].Player.toLowerCase()
    if (playerName.includes(value)) {
      filteredData.push(data[i])
    }
  }
  return filteredData
}

// sort columns by class name "sortCol" : Total Rushing Yards (Yds), Longest Rush (Lng), Total Rushing Touchdowns (TD)
$('th.sortCol').on('click', function(){
  var column = $(this).data('colname')
  var order = $(this).data('order')
  var text = $(this).html()
  text = text.substring(0, text.length - 1);
  
  if (order == 'desc'){
    myArray = myArray.sort((a, b) => a[column] > b[column] ? 1 : -1)
    $(this).data("order","asc");
    text += '&#9660'
  }
  else{
    myArray = myArray.sort((a, b) => a[column] < b[column] ? 1 : -1)
    $(this).data("order","desc");
    text += '&#9650'
  }

  $(this).html(text)
  buildTable(myArray)
})

function buildTable(data){
  var table = document.getElementById('myTable')
  table.innerHTML = ''
  for (var i = 0; i < data.length; i++){
    var row = `<tr>
      <td>${data[i]["Player"]}</td>
      <td>${data[i]["Team"]}</td>
      <td>${data[i]["Pos"]}</td>
      <td>${data[i]["Att"]}</td>
      <td>${data[i]["Att/G"]}</td>
      <td>${data[i]["Yds"]}</td>
      <td>${data[i]["Avg"]}</td>
      <td>${data[i]["Yds/G"]}</td>
      <td>${data[i]["TD"]}</td>
      <td>${data[i]["Lng"]}</td>
      <td>${data[i]["1st"]}</td>
      <td>${data[i]["1st%"]}</td>
      <td>${data[i]["20+"]}</td>
      <td>${data[i]["40+"]}</td>
      <td>${data[i]["FUM"]}</td>
    </tr>`
    table.innerHTML += row
  }
}

// export target #table_id into a csv
function download_table_as_csv(table_id) {
  // Select rows from table_id
  var rows = document.querySelectorAll('table#' + table_id + ' tr');
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    for (var j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText.replace(/(\r\n|\n|\r|▲|▼)/gm, '').replace(/(\s\s)/gm, ' ')
      // Escape double-quote with double-double-quote (source: https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(','));
  }
  var csv_string = csv.join('\n');
  // Download it
  var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}