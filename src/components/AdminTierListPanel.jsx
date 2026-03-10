import { useState, useEffect } from 'react';
import { getTierLists, createTierList, updateTierList, deleteTierList } from '../api/tierListService';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    width: '100%'
  },
  title: {
    color: '#fff',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  errorBox: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    color: '#ff6666',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #ff4444'
  },
  successBox: {
    backgroundColor: 'rgba(68, 200, 100, 0.1)',
    color: '#66ff88',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #44c864'
  },
  formContainer: {
    backgroundColor: '#1a1a2e',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #333'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#aaa'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #333',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0f0f1e',
    color: '#fff'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #333',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    minHeight: '80px',
    resize: 'vertical',
    backgroundColor: '#0f0f1e',
    color: '#fff'
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
    backgroundColor: '#667eea',
    color: 'white'
  },
  buttonCancel: {
    backgroundColor: '#666',
    color: 'white'
  },
  tierListsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px'
  },
  tierListCard: {
    backgroundColor: '#1a1a2e',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  tierListHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px'
  },
  tierListInfo: {
    flex: 1
  },
  tierListName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 5px 0'
  },
  tierListDescription: {
    fontSize: '12px',
    color: '#999',
    margin: 0
  },
  tierListActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  buttonEdit: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#667eea',
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
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  }
};

function AdminTierListPanel({ user }) {
  const [tierLists, setTierLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false
  });

  // Load tier lists on mount
  useEffect(() => {
    loadTierLists();
  }, []);

  const loadTierLists = async () => {
    try {
      setLoading(true);
      const data = await getTierLists();
      setTierLists(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tier lists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (tierList) => {
    setEditingId(tierList.id);
    setFormData({
      name: tierList.name,
      description: tierList.description || '',
      is_public: tierList.is_public || false
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      is_public: false
    });
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name || !formData.name.trim()) {
      setError('Tier list name is required');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateTierList(editingId, formData);
        setSuccess('Tier list updated successfully!');
      } else {
        await createTierList(formData);
        setSuccess('Tier list created successfully!');
      }
      await loadTierLists();
      handleCancel();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tierListId, tierListName) => {
    if (!confirm(`Are you sure you want to delete tier list "${tierListName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteTierList(tierListId);
      setSuccess(`Tier list "${tierListName}" deleted successfully!`);
      await loadTierLists();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && tierLists.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading tier lists...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Manage Tier Lists</h2>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      {/* Form */}
      <div style={styles.formContainer}>
        <h3 style={{ color: '#fff', marginTop: 0, fontSize: '16px' }}>
          {editingId ? '✏️ Edit Tier List' : '➕ Create New Tier List'}
        </h3>

        <form onSubmit={handleSave}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tier List Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Character Tier List"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="e.g., My personal character ranking"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
                style={{ marginRight: '8px', width: 'auto' }}
              />
              Make this tier list public
            </label>
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

      {/* Tier Lists */}
      <div>
        <h3 style={{ color: '#fff', margin: '20px 0 15px', fontSize: '16px' }}>
          📋 Tier Lists ({tierLists.length})
        </h3>

        {tierLists.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No tier lists created yet. Create your first tier list above!</p>
          </div>
        ) : (
          <div style={styles.tierListsList}>
            {tierLists.map(tierList => (
              <div key={tierList.id} style={styles.tierListCard}>
                <div style={styles.tierListHeader}>
                  <div style={styles.tierListInfo}>
                    <h4 style={styles.tierListName}>{tierList.name}</h4>
                    <p style={styles.tierListDescription}>
                      {tierList.is_public ? '🌐 Public' : '🔒 Private'}
                    </p>
                  </div>
                </div>

                {tierList.description && (
                  <p style={{ margin: '10px 0', fontSize: '13px', color: '#999' }}>
                    {tierList.description}
                  </p>
                )}

                <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                  Created: {new Date(tierList.created_at).toLocaleDateString()}
                </p>

                <div style={styles.tierListActions}>
                  <button
                    onClick={() => handleEdit(tierList)}
                    style={styles.buttonEdit}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tierList.id, tierList.name)}
                    style={styles.buttonDelete}
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

export default AdminTierListPanel;