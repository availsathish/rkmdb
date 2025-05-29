import os
import sys
# DON'T CHANGE THIS LINE
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from src.models.database import db
from src.routes.customer import customer_bp
from src.routes.product import product_bp
import os

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///customer_product.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

# Ensure upload directories exist
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'products'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'thumbnails'), exist_ok=True)

# Initialize database
db.init_app(app)

# Register blueprints with API prefix
app.register_blueprint(customer_bp, url_prefix='/api/customers')
app.register_blueprint(product_bp, url_prefix='/api/products')

# Create database tables
with app.app_context():
    db.create_all()

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# API health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'API is running'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
