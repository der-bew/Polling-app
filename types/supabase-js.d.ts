declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any;
  export type Session = any;
  export type AuthChangeEvent = any;
}
