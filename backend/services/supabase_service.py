from supabase import create_client, Client
from config import Config

class SupabaseService:
    def __init__(self):
        try:
            if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
                self.client = None
            else:
                self.client: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        except:
            self.client = None
    
    def signup_user(self, email, password, first_name, last_name, username):
        """Create new user with Supabase Auth"""
        if not self.client:
            raise Exception("Supabase not configured")
        try:
            # Create auth user first
            auth_response = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            
            print(f"Auth response: {auth_response}")
            
            # Insert user profile using service role client
            if auth_response.user:
                profile_data = {
                    "id": auth_response.user.id,
                    "email": email,
                    "username": username,
                    "first_name": first_name,
                    "last_name": last_name
                }
                
                print(f"Inserting profile: {profile_data}")
                
                profile_response = self.client.table('users').insert(profile_data).execute()
                print(f"Profile response: {profile_response}")
            
            return auth_response
        except Exception as e:
            print(f"Signup error: {str(e)}")
            raise e
    
    def signin_user(self, email, password):
        """Sign in user with Supabase Auth"""
        if not self.client:
            raise Exception("Supabase not configured")
        try:
            print(f"Attempting signin for: {email}")
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            print(f"Signin successful: {response.user.email if response.user else 'No user'}")
            return response
        except Exception as e:
            print(f"Signin failed: {str(e)}")
            raise e
    
    def get_user_profile(self, user_id):
        """Get user profile from users table"""
        if not self.client:
            return None
        try:
            response = self.client.table('users').select('*').eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except:
            return None
    
    def check_user_exists(self, email):
        """Check if user already exists"""
        if not self.client:
            return False
        try:
            response = self.client.table('users').select('email').eq('email', email).execute()
            return len(response.data) > 0
        except:
            return False
    
    def check_username_exists(self, username):
        """Check if username already exists"""
        if not self.client:
            return False
        try:
            response = self.client.table('users').select('username').eq('username', username).execute()
            return len(response.data) > 0
        except:
            return False

supabase_service = SupabaseService()
