from flask import Flask, request, jsonify, session,redirect, url_for 
from flask_bcrypt import Bcrypt 
from flask_cors import CORS, cross_origin 
from models import db, User, Post, Comments, Message, Membership, Group, Reaction, BlockUser
import secrets
import os
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import logging
import base64

 
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'rT30uDfAqHbF'
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/portfolioprojectdb'
 
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True
  
bcrypt = Bcrypt(app) 
CORS(app, supports_credentials=True)
db.init_app(app)
  
with app.app_context():
    db.create_all()
    
@app.route("/")
def hello_world():
    return "Hello, World!"
 
@app.route("/signup", methods=["POST"])
def signup():
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    user_name = request.json["user_name"]
    email = request.json["email"]
    profile_picture = request.json.get("profile_picture", None)
    password = request.json["password"]
    comfirm_password = request.json["comfirm_password"]
    
 
    user_email_exists = User.query.filter_by(email=email).first() is not None
 
    if user_email_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    
    user_name_exists = User.query.filter_by(user_name=user_name).first() is not None
    
    if user_name_exists:
        return jsonify({"error": "Username already exists"}), 409
    
   # hashed_password = bcrypt.generate_password_hash(password)
    #hashed_comfirm_password = bcrypt.generate_password_hash(comfirm_password)
    
    new_user = User(
    first_name=first_name,
    last_name=last_name,
    user_name=user_name,
    email=email,
    password=password,
    comfirm_password=comfirm_password,
   
)
    db.session.add(new_user)
    db.session.commit()
 
    #session["user_id"] = new_user.user_id
 
    return jsonify({
        "id": new_user.user_id,
        "email": new_user.email
    })
    
@app.route('/view_current_user_profile', methods=["GET"])
@jwt_required()
def get_user_profile():
    current_user_id = get_jwt_identity()
    
    # Fetch user profile
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    profile = {
        'fullName': f'{user.first_name} {user.last_name}',
        'profilePicture': user.profile_picture,
        'groups': [{'id': group.group_id, 'name': group.group_name} for group in user.group],
        'memberships': [{'id': membership.member_id, 'groupName': membership.group.group_name} for membership in user.membership],
        'ownedGroups': [{'id': owned_group.group_id, 'name': owned_group.group_name} for owned_group in user.group if owned_group.user_id == current_user_id]
    }
    return jsonify(profile), 200

@app.route('/view_user_profile/<int:user_id>', methods=["GET"])
@jwt_required()
def view_user_profile(user_id):
    current_user_id = get_jwt_identity()
    
    if current_user_id == user_id:
        return jsonify({'error': 'You cannot view your own profile'}), 403

    # Fetch user profile
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    profile = {
        'fullName': f'{user.first_name} {user.last_name}',
        'profilePicture': user.profile_picture,
        'groups': [{'id': group.group_id, 'name': group.group_name} for group in user.group],
        'memberships': [{'id': membership.member_id, 'groupName': membership.group.group_name} for membership in user.membership],
        'ownedGroups': [{'id': owned_group.group_id, 'name': owned_group.group_name} for owned_group in user.group if owned_group.user_id == user_id]
    }
    return jsonify(profile), 200      
 

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

   
    
    if not email or not password:
        return jsonify({"error": "Email and password are required fields"}), 400
        
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User not found"}), 404
    if user.password != password:
        return jsonify({"error": "Invali password"}), 401

    
    access_token = create_access_token(identity=user.user_id)
    return jsonify({"access_token": access_token}), 200

@app.route('/update_profile', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # For GET request, return user data (excluding sensitive fields)
    if request.method == 'GET':
        return jsonify({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile_picture': user.profile_picture
        })

    # For POST request, handle profile picture upload if not provided
    if request.method == 'POST' and 'profile_picture' in request.files:
        profile_picture_file = request.files['profile_picture']
        if profile_picture_file:
            
            profile_picture_data = profile_picture_file.read()
            profile_picture_data = base64.b64encode(profile_picture_file.read()).decode('utf-8')
            
            user.profile_picture = profile_picture_data
            db.session.commit()
            return jsonify({'message': 'Profile picture uploaded successfully'}), 200
        else:
            return jsonify({'error': 'No profile picture provided in the request'}), 400

    # For PUT request, update user profile data
    if request.method == 'PUT':
        first_name = request.json.get('first_name')
        last_name = request.json.get('last_name')
        email = request.json.get('email')
        user_name = request.json.get('user_name')

        # Update user profile fields
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if email:
            user.email = email

        # Update profile picture if provided
        if 'profile_picture' in request.files:
            profile_picture_file = request.files['profile_picture']
            if profile_picture_file:
             
                profile_picture_data = base64.b64encode(profile_picture_file.read()).decode('utf-8')
               
                user.profile_picture = profile_picture_data

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200

    return jsonify({'error': 'Invalid request method'}), 405



@app.route('/create_post', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = get_jwt_identity()

    title = request.json.get('title')
    content = request.json.get('content')
    group_id = request.json.get('group_id')
    post_thumbnail = request.files.get('post_thumbnail')
 
    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    if group_id is not None and not is_valid_group(group_id):
        return jsonify({'error': 'Invalid group_id'}), 400



    new_post = Post(title=title, content=content, user_id=current_user_id, group_id=group_id)
    
    if post_thumbnail:
        thumbnail_data = post_thumbnail.read()
        new_post.post_thumbnail = thumbnail_data
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully'}), 201


@app.route('/get_posts', methods=['GET'])
@jwt_required(optional=True)
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    current_user_id = get_jwt_identity()
    if current_user_id:
        general_posts = Post.query.filter_by(group_id=None)
        user_groups = Membership.query.filter_by(user_id=current_user_id).all()
        group_posts = []
        for group in user_groups:
            posts = Post.query.filter_by(group_id=group.group_id)
            group_posts.extend(posts)
        all_posts = general_posts.union(*group_posts)
    else:
        all_posts = Post.query.filter_by(group_id=None)

    # Paginate the posts
    paginated_posts = all_posts.paginate(page=page, per_page=per_page)

    serialized_posts = []
    for post in paginated_posts.items:
        author = User.query.get(post.user_id)
        author_name = f"{author.first_name} {author.last_name}" if author else "Unknown"
        serialized_post = {
            'id': post.post_id,  
            'title': post.title,
            'content': post.content,
            'group_id': post.group_id,
            'user_id': post.user_id,
            'post_thumbnail': post.post_thumbnail,
            'created_at': post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'author_full_name': author_name  # Include author's full name
        }
        serialized_posts.append(serialized_post)

    return jsonify({
        'posts': serialized_posts,
        'total_posts': paginated_posts.total,
        'current_page': paginated_posts.page,
        'total_pages': paginated_posts.pages
    }), 200
    
@app.route('/get_post/<int:postId>', methods=['GET'])
@jwt_required(optional=True)
def get_post(postId):
    post = Post.query.get(postId)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    author = User.query.get(post.user_id)
    author_name = f"{author.first_name} {author.last_name}" if author else "Unknown"
    serialized_post = {
        'id': post.post_id,  
        'title': post.title,
        'content': post.content,
        'group_id': post.group_id,
        'user_id': post.user_id,
        'post_thumbnail': post.post_thumbnail,
        'created_at': post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        'author_full_name': author_name  # Include author's full name
    }

    return jsonify(serialized_post), 200
@app.route('/create_group', methods=['POST'])
@jwt_required()
def create_group():
    group_name = request.json.get('group')
    description = request.json.get('description')
    current_user_id = get_jwt_identity()
    
    app.logger.info(f"Group Name: {group_name}, Description: {description}, Current User ID: {current_user_id}")
    new_group = Group(group_name=group_name, description=description, user_id=current_user_id)
    db.session.add(new_group)
    db.session.commit()
    
    app.logger.info(f"New Group ID: {new_group.group_id}")
    
    user_role = 'admin'
    new_membership = Membership(user_id=current_user_id, group_id=new_group.group_id, user_role=user_role)
    db.session.add(new_membership)
    db.session.commit()
    
    return jsonify({'message': 'Group created successfully'}), 201
    
    
@app.route('/join_group', methods=['POST'])
@jwt_required()
def join_group():
    current_user_id = get_jwt_identity()
    data = request.json
    group_id = data.get('group_id')

    group = Group.query.get(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    # Check if the user is already a member of the group
    existing_membership = Membership.query.filter_by(user_id=current_user_id, group_id=group_id).first()
    if existing_membership:
        return jsonify({'message': 'User is already a member of this group'}), 200

    # Create a new Membership entry for the user and group
    new_membership = Membership(user_id=current_user_id, group_id=group_id, user_role='member')
    db.session.add(new_membership)
    db.session.commit()

    return jsonify({'message': 'User joined the group successfully'}), 200

# Route for users to leave a group
@app.route('/leave_group', methods=['POST'])
@jwt_required()
def leave_group():
    current_user_id = get_jwt_identity()
    data = request.json
    group_id = data.get('group_id')
    
    print("Current user ID:", current_user_id)
    print("Group ID before querying the database:", group_id)
    logging.info(f"Current user ID: {current_user_id}, Group ID before querying the database: {group_id}")
    

    # Retrieve the group from the database
    group = Group.query.get(group_id)
    
    print("Group ID after querying the database:", group_id)
    logging.info(f"Group ID after querying the database: {group_id}")
   

    # Check if the current user is a member of the group
    membership = Membership.query.filter_by(user_id=current_user_id, group_id=group_id).first()
    print("Membership status for user:", membership)
    if not membership:
        return jsonify({'error': 'User is not a member of this group'}), 400

    # Delete the Membership entry for the user and group
    db.session.delete(membership)
    db.session.commit()
    print("Membership entry deleted successfully")

    return jsonify({'message': 'User left the group successfully'}), 200

# Route for admin to remove a user from a group
@app.route('/remove_user_from_group', methods=['POST'])
@jwt_required()
def remove_user_from_group():
    current_user_id = get_jwt_identity()
    data = request.json
    user_id = data.get('user_id')
    group_id = data.get('group_id')

    # Check if the current user is an admin of the group
    membership = Membership.query.filter_by(user_id=current_user_id, group_id=group_id, user_role='admin').first()
    if not membership:
        return jsonify({'error': 'Unauthorized'}), 403

    # Remove the user from the group
    membership_to_remove = Membership.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not membership_to_remove:
        return jsonify({'error': 'User is not a member of this group'}), 400

    db.session.delete(membership_to_remove)
    db.session.commit()

    # Optionally, remove the user's posts from the group
    posts_to_delete = Post.query.filter_by(user_id=user_id, group_id=group_id).all()
    for post in posts_to_delete:
        db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'User removed from group successfully'}), 200

# Route for admin to remove a post from a group
@app.route('/remove_post', methods=['POST'])
@jwt_required()
def remove_post():
    current_user_id = get_jwt_identity()
    data = request.json
    post_id = data.get('post_id')

    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    # Check if the current user is authorized to delete the post (e.g., admin or post owner)
    if current_user_id != post.user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post removed from group successfully'}), 200

def user_exists(user_id):
    user = User.query.get(user_id)
    return user is not None

@app.route('/send_message/<int:user_id>', methods=["POST"])
@jwt_required()
def send_message(user_id):
    data = request.json
    current_user_id = get_jwt_identity()
    content = data.get('content')
    
    # Validate content
    if content is None or content.strip() == '':
        return jsonify({'error': 'Message content cannot be empty'}), 400
    
    # Check if receiver exists
    receiver = User.query.get(user_id)
    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404
    
    # Check if sender exists
    sender = User.query.get(current_user_id)
    if not sender:
        return jsonify({'error': 'Sender not found'}), 404
    
    # Create a new message
    message = Message(
        content=content,
        sender_id=current_user_id,  # Set the sender ID
        receiver_id=user_id,        # Set the receiver ID
        is_sender_inbox=True,       # Indicate that the sender is the current user
    )
    db.session.add(message)
    db.session.commit()
    
    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/messages/<int:message_id>', methods=["GET"])
@jwt_required()
def get_message(message_id):
    current_user_id = get_jwt_identity()
    
    # Fetch the message
    message = Message.query.get(message_id)
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # Check if the current user is the sender or receiver of the message
    if current_user_id != message.sender_id and current_user_id != message.receiver_id:
        return jsonify({'error': 'Unauthorized access to this message'}), 403
    
    # Construct message details
    message_detail = {
        'id': message.id,
        'content': message.content,
        'sender_id': message.sender_id,
        'receiver_id': message.receiver_id,
        'is_sender_inbox': message.is_sender_inbox,
        'created_at': message.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    }
    
    return jsonify({'message': message_detail}), 200

@app.route('/messages/<int:message_id>/reply', methods=["POST"])
@jwt_required()
def reply_to_message(message_id):
    data = request.json
    current_user_id = get_jwt_identity()
    content = data.get('content')
    
    # Validate content
    if content is None or content.strip() == '':
        return jsonify({'error': 'Reply content cannot be empty'}), 400
    
    # Fetch the message
    message = Message.query.get(message_id)
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    # Check if the current user is the sender or receiver of the message
    if current_user_id != message.sender_id and current_user_id != message.receiver_id:
        return jsonify({'error': 'Unauthorized reply to this message'}), 403
    
    # Determine the recipient of the reply
    recipient_id = message.sender_id if current_user_id == message.receiver_id else message.receiver_id
        
    # Create a new message as a reply
    reply_message = Message(
        content=content,
        sender_id=current_user_id,
        receiver_id=recipient_id,
        is_sender_inbox=True,
    )
    db.session.add(reply_message)
    db.session.commit()
    
    return jsonify({'message': 'Reply sent successfully'}), 200

@app.route('/inbox', methods=["GET"])
@jwt_required()
def inbox():
    current_user_id = get_jwt_identity()
    
    # Fetch all messages where the current user is the receiver
    received_messages = Message.query.filter_by(receiver_id=current_user_id).all()
    
    # Construct a list of received message details
    received_message_details = [{
        'id': message.id,
        'content': message.content,
        'sender_id': message.sender_id,
        'receiver_id': message.receiver_id,
        'is_sender_inbox': message.is_sender_inbox,
        'created_at': message.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    } for message in received_messages]
    
    return jsonify({'inbox_messages': received_message_details}), 200

@app.route('/sent', methods=["GET"])
@jwt_required()
def sent():
    current_user_id = get_jwt_identity()
    
    # Fetch all messages where the current user is the sender
    sent_messages = Message.query.filter_by(sender_id=current_user_id).all()
    
    # Construct a list of sent message details
    sent_message_details = [{
        'id': message.id,
        'content': message.content,
        'sender_id': message.sender_id,
        'receiver_id': message.receiver_id,
        'is_sender_inbox': message.is_sender_inbox,
        'created_at': message.created_at.strftime('%Y-%m-%d %H:%M:%S'),
    } for message in sent_messages]
    
    return jsonify({'sent_messages': sent_message_details}), 200


@app.route('/block_user', methods=['POST'])
@jwt_required()
def block_user():
    current_user_id = get_jwt_identity()
    
    data = request.json
    user_id = data.get('user_id')
    group_id = data.get('group_id')
    # Check if the user is already blocked
    existing_block = BlockUser.query.filter_by(user_id=user_id, block_id=current_user_id, group_id=group_id).first()
    if existing_block:
        return jsonify({'message': 'User is already blocked'}), 200
    
    # Block the user
    block_user = BlockUser(status='blocked', user_id=user_id, block_id=current_user_id, group_id=group_id)
    db.session.add(block_user)
    db.session.commit()
    
    return jsonify({'message': 'User blocked successfully'}), 200

@app.route('/unblock_user', methods=['POST'])
@jwt_required()
def unblock_user(user_id):
    current_user_id = get_jwt_identity()
    
    # Check if the user is blocked
    block_record = BlockUser.query.filter_by(user_id=user_id, block_id=current_user_id).first()
    if not block_record:
        return jsonify({'error': 'User is not blocked'}), 404
    
    # Unblock the user
    db.session.delete(block_record)
    db.session.commit()
    
    return jsonify({'message': 'User unblocked successfully'}), 200


@app.route('/edit_post/<int:postId>', methods=['PUT'])
@jwt_required()
def edit_post(postId):
    current_user_id = get_jwt_identity()
    post = Post.query.filter_by(id=postId).first()
    
    if post and post.user_id == current_user_id:
        data = request.get_json()
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        
        db.session.commit()
        return jsonify({'message': 'Post updated'}), 200
    else:
        return jsonify ({'error': 'Post not found or unauthoried'}), 404
        
@app.route('/delete_post/<int:postId>', methods=['DELETE'])
@jwt_required()
def delete_post(postId):
    current_user_id = get_jwt_identity()
    post = Post.query.filter_by(id=postId).first()
    
    if post and post.user_id == current_user_id:
        db.session.delete(post)
        db.session.commit()
        return jsonify({'Message': 'Post deleted successfully'}), 200
    else:
        return jsonify({'error': 'Post not found or authathorized'})
    
        
@app.route('/add_comment/<int:post_id>', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    comment_content = data.get('comment')
    
    if comment_content is None:
        return jsonify({'error': "Please provide a comment"}), 400
    
    new_comment = Comments(user_id=current_user_id, post_id=post_id, comment=comment_content)
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({'message': 'Your comment was successfully added'}), 200

@app.route('/get_comments/<int:post_id>')
def get_comments(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({'error': 'Post not found'}), 404
    
    comments = post.comments
    
    def generate_full_name(user):
        return f"{user.first_name} {user.last_name}"

    comments_data = []
    for comment in comments:
        user = User.query.get(comment.user_id)
        if user:
            full_name = generate_full_name(user)
            comments_data.append({
                
                'comment_id': comment.comment_id,
                'comment': comment.comment,
                'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'user_full_name': full_name
            })
    return jsonify(comments_data)

    
    