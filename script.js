var baseURL = "http://10.0.0.50:5000";
var refreshRate = 1000;
var pendingText = "NaN"
var actualTemperatureNozzle = pendingText;
var targetTemperatureNozzle = pendingText;
var actualTemperatureBed = pendingText;
var targetTemperatureBed = pendingText;
var estimatedPrintTime = pendingText;
var percentComplete = pendingText;
var printTimeElapsed = pendingText;
var jobStateText = pendingText;
var currentLayer = '0';
var totalLayers = '0';

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
  console.log(printTimeElapsed);
  console.log(actualTemperatureNozzle);
  console.log(targetTemperatureNozzle);
  console.log(actualTemperatureBed);
  console.log(targetTemperatureBed);
  console.log(currentLayer);
  console.log(totalLayers);
}

function displayData() {
  $(document).ready(function () {
    $('#jobStateText').text(jobStateText);
    $('#percentComplete').text(percentComplete != pendingText ? Math.round(percentComplete * 100) / 100 + '%' : pendingText);
    $('#estimatedPrintTime').text(estimatedPrintTime == pendingText ? pendingText : secondsToHms(estimatedPrintTime));
    $('#printTimeElapsed').text(printTimeElapsed == pendingText ? pendingText : secondsToHms(printTimeElapsed));
    $('#layer').text(currentLayer + '/' + totalLayers);
    $("#temperatureBed").text((Math.round(actualTemperatureBed * 100) / 100).toFixed(2) + ' | ' + (Math.round(targetTemperatureBed * 100) / 100).toFixed(2));
    $("#temperatureNozzle").text((Math.round(actualTemperatureNozzle * 100) / 100).toFixed(2) + ' | ' + (Math.round(targetTemperatureNozzle * 100) / 100).toFixed(2));
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
  estimatedPrintTime = printerData.job.estimatedPrintTime;
  percentComplete = printerData.progress.completion;
  printTimeElapsed = printerData.progress.printTime;
  jobStateText = printerData.state;
}

function setLayerInfo(printerData) {
  var layer = printerData.layer.current;
  currentLayer = layer;
  totalLayers = printerData.layer.total;
}

function getRequest(url) {
  return $.get({
    url: baseURL + url,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': '64C2BD12AD804694A98594A7231FEE4E',
    }
  });
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + ":" : "00:";
  var mDisplay = m > 0 ? m + ":" : "00:";
  var sDisplay = s > 0 ? s + "" : "00";

  hDisplay = hDisplay.length == 2 ? '0' + hDisplay : hDisplay;
  mDisplay = mDisplay.length == 2 ? '0' + mDisplay : mDisplay;
  sDisplay = sDisplay.length == 1 ? '0' + sDisplay : sDisplay;

  return hDisplay + mDisplay + sDisplay;
}
