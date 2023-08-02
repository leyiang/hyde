// establish whether the controls are hidden or not
var controlsHidden = false;

console.log(666);
chrome.commands.onCommand.addListener(function(command) {
  // if the user invokes the "hide" command...
  if (command === "hide") {
    // get information about the current tab...
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const url = new URL(tabs[0].url);

      chrome.storage.sync.get(["hydeRules"], items => {

        // console.log( items.hydeRules, url.hostname );

        // if the user is watching a YouTube video...
        if ( url.hostname in items.hydeRules ) {
          // console.log("IN!!!!");

          // and if the controls are not already hidden...
          if (controlsHidden === false) {
            // run the 'hide.js' script.
            chrome.tabs.executeScript({
              file: 'src/hide.js'
            });

            // change controls to hidden
            controlsHidden = true;
          }

          // if the controls are already hidden...
          else {
            // run the 'show.js' script.
            chrome.tabs.executeScript({
              file: 'src/show.js'
            });

            // change controls to not hidden
            controlsHidden = false;
          }
        }
      });

      // and establish whether or not they are on YouTube.
      // var onYT = tabUrl.includes("youtube.com/watch?");

    });
  }
});