/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         multitwitch resize
// @namespace    http://tampermonkey.net/
// @version      2025-02-19
// @description  "Script to add a button to multitwitch.tv for resizing chat"
// @author       https://github.com/ironkrendel
// @match        https://www.multitwitch.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

var startPosX = -1;
var mousePosX;
var offset = 0;

var wrapper = document.getElementById('wrapper');
var chatbox = document.getElementById('chatbox');
var streams = document.getElementById('streams');

function handleMouseMove(event) {
    mousePosX = event.clientX;
}

function handleMouseDown(event) {
    startPosX = event.clientX;
}

function handleMouseUp(event) {
    if (startPosX == -1) return;
    offset = startPosX - mousePosX;
    chatbox.style.width = String(chatbox.getBoundingClientRect().width + offset) + "px";
    streams.style.width = String(streams.getBoundingClientRect().width - offset) + "px";
    resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

    for (var i = 0;i < streams.childElementCount;i++) {
        streams.children[i].style.width = String(streams.children[i].getBoundingClientRect().width - offset) + "px";
    }

    startPosX = -1;
}

function handleReset(event) {
    offset = 0;
    chatbox.style.width = String(chatbox.getBoundingClientRect().width + offset) + "px";
    streams.style.width = String(streams.getBoundingClientRect().width - offset) + "px";
    resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

    for (var i = 0;i < streams.childElementCount;i++) {
        streams.children[i].style.width = String(streams.children[i].getBoundingClientRect().width - offset) + "px";
    }
}

//document.addEventListener("mouseout", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

console.log("Multitwitch resize btn is active");

var resize_btn = document.createElement('button');
resize_btn.id = 'resize_btn';
resize_btn.setAttribute("style", "padding:0px;border:0px;width:10px;height:10px;background-color:red;position:absolute;right:0px;");
wrapper.append(resize_btn);
resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

resize_btn.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
window.addEventListener("resize", (event) => {
    console.log(offset);
    chatbox.style.width = String(chatbox.getBoundingClientRect().width + offset) + "px";
    streams.style.width = String(streams.getBoundingClientRect().width - offset) + "px";
    resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

    for (var i = 0;i < streams.childElementCount;i++) {
        streams.children[i].style.width = String(streams.children[i].getBoundingClientRect().width - offset) + "px";
    }
});