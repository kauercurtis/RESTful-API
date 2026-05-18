const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const { checkContentType, checkBusiness, checkReview, checkPhoto, checkPatch } = require('./middleware');
// REMOVED: const { generateUniqueId } = require('./hash'); // No longer needed
const { getNewPage } = require('./page');

const port = 8086;
const PAGE_SIZE = 10;

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DB_NAME;
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}?authSource=admin`;
let db = null;

app.use(express.json());

// Helper function to safely parse ObjectIds and avoid BSON errors crash
const tryCastObjectId = (id) => {
    try {
        return new ObjectId(id);
    } catch (e) {
        return null;
    }
};

app.patch("/businesses/:id", checkContentType, checkPatch, async (req, res, next) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid business ID format" });

    try {
        let updateOps = {};
        if (Array.isArray(req.body)) {
            req.body.forEach(patch => {
                const fieldName = patch.path.startsWith('/') ? patch.path.substring(1) : patch.path;
                updateOps[fieldName] = patch.value;
            });
        } else {
            updateOps = req.body;
        }

        const result = await db.collection('businesses').updateOne(
            { _id: businessID },
            { $set: updateOps } 
        );

        if (result.matchedCount === 1) {
            res.status(201).send({
                "links": { "business": `/businesses/${req.params.id}` }
            });
        } else {
            res.status(404).send({ "error": "business not found" });
        }
    } catch (err) {
        console.error("Database error during business patch:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.patch("/businesses/:id/reviews/:reviewid", checkContentType, checkPatch, async (req, res, next) => {
    const businessID = tryCastObjectId(req.params.id);
    const reviewID = tryCastObjectId(req.params.reviewid);
    if (!businessID || !reviewID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        let updateOps = {};
        if (Array.isArray(req.body)) {
            req.body.forEach(patch => {
                const fieldName = patch.path.startsWith('/') ? patch.path.substring(1) : patch.path;
                updateOps[fieldName] = patch.value;
            });
        } else {
            updateOps = req.body;
        }

        const result = await db.collection('reviews').updateOne(
            { _id: reviewID, businessID: businessID }, // businessID must be parsed to ObjectId
            { $set: updateOps }
        );

        if (result.matchedCount === 1) {
            res.status(201).send();
        } else {
            res.status(404).send({ "error": "business or review not found" });
        }
    } catch (err) {
        console.error("Database error during review patch:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.patch("/businesses/:id/photos/:photoid", checkContentType, checkPatch, async (req, res, next) => {
    const businessID = tryCastObjectId(req.params.id);
    const photoID = tryCastObjectId(req.params.photoid);
    if (!businessID || !photoID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        let updateOps = {};
        if (Array.isArray(req.body)) {
            req.body.forEach(patch => {
                const fieldName = patch.path.startsWith('/') ? patch.path.substring(1) : patch.path;
                updateOps[fieldName] = patch.value;
            });
        } else {
            updateOps = req.body;
        }

        const result = await db.collection('photos').updateOne(
            { _id: photoID, businessID: businessID },
            { $set: updateOps }
        );

        if (result.matchedCount === 1) {
            res.status(201).send();
        } else {
            res.status(404).send({ "error": "business or photo not found" });
        }
    } catch (err) {
        console.error("Database error during photo patch:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.delete("/businesses/:id", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const businessResult = await db.collection('businesses').deleteOne({ _id: businessID });
        if (businessResult.deletedCount === 1) {
            await Promise.all([
                db.collection('reviews').deleteMany({ businessID: businessID }),
                db.collection('photos').deleteMany({ businessID: businessID })
            ]);
            res.status(204).send();
        } else {
           res.status(404).send({ "error": "business not found" });
        }
    } catch (err) {
        console.error("Database error during business deletion:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.delete("/businesses/:id/reviews/:reviewid", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    const reviewID = tryCastObjectId(req.params.reviewid);
    if (!businessID || !reviewID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const result = await db.collection('reviews').deleteOne({
            _id: reviewID,
            businessID: businessID
        });
        if (result.deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).send({ "error": "business or review not found" });
        }
    } catch (err) {
        console.error("Database error during review deletion:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.delete("/businesses/:id/photos/:photoid", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    const photoID = tryCastObjectId(req.params.photoid);
    if (!businessID || !photoID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const result = await db.collection('photos').deleteOne({
            _id: photoID,
            businessID: businessID
        });
        if (result.deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).send({ "error": "business or photo not found" });
        }
    } catch (err) {
        console.error("Database error during deletion:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/", (req, res, next) => {
    res.status(200).send();
});

app.get("/businesses/:id/reviews/:reviewid", async (req, res) => {
    const bID = tryCastObjectId(req.params.id.trim());
    const rID = tryCastObjectId(req.params.reviewid.trim());
    if (!bID || !rID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const docByIdOnly = await db.collection('reviews').findOne({ _id: rID });
        if (!docByIdOnly) {
            return res.status(404).send({ "error": "Review not found." });
        }

        // Compare using .equals() method because they are native ObjectIds now
        if (!docByIdOnly.businessID.equals(bID)) {
            return res.status(404).send({ 
                "error": "ID exists, but belongs to a different business"
            });
        }

        res.status(200).send(docByIdOnly);
    } catch (err) {
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/businesses", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    try {
        const totalCount = await db.collection('businesses').countDocuments();
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);

        const businessesPage = await db.collection('businesses')
            .find({})
            .sort({ name: 1 })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .toArray();
            
        if (businessesPage.length === 0 && page > 1) {
            return res.status(404).send({ "error": "page not found" });
        }

        res.status(200).send({
            "businesses": businessesPage,
            "pageNumber": page,
            "totalPages": totalPages,
            "pageSize": PAGE_SIZE,
            "totalCount": totalCount,
            "links": {
                "nextPage": page < totalPages ? `/businesses?page=${page + 1}` : null,
                "prevPage": page > 1 ? `/businesses?page=${page - 1}` : null,
                "lastPage": `/businesses?page=${totalPages}`
            }
        });
    } catch (err) {
        console.error("Error fetching businesses:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/businesses/:id", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const business = await db.collection('businesses').findOne({ _id: businessID });
        if (business) {
            res.status(200).send(business);
        } else {
            res.status(404).send({ "error": "business not found" });
        }
    } catch (err) {
        console.error("Database error during business lookup:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/businesses/:id/reviews", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });
    const page = parseInt(req.query.page) || 1;

    try {
        const business = await db.collection('businesses').findOne({ _id: businessID });
        if (!business) {
            return res.status(404).send({ "error": "business not found" });
        }
        const totalCount = await db.collection('reviews').countDocuments({ businessID: businessID });
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const reviews = await db.collection('reviews')
            .find({ businessID: businessID })
            .sort({ _id: -1 })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .toArray();

        res.status(200).send({
            "reviews": reviews,
            "pageNumber": page,
            "totalPages": totalPages,
            "pageSize": PAGE_SIZE,
            "totalCount": totalCount,
            "links": {
                "nextPage": page < totalPages ? `/businesses/${req.params.id}/reviews?page=${page + 1}` : null,
                "prevPage": page > 1 ? `/businesses/${req.params.id}/reviews?page=${page - 1}` : null,
                "lastPage": `/businesses/${req.params.id}/reviews?page=${totalPages}`
            }
        });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/businesses/:id/photos", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });
    const page = parseInt(req.query.page) || 1;

    try {
        const business = await db.collection('businesses').findOne({ _id: businessID });
        if (!business) {
            return res.status(404).send({ "error": "business not found" });
        }
        const totalCount = await db.collection('photos').countDocuments({ businessID: businessID });
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const photos = await db.collection('photos')
            .find({ businessID: businessID })
            .sort({ _id: 1 })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .toArray();

        res.status(200).send({
            "photos": photos,
            "pageNumber": page,
            "totalPages": totalPages,
            "pageSize": PAGE_SIZE,
            "totalCount": totalCount,
            "links": {
                "nextPage": page < totalPages ? `/businesses/${req.params.id}/photos?page=${page + 1}` : null,
                "prevPage": page > 1 ? `/businesses/${req.params.id}/photos?page=${page - 1}` : null,
                "lastPage": `/businesses/${req.params.id}/photos?page=${totalPages}`
            }
        });
    } catch (err) {
        console.error("Error fetching photos:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.get("/businesses/:id/photos/:photoid", async (req, res) => {
    const businessID = tryCastObjectId(req.params.id);
    const photoID = tryCastObjectId(req.params.photoid);
    if (!businessID || !photoID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        // FIXED: Flattened the nested query objects you had here
        const photo = await db.collection('photos').findOne({ 
            _id: photoID,
            businessID: businessID
        });

        if (photo) {
            res.status(200).send(photo);
        } else {
            res.status(404).send({ "error": "Photo not found for this business" });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.post("/businesses", checkContentType, checkBusiness, async (req, res, next) => {
    try {
        const businessData = {
            ...req.body,
            website: req.body.website || "",
            email: req.body.email || "",
            reviews: {}, 
            photos: {}
        };
        
        // FIXED: Removed manual ID hashing wrapper. Let MongoDB do it natively.
        const result = await db.collection('businesses').insertOne(businessData);
        const generatedId = result.insertedId.toString();

        res.status(201).send({
            "id": generatedId,
            "links": {
                "business": `/businesses/${generatedId}`
            }
        });
    } catch (err) {
        console.error("Failed to insert business:", err);
        res.status(500).send({ "error": "Failed to create business" });
    }
});

app.post("/businesses/:id/reviews", checkContentType, checkReview, async (req, res, next) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const business = await db.collection('businesses').findOne({ _id: businessID });
        if (!business) {
            return res.status(404).send({ "error": `Business not found` });
        }

        const newReview = {
            ...req.body,
            businessID: businessID, // Stored as a native ObjectId structure
            links: {
                business: `/businesses/${req.params.id}`
            }
        };

        const result = await db.collection('reviews').insertOne(newReview);
        const reviewId = result.insertedId.toString();

        res.status(201).send({
            "id": reviewId,
            "links": {
                "review": `/businesses/${req.params.id}/reviews/${reviewId}`,
                "business": `/businesses/${req.params.id}`
            }
        });
    } catch (err) {
        console.error("Error inserting review:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

app.post("/businesses/:id/photos", checkContentType, checkPhoto, async (req, res, next) => {
    const businessID = tryCastObjectId(req.params.id);
    if (!businessID) return res.status(400).send({ "error": "Invalid ID format" });

    try {
        const business = await db.collection('businesses').findOne({ _id: businessID });
        if (!business) {
            return res.status(404).send({ "error": "business not found" });
        }

        const newPhoto = {
            ...req.body,
            businessID: businessID, // Stored as native ObjectId
            links: {
                business: `/businesses/${req.params.id}`
            }
        };

        const result = await db.collection('photos').insertOne(newPhoto);
        const photoId = result.insertedId.toString();

        res.status(201).send({
            "id": photoId,
            "links": {
                "photo": `/businesses/${req.params.id}/photos/${photoId}`
            }
        });
    } catch (err) {
        console.error("Error adding photo:", err);
        res.status(500).send({ "error": "Internal server error" });
    }
});

function connectWithRetry() {
    console.log('Attempting to connect to MongoDB...');
    MongoClient.connect(mongoURL)
        .then(function (client) {
            db = client.db(mongoDBName);
            console.log("Successfully connected to MongoDB.");
            app.listen(port, () => {
                console.log(`========= Server is listening on port ${port} =========`);
            });
        })
        .catch(function (err) {
            console.error('MongoDB connection failed. Retrying in 5 seconds...', err.message);
            setTimeout(connectWithRetry, 5000); 
        });
}

connectWithRetry();
