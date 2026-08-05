import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://gqgtzeapgmtjznyogkio.supabase.co'


const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3R6ZWFwZ210anpueW9na2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTg5OTksImV4cCI6MjA4NzAzNDk5OX0.IT57Tg2MNvYDPBqrh-dVwHCFm4okqSWLelNgnWLqV3c'

export const supabase = createClient(supabaseUrl, supabaseKey)