/*
 * ⚡ BLUESTIFT - SUPABASE CLIENT v2.6 (FIXED)
 * ✅ Wallet auto-créé par trigger SQL
 * ✅ Gestion d'erreurs améliorée
 * 
*/

const SUPABASE_URL = 'https://xyxsuoeldkfznodblgvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eHN1b2VsZGtmem5vZGJsZ3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTM0NDUsImV4cCI6MjA3OTEyOTQ0NX0.AWxU9WIUDD7kESKKTxx9xFmCufD5EQCyGYZTIQJEqJs';

const DEBUG_MODE = false;
const BYPASS_AUTH = false;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class BluestiftDB {
  constructor() {
    this.supabase = supabase;
    this.currentUser = null;
    this.debugMode = DEBUG_MODE;
    
    if (DEBUG_MODE) {
      console.warn('⚠️ DEBUG MODE ENABLED');
    }
  }

  // ------------------------------------------
  // 🔐 AUTHENTIFICATION
  // ------------------------------------------

  async loginAdmin(email, password) {
    if (BYPASS_AUTH) {
      console.warn('⚠️ AUTH BYPASSED - Debug mode');
      this.currentUser = { email: email, id: 'debug-user-id' };
      return this.currentUser;
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new Error(`Authentication error: ${error.message}`);

      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        await this.supabase.auth.signOut();
        throw new Error("Access denied. You are not an administrator.");
      }

      this.currentUser = data.user;
      console.log('✅ Admin logged in:', data.user.email);
      return data.user;

    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async logout() {
    if (BYPASS_AUTH) {
      this.currentUser = null;
      console.log('👋 Logged out (debug mode)');
      return;
    }
    
    await this.supabase.auth.signOut();
    this.currentUser = null;
    console.log('👋 Logged out');
  }

  async getCurrentUser() {
    if (BYPASS_AUTH) {
      return this.currentUser || { email: 'debug@bluestift.com', id: 'debug-user-id' };
    }

    if (this.currentUser) return this.currentUser;

    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUser = user;
    return user;
  }

  async isAdmin() {
    if (BYPASS_AUTH) {
      console.warn('⚠️ isAdmin() bypassed - returning TRUE');
      return true;
    }

    const user = await this.getCurrentUser();
    if (!user) return false;

    const { data } = await this.supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return data?.is_admin || false;
  }

  // ------------------------------------------
  // 📝 WAITLIST
  // ------------------------------------------

  async joinWaitlist(formData) {
    try {
      // Vérifier si déjà inscrit
      const { data: existing } = await this.supabase
        .from('waitlist')
        .select('id, position, is_early_bird')
        .eq('email', formData.email.toLowerCase())
        .maybeSingle();

      if (existing) {
        return {
          alreadyRegistered: true,
          position: existing.position,
          isEarlyBird: existing.is_early_bird
        };
      }

      // Calculer position
      const { count } = await this.supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      const position = (count || 0) + 1;
      const isEarlyBird = position <= 500;

      // Insérer dans waitlist
      const { data, error } = await this.supabase
        .from('waitlist')
        .insert({
          email: formData.email.toLowerCase(),
          full_name: formData.name,
          phone: formData.phone || null,
          interest: formData.interest || null,
          position: position,
          is_early_bird: isEarlyBird
        })
        .select()
        .single();

      if (error) throw error;

      // ✅ CORRECTION: Le wallet est créé automatiquement par le trigger SQL
      // Plus besoin d'appeler createWalletForUser() ici
      console.log('✅ User joined waitlist, wallet will be auto-created by trigger');

      return {
        success: true,
        position: position,
        isEarlyBird: isEarlyBird,
        alreadyRegistered: false
      };

    } catch (error) {
      console.error('❌ Waitlist join failed:', error);
      throw error;
    }
  }

  async getWaitlist() {
    const { data, error } = await this.supabase
      .from('waitlist')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getWaitlistStats() {
    const { count: total } = await this.supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const { count: earlyBirds } = await this.supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('is_early_bird', true);

    return {
      total: total || 0,
      earlyBirds: earlyBirds || 0,
      spotsLeft: Math.max(0, 500 - (earlyBirds || 0))
    };
  }

  // ------------------------------------------
  // 💼 WALLETS
  // ------------------------------------------

  async createWalletForUser(email, isEarlyBird = false) {
    try {
      const { data, error } = await this.supabase.rpc('create_wallet_for_user', {
        p_email: email.toLowerCase(),
        p_is_early_bird: isEarlyBird
      });

      if (error) throw error;

      console.log('💼 Wallet created:', data);
      return data;

    } catch (error) {
      console.error('❌ Wallet creation failed:', error);
      throw error;
    }
  }

  async getWallet(email) {
    try {
      // 1️⃣ Récupérer le wallet
      const { data: wallet, error: walletError } = await this.supabase
        .from('wallets')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (walletError) {
        console.error('❌ Wallet fetch error:', walletError);
        throw walletError;
      }

      if (!wallet) {
        console.log('ℹ️ No wallet found for:', email);
        return null;
      }

      // 2️⃣ Récupérer l'historique séparément
      const { data: history, error: historyError } = await this.supabase
        .from('lesson_history')
        .select('lesson_id, lesson_title, tokens_earned, completed_at')
        .eq('wallet_id', wallet.id)
        .order('completed_at', { ascending: false });

      if (historyError) {
        console.warn('⚠️ History fetch failed:', historyError);
        wallet.lesson_history = [];
      } else {
        wallet.lesson_history = history || [];
      }

      return wallet;

    } catch (error) {
      console.error('❌ getWallet error:', error);
      return null;
    }
  }

  async addLessonReward(email, lessonData) {
    try {
      const { data, error } = await this.supabase.rpc('add_lesson_reward', {
        p_email: email.toLowerCase(),
        p_lesson_id: lessonData.lessonId,
        p_lesson_title: lessonData.lessonTitle,
        p_tokens_earned: lessonData.tokensEarned
      });

      if (error) throw error;

      console.log('💰 Reward added:', data);
      return data;

    } catch (error) {
      console.error('❌ Reward failed:', error);
      throw error;
    }
  }

  async getWalletStats() {
    const { count: totalUsers } = await this.supabase
      .from('wallets')
      .select('*', { count: 'exact', head: true });

    const { count: earlyBirds } = await this.supabase
      .from('wallets')
      .select('*', { count: 'exact', head: true })
      .eq('is_early_bird', true);

    const { data: totalTokens } = await this.supabase
      .from('wallets')
      .select('balance_total');

    const totalDistributed = totalTokens?.reduce((sum, w) => sum + (w.balance_total || 0), 0) || 0;

    const { data: topEarners } = await this.supabase
      .from('wallets')
      .select('email, balance_total, lessons_completed_count')
      .order('balance_total', { ascending: false })
      .limit(10);

    return {
      totalUsers: totalUsers || 0,
      earlyBirds: earlyBirds || 0,
      totalTokensDistributed: totalDistributed,
      topEarners: topEarners || []
    };
  }

  async getAllWallets() {
    const { data, error } = await this.supabase
      .from('wallets')
      .select('*')
      .order('balance_total', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // ------------------------------------------
  // 📤 CONTRIBUTIONS
  // ------------------------------------------

  async submitContribution(formData, files) {
    console.log('📤 === START CONTRIBUTION UPLOAD ===');
    console.log('📋 Form data:', formData);
    console.log('📋 Files count:', files.length);
    
    try {
      // 1️⃣ Créer la contribution
      console.log('1️⃣ Creating contribution record...');
      
      const { data: contribution, error: insertError } = await this.supabase
        .from('contributions')
        .insert({
          email: formData.email.toLowerCase(),
          contributor_name: formData.name,
          title: formData.title,
          category: formData.category,
          description: formData.description || null,
          file_count: files.length,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Contribution creation error:', insertError);
        throw insertError;
      }

      console.log('✅ Contribution created, ID:', contribution.id);

      // 2️⃣ Uploader les fichiers
      console.log('2️⃣ Uploading files to storage...');
      const uploadedFiles = [];
      const failedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        console.log(`📄 File ${i + 1}/${files.length}: ${file.name} (${fileSize} MB, ${file.type})`);
        
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${contribution.id}/${timestamp}_${randomStr}_${sanitizedName}`;
        
        console.log('   → Uploading to path:', fileName);
        
        try {
          const { data: uploadData, error: uploadError } = await this.supabase.storage
            .from('Contribute')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type || 'application/octet-stream'
            });

          if (uploadError) {
            console.error(`❌ Upload error for ${file.name}:`, uploadError);
            failedFiles.push({ 
              name: file.name, 
              error: uploadError.message || 'Unknown error'
            });
            continue;
          }

          console.log(`✅ File uploaded successfully:`, uploadData.path);

          uploadedFiles.push({
            file_name: file.name,
            file_path: uploadData.path,
            file_url: `${SUPABASE_URL}/storage/v1/object/public/Contribute/${uploadData.path}`,
            mime_type: file.type || 'application/octet-stream',
            file_size: file.size
          });

          console.log(`   → Path stored: ${uploadData.path}`);

        } catch (err) {
          console.error(`❌ Upload exception for ${file.name}:`, err);
          failedFiles.push({ 
            name: file.name, 
            error: err.message || 'Upload exception'
          });
        }
      }

      console.log(`📊 Upload summary: ${uploadedFiles.length} succeeded, ${failedFiles.length} failed`);

      // 3️⃣ Enregistrer les métadonnées
      if (uploadedFiles.length > 0) {
        console.log('3️⃣ Saving file metadata to database...');
        
        const { error: filesError } = await this.supabase
          .from('contribution_files')
          .insert(
            uploadedFiles.map(f => ({
              contribution_id: contribution.id,
              ...f
            }))
          );

        if (filesError) {
          console.error('❌ Metadata insertion error:', filesError);
          throw filesError;
        }

        console.log('✅ Metadata saved successfully');

        await this.supabase
          .from('contributions')
          .update({ file_count: uploadedFiles.length })
          .eq('id', contribution.id);

        console.log('✅ File count updated');
      }

      if (failedFiles.length > 0) {
        console.warn('⚠️ Some files failed to upload:', failedFiles);
        
        if (uploadedFiles.length === 0) {
          throw new Error(`All files failed to upload: ${failedFiles.map(f => f.error).join(', ')}`);
        } else {
          console.warn(`⚠️ ${failedFiles.length} file(s) were skipped`);
        }
      }

      console.log('✅ === CONTRIBUTION UPLOAD COMPLETE ===');
      return contribution.id;

    } catch (error) {
      console.error('❌ === GLOBAL UPLOAD ERROR ===');
      console.error('Error details:', error);
      throw error;
    }
  }

  async getAllContributions(status = null) {
    let query = this.supabase
      .from('contributions')
      .select(`
        *,
        contribution_files (
          file_name,
          file_url,
          file_path,
          mime_type
        )
      `)
      .order('submitted_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async approveContribution(contributionId) {
    const adminId = BYPASS_AUTH ? 'debug-admin-id' : this.currentUser?.id;
    if (!adminId && !BYPASS_AUTH) throw new Error('Admin login required');

    const { error } = await this.supabase.rpc('approve_contribution', {
      p_contribution_id: contributionId,
      p_admin_id: adminId
    });

    if (error) throw error;
    console.log('✅ Contribution approved:', contributionId);
  }

  async rejectContribution(contributionId, reason = null) {
    const adminId = BYPASS_AUTH ? 'debug-admin-id' : this.currentUser?.id;
    if (!adminId && !BYPASS_AUTH) throw new Error('Admin login required');

    const { error } = await this.supabase.rpc('reject_contribution', {
      p_contribution_id: contributionId,
      p_admin_id: adminId,
      p_reason: reason
    });

    if (error) throw error;
    console.log('❌ Contribution rejected:', contributionId);
  }

  async deleteContribution(contributionId) {
    console.log('🗑️ Deleting contribution:', contributionId);
    
    try {
      const { data: files, error: fetchError } = await this.supabase
        .from('contribution_files')
        .select('file_path')
        .eq('contribution_id', contributionId);
      
      if (fetchError) {
        console.error('❌ Error fetching files:', fetchError);
      }
      
      if (files && files.length > 0) {
        console.log(`🗑️ Deleting ${files.length} file(s) from storage...`);
        
        for (const file of files) {
          console.log('   → Deleting:', file.file_path);
          
          const { error: deleteError } = await this.supabase.storage
            .from('Contribute')
            .remove([file.file_path]);
          
          if (deleteError) {
            console.error('⚠️ File deletion failed:', deleteError);
          } else {
            console.log('   ✅ File deleted');
          }
        }
      }
      
      const { error } = await this.supabase
        .from('contributions')
        .delete()
        .eq('id', contributionId);

      if (error) throw error;
      
      console.log('✅ Contribution deleted successfully');
      
    } catch (error) {
      console.error('❌ Delete contribution error:', error);
      throw error;
    }
  }

  // ------------------------------------------
  // 💬 FEEDBACKS
  // ------------------------------------------

  async submitFeedback(formData) {
    const { data, error } = await this.supabase
      .from('feedbacks')
      .insert({
        email: formData.email?.toLowerCase() || null,
        name: formData.name || null,
        rating: parseInt(formData.rating),
        type: formData.type,
        message: formData.message
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Feedback submitted:', data.id);
    return data.id;
  }

  async getAllFeedbacks() {
    const { data, error } = await this.supabase
      .from('feedbacks')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteFeedback(feedbackId) {
    const { error } = await this.supabase
      .from('feedbacks')
      .delete()
      .eq('id', feedbackId);

    if (error) throw error;
    console.log('🗑️ Feedback deleted:', feedbackId);
  }

  // ------------------------------------------
  // 📚 LIBRARY
  // ------------------------------------------

  async getLibrary(category = null) {
    let query = this.supabase
      .from('library')
      .select(`
        *,
        library_files (
          file_name,
          file_url,
          file_path,
          mime_type
        )
      `)
      .order('added_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async incrementDownloadCount(libraryId) {
    const { data: current } = await this.supabase
      .from('library')
      .select('downloads_count')
      .eq('id', libraryId)
      .single();

    if (current) {
      await this.supabase
        .from('library')
        .update({ downloads_count: (current.downloads_count || 0) + 1 })
        .eq('id', libraryId);
    }
  }

  // ------------------------------------------
  // 📊 STATISTICS
  // ------------------------------------------

  async getStats() {
    const [waitlistStats, walletStats, contributions, feedbacks, library] = await Promise.all([
      this.getWaitlistStats(),
      this.getWalletStats(),
      this.getAllContributions(),
      this.getAllFeedbacks(),
      this.getLibrary()
    ]);

    const pending = contributions.filter(c => c.status === 'pending').length;
    const approved = contributions.filter(c => c.status === 'approved').length;
    const rejected = contributions.filter(c => c.status === 'rejected').length;

    return {
      waitlist: waitlistStats,
      wallets: walletStats,
      contributions: {
        pending,
        approved,
        rejected,
        total: contributions.length
      },
      feedbacks: feedbacks.length,
      library: library.length
    };
  }
}

// ==========================================
// 🌍 INSTANCE GLOBALE
// ==========================================
window.BluestiftDB = new BluestiftDB();

// ==========================================
// 🔧 COMPATIBILITY LAYER (FIXED)
// ==========================================
window.WBSPWallet = {
  createWallet: (email, isEarlyBird) => window.BluestiftDB.createWalletForUser(email, isEarlyBird),
  
  getWallet: async (email) => {
    const supabaseWallet = await window.BluestiftDB.getWallet(email);
    
    if (!supabaseWallet) return null;
    
    // ✅ Transformer structure Supabase → Ancien format
    return {
      email: supabaseWallet.email,
      isEarlyBird: supabaseWallet.is_early_bird,
      tokens: {
        signup: supabaseWallet.balance_signup || 0,
        lessons: supabaseWallet.balance_lessons || 0,
        total: supabaseWallet.balance_total || 0
      },
      lessonsCompleted: supabaseWallet.lessons_completed_count || 0,
      // ✅ CORRECTION: Utiliser lesson_history (underscore)
      lesson_history: (supabaseWallet.lesson_history || []).map(l => ({
        lessonTitle: l.lesson_title,
        lessonId: l.lesson_id,
        tokensEarned: l.tokens_earned,
        completedAt: l.completed_at
      })),
      createdAt: supabaseWallet.created_at,
      lastActivity: supabaseWallet.updated_at
    };
  },
  
  addLessonReward: async (email, lessonData) => {
    const supabaseResult = await window.BluestiftDB.addLessonReward(email, lessonData);
    
    if (!supabaseResult) return null;
    
    // ✅ Transformer résultat RPC
    return {
      success: supabaseResult.success,
      tokens_earned: supabaseResult.tokens_earned,
      new_balance: supabaseResult.new_balance,
      lessons_completed: supabaseResult.lessons_completed,
      error: supabaseResult.error
    };
  },
  
  getWalletStats: () => window.BluestiftDB.getWalletStats(),
  
  exportWallets: async () => {
    const wallets = await window.BluestiftDB.getAllWallets();
    if (wallets.length === 0) return '';
    const headers = Object.keys(wallets[0]).join(',');
    const rows = wallets.map(w => Object.values(w).map(v => `"${v}"`).join(','));
    return [headers, ...rows].join('\n');
  }
};

// ==========================================
// 🔧 DEBUG COMMANDS
// ==========================================
window.BluestiftDebug = {
  loginAdmin: (email, password) => window.BluestiftDB.loginAdmin(email, password),
  getStats: () => window.BluestiftDB.getStats(),
  viewWaitlist: () => window.BluestiftDB.getWaitlist(),
  viewContributions: () => window.BluestiftDB.getAllContributions(),
  viewWallets: () => window.BluestiftDB.getAllWallets(),
  viewLibrary: () => window.BluestiftDB.getLibrary(),
  toggleDebug: () => {
    window.BluestiftDB.debugMode = !window.BluestiftDB.debugMode;
    console.log('Debug mode:', window.BluestiftDB.debugMode);
  }
};

console.log('✅ Bluestift Supabase Client v2.6 (FIXED) loaded!');
console.log('✅ Wallet auto-créé par trigger SQL');
console.log('💡 Commands: window.BluestiftDebug');
console.log('💼 Wallet: window.WBSPWallet');
console.log('📊 Database: window.BluestiftDB');