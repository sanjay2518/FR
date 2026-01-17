from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid

admin_bp = Blueprint('admin', __name__)

# Mock database - replace with real database in production
submissions_db = []
prompts_db = []

@admin_bp.route('/users', methods=['GET'])
def get_users():
    try:
        # Mock data - replace with real database query
        users = [
            {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'status': 'active', 'subscription': 'free', 'joinDate': '2024-01-10'},
            {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'status': 'active', 'subscription': 'premium', 'joinDate': '2024-01-08'}
        ]
        return jsonify({'users': users})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/toggle-status', methods=['POST'])
def toggle_user_status(user_id):
    try:
        # In production, update user status in database
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    try:
        subscriptions = [
            {'id': 1, 'user': 'Jane Smith', 'email': 'jane@example.com', 'plan': 'premium', 'status': 'active', 'startDate': '2024-01-08', 'endDate': '2025-01-08', 'amount': '$29.99'}
        ]
        stats = {'active': 1, 'revenue': 29.99, 'cancelled': 0}
        return jsonify({'subscriptions': subscriptions, 'stats': stats})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/subscriptions/<subscription_id>/cancel', methods=['POST'])
def cancel_subscription(subscription_id):
    try:
        # In production, cancel subscription in database
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/subscriptions/<subscription_id>/reactivate', methods=['POST'])
def reactivate_subscription(subscription_id):
    try:
        # In production, reactivate subscription in database
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/submissions', methods=['GET'])
def get_submissions():
    try:
        status_filter = request.args.get('status')
        filtered_submissions = submissions_db
        
        if status_filter:
            filtered_submissions = [s for s in submissions_db if s.get('status') == status_filter]
        
        return jsonify({'submissions': filtered_submissions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/submissions/<submission_id>/feedback', methods=['POST'])
def add_feedback(submission_id):
    try:
        data = request.get_json()
        score = data.get('score')
        comments = data.get('comments')
        
        # Find and update submission
        for submission in submissions_db:
            if str(submission['id']) == submission_id:
                submission['status'] = 'reviewed'
                submission['score'] = score
                submission['feedback'] = comments
                submission['reviewed_at'] = datetime.now().isoformat()
                break
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/prompts', methods=['GET'])
def get_prompts():
    try:
        return jsonify({'prompts': prompts_db})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/prompts/add', methods=['POST'])
def add_prompt():
    try:
        data = request.get_json()
        prompt = {
            'id': str(uuid.uuid4()),
            'title': data.get('title'),
            'description': data.get('description'),
            'type': data.get('type'),
            'difficulty': data.get('difficulty'),
            'created_at': datetime.now().isoformat()
        }
        prompts_db.append(prompt)
        return jsonify({'success': True, 'prompt': prompt})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/prompts/<prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    try:
        global prompts_db
        prompts_db = [p for p in prompts_db if str(p['id']) != prompt_id]
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500