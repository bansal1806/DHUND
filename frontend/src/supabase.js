import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url' && supabaseAnonKey !== 'your-supabase-anon-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.info('Supabase credentials missing. Real-time updates and cloud storage will be disabled.');
    // Mock client to prevent crashes
    supabase = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        },
        from: () => ({
            select: () => ({
                order: () => ({
                    limit: () => Promise.resolve({ data: [], error: null }),
                }),
            }),
            on: () => ({
                subscribe: () => ({ unsubscribe: () => { } }),
            }),
        }),
        channel: () => ({
            on: () => ({
                subscribe: () => ({ unsubscribe: () => { } }),
            }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
        },
        removeChannel: () => Promise.resolve(),
        removeAllChannels: () => Promise.resolve(),
    };
}

export default supabase;
