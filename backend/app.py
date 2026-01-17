from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from services.supabase_service import supabase_service

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return {'message': 'Flask + Supabase API'}

@app.route('/health')
def health():
    try:
        if not supabase_service.client:
            return {'status': 'unhealthy', 'database': 'not configured'}, 503
        supabase_service.client.table('users').select('count').limit(1).execute()
        return {'status': 'healthy', 'database': 'connected'}, 200
    except:
        return {'status': 'unhealthy', 'database': 'disconnected'}, 503

if __name__ == '__main__':
    app.run(debug=True, port=5000)
