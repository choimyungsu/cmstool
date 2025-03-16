// controllers/treeController.js
const treeModel = require('../models/treeModel');

const treeController = {
    // tree.ejs 렌더링
    async getAllPage(req, res) {
        try {
            res.render('index', { 
                currentPage: 'pages/tree' ,
                user: req.session.user,
            });
        } catch (error) {
            console.error('Error rendering tree page:', error);
            res.status(500).send('Server Error');
        }
    },

    // 모든 데이터 조회 (JSON)
    async getAll(req, res) {
        try {
          const trees = await treeModel.getAll();
          res.json(trees);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      },

    // 데이터 생성
    async create(req, res) {
        try {
          const tree = await treeModel.create(req.body);
          res.status(201).json(tree);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      },
    
      async update(req, res) {
        try {
          const id = req.params.id;
          const tree = req.body;
    
          // parent_id가 변경되었거나 seq가 변경되었을 경우
          if (tree.parent_id !== undefined || tree.seq !== undefined) {
            const siblings = await treeModel.getAll();
            const siblingsAtSameLevel = siblings.filter(s => s.parent_id === tree.parent_id);
    
            // seq가 명시되지 않은 경우, 마지막 순서로 설정
            if (tree.seq === undefined) {
              tree.seq = siblingsAtSameLevel.length;
            }
    
            // 동일 parent_id 내에서 seq 재조정
            let updatedSeq = 0;
            for (const sibling of siblingsAtSameLevel) {
              if (sibling.id == id) continue;
              if (updatedSeq === tree.seq) updatedSeq++;
              await treeModel.update(sibling.id, { ...sibling, seq: updatedSeq });
              updatedSeq++;
            }
          }
    
          const updatedTree = await treeModel.update(id, tree);
          res.json(updatedTree);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      },
    
      async delete(req, res) {
        try {
          const id = req.params.id;
          const tree = await treeModel.delete(id);
          res.json(tree);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      }
    };
    
    module.exports = treeController;