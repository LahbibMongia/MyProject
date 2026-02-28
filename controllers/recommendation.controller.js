const Recommendation = require('../models/recommendation.model');

const createRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.create(req.body);
        res.status(201).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.id);
        res.status(200).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRecommendationByParent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const recommendations = await Recommendation.find({ parent: parentId }).sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRecommendationByBabysitter = async (req, res) => {
    try {
        const { babysitterId } = req.params;
        const recommendations = await Recommendation.find({ babysitter: babysitterId }).sort({ createdAt: -1 });
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findByIdAndDelete(req.params.id);
        res.status(200).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createRecommendation, getRecommendation, getRecommendationByParent, getRecommendationByBabysitter, updateRecommendation, deleteRecommendation };