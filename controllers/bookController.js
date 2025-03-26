const Book = require('../models/bookModel');
const multer = require('multer');
const path = require('path');

// Multer 설정: 파일 업로드 처리
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // 업로드된 파일 저장 경로
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일명 고유화
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 제한
}).single('cover_image');

const bookController = {
    // 책 목록 페이지
    async getBookList(req, res) {
        try {
            const userId = req.session.user.id;
            const user = req.session.user;
            const projectList = req.session.projectList;
            const selectedProjectId = req.session.selectedProjectId;
            if (!user || !user.user_name) {
                return res.redirect('/login');
            }

            console.log('getBookList - userId:', userId); // 디버깅용 로그
            const books = await Book.getAllBooks(userId);
            console.log('getBookList - books:', books); // 디버깅용 로그
            res.render('index', {
                currentPage: 'pages/bookList',
                books: books,
                user: user,
                projectList: projectList,
                selectedProjectId: selectedProjectId
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },

    // 책 생성 페이지
    async getCreateBookPage(req, res) {
        try {
            const user = req.session.user;
            const projectList = req.session.projectList;
            const selectedProjectId = req.session.selectedProjectId;
            if (!user || !user.user_name) {
                return res.redirect('/login');
            }

            res.render('index', {
                currentPage: 'pages/createBook',
                user: user,
                projectList: projectList,
                selectedProjectId: selectedProjectId
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },

    // 책 생성 처리
    async createBook(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ success: false, message: err.message });
            }

            try {
                const { title } = req.body;
                const cover_image = req.file ? `/uploads/${req.file.filename}` : null;
                const author_id = req.session.user.id;

                if (!title || !cover_image) {
                    return res.status(400).json({ success: false, message: '제목과 표지 이미지는 필수입니다.' });
                }

                const newBook = await Book.createBook({ title, cover_image, author_id });
                res.json({ success: true, book: newBook });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Failed to create book' });
            }
        });
    },

    // 책 퍼블리싱
    async publishBook(req, res) {
        try {
            const { bookId } = req.params;
            const updatedBook = await Book.publishBook(bookId);
            res.json({ success: true, book: updatedBook });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to publish book' });
        }
    }
};

module.exports = bookController;