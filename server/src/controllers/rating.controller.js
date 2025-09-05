import Rating from "../models/rating.model.js";

// validate incomming
function normalizeRating(n) {
  const r = Number(n);
  if (!Number.isFinite(r)) return null;
  const i = Math.round(r);
  if (i < 1 || i > 5) return null;
  return i;
}

// computer avg
async function computeStats(itemId) {
  const agg = await Rating.aggregate([
    { $match: { itemId } },
    {
      $group: {
        _id: "$itemId",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, average: { $ifNull: ["$average", null] }, count: 1 },
    },
  ]);
  if (!agg.length) return { average: null, count: 0 };
  return { average: Math.round(agg[0].average * 10) / 10, count: agg[0].count };
}

// GET
export async function getRating(req, res, next) {
  try {
    const itemId = String(req.params.itemId);
    const [mine, stats] = await Promise.all([
      Rating.findOne(
        { userId: req.user.sub, itemId },
        { rating: 1, _id: 0 }
      ).lean(),
      computeStats(itemId),
    ]);
    res.json({ ...stats, myRating: mine?.rating ?? null });
  } catch (e) {
    next(e);
  }
}

// POST
export async function setRating(req, res, next) {
  try {
    const itemId = String(req.params.itemId);
    const value = normalizeRating(req.body?.rating);
    if (value == null) {
      return res.status(400).json({ error: "rating must be an integer 1..5" });
    }

    await Rating.findOneAndUpdate(
      { userId: req.user.sub, itemId },
      { $set: { rating: value } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await computeStats(itemId);
    return res.json({ myRating: value, ...stats });
  } catch (e) {
    if (e.code === 11000) {
      try {
        const value = normalizeRating(req.body?.rating);
        await Rating.updateOne(
          { userId: req.user.sub, itemId: String(req.params.itemId) },
          { $set: { rating: value } }
        );
        const stats = await computeStats(String(req.params.itemId));
        return res.json({ myRating: value, ...stats });
      } catch (err) {
        return next(err);
      }
    }
    next(e);
  }
}

// Delete
export async function removeRating(req, res, next) {
  try {
    const itemId = String(req.params.itemId);
    await Rating.deleteOne({ userId: req.user.sub, itemId });
    const stats = await computeStats(itemId);
    return res.json({ ok: true, myRating: null, ...stats });
  } catch (e) {
    next(e);
  }
}
