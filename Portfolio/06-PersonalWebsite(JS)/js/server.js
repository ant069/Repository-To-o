document.getElementById('scheduleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  var date = document.getElementById('date').value;
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var activity = document.getElementById('activity').value;
  var place = document.getElementById('place').value;
  var type = document.getElementById('type').value;
  var notes = document.getElementById('notes').value;
  var flag = document.getElementById('flag').value;
  var status = document.getElementById('status').checked;
  
  var tbody = document.getElementById('scheduleBody');
  var newRow = tbody.insertRow();
  
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);
  var cell6 = newRow.insertCell(5);
  var cell7 = newRow.insertCell(6);
  var cell8 = newRow.insertCell(7);
  var cell9 = newRow.insertCell(8);
  
  cell1.textContent = date;
  cell2.textContent = start;
  cell3.textContent = end;
  cell4.textContent = activity;
  cell5.textContent = place;
  cell6.textContent = type;
  cell7.textContent = notes;
  
  var flagDiv = document.createElement('div');
  flagDiv.style.width = '20px';
  flagDiv.style.height = '20px';
  flagDiv.style.background = flag;
  flagDiv.style.borderRadius = '3px';
  flagDiv.style.margin = '0 auto';
  cell8.appendChild(flagDiv);
  
  var statusSpan = document.createElement('span');
  if (status) {
    statusSpan.className = 'busy';
    statusSpan.textContent = 'Busy';
  } else {
    statusSpan.className = 'free';
    statusSpan.textContent = 'Free';
  }
  cell9.appendChild(statusSpan);
  
  document.getElementById('scheduleForm').reset();
  
  alert('Activity added to schedule successfully!');
});
