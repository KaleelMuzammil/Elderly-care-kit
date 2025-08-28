const { Router } = require('express')
const medicine = require('../models/medicine')
const auth  = require('../mw/auth')

const router = Router()

// List medicines for the logged-in user
router.get('/', auth, async (req, res) => {
  const items = await Medicine.find({ userId: req.user.sub }).sort({ createdAt: -1 })
  res.json(items)
})

// Create medicine for the logged-in user
router.post('/', auth, async (req, res) => {
  const med = await Medicine.create({ ...req.body, userId: req.user.sub })
  res.status(201).json(med)
})

// Update a medicine (owned by the user)
router.put('/:id', auth, async (req, res) => {
  const updated = await Medicine.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.sub },
    req.body,
    { new: true }
  )
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
})

// Delete a medicine (owned by the user)
router.delete('/:id', auth, async (req, res) => {
  const r = await Medicine.deleteOne({ _id: req.params.id, userId: req.user.sub })
  if (!r.deletedCount) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

module.exports = router
