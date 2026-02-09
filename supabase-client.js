/*
 * ⚡ BLUESTIFT - SUPABASE CLIENT v3.0 (WALLET REMOVED)
 * ✅ Waitlist management
 * ✅ Contributions & Library
 * ✅ Feedbacks
 * ✅ Admin auth
 * ❌ Wallet/Tokens completely removed
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

      console.log('✅ User joined waitlist, position:', position);

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
  // 📊 STATISTICS
  // ------------------------------------------

  async getStats() {
    const [waitlistStats, contributions, feedbacks] = await Promise.all([
      this.getWaitlistStats(),
      this.getAllContributions(),
      this.getAllFeedbacks()
    ]);

    const pending = contributions.filter(c => c.status === 'pending').length;
    const approved = contributions.filter(c => c.status === 'approved').length;
    const rejected = contributions.filter(c => c.status === 'rejected').length;

    return {
      waitlist: waitlistStats,
      contributions: {
        pending,
        approved,
        rejected,
        total: contributions.length
      },
      feedbacks: feedbacks.length
    };
  }
}

// ==========================================
// 🌐 INSTANCE GLOBALE
// ==========================================
window.BluestiftDB = new BluestiftDB();

// ==========================================
// 🔧 DEBUG COMMANDS
// ==========================================
window.BluestiftDebug = {
  loginAdmin: (email, password) => window.BluestiftDB.loginAdmin(email, password),
  getStats: () => window.BluestiftDB.getStats(),
  viewWaitlist: () => window.BluestiftDB.getWaitlist(),
  viewContributions: () => window.BluestiftDB.getAllContributions(),
  toggleDebug: () => {
    window.BluestiftDB.debugMode = !window.BluestiftDB.debugMode;
    console.log('Debug mode:', window.BluestiftDB.debugMode);
  }
};

console.log('✅ Bluestift Supabase Client v3.0 (WALLET REMOVED) loaded!');
console.log('❌ Wallet/Token system completely removed');
console.log('💡 Commands: window.BluestiftDebug');
console.log('📊 Database: window.BluestiftDB');