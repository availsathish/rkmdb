from flask import Blueprint, request, jsonify
from src.models.database import db
from src.models.customer import Customer

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/', methods=['GET'])
def get_all_customers():
    customers = Customer.query.all()
    return jsonify({
        'success': True,
        'customers': [customer.to_dict() for customer in customers]
    }), 200

@customer_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({
            'success': False,
            'message': 'Customer not found'
        }), 404
    
    return jsonify({
        'success': True,
        'customer': customer.to_dict()
    }), 200

@customer_bp.route('/', methods=['POST'])
def create_customer():
    data = request.json
    
    # Validate required fields
    required_fields = ['company_name', 'address', 'city', 'mobile_number']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    # Validate field lengths
    if len(data['company_name']) > 100:
        return jsonify({
            'success': False,
            'message': 'Company name must be 100 characters or less'
        }), 400
    
    if len(data['address']) > 200:
        return jsonify({
            'success': False,
            'message': 'Address must be 200 characters or less'
        }), 400
    
    if len(data['city']) > 50:
        return jsonify({
            'success': False,
            'message': 'City must be 50 characters or less'
        }), 400
    
    if len(data['mobile_number']) > 20:
        return jsonify({
            'success': False,
            'message': 'Mobile number must be 20 characters or less'
        }), 400
    
    # Create new customer
    new_customer = Customer(
        company_name=data['company_name'],
        address=data['address'],
        city=data['city'],
        mobile_number=data['mobile_number']
    )
    
    db.session.add(new_customer)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Customer created successfully',
        'customer': new_customer.to_dict()
    }), 201

@customer_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({
            'success': False,
            'message': 'Customer not found'
        }), 404
    
    data = request.json
    
    # Update fields if provided
    if 'company_name' in data and data['company_name']:
        if len(data['company_name']) > 100:
            return jsonify({
                'success': False,
                'message': 'Company name must be 100 characters or less'
            }), 400
        customer.company_name = data['company_name']
    
    if 'address' in data and data['address']:
        if len(data['address']) > 200:
            return jsonify({
                'success': False,
                'message': 'Address must be 200 characters or less'
            }), 400
        customer.address = data['address']
    
    if 'city' in data and data['city']:
        if len(data['city']) > 50:
            return jsonify({
                'success': False,
                'message': 'City must be 50 characters or less'
            }), 400
        customer.city = data['city']
    
    if 'mobile_number' in data and data['mobile_number']:
        if len(data['mobile_number']) > 20:
            return jsonify({
                'success': False,
                'message': 'Mobile number must be 20 characters or less'
            }), 400
        customer.mobile_number = data['mobile_number']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Customer updated successfully',
        'customer': customer.to_dict()
    }), 200

@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({
            'success': False,
            'message': 'Customer not found'
        }), 404
    
    db.session.delete(customer)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Customer deleted successfully'
    }), 200
