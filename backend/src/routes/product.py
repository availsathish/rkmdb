import os
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from src.models.database import db
from src.models.product import Product

product_bp = Blueprint('product', __name__)

# Configure upload folders
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads', 'products')
ORIGINAL_FOLDER = os.path.join(UPLOAD_FOLDER, 'original')
THUMBNAIL_FOLDER = os.path.join(UPLOAD_FOLDER, 'thumbnails')

# Create directories if they don't exist
os.makedirs(ORIGINAL_FOLDER, exist_ok=True)
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_thumbnail(image_path, thumbnail_path):
    """
    Simple file copy instead of using PIL for thumbnail generation
    """
    try:
        # Just copy the file instead of resizing
        import shutil
        shutil.copy(image_path, thumbnail_path)
        return True
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return False

@product_bp.route('/', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    return jsonify({
        'success': True,
        'products': [product.to_dict() for product in products]
    }), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            'success': False,
            'message': 'Product not found'
        }), 404
    
    return jsonify({
        'success': True,
        'product': product.to_dict()
    }), 200

@product_bp.route('/', methods=['POST'])
def create_product():
    # Handle form data for product with possible image upload
    product_name = request.form.get('product_name')
    price = request.form.get('price')
    product_type = request.form.get('product_type')
    
    # Validate required fields
    if not product_name:
        return jsonify({'success': False, 'message': 'Product name is required'}), 400
    
    if not price:
        return jsonify({'success': False, 'message': 'Price is required'}), 400
    
    if not product_type:
        return jsonify({'success': False, 'message': 'Product type is required'}), 400
    
    # Validate field lengths
    if len(product_name) > 100:
        return jsonify({'success': False, 'message': 'Product name must be 100 characters or less'}), 400
    
    if len(product_type) > 50:
        return jsonify({'success': False, 'message': 'Product type must be 50 characters or less'}), 400
    
    # Validate price is a positive number
    try:
        price_value = float(price)
        if price_value <= 0:
            return jsonify({'success': False, 'message': 'Price must be a positive number'}), 400
    except ValueError:
        return jsonify({'success': False, 'message': 'Price must be a valid number'}), 400
    
    # Initialize image-related variables
    image_filename = None
    image_path = None
    thumbnail_path = None
    
    # Handle image upload if present
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            # Generate a unique filename
            original_filename = secure_filename(file.filename)
            filename_parts = original_filename.rsplit('.', 1)
            unique_filename = f"{filename_parts[0]}_{uuid.uuid4().hex}.{filename_parts[1]}"
            
            # Save original image
            original_path = os.path.join(ORIGINAL_FOLDER, unique_filename)
            file.save(original_path)
            
            # Create thumbnail (simple copy in this version)
            thumbnail_filename = f"thumb_{unique_filename}"
            thumb_path = os.path.join(THUMBNAIL_FOLDER, thumbnail_filename)
            create_thumbnail(original_path, thumb_path)
            
            # Set image paths for database
            image_filename = original_filename
            image_path = f"/static/uploads/products/original/{unique_filename}"
            thumbnail_path = f"/static/uploads/products/thumbnails/{thumbnail_filename}"
    
    # Create new product
    new_product = Product(
        product_name=product_name,
        price=price_value,
        product_type=product_type,
        image_filename=image_filename,
        image_path=image_path,
        thumbnail_path=thumbnail_path
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Product created successfully',
        'product': new_product.to_dict()
    }), 201

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            'success': False,
            'message': 'Product not found'
        }), 404
    
    # Handle form data for product with possible image upload
    product_name = request.form.get('product_name')
    price = request.form.get('price')
    product_type = request.form.get('product_type')
    
    # Update fields if provided
    if product_name:
        if len(product_name) > 100:
            return jsonify({'success': False, 'message': 'Product name must be 100 characters or less'}), 400
        product.product_name = product_name
    
    if price:
        try:
            price_value = float(price)
            if price_value <= 0:
                return jsonify({'success': False, 'message': 'Price must be a positive number'}), 400
            product.price = price_value
        except ValueError:
            return jsonify({'success': False, 'message': 'Price must be a valid number'}), 400
    
    if product_type:
        if len(product_type) > 50:
            return jsonify({'success': False, 'message': 'Product type must be 50 characters or less'}), 400
        product.product_type = product_type
    
    # Handle image upload if present
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            # Delete old image files if they exist
            if product.image_path and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.image_path.lstrip('/'))):
                try:
                    os.remove(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.image_path.lstrip('/')))
                except Exception as e:
                    print(f"Error removing old image: {e}")
            
            if product.thumbnail_path and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.thumbnail_path.lstrip('/'))):
                try:
                    os.remove(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.thumbnail_path.lstrip('/')))
                except Exception as e:
                    print(f"Error removing old thumbnail: {e}")
            
            # Generate a unique filename
            original_filename = secure_filename(file.filename)
            filename_parts = original_filename.rsplit('.', 1)
            unique_filename = f"{filename_parts[0]}_{uuid.uuid4().hex}.{filename_parts[1]}"
            
            # Save original image
            original_path = os.path.join(ORIGINAL_FOLDER, unique_filename)
            file.save(original_path)
            
            # Create thumbnail (simple copy in this version)
            thumbnail_filename = f"thumb_{unique_filename}"
            thumb_path = os.path.join(THUMBNAIL_FOLDER, thumbnail_filename)
            create_thumbnail(original_path, thumb_path)
            
            # Update image paths in database
            product.image_filename = original_filename
            product.image_path = f"/static/uploads/products/original/{unique_filename}"
            product.thumbnail_path = f"/static/uploads/products/thumbnails/{thumbnail_filename}"
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Product updated successfully',
        'product': product.to_dict()
    }), 200

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            'success': False,
            'message': 'Product not found'
        }), 404
    
    # Delete image files if they exist
    if product.image_path and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.image_path.lstrip('/'))):
        try:
            os.remove(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.image_path.lstrip('/')))
        except Exception as e:
            print(f"Error removing image: {e}")
    
    if product.thumbnail_path and os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.thumbnail_path.lstrip('/'))):
        try:
            os.remove(os.path.join(os.path.dirname(os.path.dirname(__file__)), product.thumbnail_path.lstrip('/')))
        except Exception as e:
            print(f"Error removing thumbnail: {e}")
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Product deleted successfully'
    }), 200
