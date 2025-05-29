from datetime import datetime
from src.models.database import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    product_type = db.Column(db.String(50), nullable=False)
    image_filename = db.Column(db.String(255))
    image_path = db.Column(db.String(255))
    thumbnail_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product_name,
            'price': float(self.price) if self.price else 0.0,
            'product_type': self.product_type,
            'image_filename': self.image_filename,
            'image_path': self.image_path,
            'thumbnail_path': self.thumbnail_path,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
