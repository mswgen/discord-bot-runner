var presences = new Array();
var message_listeners = new Array();
document.querySelector('#login').onclick = login;
function login () {
    document.querySelector('#token').disabled = true;
    document.querySelector('#login').disabled = true;
    document.querySelector('#login').innerHTML = '로그인 중';
    client.login(document.querySelector('#token').value);
    client.on('ready', () => {
        document.querySelector('#login').innerHTML = '로그아웃';
        document.querySelector('#token').disabled = false;
        document.querySelector('#login').disabled = false;
        document.querySelector('#login').onclick = logout;
        document.querySelector('#presence_area').style.display = 'block';
    });
}
function logout () {
    client.destroy();
    document.querySelector('#login').onclick = login;
    document.querySelector('#login').innerHTML = '로그인';
    document.querySelector('#presence_area').style.display = 'none';
}
document.querySelector('#addPresence').onclick = () => {
    var stat = undefined;
    if (document.querySelector('#online').checked) {
        stat = 'online';
    } else if (document.querySelector('#idle').checked) {
        stat = 'idle';
    } else if (document.querySelector('#dnd').checked) {
        stat = 'dnd';
    } else if (document.querySelector('#invisible').checked) {
        stat = 'invisible';
    } else {
        return;
    }
    var gameType = undefined;
    var stream_url = undefined;
    if (document.querySelector('#playing').checked) {
        gameType = 'PLAYING';
    } else if (document.querySelector('#listening').checked) {
        gameType = 'LISTENING';
    } else if (document.querySelector('#watching').checked) {
        gameType = 'WATCHING';
    } else if (document.querySelector('#streaming').checked) {
        gameType = 'STREAMING';
        stream_url = document.querySelector('#stream_url').value;
    } else {
        return;
    }
    presences.push({
        status: stat,
        activity: {
            name: document.querySelector('#gameName').value,
            type: gameType,
            url: stream_url
        }
    });
    document.querySelector('#presences').innerHTML = '';
    for (var p of presences) {
        document.querySelector('#presences').innerHTML += `상태: ${p.status}, 게임 이름: ${p.activity.name}, 게임 타입: ${p.activity.type}, 스트리밍 URL: ${p.activity.url || '없음'}<br>`;
    }
    document.querySelector('#gameName').value = '';
    for (var e of document.querySelectorAll('.stat')) {
        e.checked = false;
    }
    for (var e of document.querySelectorAll('.gameType')) {
        e.checked = false;
    }
    document.querySelector('#stream_url').disabled = true;
    document.querySelector('#stream_url').value = '';
};
document.querySelector('#setPresence').onclick = () => {
    if (window.presence_change_interval) {
        client.clearInterval(window.presence_change_interval);
    }
    if (!presences[0]) {
        return;
    }
    window.presence_change_interval = client.setInterval(() => {
        client.user.setPresence(presences[Math.floor(Math.random() * presences.length)]);
    }, parseInt(document.querySelector('#interval').value) * 1000);
    console.log(parseInt(document.querySelector('#interval').value) * 1000);
}
document.querySelector('#streaming').onclick = () => {
    document.querySelector('#stream_url').disabled = false;
}
document.querySelector('#playing').onclick = () => {
    document.querySelector('#stream_url').disabled = true;
}
document.querySelector('#watching').onclick = () => {
    document.querySelector('#stream_url').disabled = true;
}
document.querySelector('#listening').onclick = () => {
    document.querySelector('#stream_url').disabled = true;
}
document.querySelector('#clearPresence').onclick = () => {
    presences = [];
    document.querySelector('#presences').innerHTML = '상메 없음';
}
document.querySelector('#submit_listener').onclick = () => {
    if (document.querySelector('#alias').value == '') return;
    if (document.querySelector('#func').value == '') return;
    message_listeners.push({
        alias: document.querySelector('#alias').value,
        func: document.querySelector('#func').value
    });
    document.querySelector('#alias').value = '';
    document.querySelector('#func').value = '';
    document.querySelector('#listeners').innerHTML = '';
    for (var l of message_listeners) {
        document.querySelector('#listeners').innerHTML += `<li>메세지 시작 내용: ${l.alias}<br>실행할 JavaScript 코드: ${l.func}<br><br></li>`;
    }
}
document.querySelector('#clearAllListeners').onclick = () => {
    message_listeners = [];
    document.querySelector('#listeners').innerHTML = '';
}
var x = setInterval(() => {
    if (window.client) {
        clearInterval(x);
        delete x;
        client.on('message', message => {
            var args = message.content.split(' ');
            for (var l of message_listeners) {
                if (message.content.toLowerCase().startsWith(l.alias.toLowerCase())) {
                    eval(l.func);
                }
            }
        });
    }
}, 3000);
document.querySelector('#open_close').onclick = () => {
    if (document.querySelector('#open_close').innerHTML == '목록 보기') {
        document.querySelector('#open_close').innerHTML = '목록 접기';
        document.querySelector('#listeners').style.display = 'block';
    } else {
        document.querySelector('#open_close').innerHTML = '목록 보기';
        document.querySelector('#listeners').style.display = 'none';
    }
}