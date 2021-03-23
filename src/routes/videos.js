const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const Lecture = require('../models/lecture');

// get all videos of a specific lecture
router.get('/', async (req, res) => {
    const q = {};
    if (req.query.lectureid !== undefined) {
        q.lecture = req.query.lectureid;
    };
    try {
        const videos = await Video.find(q);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

// Get one video
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Video.findById(id).then(video => {
        if (!video) {
            return res.status(404).json({ message: 'Cannot find video' });
        } else res.json(video);
    })
        .catch(
            error => res.status(500).json({ message: error.message })
        );
});

// Create one video;
router.post('/:_id', async (req, res) => {
    const { title, profesor, url, img, duration } = req.body;
    const { _id } = req.params;
    const videoLecture = new Video({
        title,
        profesor,
        url,
        img,
        duration,
    });
    const oneLecture = await Lecture.findById(_id);
    videoLecture.lecture = req.params._id;
    await videoLecture.save();
    oneLecture.video.push(videoLecture);
    await oneLecture.save();
    res.send(videoLecture);
});

// Update one Video
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { title, profesor, url, lecture, img, duration } = req.body;
    let update = {};
    if (title) {
        update = { ...update, title };
    };
    if (profesor) {
        update = { ...update, profesor };
    };
    if (url) {
        update = { ...update, url };
    };
    if (lecture) {
        update = { ...update, lecture };
    };
    if (img) {
        update = { ...update, img };
    };
    if (duration) {
        update = { ...update, duration };
    };

    Video.findByIdAndUpdate(id, update, { new: true }).then(video => {
        res.json(video);
    })
        .catch(error => {
            res.status(400).json({ message: error.message });
        });
});

// Delete one video and remove it from the lecture

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Lecture.find({ video: id }).then(res => {
        for (let i = 0; i < res[0].video.length; i++) {
            if (res[0].video[i] == id) {
                res[0].video.splice(i, 1);
            };
        };
        res[0].save();
    });
    Video.findById(id).then(video => {
        video.remove();
        res.json({ message: 'Video has been deleted' });
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
});

module.exports = router;