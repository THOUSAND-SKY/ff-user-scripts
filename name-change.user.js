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
    const playerName = document.querySelector(${qs})?.textContent
    if (!playerName) {
      console.warn("no player name for", targetPlayerNameId)
      return
    }
    const newText = textPasted.replace(strToMatch, playerName);
    console.log("new text", newText);
    newEvent.clipboardData.setData("text/plain", newText);
    setTimeout(() => {
      console.log('exec selectAlL')
      document.execCommand("selectAll");
      console.log("exec success")
      setTimeout(() => {
        console.log("new event sent", newEvent.clipboardData.getData("Text"))
        document.dispatchEvent(newEvent);
        setTimeout(attach, 200)
      }, 50);
    }, 50);
  };
  function attach() {
    document.addEventListener("paste", listener, { once: true })
  }
  attach()
  `)
}
