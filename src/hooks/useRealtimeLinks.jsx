import { useState, useEffect } from 'react';
import { supabase } from '../db/supabase';
import { getUserLinks, getDashboardStats, getClickAnalytics } from '../db/apiLinks';

export const useRealtimeLinks = (userId) => {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    averageClicks: 0
  });
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [linksData, statsData, analyticsData] = await Promise.all([
        getUserLinks(userId),
        getDashboardStats(userId),
        getClickAnalytics(userId)
      ]);
      
      setLinks(linksData);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    // Fetch initial data
    fetchData();

    // Subscribe to changes in the links table
    const linksSubscription = supabase
      .channel('links_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'links',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Links change detected:', payload);
          
          // Refresh data when links change
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to changes in link_clicks table (if it exists)
    const clicksSubscription = supabase
      .channel('clicks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'link_clicks',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Clicks change detected:', payload);
          
          // Refresh analytics when clicks change
          getClickAnalytics(userId).then(setAnalytics);
          getDashboardStats(userId).then(setStats);
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      linksSubscription.unsubscribe();
      clicksSubscription.unsubscribe();
    };
  }, [userId]);

  // Function to refresh data manually
  const refreshData = () => {
    fetchData();
  };

  return {
    links,
    stats,
    analytics,
    loading,
    error,
    refreshData,
    setLinks,
    setStats
  };
}; 