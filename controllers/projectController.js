// const ProjectModel = require('../models/project');
// const multer = require('multer');
// const xlsx = require('xlsx');

// // 파일 업로드 설정
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single('excelFileInput');

// const Op = { like: 'LIKE' }; // Mock Op object to avoid ReferenceError

// class ProjectController {
//     static async getProjects(req, res) {
//         try {
//             const { search_pjt_uid, search_pjt_name, search_pjt_open } = req.query;

//             const whereClause = {};
//             if (search_pjt_uid) whereClause.pjt_uid = { [Op.like]: `%${search_pjt_uid}%` };
//             if (search_pjt_name) whereClause.pjt_name = { [Op.like]: `%${search_pjt_name}%` };
//             if (search_pjt_open) whereClause.pjt_open = { [Op.like]: `%${search_pjt_open}%` };

//             const projects = await ProjectModel.getAllProjects({ where: whereClause });
//             res.render('index', { 
//                 currentPage: "pages/project", 
//                 projects, 
//                 selectedProject: null, 
//                 activeTab: 'projectList',
//                 search_pjt_uid: search_pjt_uid || '',
//                 search_pjt_name: search_pjt_name || '',
//                 search_pjt_open: search_pjt_open || ''
//             });
//         } catch (error) {
//             console.error('List error:', error);
//             res.status(500).send('Server Error');
//         }
//     }

//     static async getProjectDetail(req, res) {
//         const { id } = req.params;
//         try {
//             const projects = await ProjectModel.getAllProjects();
//             const selectedProject = await ProjectModel.getProjectById(id);
//             res.render('index', { 
//                 currentPage: 'pages/project', 
//                 projects, 
//                 selectedProject, 
//                 activeTab: 'projectList' 
//             });
//         } catch (error) {
//             console.error('Detail error:', error);
//             res.status(500).send('상세 조회 오류: ' + error.message);
//         }
//     }

//     static async createProject(req, res) {
//         try {
//             await ProjectModel.createProject(req.body);
//             res.redirect('/project');
//         } catch (error) {
//             console.error('Create error:', error);
//             res.status(500).send('프로젝트 생성 오류: ' + error.message);
//         }
//     }

//     static async updateProject(req, res) {
//         const { id } = req.params;
//         try {
//             await ProjectModel.updateProject(id, req.body);
//             res.redirect('/project');
//         } catch (error) {
//             console.error('Update error:', error);
//             res.status(500).send('프로젝트 업데이트 오류: ' + error.message);
//         }
//     }

//     static async deleteProject(req, res) {
//         const { id } = req.params;
//         try {
//             await ProjectModel.deleteProject(id);
//             res.redirect('/project');
//         } catch (error) {
//             console.error('Delete error:', error);
//             res.status(500).send('프로젝트 삭제 오류: ' + error.message);
//         }
//     }

//     static importProject(req, res) {
//         upload(req, res, async (err) => {
//             if (err) {
//                 console.error('Upload error:', err);
//                 return res.status(400).json({ success: false, message: '파일 업로드 오류' });
//             }
//             if (!req.file) {
//                 return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
//             }
//             try {
//                 const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];
//                 const jsonData = xlsx.utils.sheet_to_json(worksheet);

//                 const projectData = jsonData.map(row => ({
//                     pjt_uid: row.pjt_uid || '',
//                     pjt_name: row.pjt_name || '',
//                     pjt_desc: row.pjt_desc || '',
//                     pjt_open: row.pjt_open || '',
//                     pjt_start_date: row.pjt_start_date || '',
//                     pjt_end_date: row.pjt_end_date || ''
//                 }));

//                 for (const data of projectData) {
//                     await ProjectModel.createProject(data);
//                 }
//                 res.json({ success: true, message: '데이터가 성공적으로 import되었습니다.' });
//             } catch (error) {
//                 console.error('Import error:', error);
//                 res.status(500).json({ success: false, message: '데이터 import 중 오류가 발생했습니다.' });
//             }
//         });
//     }

//     static async downloadExcel(req, res) {
//         try {
//             const projects = await ProjectModel.getAllProjects();
//             const worksheetData = projects.map(project => ({
//                 'ID': project.id,
//                 '프로젝트 UID': project.pjt_uid,
//                 '프로젝트 이름': project.pjt_name,
//                 '설명': project.pjt_desc,
//                 '공개 여부': project.pjt_open,
//                 '시작일': project.pjt_start_date,
//                 '종료일': project.pjt_end_date
//                 // '생성일': project.created_at,
//                 // '변경일': project.updated_at
//             }));

//             const worksheet = xlsx.utils.json_to_sheet(worksheetData);
//             const workbook = xlsx.utils.book_new();
//             xlsx.utils.book_append_sheet(workbook, worksheet, 'Projects');
//             const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

//             res.setHeader('Content-Disposition', 'attachment; filename=projects_export.xlsx');
//             res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//             res.send(excelBuffer);
//         } catch (error) {
//             console.error('Excel download error:', error);
//             res.status(500).send('엑셀 다운로드 중 오류가 발생했습니다.');
//         }
//     }
// }

// module.exports = ProjectController;


const ProjectModel = require('../models/project');
const multer = require('multer');
const xlsx = require('xlsx');

// 파일 업로드 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('excelFileInput');

const Op = { like: 'LIKE' }; // Mock Op object to avoid ReferenceError

const projectController = {

  async getProjects(req, res) {
    try {
      const { search_pjt_uid, search_pjt_name, search_pjt_open } = req.query;

      const whereClause = {};
      if (search_pjt_uid) whereClause.pjt_uid = { [Op.like]: `%${search_pjt_uid}%` };
      if (search_pjt_name) whereClause.pjt_name = { [Op.like]: `%${search_pjt_name}%` };
      if (search_pjt_open) whereClause.pjt_open = { [Op.like]: `%${search_pjt_open}%` };

      const projects = await ProjectModel.getAllProjects({ where: whereClause });
      res.render('index', { 
        currentPage: "pages/project", 
        projects, 
        selectedProject: null, 
        activeTab: 'projectList',
        search_pjt_uid: search_pjt_uid || '',
        search_pjt_name: search_pjt_name || '',
        search_pjt_open: search_pjt_open || '',
        user: req.session.user ,
        projectList: req.session.projectList || [], // 세션에서 프로젝트 리스트 가져오기
        selectedProjectId: req.session.selectedProjectId // 선택된 프로젝트 ID 전달
      });
    } catch (error) {
      console.error('List error:', error);
      res.status(500).send('Server Error');
    }
  },

  async getProjectDetail(req, res) {
    const { id } = req.params;
    try {
      const projects = await ProjectModel.getAllProjects();
      const selectedProject = await ProjectModel.getProjectById(id);
      res.render('index', { 
        currentPage: 'pages/project', 
        projects, 
        selectedProject, 
        activeTab: 'projectList' 
      });
    } catch (error) {
      console.error('Detail error:', error);
      res.status(500).send('상세 조회 오류: ' + error.message);
    }
  },

  async createProject(req, res) {
    try {
      await ProjectModel.createProject(req.body);
      res.redirect('/project');
    } catch (error) {
      console.error('Create error:', error);
      res.status(500).send('프로젝트 생성 오류: ' + error.message);
    }
  },

  async updateProject(req, res) {
    const { id } = req.params;
    try {
      await ProjectModel.updateProject(id, req.body);
      res.redirect('/project');
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).send('프로젝트 업데이트 오류: ' + error.message);
    }
  },

  async deleteProject(req, res) {
    const { id } = req.params;
    try {
      await ProjectModel.deleteProject(id);
      res.redirect('/project');
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).send('프로젝트 삭제 오류: ' + error.message);
    }
  },

  importProject(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ success: false, message: '파일 업로드 오류' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
      }
      try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const projectData = jsonData.map(row => ({
          pjt_uid: row.pjt_uid || '',
          pjt_name: row.pjt_name || '',
          pjt_desc: row.pjt_desc || '',
          pjt_open: row.pjt_open || '',
          pjt_start_date: row.pjt_start_date || '',
          pjt_end_date: row.pjt_end_date || ''
        }));

        for (const data of projectData) {
          await ProjectModel.createProject(data);
        }
        res.json({ success: true, message: '데이터가 성공적으로 import되었습니다.' });
      } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ success: false, message: '데이터 import 중 오류가 발생했습니다.' });
      }
    });
  },

  async downloadExcel(req, res) {
    try {
      const projects = await ProjectModel.getAllProjects();
      const worksheetData = projects.map(project => ({
        'ID': project.id,
        '프로젝트 UID': project.pjt_uid,
        '프로젝트 이름': project.pjt_name,
        '설명': project.pjt_desc,
        '공개 여부': project.pjt_open,
        '시작일': project.pjt_start_date,
        '종료일': project.pjt_end_date
        // '생성일': project.created_at,
        // '변경일': project.updated_at
      }));

      const worksheet = xlsx.utils.json_to_sheet(worksheetData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Projects');
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      res.setHeader('Content-Disposition', 'attachment; filename=projects_export.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(excelBuffer);
    } catch (error) {
      console.error('Excel download error:', error);
      res.status(500).send('엑셀 다운로드 중 오류가 발생했습니다.');
    }
  }
};

module.exports = projectController;