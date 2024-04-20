from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, VARCHAR, Text, BLOB, Sequence, ForeignKey, DateTime, func, or_
from sqlalchemy.orm import relationship
from sqlalchemy.exc import IntegrityError

db = SQLAlchemy()
  
class User(db.Model):
    __tablename__ = "user"
    
    user_id = db.Column(db.Integer, Sequence('user_id_seq'), primary_key=True, autoincrement=True)
    first_name = db.Column(db.VARCHAR(50), nullable=False)
    last_name = db.Column(db.VARCHAR(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.VARCHAR(50), nullable=False)
    comfirm_password = db.Column(db.VARCHAR(50), nullable=False)
    profile_picture = db.Column(db.BLOB, nullable=True)
    mimetype =db.Column(db.TEXT, nullable=True)
    
    comments = db.relationship('Comments', back_populates="user")
    post = relationship("Post", back_populates="user")
    message = relationship("Message", back_populates="user")
    group = relationship("Group", back_populates="user")
    membership = relationship("Membership", back_populates="user")
    blockuser = relationship("BlockUser", back_populates="user")
    reaction = relationship("Reaction", back_populates="user")
    
    
    __table_args__ = (
        db.CheckConstraint("first_name IS NOT NULL"),
        db.CheckConstraint("last_name IS NOT NULL"),
        db.CheckConstraint("user_name IS NOT NULL"),
        db.CheckConstraint("email IS NOT NULL"),
        db.CheckConstraint("password IS NOT NULL"),
        db.CheckConstraint("comfirm_password IS NOT NULL")
        
    )
    
class Post(db.Model):
    __tablename__ = "post"
    post_id = db.Column(db.Integer, Sequence('post_id_seq'), primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.user_id'))
    group_id = db.Column(db.Integer, ForeignKey('group.group_id'), nullable=True)
    post_thumbnail = Column(BLOB)
    created_at = db.Column(db.DateTime, default=func.now())
    mimetype = db.Column(db.Text, nullable=False)
    
    comments = db.relationship('Comments', back_populates="post")
    group = relationship("Group", back_populates="post")
    user = relationship("User", back_populates="post")
    reaction = relationship("Reaction", back_populates="post")
    
    ##def serialize(self):
        #return {
            #'id': self.post_id,
            #'title': self.title,
            #'content': self.content,
            #'group_id': self.group_id,
            #'user_id': self.user_id,
            #'post_thumbnail': self.post_thumbnail,
            #'author': f"{self.user.first_name} {self.user.last_name}",
            #'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S") 
            ##}
            
class Message(db.Model):
    __tablename__ = "message"
    message_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    is_sender_inbox = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    
    user = relationship("User", back_populates="message")
    #membership = relationship("Membership", back_populates="message")


class Group(db.Model):
    __tablename__ = "group"
    group_id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.VARCHAR(50), nullable=False)
    group_name = db.Column(db.VARCHAR(255), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    user_id = db.Column(db.Integer, ForeignKey('user.user_id'))
  
    user = relationship("User", back_populates="group")
    membership = relationship("Membership", back_populates="group")
    #reaction = relationship("Reaction", back_populates="group")
    post = relationship("Post", back_populates="group")
    blockuser = relationship("BlockUser", back_populates="group")
    
class Membership(db.Model):
    __tablename__ = "membership"
    member_id = db.Column(db.Integer, Sequence('member_id_seq'), primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.user_id'))
    group_id = db.Column(db.Integer, ForeignKey('group.group_id'))
    user_role =db.Column(db.VARCHAR(50), nullable=False)
    
    user = relationship("User", back_populates="membership")
    group = relationship("Group", back_populates="membership")
    #message = relationship("Message", back_populates="membership")
    
class BlockUser(db.Model):
    __tablename__ = 'blockeduser'
    block_id = db.Column(db.Integer, Sequence('blockuser_id_seq'), primary_key=True)
    status = db.Column(db.VARCHAR(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id'))
    
    user = relationship("User", back_populates="blockuser")
    group = relationship("Group", back_populates="blockuser")


class Reaction(db.Model):
    __tablename__ = 'reaction'
    reaction_id = db.Column(db.Integer, Sequence('reaction_id_seq'), primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False)
    target_type = db.Column(db.VARCHAR(50), nullable=False)
    target_id = db.Column(db.Integer, nullable=False)
    actvity_type = db.Column(db.VARCHAR(50), nullable=False)
    comment = Column(VARCHAR(255) , nullable=True)
    
    user_id = db.Column(db.Integer, ForeignKey('user.user_id'))
    post_id = db.Column(db.Integer, ForeignKey('post.post_id'))
    #group_id = db.Column(db.Integer, ForeignKey('group.group_id'))
    
    user = relationship("User", back_populates="reaction")
    post = relationship("Post", back_populates="reaction")
   # group = relationship("Group", back_populates="reaction")
    
class Comments(db.Model):
    __tablename__ = 'comments'
    comment_id = db.Column(db.Integer,Sequence('reaction_id_seq'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.post_id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime,  default=func.now())
    
    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")