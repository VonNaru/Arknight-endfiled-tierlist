import { useState, useEffect } from 'react';
import { getTiers, createTier, updateTier, deleteTier } from '../api/tierService';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    maxWidth: '900px'
  },
  title: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #f5c6cb'
  },
  successBox: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #c3e6cb'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ddd'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  },
  colorInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    height: '40px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    minHeight: '80px',
    resize: 'vertical'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  button: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  },
  buttonSave: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
    color: 'white'
  },
  buttonAdd: {
    backgroundColor: '#17a2b8',
    color: 'white'
  },
  tiersList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px'
  },
  tierCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  tierHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px'
  },
  colorBox: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    border: '2px solid #333',
    flexShrink: 0
  },
  tierInfo: {
    flex: 1
  },
  tierName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0'
  },
  tierColor: {
    fontSize: '12px',
    color: '#666',
    margin: 0
  },
  tierActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  buttonEdit: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  buttonDelete: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: 'px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px'
  },
  colorPreview: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '5px'
  },
  colorPreviewBox: {
    width: '30px',
    height: '30px',
    borderRadius: '3px',
    border: '1px solid #ddd'
  }
};

function AdminTierPanel() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color_code: '#FFD700',
    description: '',
    display_order: 0
  });

  // Load tiers on mount
  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      setLoading(true);
      const data = await getTiers();
      setTiers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tiers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value
    }));
  };

  const handleEdit = (tier) => {
    setEditingId(tier.id);
    setFormData({
      name: tier.name,
      color_code: tier.color_code,
      description: tier.description || '',
      display_order: tier.display_order || 0
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      color_code: '#FFD700',
      description: '',
      display_order: 0
    });
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name || !formData.name.trim()) {
      setError('Tier name is required');
      return;
    }
    if (!formData.color_code || !formData.color_code.trim()) {
      setError('Color code is required');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateTier(editingId, formData);
        setSuccess('Tier updated successfully!');
      } else {
        await createTier(formData);
        setSuccess('Tier created successfully!');
      }
      await loadTiers();
      handleCancel();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tierId, tierName) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tier "${tierName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteTier(tierId);
      setSuccess(`Tier "${tierName}" deleted successfully!`);
      await loadTiers();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && tiers.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading tiers...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Manage Tiers</h2>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      {/* Form */}
      <div style={styles.formContainer}>
        <h3 style={{ color: '#333', marginTop: 0 }}>
          {editingId ? '✏️ Edit Tier' : '➕ Create New Tier'}
        </h3>

        <form onSubmit={handleSave}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tier Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., S, A, B, C, D"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Color Code *</label>
            <input
              type="color"
              name="color_code"
              value={formData.color_code}
              onChange={handleInputChange}
              style={styles.colorInput}
            />
            <div style={styles.colorPreview}>
              <div
                style={{
                  ...styles.colorPreviewBox,
                  backgroundColor: formData.color_code
                }}
              />
              <span style={{ fontSize: '12px', color: '#666' }}>
                {formData.color_code}
              </span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="e.g., Tier tertinggi, sangat recommended"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.buttonSave }}
              disabled={loading}
            >
              💾 {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{ ...styles.button, ...styles.buttonCancel }}
                disabled={loading}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tiers List */}
      <div>
        <h3 style={{ color: '#333', margin: '20px 0 15px' }}>
          📋 Tiers List ({tiers.length})
        </h3>

        {tiers.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No tiers created yet. Create your first tier above!</p>
          </div>
        ) : (
          <div style={styles.tiersList}>
            {tiers.map(tier => (
              <div key={tier.id} style={styles.tierCard}>
                <div style={styles.tierHeader}>
                  <div
                    style={{
                      ...styles.colorBox,
                      backgroundColor: tier.color_code
                    }}
                  />
                  <div style={styles.tierInfo}>
                    <h4 style={styles.tierName}>{tier.name}</h4>
                    <p style={styles.tierColor}>{tier.color_code}</p>
                  </div>
                </div>

                {tier.description && (
                  <p style={{ margin: '10px 0', fontSize: '13px', color: '#666' }}>
                    {tier.description}
                  </p>
                )}

                <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                  Order: {tier.display_order}
                </p>

                <div style={styles.tierActions}>
                  <button
                    onClick={() => handleEdit(tier)}
                    style={styles.buttonEdit}
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id, tier.name)}
                    style={styles.buttonDelete}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTierPanel;
