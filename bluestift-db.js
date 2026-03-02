// ==========================================
// BLUESTIFT-DB.JS - Public Data Layer
// Handles: waitlist, feedbacks, contributions
// ==========================================

window.BluestiftDB = (() => {
  let _client = null;

  function _getClient() {
    if (_client) return _client;
    if (typeof window.supabase === 'undefined' || typeof SUPABASE_CONFIG === 'undefined') {
      throw new Error('Supabase not initialized. Make sure config.js is loaded first.');
    }
    _client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return _client;
  }

  // ------------------------------------
  // WAITLIST
  // Table: waitlist
  // position   → set automatically by trigger set_waitlist_position()
  // is_early_bird → GENERATED column (position <= 500), never set manually
  // ------------------------------------

  async function joinWaitlist({ name, email, interest }) {
    const db = _getClient();
    const cleanEmail = email.toLowerCase().trim();

    // Check if already registered
    const { data: existing } = await db
      .from('waitlist')
      .select('position, is_early_bird')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return {
        alreadyRegistered: true,
        position: existing.position,
        isEarlyBird: existing.is_early_bird,
      };
    }

    // Insert — trigger assigns position, generated column sets is_early_bird
    const { data, error } = await db
      .from('waitlist')
      .insert({
        full_name:    name.trim(),
        email:        cleanEmail,
        profile_type: interest?.trim() || null,
        signup_source: 'web',
      })
      .select('position, is_early_bird')
      .single();

    if (error) throw error;

    return {
      alreadyRegistered: false,
      position:    data.position,
      isEarlyBird: data.is_early_bird,
    };
  }

  async function getWaitlistStats() {
    const db = _getClient();
    const { count, error } = await db
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    const total = count || 0;
    return { total, spotsLeft: Math.max(0, 500 - total) };
  }

  // Alias used by the debug panel in script.js
  const getStats = getWaitlistStats;

  // ------------------------------------
  // FEEDBACKS
  // Table: feedbacks
  // ------------------------------------

  async function submitFeedback({ name, email, rating, type, message }) {
    const db = _getClient();
    const { error } = await db.from('feedbacks').insert({
      name:         name?.trim() || null,
      email:        email?.trim() || null,
      rating:       parseInt(rating, 10),
      type,
      message:      message.trim(),
      submitted_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  // ------------------------------------
  // CONTRIBUTIONS (RAYA training data)
  // Table: contributions (storage_path, file_count)
  // Storage bucket: Contributions/{contribution_id}/
  // contribution_files table has been removed — Storage is the source of truth
  // ------------------------------------

  async function submitContribution(data, files) {
    const db = _getClient();

    // Insert contribution record
    const { data: contrib, error } = await db
      .from('contributions')
      .insert({
        contributor_name: data.name.trim(),
        email:            data.email.trim().toLowerCase(),
        title:            data.title.trim(),
        category:         data.category,
        description:      data.description?.trim() || null,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Upload each file to storage
    let uploadedCount = 0;
    for (const file of files) {
      const filePath = `${contrib.id}/${file.name}`;

      const { error: uploadError } = await db.storage
        .from('Contributions')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError.message);
        continue;
      }

      uploadedCount++;
    }

    // Update storage reference and file count on the contribution row
    if (uploadedCount > 0) {
      await db
        .from('contributions')
        .update({
          storage_path: `${contrib.id}/`,
          file_count:   uploadedCount,
        })
        .eq('id', contrib.id);
    }
  }

  // ------------------------------------
  // PUBLIC API
  // ------------------------------------

  return {
    joinWaitlist,
    getWaitlistStats,
    getStats,
    submitFeedback,
    submitContribution,
  };
})();

console.log('BluestiftDB loaded');
