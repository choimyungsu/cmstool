const treewbsModel = require('../models/treewbs');

const treewbsController = {
    async getAll(req, res) {
        try {
            const projectId = req.session.selectedProjectId;
            if (!projectId) {
                return res.status(400).json({ error: '선택된 프로젝트가 없습니다.' });
            }
            const nodes = await treewbsModel.getAll(projectId);
            res.json(nodes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const projectId = req.session.selectedProjectId;
            if (!projectId) {
                return res.status(400).json({ error: '선택된 프로젝트가 없습니다.' });
            }
            const node = { ...req.body, project_id: projectId };
            const createdNode = await treewbsModel.create(node);
            res.status(201).json(createdNode);
        } catch (error) {
            console.error('Error in create:', error.stack);
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const projectId = req.session.selectedProjectId;
            if (!projectId) {
                return res.status(400).json({ error: '선택된 프로젝트가 없습니다.' });
            }
            const node = { ...req.body, project_id: projectId };
            const updatedNode = await treewbsModel.update(req.params.id, node);
            res.json(updatedNode);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const projectId = req.session.selectedProjectId;
            if (!projectId) {
                return res.status(400).json({ error: '선택된 프로젝트가 없습니다.' });
            }
            const deletedNode = await treewbsModel.delete(req.params.id);
            res.json(deletedNode);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async upload(req, res) {
        try {
            const projectId = req.session.selectedProjectId;
            if (!projectId) {
                return res.status(400).json({ error: '선택된 프로젝트가 없습니다.' });
            }
            const uploadedData = req.body;
            if (!Array.isArray(uploadedData) || uploadedData.length === 0) {
                return res.status(400).json({ error: '업로드된 데이터가 비어 있거나 유효하지 않습니다.' });
            }

            const insertedNodes = await Promise.all(
                uploadedData.map(async (node) => {
                    const { ID, task, start_date, end_date, progress, assignee, parent_id } = node;
                    return await treewbsModel.create({
                        task: task || 'Unnamed Task',
                        start_date: start_date || null,
                        end_date: end_date || null,
                        progress: progress || 0,
                        assignee: assignee || null,
                        parent_id: parent_id || null,
                        project_id: projectId
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