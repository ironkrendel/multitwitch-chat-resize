/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         multitwitch resize
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  A simple script to add a button for resizing chat on multitwitch.tv.
// @author       https://github.com/ironkrendel
// @match        https://www.multitwitch.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527475/multitwitch%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/527475/multitwitch%20resize.meta.js
// ==/UserScript==

var startPosX = -1;
var mousePosX;
var offset = 0;
var original_chat_width;
var original_chat_height;
var original_stream_height;
var original_stream_width;

var wrapper = document.getElementById('wrapper');
var chatbox = document.getElementById('chatbox');
var streams = document.getElementById('streams');

function resizeChat(_offset) {
    chatbox.style.width = String(original_chat_width + _offset) + "px";
    chatbox.style.height = String(original_chat_height) + "px";
    resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

    var height = $(window).innerHeight() - 16;
    var width = $("#streams").width();
    if(!chat_hidden) {
        var chat_width = original_chat_width + _offset;
        var wrapper_width = document.getElementById('wrapper').getBoundingClientRect().width;
        width = wrapper_width - chat_width - 5;
        streams.style.width = String(width) + "px";
    } else {
        var wrapper_width = document.getElementById('wrapper').style.width;
        width = wrapper_width;
        streams.style.width = String(width) + "px";
    }

    var best_height = 0;
    var best_width = 0;
    var n = streams.childElementCount;
    for (var per_row = 1; per_row <= n; per_row++) {
        var num_rows = Math.ceil(n / per_row);
        var max_width = Math.floor(width / per_row) - 4;
        var max_height = Math.floor(height / num_rows) - 4;
        if (max_width * 9/16 < max_height) {
            max_height = max_width * 9/16;
        } else {
            max_width = (max_height) * 16/9;
        }
        if (max_width > best_width) {
            best_width = max_width;
            best_height = max_height;
        }
    }

    for (var i = 0;i < streams.childElementCount;i++) {
        streams.children[i].style.height = String(Math.floor(best_height)) + "px";
        streams.children[i].style.width = String(Math.floor(best_width)) + "px";
    }
}

function handleMouseMove(event) {
    mousePosX = event.clientX;
    if (startPosX == -1) return;
    var _offset = offset + (startPosX - mousePosX);
    resizeChat(_offset);
}

function handleMouseDown(event) {
    startPosX = event.clientX;
}

function handleMouseUp(event) {
    if (startPosX == -1) return;
    offset += startPosX - mousePosX;
    resizeChat(offset);

    startPosX = -1;
}

function handleReset(event) {
    offset = 0;
    resizeChat(offset);
}

// document.addEventListener("mouseout", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

if (streams.childElementCount > 0) {
    original_stream_height = streams.children[0].getBoundingClientRect().height;
    original_stream_width = streams.children[0].getBoundingClientRect().width;
}

original_chat_width = chatbox.getBoundingClientRect().width;
original_chat_height = chatbox.getBoundingClientRect().height;

console.log("Multitwitch resize btn is active");

var resize_btn = document.createElement('button');
resize_btn.id = 'resize_btn';
resize_btn.setAttribute("style", "padding:0px;border:0px;width:10px;height:10px;background-color:red;position:absolute;right:0px;");
wrapper.append(resize_btn);
resize_btn.style.right = String(chatbox.getBoundingClientRect().width + resize_btn.getBoundingClientRect().width + 3) + "px";

for (var i = 0;i < streams.childElementCount;i++) {
    streams.children[i].addEventListener("mouseover", handleMouseUp);
}

resize_btn.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
window.addEventListener("resize", (event) => {
    resizeChat(offset);
});