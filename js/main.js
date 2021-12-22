let current_chat_id;
let chat_ids = [];

const BOT_TOKEN = prompt("Enter bot token", "");

function retrieve_messages() {
    $.getJSON(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`, function (data) {
        $("#temp-container").html("");
        data.result.forEach(e => {
            let chat_name = "";
            let last_name = e.message.from.last_name ? e.message.from.last_name : ""
            let first_name = e.message.from.first_name ? e.message.from.first_name : ""
            if (first_name && last_name) first_name += " ";
            let user_name = `${first_name}${last_name}`
            if (e.message.chat.type.endsWith("group"))
                chat_name = `${e.message.chat.title}`
            if (!chat_ids.includes(e.message.chat.id)) {
                chat_ids.push(e.message.chat.id);
                $('#chat-select').append($('<option>', {
                    value: e.message.chat.id,
                    text: chat_name ? chat_name : user_name
                }));
            }
            $("#temp-container").append(`<p class="text-message">${chat_name ? `[${chat_name}] ` : ""} ${user_name}: ${e.message.text}</p>`);
        });
        $("#main-container").html($("#temp-container").html())
        let objDiv = document.getElementById("main-container");
        objDiv.scrollTop = objDiv.scrollHeight;
    });
}


$(document).on('change', '#chat-select', function () {
    current_chat_id = $("#chat-select option:selected").val();
    $("#message-input").attr("placeholder", `Send a message to ${$("#chat-select option:selected").text()}`);
    $("#temp-chat-option").remove();
});


$(document).ready(function () {
    let interval_id = window.setInterval(function () {
        retrieve_messages();
    }, 1000);
    $("#message-form").submit(function (event) {
        event.preventDefault();
        if (!current_chat_id) {
            alert("Select a chat")
            return;
        }
        let message = $("#message-input").val();
        $.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${current_chat_id}&text=${encodeURIComponent(message)}`);
        $("#sent-container").append(`<p class="text-message">To ${$("#chat-select option:selected").text()}: ${message}</p>`);
        let objDiv = document.getElementById("sent-container");
        objDiv.scrollTop = objDiv.scrollHeight;
        $("#message-input").val("");
    });


    $(document).on("keydown", function (e) {
        if (!$("#message-input").is(":focus"))
            if (e.which != 9 && e.which != 13)
                $("#message-input").focus();
        if (e.which == 27)
            $("#message-input").val("");
    });
});

