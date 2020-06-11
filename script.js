var baseURL = "http://192.168.0.213";
var refreshRate = 1000;
var pendingText = "..."
var actualTemperatureNozzle = pendingText;
var targetTemperatureNozzle = pendingText;
var actualTemperatureBed = pendingText;
var targetTemperatureBed = pendingText;
var estimatedPrintTime = pendingText;
var percentComplete = pendingText;
var printTimeElapsed = pendingText;
var printTimeLeft = pendingText;
var jobStateText = pendingText;

var interval = setInterval(refresh, refreshRate);

function refresh() {
  getPrinterInfo();
  logInfo();
  displayData();
}

function logInfo() {
  console.log(jobStateText);
  console.log(percentComplete);
  console.log(estimatedPrintTime);
  console.log(printTimeLeft);
  console.log(printTimeElapsed);
  console.log(actualTemperatureNozzle);
  console.log(targetTemperatureNozzle);
  console.log(actualTemperatureBed);
  console.log(targetTemperatureBed);
}

function displayData() {
  $(document).ready(function() {
    $('#jobStateText').text(jobStateText);
    $('#percentComplete').text(percentComplete != pendingText ? Math.round(percentComplete * 100) / 100 + '%' : pendingText);
    $('#estimatedPrintTime').text(estimatedPrintTime == pendingText ? pendingText : secondsToHms(estimatedPrintTime));
    $('#printTimeLeft').text(printTimeLeft == pendingText ? pendingText : secondsToHms(printTimeLeft));
    $('#printTimeElapsed').text(printTimeElapsed == pendingText ? pendingText : secondsToHms(printTimeElapsed));
    $("#actualTemperatureNozzle").text(actualTemperatureNozzle);
    $("#targetTemperatureNozzle").text(targetTemperatureNozzle);
    $("#actualTemperatureBed").text(actualTemperatureBed);
    $("#targetTemperatureBed").text(targetTemperatureBed);
  });
}

function getPrinterInfo() {
  let toolInfo = "/api/printer";
  let toolInfoRequest = getRequest(toolInfo);
  toolInfoRequest
  .then(printerData => setToolInfo(printerData))
  .catch(error => {
    clearInterval(interval);
    console.log(error);
  });
  
  let jobInfo = '/api/job';
  let jobInfoRequest = getRequest(jobInfo);
  jobInfoRequest
  .then(printerData => setJobInfo(printerData))
  .catch(error => {
    clearInterval(interval);
    console.log(error);
  });
}

function setToolInfo(printerData) {
  actualTemperatureNozzle = printerData.temperature.tool0.actual;
  targetTemperatureNozzle = printerData.temperature.tool0.target;
  actualTemperatureBed = printerData.temperature.bed.actual;
  targetTemperatureBed = printerData.temperature.bed.target;
  jobStateText = jobStateText == pendingText ? printerData.state.text : jobStateText;
}

function setJobInfo(printerData) {
  console.log(printerData);
  estimatedPrintTime = printerData.job.estimatedPrintTime;
  percentComplete = printerData.progress.completion;
  printTimeElapsed = printerData.progress.printTime;
  printTimeLeft = printerData.progress.printTimeLeft;
  jobStateText = printerData.state;
}

function getRequest(url) {
  return $.get({
    url: baseURL + url,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'BAEDF577501645078C15126E74809AA6',
    }
  });
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + ":" : "";
  var mDisplay = m > 0 ? m + ":" : "";
  var sDisplay = s > 0 ? s       : "";
  return hDisplay + mDisplay + sDisplay; 
}

