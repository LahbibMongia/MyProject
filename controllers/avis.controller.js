const Avis = require('../models/avis.model');

const avisController = {
    createAvis : async (req, res) => {
        try {
            const avis = new Avis(req.body);
            await avis.save();
            res.status(201).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAvis : async (req, res) => {
        try {
            const avis = await Avis.findById(req.params.id);
            if (!avis) {
                return res.status(404).json({ message: 'Avis not found' });
            }
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAvisByParent : async (req, res) => {
        try {
            const avis = await Avis.find({ parent: req.params.parentId });
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAvisByBabysitter : async (req, res) => {
        try {
            const avis = await Avis.find({ babysitter: req.params.babysitterId });
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateAvis : async (req, res) => {
        try {
            const avis = await Avis.findById(req.params.id);
            if (!avis) {
                return res.status(404).json({ message: 'Avis not found' });
            }
            avis.set(req.body);
            await avis.save();
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteAvis : async (req, res) => {
        try {
            const avis = await Avis.findById(req.params.id);
            if (!avis) {
                return res.status(404).json({ message: 'Avis not found' });
            }
            await avis.remove();
            res.status(200).json({ message: 'Avis deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = avisController;