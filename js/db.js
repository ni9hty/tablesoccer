//  Declare SQL Query for SQLite
 
var createStatement = "CREATE TABLE IF NOT EXISTS matches (id INTEGER PRIMARY KEY AUTOINCREMENT, team1_player1 TEXT, team1_player2 TEXT, team2_player1 TEXT, team2_player2, team1Result INTEGER, team2result INTEGER, timeStamp TEXT)";

var selectAllStatement = "SELECT * FROM matches";

var insertStatement = "INSERT INTO matches (team1_player1, team1_player2, team2_player1, team2_player2, team1Result, team2Result, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)";
 
var updateStatement = "UPDATE matches SET team1_player1 = ?, team1_player2 = ?, team2_player1 = ?, team2_player2 = ?, team1Result = ?, team2Result = ?, timestamp = ? WHERE id=?";
 
var deleteStatement = "DELETE FROM matches WHERE id=?";
 
var dropStatement = "DROP TABLE matches";
 
 var db = openDatabase("matches", "1.0", "Tablesoccer Matches", 200000);  // Open SQLite Database
 
var dataset;
 
var DataType;
 
 function initDatabase()  // Function Call When Page is ready.
{
  try {
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
        {
          alert('Databases are not supported in this browser.');
        }
        else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    }
    catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
        return;
    }
}
 
function createTable()
{
    db.transaction(function (tx) { tx.executeSql(createStatement, [], showRecords, onError); });
}
 
function insertRecord()
{
        var t1p1 = $('input:text[id=Team1Player1]').val();
        var t1p2 = $('input:text[id=Team1Player2]').val();
        var t2p1 = $('input:text[id=Team2Player1]').val();
        var t2p2 = $('input:text[id=Team2Player2]').val();
        var t1res = $('input:text[id=Team1Result]').val();
        var t2res = $('input:text[id=Team2Result]').val();
	var timestamp = Date.now();
        db.transaction(function (tx) { tx.executeSql(insertStatement, [t1p1, t1p2, t2p1, t2p2, t1res, t2res, timestamp], loadAndReset, onError); });
        //tx.executeSql(SQL Query Statement,[ Parameters ] , Sucess Result Handler Function, Error Result Handler Function );
}
 
function deleteRecord(id) 
{
    var iddelete = id.toString();
    db.transaction(function (tx) { tx.executeSql(deleteStatement, [id], showRecords, onError); alert("Delete Sucessfully"); });
    resetForm();
}
 
function updateRecord() 
{
    var t1p1update = $('input:text[id=Team1Player1]').val().toString();
    var t1p2update = $('input:text[id=Team1Player2]').val().toString();
    var t2p1update = $('input:text[id=Team2Player1]').val().toString();
    var t2p2update = $('input:text[id=Team2Player2]').val().toString();
    var t1resupdate = $('input:text[id=Team1Result]').val().toString();
    var t2resupdate = $('input:text[id=Team2Result]').val().toString();
    var timestampup = Date.now();
    var useridupdate = $("#id").val();
 
    db.transaction(function (tx) { tx.executeSql(updateStatement, [t1p1update, t1p2update, t2p1update, t2p2update, t1resupdate, t2resupdate, timestampup, Number(useridupdate)], loadAndReset, onError); });
}
 
function dropTable()
{
    db.transaction(function (tx) { tx.executeSql(dropStatement, [], showRecords, onError); });
    resetForm();
    initDatabase();
}
 
function loadRecord(i) // display records which are retrived from database.
{
    var item = dataset.item(i);
    $("#Team1Player1").val((item['team1_player1']).toString());
    $("#Team1Player2").val((item['team1_player2']).toString());
    $("#Team2Player1").val((item['team2_player1']).toString());
    $("#Team2Player2").val((item['team2_player2']).toString());
    $("#Team1Result").val((item['team1Result']).toString());
    $("#Team2Result").val((item['team2Result']).toString());
    $("#id").val((item['id']).toString());
}
 
function resetForm() // Function for reset form input values.
{
    $("#Team1Player1").val("");
    $("#Team1Player2").val("");
    $("#Team2Player1").val("");
    $("#Team2Player2").val("");
    $("#Team1Result").val("");
    $("#Team2Result").val("");
    $("#id").val("");
}
 
function loadAndReset() 
{
    resetForm();
    showRecords()
}
 
function onError(tx, error) 
{
    alert(error.message);
}
 
function showRecords() // Function For Retrive data from Database Display records as list
{
    $("#results").html('')
    db.transaction(function (tx) {
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = dataset.length - 1, item = null; i >= 0; i--) {
                item = dataset.item(i);
		var unixtime = item['timestamp']
		var newDate = new Date();
		newDate.setTime(unixtime);
		var timestring = newDate.toLocaleString('de-DE', { hour12:false})
                var linkeditdelete = '<li>' + item['team1_player1'] + ' , ' + item['team1_player2'] + ' , ' + item['team2_player1'] + ' , ' + item['team2_player2'] + ' , ' + item['team1Result'] + ', ' + item['team2Result'] + ' - ' + timestring + ' ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
 
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").append(linkeditdelete);
            }
        });
    });
}
 
$(document).ready(function () // Call function when page is ready for load..
{
;
 
    $("body").fadeIn(2000); // Fade In Effect when Page Load..
 
    initDatabase();
 
    $("#submitButton").click(insertRecord);  // Register Event Listener when button click.
 
    $("#btnUpdate").click(updateRecord);
 
    $("#btnReset").click(resetForm);
 
    $("#btnDrop").click(dropTable);
});
