// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  window.Discord = require('discord.js');
  window.client = new Discord.Client();
  document.querySelector('#presence_area').style.display = 'none';
  document.querySelector('#listeners').style.display = 'none';
});
