const Page = require('../models/pageModel');

const pageController = {
    async getBookView(req, res) {
        try {
            const { bookId } = req.params;
            const user = req.session.user || {};
            const projectList = req.session.projectList || [];
            const selectedProjectId = req.session.selectedProjectId || null;

            if (!user || !user.user_name) {
                return res.redirect('/login');
            }

            let bookmark = null;
            let bookmarks = [];
            try {
                // 현재 페이지의 책갈피
                bookmark = await Page.getBookmark(user.id, currentPage.id);
                // 해당 책의 모든 책갈피 (페이지 번호 포함)
                bookmarks = await Page.getAllBookmarksByBook(user.id, bookId);
            } catch (error) {
                console.error('Error fetching bookmark/bookmarks:', error.message);
            }

            const pages = await Page.getPagesByBook(bookId);
            if (!pages || pages.length === 0) {
                return res.render('index', {
                    currentPage: 'pages/bookView',
                    bookId: bookId,
                    pages: [],
                    currentPageNumber: 1,
                    user: user,
                    projectList: projectList,
                    selectedProjectId: selectedProjectId,
                    bookmark: bookmark,
                    bookmarks: bookmarks // 모든 책갈피 전달
                });
            }

            res.redirect(`/book/${bookId}/page/1`);
        } catch (error) {
            console.error('getBookView - Error:', error.message, error.stack);
            res.status(500).send('Server Error');
        }
    },

    async getBookViewWithPage(req, res) {
        try {
            const { bookId, pageNumber } = req.params;
            const user = req.session.user || {};
            const projectList = req.session.projectList || [];
            const selectedProjectId = req.session.selectedProjectId || null;

            if (!user || !user.user_name || !user.id) {
                console.log('User session invalid:', req.session.user);
                return res.redirect('/login');
            }

            if (!bookId || isNaN(parseInt(bookId))) {
                console.log('Invalid bookId:', bookId);
                return res.status(400).send('Invalid book ID');
            }

            const pages = await Page.getPagesByBook(bookId);
            const currentPageNumber = parseInt(pageNumber, 10);

            console.log('Pages:', pages);
            console.log('Current Page Number:', currentPageNumber);

            if (!pages || pages.length === 0 || currentPageNumber < 1 || currentPageNumber > pages.length) {
                console.log('Pages not found or invalid page number:', { bookId, pageNumber, pages });
                return res.status(404).send('Page Not Found');
            }

            const currentPage = pages.find(p => p.page_number === currentPageNumber) || pages[0];
            console.log('Current Page:', currentPage);

            if (!currentPage || !currentPage.id) {
                console.log('Current page not found or missing id:', currentPage);
                return res.status(404).send('Page Not Found');
            }

            let bookmark = null;
            let bookmarks = [];
            try {
                // 현재 페이지의 책갈피
                bookmark = await Page.getBookmark(user.id, currentPage.id);
                // 해당 책의 모든 책갈피 (페이지 번호 포함)
                bookmarks = await Page.getAllBookmarksByBook(user.id, bookId);
                console.log('Bookmarks:', bookmarks);
                console.log('Current Page Content:', currentPage.content);
            } catch (error) {
                console.error('Error fetching bookmark/bookmarks:', error.message);
            }

            res.render('index', {
                currentPage: 'pages/bookView',
                bookId: bookId,
                pages: pages,
                currentPageNumber: currentPageNumber,
                user: user,
                projectList: projectList,
                selectedProjectId: selectedProjectId,
                bookmark: bookmark,
                bookmarks: bookmarks // 모든 책갈피 전달
            });
        } catch (error) {
            console.error('getBookViewWithPage - Error:', error.message, error.stack);
            res.status(500).send('Server Error');
        }
    },

    async addBookmark(req, res) {
        try {
            const { pageId, bookId } = req.body;
            const userId = req.session.user?.id;

            if (!userId || isNaN(parseInt(userId))) {
                return res.status(400).json({ success: false, message: '유효한 사용자 ID가 필요합니다.' });
            }
            if (!pageId || isNaN(parseInt(pageId))) {
                return res.status(400).json({ success: false, message: '유효한 페이지 ID가 필요합니다.' });
            }
            if (!bookId || isNaN(parseInt(bookId))) {
                return res.status(400).json({ success: false, message: '유효한 책 ID가 필요합니다.' });
            }

            const bookmark = await Page.addBookmark(parseInt(userId), parseInt(pageId), parseInt(bookId));
            res.json({ success: true, bookmark });
        } catch (error) {
            console.error('addBookmark - Error:', error.message, error.stack);
            res.status(500).json({ success: false, message: '책갈피 추가 실패' });
        }
    },

    async removeBookmark(req, res) {
        try {
            const { pageId } = req.body;
            const userId = req.session.user?.id;

            if (!userId || isNaN(parseInt(userId))) {
                return res.status(400).json({ success: false, message: '유효한 사용자 ID가 필요합니다.' });
            }
            if (!pageId || isNaN(parseInt(pageId))) {
                return res.status(400).json({ success: false, message: '유효한 페이지 ID가 필요합니다.' });
            }

            const bookmark = await Page.removeBookmark(parseInt(userId), parseInt(pageId));
            res.json({ success: true, bookmark });
        } catch (error) {
            console.error('removeBookmark - Error:', error.message, error.stack);
            res.status(500).json({ success: false, message: '책갈피 제거 실패' });
        }
    },



    async getCreatePage(req, res) {
        try {
            const { bookId } = req.query;
            const user = req.session.user || {};
            const projectList = req.session.projectList || [];
            const selectedProjectId = req.session.selectedProjectId || null;
    
            if (!user || !user.user_name) {
                return res.redirect('/login');
            }
    
            if (!bookId) {
                return res.status(400).send('bookId is required');
            }
    
            const pages = await Page.getPagesByBook(bookId); // 기존 페이지 목록 조회
    
            res.render('index', {
                currentPage: 'pages/createPage',
                bookId: bookId,
                pages: pages, // 페이지 목록 전달
                user: user,
                projectList: projectList,
                selectedProjectId: selectedProjectId
            });
        } catch (error) {
            console.error('getCreatePage - Error:', error.message, error.stack);
            res.status(500).send('Server Error');
        }
    },

    async createPage(req, res) {
        try {
            const { bookId, chapter_id, page_number, content, watermark_text, watermark_size } = req.body;

            if (!bookId || !chapter_id || !page_number || !content) {
                return res.status(400).json({ success: false, message: '모든 필수 필드를 입력해주세요.' });
            }

            const pageData = {
                book_id: parseInt(bookId, 10),
                chapter_id: parseInt(chapter_id, 10),
                page_number: parseInt(page_number, 10),
                content: content,
                watermark_text: watermark_text || `Watermark - Book ${bookId}`,
                watermark_size: watermark_size ? parseInt(watermark_size, 10) : 40
            };

            // 삽입 위치 이후의 페이지 번호를 1씩 증가
            await Page.shiftPageNumbers(pageData.book_id, pageData.page_number);

            // 새로운 페이지 삽입
            const newPage = await Page.createPage(pageData);
            res.json({ success: true, page: newPage });
        } catch (error) {
            console.error('createPage - Error:', error.message, error.stack);
            res.status(500).json({ success: false, message: '페이지 생성에 실패했습니다.' });
        }
    },
    
    async getEditPage(req, res) {
        try {
            const { pageId } = req.params;
            const user = req.session.user || {};
            const projectList = req.session.projectList || [];
            const selectedProjectId = req.session.selectedProjectId || null;

            if (!user || !user.user_name) {
                return res.redirect('/login');
            }

            const page = await Page.getPageById(pageId);
            if (!page) {
                return res.status(404).send('Page Not Found');
            }

            res.render('index', {
                currentPage: 'pages/editPage',
                page: page,
                user: user,
                projectList: projectList,
                selectedProjectId: selectedProjectId
            });
        } catch (error) {
            console.error('getEditPage - Error:', error.message, error.stack);
            res.status(500).send('Server Error');
        }
    },

        async updatePage(req, res) {
            try {
                const { pageId, bookId, chapter_id, page_number, content, watermark_text, watermark_size } = req.body;
    
                if (!pageId || !bookId || !chapter_id || !page_number || !content) {
                    return res.status(400).json({ success: false, message: '모든 필수 필드를 입력해주세요.' });
                }
    
                const pageData = {
                    id: parseInt(pageId, 10),
                    book_id: parseInt(bookId, 10),
                    chapter_id: parseInt(chapter_id, 10),
                    page_number: parseInt(page_number, 10),
                    content: content,
                    watermark_text: watermark_text,
                    watermark_size: watermark_size ? parseInt(watermark_size, 10) : 40
                };
    
                const updatedPage = await Page.updatePage(pageData);
                res.json({ success: true, page: updatedPage });
            } catch (error) {
                console.error('updatePage - Error:', error.message, error.stack);
                res.status(500).json({ success: false, message: '페이지 수정에 실패했습니다.' });
            }
    },


};

module.exports = pageController;