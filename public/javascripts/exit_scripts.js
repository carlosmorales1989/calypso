window.onbeforeunload = function () {
  /*var message = 'Dont leave!!!';
  if (typeof event == 'undefined') {
    event = window.event;
  }
  console.log(":o");
  alert();
  if (event) {
    event.returnValue = message;
  }
  return message;*/
  return ":(";
}
window.onload = function(){
  window.open('www.google.com','_blank');
}
