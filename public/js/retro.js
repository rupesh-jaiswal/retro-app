const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
// const $messageInput = $messageForm.querySelector("#message-input");
// const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
//Category Items parent wrapper
const $wentWellItems = document.querySelector("#went-well-items");
const $toImproveItems = document.querySelector("#to-improve-items");
const $actionItemsItems = document.querySelector("#action-items-items");
// Add item input
const $wentWellAddItem = document.querySelector("#went-well-add-item");
const $toImproveAddItem = document.querySelector("#to-improve-add-item");
const $actionItemsAddItem = document.querySelector("#action-items-add-item");

// Add Item button
const $wentWellAddButton = document.querySelector("#went-well-add-button");
const $toImproveAddButton = document.querySelector("#to-improve-add-button");
const $actionItemsAddButton = document.querySelector("#action-items-add-button");

//Add Button for Each Item
const $wentWellAddItemButton = document.querySelector("#went-well-item-add-button");
const $toImproveAddItemButton = document.querySelector("#to-improve-item-add-button");
const $actionItemsAddItemButton = document.querySelector("#action-items-item-add-button");

//Cancel buttons
const $wentWellCancelItemButton = document.querySelector("#went-well-item-cancel-button");
const $toImproveCancelItemButton = document.querySelector("#to-improve-item-cancel-button");
const $actionItemsCancelItemButton = document.querySelector("#action-items-item-cancel-button");


const $wentWellAddItemText = document.querySelector("#went-well-add-item-text");
const $toImproveAddItemText = document.querySelector("#to-improve-add-item-text");
const $actionItemsAddItemText = document.querySelector("#action-items-add-item-text");
//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
// const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
//options

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});
//functions 

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/'
    }
});
function sendItem ($messageElement, category) {
    const message = $messageElement.value;
    if(message==='') {
        return;
    }
    const acknowledgeFunction = () => {
        $messageElement.value='';
    }
    socket.emit('send-retro-item', {
        category,
        message: message.trim(),
    },acknowledgeFunction);
}
$wentWellCancelItemButton.addEventListener('click', (e) => {
    $wentWellAddItem.setAttribute('style', 'display: none');
});

$toImproveCancelItemButton.addEventListener('click', (e) => {
    $toImproveAddItem.setAttribute('style', 'display: none');
});

$actionItemsCancelItemButton.addEventListener('click', (e) => {
    $actionItemsAddItem.setAttribute('style', 'display: none');
});


$wentWellAddItemButton.addEventListener('click', (e) => {
    sendItem($wentWellAddItemText, 'went-well');
});

$toImproveAddItemButton.addEventListener('click', (e) => {
    sendItem($toImproveAddItemText, 'to-improve');
});

$actionItemsAddItemButton.addEventListener('click', (e) => {
    sendItem($actionItemsAddItemText, 'action-items');
});


$wentWellAddButton.addEventListener('click', (e) => {
    $wentWellAddItem.setAttribute('style', 'display: flex');
    $wentWellAddItemText.focus();
});

$toImproveAddButton.addEventListener('click', (e) => {
    $toImproveAddItem.setAttribute('style', 'display: flex');
    $toImproveAddItemText.focus();
});

$actionItemsAddButton.addEventListener('click', (e) => {
    $actionItemsAddItem.setAttribute('style', 'display: flex');
    $actionItemsAddItemText.focus();
});

socket.on('user added', () => {
    console.log('users is added');
});

socket.on('message', (message) => {
    console.log(message);
    //const html = Mustache.render(messageTemplate, { message });
    //$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('new user', () => {
    console.log('new user joined');
})

socket.on('user left', () => {
    console.log('a user left');
});
function updateCategory (category, message) {
    const html = Mustache.render(messageTemplate, { message });
    category.insertAdjacentHTML('beforeend', html);
}

socket.on('retro-item', (data) => {
    const { category, message } = data;

    switch(category) {
        case "went-well": 
            updateCategory($wentWellItems, message);
            break;
        case "to-improve":
            updateCategory($toImproveItems, message);
            break;
        case "action-items":
            updateCategory($actionItemsItems, message);
            break;
    }
});
function updateAllCategory(category, domhandler) {
    category.forEach((message) => {
        updateCategory(domhandler, message);
    });
}
socket.on('retro-items', (data) => {
    const { wentWell, toImprove, actionItems } = data;

    updateAllCategory(data["went-well"], $wentWellItems);
    updateAllCategory(data["to-improve"], $toImproveItems);
    updateAllCategory(data["action-items"], $actionItemsItems);

});

// socket.on('room-data', ({room, users}) => {
//     const html = Mustache.render(sidebarTemplate, {
//         room, users
//     });
//     document.querySelector('#sidebar').innerHTML = html;
// });