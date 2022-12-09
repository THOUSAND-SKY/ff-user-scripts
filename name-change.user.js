// ==UserScript==
// @name discord-name-changer
// @match *://discord.com/*
// @version          2
// ==/UserScript==


{
  // Need to eval the whole thing because otherwise "clipboardEvent" is restricted.
  const qs = "`#message-username-${targetPlayerNameId} > span:first-child`"
  window.eval(`
  const listener = (e) => {
    console.log({ e, target: e.target });
    const newEvent = new ClipboardEvent("paste", {
      composed: true,
      clipboardData: new DataTransfer(),
      bubbles: true,
    });
    const textPasted = e.clipboardData.getData("Text");
    const targetPlayerNameId = window.location.href.replace(/.*\\//g, "");
    const strToMatch = "valued player"
    if (!textPasted.includes(strToMatch)) {
    console.log("no matching 'valued player' phrase")
      return;
    }
    const playerName = document.querySelector(${qs})?.textContent
    if (!playerName) {
      console.warn("no player name for", targetPlayerNameId)
      return
    }
    const newText = textPasted.replace(strToMatch, playerName);
    if (newText === textPasted) {
    console.log('newtext equals old text', textPasted)
      return;
    }
    console.log("new text", newText);
    newEvent.clipboardData.setData("text/plain", newText);
    setTimeout(() => {
      console.log('exec selectAlL')
      document.execCommand("selectAll");
      console.log("exec success")
      setTimeout(() => {
        console.log("new event sent", newEvent.clipboardData.getData("Text"))
        document.dispatchEvent(newEvent);
      }, 150);
    }, 150);
  };
  function attach() {
    document.addEventListener("paste", listener)
  }
  attach()
  `)
}
