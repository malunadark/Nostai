$(function() {
  var pageTurnSound = document.getElementById('page-turn-sound');

  $('#book').turn({
    width: 900,
    height: 600,
    autoCenter: true,
    gradients: true,
    duration: 800
  }).bind('turning', function(event, page, view) {
    if (pageTurnSound) {
      pageTurnSound.currentTime = 0;
      pageTurnSound.play();
    }
  });
});
