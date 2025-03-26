$(document).ready(function() {
    let currentPage = 0;
    const pages = $('.page');

    // 초기 페이지 표시
    $(pages[currentPage]).addClass('active');

    // 페이지 이동
    $('.next-btn').click(function() {
        if (currentPage < pages.length - 1) {
            $(pages[currentPage]).removeClass('active');
            currentPage++;
            $(pages[currentPage]).addClass('active');
        }
    });

    $('.prev-btn').click(function() {
        if (currentPage > 0) {
            $(pages[currentPage]).removeClass('active');
            currentPage--;
            $(pages[currentPage]).addClass('active');
        }
    });

    // 책갈피 추가
    $('.bookmark-btn').click(function() {
        const pageId = $(pages[currentPage]).data('page-id');
        $.ajax({
            url: '/bookmark/add',
            method: 'POST',
            data: { pageId },
            success: function(response) {
                alert('책갈피가 추가되었습니다.');
            }
        });
    });

    // 형광펜 기능
    $('.highlight-btn').click(function() {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            const pageId = $(pages[currentPage]).data('page-id');
            $.ajax({
                url: '/highlight/add',
                method: 'POST',
                data: { pageId, highlightedText: selectedText },
                success: function(response) {
                    const span = document.createElement('span');
                    span.style.backgroundColor = 'yellow';
                    span.textContent = selectedText;
                    const range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(span);
                }
            });
        }
    });

    // 목차 클릭 시 페이지 이동
    $('.toc a').click(function(e) {
        e.preventDefault();
        const pageId = $(this).data('page-id');
        $(pages[currentPage]).removeClass('active');
        currentPage = pages.index($(`[data-page-id="${pageId}"]`));
        $(pages[currentPage]).addClass('active');
    });
});