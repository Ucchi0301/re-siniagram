$(document).ready(function() {
    // CSRFトークンを取得
    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    // ユーザーIDをURLから取得
    const userId = window.location.pathname.split('/')[2]; // user/{uuid}/ からuuidを取得

    // ユーザー情報を取得して表示
    $.ajax({
        url: `/api/user/${userId}/`, // APIエンドポイントにGETリクエストを送信
        type: 'GET',
        headers: {
            'accept': 'application/json',
            'X-CSRFTOKEN': getCSRFToken(),
        },
        success: function(data) {
            // ユーザー詳細情報を表示
            $('#user-detail').html(`
                <p><strong>ユーザー名:</strong> ${data.username}</p>
                <p><strong>メールアドレス:</strong> ${data.email}</p>
            `);
        },
        error: function(error) {
            console.log('Error:', error);
            alert('ユーザー情報の取得に失敗しました。');
        }
    });

    // ユーザーの投稿を取得して表示
    $.ajax({
        url: `/api/user/${userId}/posts/`, // ユーザーの投稿一覧を取得
        type: 'GET',
        headers: {
            'accept': 'application/json',
            'X-CSRFTOKEN': getCSRFToken(),
        },
        success: function(posts) {
            // 投稿一覧を表示
            displayPosts(posts);
        },
        error: function(error) {
            console.log('Error:', error);
            alert('投稿情報の取得に失敗しました。');
        }
    });

    // ユーザーの投稿を表示する関数
    function displayPosts(posts) {
        const postListContainer = $('#post-list');
        postListContainer.empty(); // 既存の投稿リストをクリア

        if (posts.length === 0) {
            postListContainer.append('<p>このユーザーはまだ投稿をしていません。</p>');
        } else {
            posts.forEach(function(post) {
                const postCard = `
                    <div class="post-card">
                        <div class="post-info">
                            <p><strong>投稿ID:</strong> ${post.id}</p>
                            <p><strong>投稿日時:</strong> ${new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <div class="post-image">
                            <img src="${post.image}" alt="投稿画像">
                        </div>
                    </div>
                `;
                postListContainer.append(postCard);
            });
        }
    }
});
