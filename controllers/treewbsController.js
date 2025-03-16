const treewbsModel = require('../models/treewbs');

const treewbsController = {
    async getAll(req, res) {
        try {
            const nodes = await treewbsModel.getAll();
            res.json(nodes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            //console.log('Creating node with body:', req.body);
            const node = await treewbsModel.create(req.body);
            res.status(201).json(node);
        } catch (error) {
            console.error('Error in create:', error.stack);
            res.status(500).json({ error: error.message });
        }
    },
    

    async update(req, res) {
        try {
            const node = await treewbsModel.update(req.params.id, req.body);
            res.json(node);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const node = await treewbsModel.delete(req.params.id);
            res.json(node);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 엑셀 업로드 기능 추가
    async upload(req, res) {
        try {
            const uploadedData = req.body; // 클라이언트에서 보낸 JSON 데이터
            if (!Array.isArray(uploadedData) || uploadedData.length === 0) {
                return res.status(400).json({ error: '업로드된 데이터가 비어 있거나 유효하지 않습니다.' });
            }

            // 기존 데이터 삭제
            //await treewbsModel.clearAll();

            // 새 데이터 삽입
            const insertedNodes = await Promise.all(
                uploadedData.map(async (node) => {
                    const { ID, task, start_date, end_date, progress, assignee, parent_id } = node;
                    return await treewbsModel.create({
                        task: task,
                        start_date: start_date || null,
                        end_date: end_date || null,
                        progress: progress || 0,
                        assignee: assignee || null,
                        parent_id: parent_id || null
                    });
                })
            );

            res.status(200).json({ message: '엑셀 데이터가 성공적으로 업로드되었습니다.', nodes: insertedNodes });
        } catch (error) {
            console.error('Error in upload:', error.stack);
            res.status(500).json({ error: error.message });
        }
    }


};

module.exports = treewbsController;