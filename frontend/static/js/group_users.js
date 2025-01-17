$(document).ready(function() {
    // CSRFトークンを取得
    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    // グループ情報を取得する関数
    function fetchGroupInfo() {
        $.ajax({
            url: '/api/group/', // グループ情報APIのURL
            type: 'GET',
            headers: {
                'accept': 'application/json',
                'X-CSRFTOKEN': getCSRFToken(),
            },
            success: function(data) {
                // グループ情報を表示
                displayGroupInfo(data);
            },
            error: function(error) {
                console.log('Error:', error);
                alert('グループ情報の取得に失敗しました。');
            }
        });
    }

    // グループ情報を表示する関数
    function displayGroupInfo(group) {
        const groupInfoContainer = $('#group-info');
        groupInfoContainer.empty(); // 既存のグループ情報をクリア

        const groupInfo = `
            <p><strong>グループ名:</strong> ${group.name}</p>
            <p><strong>グループID:</strong> ${group.id}</p>
            <p><strong>説明:</strong> ${group.description || 'なし'}</p>
        `;
        groupInfoContainer.append(groupInfo);
    }

    // ユーザー情報を取得する関数
    function fetchUsers() {
        $.ajax({
            url: '/api/group/users/', // ユーザー情報APIのURL
            type: 'GET',
            headers: {
                'accept': 'application/json',
                'X-CSRFTOKEN': getCSRFToken(),
            },
            success: function(data) {
                // ユーザー情報を表示
                displayUsers(data);
            },
            error: function(error) {
                console.log('Error:', error);
                alert('ユーザー情報の取得に失敗しました。');
            }
        });
    }

    // ユーザー情報を表示する関数
    function displayUsers(users) {
        const userListContainer = $('#user-list');
        userListContainer.empty(); // 既存のユーザーリストをクリア

        if (users.length === 0) {
            userListContainer.append('<p>このグループには参加者がいません。</p>');
        } else {
            users.forEach(function(user) {
                const userCard = `
                    <div class="user-card" data-user-id="${user.user.id}">
                        <div class="user-info">
                            <p><strong>ユーザー名:</strong> ${user.user.username}</p>
                            <p><strong>メール:</strong> ${user.user.email}</p>
                        </div>
                        <div class="avatar">
                            <img src="${user.user.avatar || '/static/images/default-avatar.png'}" alt="アバター">
                        </div>
                    </div>
                `;
                userListContainer.append(userCard);
            });

            // ユーザーカードがクリックされた時の処理
            $('.user-card').click(function() {
                const userId = $(this).data('user-id');
                window.location.href = `/user/${userId}/`; // ユーザー詳細ページへ遷移
            });
        }
    }

    // ページ読み込み時にグループ情報とユーザー情報を取得
    fetchGroupInfo();
    fetchUsers();
});
