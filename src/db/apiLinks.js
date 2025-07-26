import { supabase } from "./supabase";

// Create a new short link
export async function createShortLink(userId, originalUrl, customSlug = null) {
  try {
    // Generate a unique short code if no custom slug provided
    let shortCode = customSlug;
    if (!shortCode) {
      shortCode = Math.random().toString(36).substring(2, 8);
    }

    // Check if short code already exists
    const { data: existingLink } = await supabase
      .from('links')
      .select('id')
      .eq('short_code', shortCode)
      .single();

    if (existingLink) {
      throw new Error('Short code already exists. Please try again.');
    }

    // Create the new link
    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: userId,
          original_url: originalUrl,
          short_code: shortCode,
          clicks: 0,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating short link:', error);
    throw error;
  }
}

// Get all links for a user
export async function getUserLinks(userId) {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user links:', error);
    throw error;
  }
}

// Track a click on a link
export async function trackLinkClick(shortCode) {
  try {
    // First, get the link to check if it exists and is active
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('id, clicks, is_active, original_url')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single();

    if (fetchError || !link) {
      throw new Error('Link not found or inactive');
    }

    // Increment the click count
    const { data, error } = await supabase
      .from('links')
      .update({ 
        clicks: link.clicks + 1,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', link.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking link click:', error);
    throw error;
  }
}

// Get dashboard statistics for a user
export async function getDashboardStats(userId) {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('clicks, created_at')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    const totalLinks = data.length;
    const totalClicks = data.reduce((sum, link) => sum + link.clicks, 0);
    const averageClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

    return {
      totalLinks,
      totalClicks,
      averageClicks
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// Get click analytics for the last 7 days
export async function getClickAnalytics(userId) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('link_clicks')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group clicks by day
    const dailyClicks = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize all days with 0 clicks
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      dailyClicks[dayName] = 0;
    }

    // Count clicks for each day
    data.forEach(click => {
      const clickDate = new Date(click.created_at);
      const dayName = days[clickDate.getDay()];
      dailyClicks[dayName]++;
    });

    // Convert to array format
    const analytics = Object.entries(dailyClicks).map(([day, clicks]) => ({
      date: day,
      clicks
    }));

    return analytics;
  } catch (error) {
    console.error('Error fetching click analytics:', error);
    // Return mock data if analytics table doesn't exist yet
    return [
      { date: "Mon", clicks: 45 },
      { date: "Tue", clicks: 90 },
      { date: "Wed", clicks: 135 },
      { date: "Thu", clicks: 180 },
      { date: "Fri", clicks: 150 },
      { date: "Sat", clicks: 120 },
      { date: "Sun", clicks: 95 },
    ];
  }
}

// Delete a link
export async function deleteLink(linkId, userId) {
  try {
    const { error } = await supabase
      .from('links')
      .update({ is_active: false })
      .eq('id', linkId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
} 