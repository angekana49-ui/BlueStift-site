// ==========================================
// BLUESTIFT-DB.JS - Public Data Layer
// Handles: waitlist, feedbacks, contributions
// Uses same Supabase project as schools-db.js
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
  // Columns: full_name, email, phone, position, is_early_bird, joined_at
  // ------------------------------------

  async function joinWaitlist({ name, email, phone, interest }) {
    const db = _getClient();
    const cleanEmail = email.toLowerCase().trim();

    // Check if already registered
    const { data: existing } = await db
      .from('waitlist')
      .select('id, position, is_early_bird')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return {
        alreadyRegistered: true,
        position: existing.position,
        isEarlyBird: existing.is_early_bird,
      };
    }

    // Get current count to assign position
    const { count, error: countError } = await db
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    const position = (count || 0) + 1;
    const isEarlyBird = position <= 500;

    const { error } = await db.from('waitlist').insert({
      full_name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || null,
      profile_type: interest?.trim() || null,
      position,
      is_early_bird: isEarlyBird,
      joined_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { alreadyRegistered: false, position, isEarlyBird };
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
  // Columns: name, email, rating, type, message, submitted_at
  // ------------------------------------

  async function submitFeedback({ name, email, rating, type, message }) {
    const db = _getClient();
    const { error } = await db.from('feedbacks').insert({
      name: name?.trim() || null,
      email: email?.trim() || null,
      rating: parseInt(rating, 10),
      type,
      message: message.trim(),
      submitted_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  // ------------------------------------
  // CONTRIBUTIONS (RAYA training)
  // Table: contributions + contribution_files
  // Storage bucket: contributions
  // Columns: contributor_name, email, title, category, description
  // ------------------------------------

  async function submitContribution(data, files) {
    const db = _getClient();

    // Insert contribution record
    const { data: contrib, error } = await db
      .from('contributions')
      .insert({
        contributor_name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        title: data.title.trim(),
        category: data.category,
        description: data.description?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Upload each file to storage
    for (const file of files) {
      const filePath = `${contrib.id}/${file.name}`;

      const { error: uploadError } = await db.storage
        .from('contributions')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = db.storage
        .from('contributions')
        .getPublicUrl(filePath);

      // Insert file record
      await db.from('contribution_files').insert({
        contribution_id: contrib.id,
        file_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        mime_type: file.type,
        file_size: file.size,
      });
    }
  }

  // ------------------------------------
  // PUBLIC API
  // ------------------------------------

  return {
    joinWaitlist,
    getWaitlistStats,
    getStats,          // alias used by debug panel
    submitFeedback,
    submitContribution,
  };
})();

console.log('🌐 BluestiftDB loaded');
