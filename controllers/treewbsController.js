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
            console.log('Creating node with body:', req.body);
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
    }
};

module.exports = treewbsController;