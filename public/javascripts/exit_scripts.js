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
  window.moveTo(0, 0);
  if (document.all) {
     top.window.resizeTo(screen.availWidth, screen.availHeight);
  }

  else if (document.layers || document.getElementById) {
     if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
         top.window.outerHeight = screen.availHeight;
         top.window.outerWidth = screen.availWidth;
     }
  }
  window.open('','_blank');
}
