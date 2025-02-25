$(document).ready(function() {
    // CSRFトークンを取得
    function getCSRFToken() {
      return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }
  
    // 投稿情報を取得する関数
    function fetchPosts() {
      $.ajax({
        url: '/api/posts/', // APIのURL
        type: 'GET',
        headers: {
          'accept': 'application/json',
          'X-CSRFTOKEN': getCSRFToken(),
        },
        success: function(data) {
          // 投稿情報を表示
          displayPosts(data.results);
        },
        error: function(error) {
          console.log('Error:', error);
          alert('投稿情報の取得に失敗しました。');
        }
      });
    }
  
    // 投稿情報を表示する関数
    function displayPosts(posts) {
      const postListContainer = $('#post-list');
      postListContainer.empty(); // 既存の投稿リストをクリア
  
      if (posts.length === 0) {
        postListContainer.append('<p>投稿がありません。</p>');
      } else {
        posts.forEach(function(post) {
          const postItem = `
            <div class="post-item">
              <a href="/post/${post.id}/" class="post-link">
              <p><strong>投稿者:</strong> ${post.createdBy.username}</p>
                <p><strong>作成日時:</strong> ${new Date(post.createdAt).toLocaleString()}</p>
                <img src="${post.image}" alt="投稿画像">
              </a>
            </div>
          `;
          postListContainer.append(postItem);
        });
      }
    }
  
    // ページ読み込み時に投稿情報を取得
    fetchPosts();
  });
  