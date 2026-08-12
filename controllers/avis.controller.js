const Avis = require('../models/avis.model');

const avisController = {
    createAvis: async (req, res) => {
        try {
            const { parent, babysitter, note, commentaire } = req.body;

            const avis = await Avis.create({
                parent,
                babysitter,
                note,
                commentaire
            });

            res.status(201).json(avis);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAvis: async (req, res) => {
        try {
            const avis = await Avis.findById(req.params.id);
            if (!avis) {
                return res.status(404).json({ message: 'Avis not found' });
            }
            res.status(200).jsààon(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAvisByParent: async (req, res) => {
        try {
            const avis = await Avis.find({ parent: req.params.parentId });
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAvisByBabysitter: async (req, res) => {
        try {
            const avis = await Avis.find({ babysitter: req.params.babysitterId });
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateAvis: async (req, res) => {
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
    deleteAvis: async (req, res) => {
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

// 
module.exports.AssignAvisToParent = async (req, res) => {
  try {
    const avisId = req.params.avisId;
    const parentId = req.params.parentId;

    const avisData = await Avis.findById(avisId);

    if (!avisData) {
      throw new Error("Avis not found");
    }

    // check if already assigned
    if (avisData.parent && avisData.parent.toString() === parentId) {
      throw new Error("Avis already assigned to parent");
    }

    const UpdatedAvis = await Avis.findByIdAndUpdate(
      avisId,
      { parent: parentId },
      { new: true }
    );

    res.status(200).json({
      message: "Avis assigned successfully",
      data: UpdatedAvis
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /parent/:parentId/avis
// → create avis with parent field set immediately

module.exports = avisController;