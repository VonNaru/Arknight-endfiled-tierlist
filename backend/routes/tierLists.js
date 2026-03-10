import express from 'express';
import { supabase } from '../config/supabase.js';
import {
  getAllTierLists,
  getTierListById,
  createTierList,
  updateTierList,
  deleteTierList
} from '../controllers/tierListController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Tier list CRUD
router.get('/', getAllTierLists);
router.get('/:id', getTierListById);
router.post('/', authenticate, createTierList);
router.put('/:id', authenticate, updateTierList);
router.delete('/:id', authenticate, deleteTierList);

// ============================================
// TIER LIST ITEMS MANAGEMENT
// ============================================

// Add character ke tier list
router.post('/:tierListId/items', authenticate, async (req, res) => {
  try {
    const { tierListId } = req.params;
    const { character_id, tiers_id } = req.body;
    const userId = req.user.id;
    
    if (!character_id || !tiers_id) {
      return res.status(400).json({ error: 'character_id and tiers_id required' });
    }
    
    // Verify ownership
    const { data: tierList } = await supabase
      .from('tier_lists')
      .select('id')
      .eq('id', tierListId)
      .eq('user_id', userId)
      .single();
    
    if (!tierList) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { data, error } = await supabase
      .from('tier_list_items')
      .insert([{
        tier_list_id: tierListId,
        character_id,
        tiers_id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Character added to tier list', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item tier (PENTING - untuk ubah tier character di tier list)
router.put('/:tierListId/items/:itemId', authenticate, async (req, res) => {
  try {
    const { tierListId, itemId } = req.params;
    const { tiers_id } = req.body;
    const userId = req.user.id;
    
    if (!tiers_id) {
      return res.status(400).json({ error: 'tiers_id required' });
    }
    
    // Verify ownership
    const { data: tierList } = await supabase
      .from('tier_lists')
      .select('id')
      .eq('id', tierListId)
      .eq('user_id', userId)
      .single();
    
    if (!tierList) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { error } = await supabase
      .from('tier_list_items')
      .update({ tiers_id })
      .eq('id', itemId)
      .eq('tier_list_id', tierListId);
    
    if (error) throw error;
    
    res.json({ message: 'Tier updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove character dari tier list
router.delete('/:tierListId/items/:itemId', authenticate, async (req, res) => {
  try {
    const { tierListId, itemId } = req.params;
    const userId = req.user.id;
    
    // Verify ownership
    const { data: tierList } = await supabase
      .from('tier_lists')
      .select('id')
      .eq('id', tierListId)
      .eq('user_id', userId)
      .single();
    
    if (!tierList) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { error } = await supabase
      .from('tier_list_items')
      .delete()
      .eq('id', itemId)
      .eq('tier_list_id', tierListId);
    
    if (error) throw error;
    
    res.json({ message: 'Character removed from tier list' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
