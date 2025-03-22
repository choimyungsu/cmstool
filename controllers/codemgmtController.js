// // controllers/codemgmtController.js
// const CodeModel = require('../models/codeModel');

// const codemgmtController = {
//   async getCodeManagement(req, res) {
//     try {
//       const masterCodes = await CodeModel.getMasterCodes();
//       let selectedMaster = null;
//       let slaveCodes = [];

//       if (req.query.master_id) {
//         selectedMaster = await CodeModel.getMasterCodeById(req.query.master_id);
//         slaveCodes = await CodeModel.getSlaveCodes(req.query.master_id);
//       }

//       res.render('index', {
//         title: 'Code Management',
//         currentPage: 'pages/codemgmt',
//         masterCodes,
//         selectedMaster,
//         slaveCodes,
//       });
//     } catch (error) {
//       console.error('Error fetching codes:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async createMasterCode(req, res) {
//     try {
//       const { code_group, code_name } = req.body;
//       const newMasterCode = await CodeModel.createMasterCode(code_group, code_name);
//       res.redirect('/codemgmt');
//     } catch (error) {
//       console.error('Error creating master code:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async updateMasterCode(req, res) {
//     try {
//       const { id, code_group, code_name } = req.body;
//       const updatedMasterCode = await CodeModel.updateMasterCode(id, code_group, code_name);
//       res.redirect('/codemgmt');
//     } catch (error) {
//       console.error('Error updating master code:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async deleteMasterCode(req, res) {
//     try {
//       const { id } = req.params;
//       await CodeModel.deleteMasterCode(id);
//       res.redirect('/codemgmt');
//     } catch (error) {
//       console.error('Error deleting master code:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async createSlaveCode(req, res) {
//     try {
//       const { master_id, code_value, code_name, sort_order, is_active } = req.body;
//       const newSlaveCode = await CodeModel.createSlaveCode(master_id, code_value, code_name, sort_order, is_active === 'true');
//       res.redirect(`/codemgmt?master_id=${master_id}`);
//     } catch (error) {
//       console.error('Error creating slave code:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async updateSlaveCode(req, res) {
//     try {
//       const { id, master_id, code_value, code_name, sort_order, is_active } = req.body;
//       const updatedSlaveCode = await CodeModel.updateSlaveCode(id, master_id, code_value, code_name, sort_order, is_active === 'true');
//       res.redirect(`/codemgmt?master_id=${master_id}`);
//     } catch (error) {
//       console.error('Error updating slave code:', error);
//       res.status(500).send('Server Error');
//     }
//   },

//   async deleteSlaveCode(req, res) {
//     try {
//       const { id, master_id } = req.params;
//       await CodeModel.deleteSlaveCode(id);
//       res.redirect(`/codemgmt?master_id=${master_id}`);
//     } catch (error) {
//       console.error('Error deleting slave code:', error);
//       res.status(500).send('Server Error');
//     }
//   },
// };

// module.exports = codemgmtController;


// controllers/codemgmtController.js
const CodeModel = require('../models/codeModel');

const codemgmtController = {
  async getCodeManagement(req, res) {
    try {
      const masterCodes = await CodeModel.getMasterCodes();
      let selectedMaster = null;
      let slaveCodes = [];

      // req.query.master_id가 있으면 해당 ID로 선택, 없으면 첫 번째 마스터 코드를 기본 선택
      if (req.query.master_id) {
        selectedMaster = await CodeModel.getMasterCodeById(req.query.master_id);
      } else if (masterCodes.length > 0) {
        selectedMaster = await CodeModel.getMasterCodeById(masterCodes[0].id);
      }

      if (selectedMaster) {
        slaveCodes = await CodeModel.getSlaveCodes(selectedMaster.id);
      }

      res.render('index', {
        title: 'Code Management',
        currentPage: 'pages/codemgmt',
        masterCodes,
        selectedMaster,
        slaveCodes,
        user: req.session.user,
        projectList: req.session.projectList || [], // 세션에서 프로젝트 리스트 가져오기
        selectedProjectId: req.session.selectedProjectId // 선택된 프로젝트 ID 전달
      });
    } catch (error) {
      console.error('Error fetching codes:', error);
      res.status(500).send('Server Error');
    }
  },

  async createMasterCode(req, res) {
    try {
      const { code_group, code_name } = req.body;
      const newMasterCode = await CodeModel.createMasterCode(code_group, code_name);
      res.redirect('/codemgmt');
    } catch (error) {
      console.error('Error creating master code:', error);
      res.status(500).send('Server Error');
    }
  },

  async updateMasterCode(req, res) {
    try {
      const { id, code_group, code_name } = req.body;
      const updatedMasterCode = await CodeModel.updateMasterCode(id, code_group, code_name);
      res.redirect('/codemgmt');
    } catch (error) {
      console.error('Error updating master code:', error);
      res.status(500).send('Server Error');
    }
  },

  async deleteMasterCode(req, res) {
    try {
      const { id } = req.params;
      await CodeModel.deleteMasterCode(id);
      res.redirect('/codemgmt');
    } catch (error) {
      console.error('Error deleting master code:', error);
      res.status(500).send('Server Error');
    }
  },

  async createSlaveCode(req, res) {
    try {
      const { master_id, code_value, code_name, sort_order, is_active } = req.body;
      const newSlaveCode = await CodeModel.createSlaveCode(master_id, code_value, code_name, sort_order, is_active === 'true');
      res.redirect(`/codemgmt?master_id=${master_id}`);
    } catch (error) {
      console.error('Error creating slave code:', error);
      res.status(500).send('Server Error');
    }
  },

  async updateSlaveCode(req, res) {
    try {
      const { id, master_id, code_value, code_name, sort_order, is_active } = req.body;
      const updatedSlaveCode = await CodeModel.updateSlaveCode(id, master_id, code_value, code_name, sort_order, is_active === 'true');
      res.redirect(`/codemgmt?master_id=${master_id}`);
    } catch (error) {
      console.error('Error updating slave code:', error);
      res.status(500).send('Server Error');
    }
  },

  async deleteSlaveCode(req, res) {
    try {
      const { id, master_id } = req.params;
      await CodeModel.deleteSlaveCode(id);
      res.redirect(`/codemgmt?master_id=${master_id}`);
    } catch (error) {
      console.error('Error deleting slave code:', error);
      res.status(500).send('Server Error');
    }
  },
};

module.exports = codemgmtController;