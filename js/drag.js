//init variables
T1P1 = "";
T1P2 = "";
T2P1 = "";
T2P2 = "";

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
       }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener


// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  //accept: '#gizn, #Nico',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active')
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget
    var dropzoneElement = event.target

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target')
    draggableElement.classList.add('can-drop')
    //draggableElement.textContent = 'Dragged in'
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target')
    event.relatedTarget.classList.remove('can-drop')
    event.relatedTarget.textContent = `${event.relatedTarget.id}`
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = `${event.relatedTarget.id}` + ' Dropped'
	  if (event.target.id == 't1p1-dropzone') {
	    T1P1 = event.relatedTarget.id;
	    //alert (T1P1 + ' was dropped to ' + event.target.id)
	  }
	  if (event.target.id == 't1p2-dropzone') {
	    T1P2 = event.relatedTarget.id;
	    //alert (T1P2 + ' was dropped to ' + event.target.id)
	  }
	  if (event.target.id == 't2p1-dropzone') {
            T2P1 = event.relatedTarget.id;
	    //alert (T2P1 + ' was dropped to ' + event.target.id)
	  }
	  if (event.target.id == 't2p2-dropzone') {
	    T2P2 = event.relatedTarget.id;
	    //alert (T2P2 + ' was dropped to ' + event.target.id)
	  }

  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active')
    event.target.classList.remove('drop-target')
  }
})

function insertDropped()
{
  var T1RES = $('input:text[id=Team1_Result]').val();
  var T2RES = $('input:text[id=Team2_Result]').val();
  if (T1P1 && T1P2 && T2P1 && T2P2 && T1RES && T2RES ) {
    var timestamp = Date.now();
    var insertStatement = "INSERT INTO matches (team1_player1, team1_player2, team2_player1, team2_player2, team1Result, team2Result, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.transaction(function (tx) { tx.executeSql(insertStatement, [T1P1, T1P2, T2P1, T2P2, T1RES, T2RES, timestamp], loadAndReset, onError); });
  } else {
    alert("missing Value to insert..!\n" + "T1P1: " + T1P1 + "\n T1P2: " + T1P2 + "\n T2P1: " + T2P1 + "\n T2P2: " + T2P2 + "\n T1RES: " + T1RES + "\n T2RES: " + T2RES)
  }
}

interact('.drag-drop')
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    listeners: { move: dragMoveListener }
  })

$(document).ready(function ()
  {
  ;
    $("#SubmitBtn").click(insertDropped);
  });

