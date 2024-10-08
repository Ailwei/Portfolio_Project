from flask import Flask, request, jsonify, session,redirect, url_for 
from flask_bcrypt import Bcrypt 
from flask_cors import CORS, cross_origin 
from model.model import db, User, Post, Comments, Message, Membership, Group, Reaction, BlockUser, Follow
import secrets, os
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import logging
from werkzeug.utils import secure_filename
import base64
from base64 import b64encode
from datetime import datetime
import traceback
from dotenv import load_dotenv


load_dotenv()



app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['JWT_SECRET_KEY'] = 'rT30uDfAqHbF'
jwt = JWTManager(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
 
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
    email = request.json["email"]
    profile_picture = request.json.get("profile_picture", None)
    password = request.json["password"]
    comfirm_password = request.json["comfirm_password"]
    
 
    user_email_exists = User.query.filter_by(email=email).first() is not None
 
    if user_email_exists:
        return jsonify({"error": "Email already exists"}), 409
    
   # hashed_password = bcrypt.generate_password_hash(password)
    #hashed_comfirm_password = bcrypt.generate_password_hash(comfirm_password)
    
    new_user = User(
    first_name=first_name,
    last_name=last_name,
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
    
    profile_picture_base64 = ''
    if user.profile_picture:
        profile_picture_base64 = base64.b64encode(user.profile_picture).decode('utf-8')
    
    profile = {
        'fullName': f'{user.first_name} {user.last_name}',
        'profile_picture': profile_picture_base64,
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
    
    profile_picture_base64 = None
    if user.profile_picture:
        profile_picture_base64 = base64.b64encode(user.profile_picture).decode('utf-8')
    
    profile = {
        'userId': user.user_id,
        'fullName': f'{user.first_name} {user.last_name}',
        'profile_picture': profile_picture_base64,
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

@app.route('/update_profile', methods=['GET', 'POST'])
@jwt_required()
def get_or_update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if request.method == 'GET':
        # Return user profile data
        profile_picture_base64 = base64.b64encode(user.profile_picture).decode('utf-8') if user.profile_picture else None
        return jsonify({
            'user_id': user.user_id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile_picture': profile_picture_base64  # Send base64 encoded profile picture
        })
        
    elif request.method == 'POST':
        # Check if the request contains a base64 encoded image
        if 'profile_picture' in request.json:
            profile_picture_data = request.json['profile_picture']
            # Decode base64 image data
            profile_picture_bytes = base64.b64decode(profile_picture_data)
            # Update the user's profile_picture field with the decoded image data
            user.profile_picture = profile_picture_bytes
            
            user.mimetype = request.json.get('mimetype')
  
        # Update other user profile fields if present in the request JSON
        if 'first_name' in request.json:
            user.first_name = request.json['first_name']
        if 'last_name' in request.json:
            user.last_name = request.json['last_name']
        if 'email' in request.json:
            user.email = request.json['email']

        try:
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

        
@app.route('/create_post', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = get_jwt_identity()

    title = request.form.get('title')
    content = request.form.get('content')
    group_id = request.form.get('group_id')
    post_thumbnail = request.files.get('post_thumbnail')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400
    
    if group_id is not None and not is_valid_group(group_id):
        return jsonify({'error': 'Invalid group_id'}), 400

    if not post_thumbnail:
        return jsonify({'error': 'Post thumbnail is required'}), 400

    # Upload the image
    filename = secure_filename(post_thumbnail.filename)
    post_thumbnail_data = post_thumbnail.read()

    # Create the post with the uploaded image data
    new_post = Post(title=title, content=content, user_id=current_user_id, group_id=group_id, post_thumbnail=post_thumbnail_data, mimetype=post_thumbnail.mimetype)
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
        
        profile_picture_base64 = None
        if author and author.profile_picture:
            profile_picture_base64 = base64.b64encode(author.profile_picture).decode('utf-8')

        thumbnail_base64 = None
        if post.post_thumbnail:
            thumbnail_base64 = base64.b64encode(post.post_thumbnail).decode('utf-8')
        
        serialized_post = {
            'id': post.post_id,
            'title': post.title,
            'content': post.content,
            'group_id': post.group_id,
            'user_id': post.user_id,
            'profile_picture': profile_picture_base64,
            'post_thumbnail': thumbnail_base64,  # Include Base64-encoded thumbnail
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
    
    # Convert post thumbnail and profile picture to Base64 string
    post_thumbnail_base64 = None
    if post.post_thumbnail:
        post_thumbnail_base64 = b64encode(post.post_thumbnail).decode('utf-8')
        
    profile_picture_base64 = None
    if author.profile_picture:
        profile_picture_base64 = b64encode(author.profile_picture).decode('utf-8')

    serialized_post = {
        'id': post.post_id,  
        'title': post.title,
        'content': post.content,
        'group_id': post.group_id,
        'user_id': post.user_id,
        'profile_picture': profile_picture_base64,
        'post_thumbnail': post_thumbnail_base64,  # Convert binary thumbnail to Base64 string
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
    
    print("Group ID:", group_id)
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
    # Extract current user ID from JWT token
    current_user_id = get_jwt_identity()

    # Extract group_id from request JSON data
    data = request.json
    group_id = data.get('group_id')

    # Log current user ID and group ID
    logging.info(f"Current User ID: {current_user_id}, Group ID before querying the database: {group_id}")

    # Retrieve the group from the database
    group = Group.query.get(group_id)

    # Check if the group exists
    if not group:
        return jsonify({'error': 'Group not found'}), 404

    # Retrieve the membership entry for the user and group
    membership = Membership.query.filter_by(user_id=current_user_id, group_id=group_id).first()

    # If user is not a member of the group, return an error response
    if not membership:
        return jsonify({'error': 'User is not a member of this group'}), 400

    # If the current user is the owner of the group
    if current_user_id == group.user_id:
        # Check if there are other members in the group
        if Membership.query.filter_by(group_id=group_id).count() > 1:
            # Transfer ownership to another member
            new_owner_membership = Membership.query.filter(Membership.group_id == group_id, Membership.user_id != current_user_id).first()
            group.user_id = new_owner_membership.user_id
            
            # Update the role of the new owner to admin
            new_owner_membership.user_role = 'admin'
        else:
            # Delete the group
            db.session.delete(group)

    # Delete the Membership entry for the user and group
    db.session.delete(membership)
    db.session.commit()

    # Return a success message
    return jsonify({'message': 'User left the group successfully'}), 200

# endpoint to get all group joined  by current user

@app.route('/groups_joined', methods=['GET'])
@jwt_required()
def get_groups_joined():
    try:
        # Get the current user's ID from the JWT token
        current_user_id = get_jwt_identity()

        # Retrieve the memberships of the current user
        memberships = Membership.query.filter_by(user_id=current_user_id).all()

        # Extract group IDs from the memberships
        group_ids = [membership.group_id for membership in memberships]

        # Retrieve the groups joined by the current user
        groups = Group.query.filter(Group.group_id.in_(group_ids)).all()

        # Create a list of group data
        groups_data = [{
            'id': group.group_id,
            'name': group.group_name
        } for group in groups]
        
        logging.info(f"Groups joined by user {current_user_id}: {groups_data}")

        return jsonify({'groups': groups_data}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Endpoint to get all groups and meberships

@app.route('/groups', methods=['GET'])
@jwt_required()
def get_groups_with_memberships():
    try:
        # Fetch all groups with their associated memberships
        groups = Group.query.all()
        groups_data = []
        current_user_id = get_jwt_identity()  # Get the current user's ID from the JWT token
        for group in groups:
            group_data = {
                'group_id': group.group_id,
                'group_name': group.group_name,
                'description': group.description,
                'members': []
            }
            memberships = Membership.query.filter_by(group_id=group.group_id).all()
            for membership in memberships:
                member_data = {
                    'user_id': membership.user_id,
                    'user_role': membership.user_role
                }
                group_data['members'].append(member_data)
            
            # Check if current user is a member of this group
            group_data['is_member'] = any(member['user_id'] == current_user_id for member in group_data['members'])
            
            groups_data.append(group_data)
            
            
        logging.info('Groups data retrieved successfully: %s', groups_data)  # Log retrieved groups

        return jsonify({'groups': groups_data}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group_details(group_id):
    try:
        # Fetch the group details by group_id
        group = Group.query.filter_by(group_id=group_id).first()
        if not group:
            return jsonify({'error': 'Group not found'}), 404

        # Fetch all members of the group
        memberships = Membership.query.filter_by(group_id=group_id).all()
        members = [{'user_id': membership.user_id, 'user_role': membership.user_role} for membership in memberships]

        # Check if the current user is a member of this group
        current_user_id = get_jwt_identity()
        is_member = any(member['user_id'] == current_user_id for member in members)

        group_data = {
            'group_id': group.group_id,
            'group_name': group.group_name,
            'description': group.description,
            'members': members,
            'is_member': is_member
        }

        return jsonify({'group': group_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/view_members/<int:group_id>', methods=['GET'])
@jwt_required()
def view_members(group_id):
    current_user = get_jwt_identity()
    
    # Check if the group exists
    if group_id not in groups:
        return jsonify(message='Group not found'), 404

    # Check if the current user is a member of the group
    if group_id not in user_groups.get(current_user, []):
        return jsonify(message='You are not a member of this group'), 403

    # Retrieve members of the group
    group_members = groups[group_id]
    return jsonify(group_id=group_id, members=group_members), 200
    
    
@app.route('/joined_groups/<int:group_id>', methods=['GET'])
@jwt_required()
def groups_joined(group_id):
    try:
        # Join the Membership and User tables to retrieve full names
       
        # Retrieve the group details
        group = Group.query.filter_by(group_id=group_id).first()

        if group:
            # Retrieve the group memberships
            memberships = db.session.query(Membership, User).join(User).filter(Membership.group_id == group_id).all()


            # Collect membership details
            memberships_data = []
            app.logger.info(f"Memberships retrieved for group {group_id}:")
            for membership, user in memberships:
                app.logger.info(f"User Full Name: {user.first_name} {user.last_name}, User Role: {membership.user_role}")
            
                user = User.query.get(membership.user_id)
                if user:
                    user_data = {
                        'user_id': user.user_id,
                        'full_name': f"{user.first_name} {user.last_name}",
                        'user_role': membership.user_role
                    }
                    memberships_data.append(user_data)

            # Construct the response data
            group_data = {
                'id': group.group_id,
                'name': group.group_name,
                'description': group.description,
                'memberships': memberships_data
            }
            return jsonify({'group': group_data}), 200
        else:
            return jsonify({'error': 'Group not found'}), 404

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

     
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
        user_id=current_user_id,  # Set the sender ID
        is_sender_inbox=True,       # Indicate that the sender is the current user
    )
    db.session.add(message)
    db.session.commit()
    
    return jsonify({'message': 'Message sent successfully'}), 200

@app.route('/get_user_id', methods=['GET'])
@jwt_required()
def get_user_id():
    current_user_id = get_jwt_identity()
    return {'userId': current_user_id}, 200

@app.route('/get_messages/<int:user_id>', methods=["GET"])
@jwt_required()
def get_messages(user_id):
    # Get the current user ID
    current_user_id = get_jwt_identity()

    # Check if the requested user ID matches the current user ID
    if user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access to messages'}), 403

    # Query the messages for the specified user
    messages = Message.query.filter_by(user_id=user_id).all()

    # Serialize the messages data
    messages_data = []
    for message in messages:
        message_type = 'inbox' if message.is_sender_inbox == 1 else 'outbox'
        message_info = {'content': message.content, 'created_at': message.created_at, 'type': message_type}
        messages_data.append(message_info)

    return jsonify({'messages': messages_data}), 200

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

@app.route('/follow/<int:user_id>', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    current_user_id = get_jwt_identity()
    
     # Check if the user is trying to follow themselves
     
    if current_user_id == user_id:
        return jsonify({'error': 'You cannot follow yourself'}), 400
    
     # Check if the follow relationship already exists
     
    existing_follow = Follow.query.filter_by(user_id=current_user_id, followed_user_id=user_id).first()
    if existing_follow:
        return jsonify({'error': 'You have already followed this user'}), 400

    # Create a new Follow instance
    
    follow = Follow(followed_user_id=user_id, user_id=current_user_id)
    db.session.add(follow)
    db.session.commit()

    return jsonify({'message': 'User followed successfully'})

@app.route('/unfollow/<int:user_id>', methods=['POST'])
@jwt_required()  # Require JWT authentication
def unfollow_user(user_id):
    # Get the current user ID from the JWT token
    current_user_id = get_jwt_identity()

    # Check if the user is trying to unfollow themselves
    if current_user_id == user_id:
        return jsonify({'error': 'You cannot unfollow yourself'}), 400

    # Check if the follow relationship exists
    existing_follow = Follow.query.filter_by(user_id=current_user_id, followed_user_id=user_id).first()
    if not existing_follow:
        return jsonify({'error': 'You are not following this user'}), 400

    # Delete the follow relationship from the database
    db.session.delete(existing_follow)
    db.session.commit()

    return jsonify({'message': 'User unfollowed successfully'}), 200

@app.route('/followed_users', methods=['GET'])
@jwt_required()
def get_followed_users():
    current_user_id = get_jwt_identity() 
    followed_users = Follow.query.filter_by(user_id=current_user_id).all() 
    followed_user_ids = [followed_user.followed_user_id for followed_user in followed_users]
    return jsonify({'followed_users': followed_user_ids}), 200


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    category = request.args.get('category')

    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    if category == 'users':
        results = User.query.filter((User.first_name + ' ' + User.last_name).ilike(f'%{query}%')).all()
        data = [{'user_id': user.user_id, 'full_name': f'{user.first_name} {user.last_name}'} for user in results]
    elif category == 'groups':
        results = Group.query.filter(Group.group_name.ilike(f'%{query}%')).all()
        data = [{'id': group.group_id, 'name': group.group_name} for group in results]
    elif category == 'posts':
        results = Post.query.filter(Post.title.ilike(f'%{query}%') | Post.content.ilike(f'%{query}%')).all()
        data = [{'id': post.post_id, 'title': post.title, 'content': post.content} for post in results]
    elif category == 'all' or not category:
        user_results = User.query.filter((User.first_name + ' ' + User.last_name).ilike(f'%{query}%')).all()
        group_results = Group.query.filter(Group.group_name.ilike(f'%{query}%')).all()
        post_results = Post.query.filter(Post.title.ilike(f'%{query}%') | Post.content.ilike(f'%{query}%')).all()
        
        data = {
            'users': [{'user_id': user.user_id, 'full_name': f'{user.first_name} {user.last_name}'} for user in user_results],
            'groups': [{'id': group.group_id, 'group_name': group.group_name} for group in group_results],
            'posts': [{'id': post.post_id, 'title': post.title, 'content': post.content} for post in post_results]
        }
    else:
        return jsonify({'error': 'Invalid category'}), 400

    return jsonify(data)
# create new reaction

@app.route('/reactions', methods=['POST'])
@jwt_required()
def create_reactions():
    try:
        data = request.json
        current_user_id = get_jwt_identity()

        post_id = data.get('post_id')
        created_at = data.get('created_at')
        activity_type = data.get('activity_type', 0)
        
        print('Received reaction data:', data)

        existing_reaction = Reaction.query.filter_by(post_id=post_id, user_id=current_user_id).first()

        if existing_reaction:
            # If the reaction exists and activity_type is 1 (like), delete the existing reaction
            if activity_type == 1:
                db.session.delete(existing_reaction)
        else:
            # If the reaction doesn't exist and activity_type is 1 (like), create a new Reaction object
            if activity_type == 1:
                new_reaction = Reaction(
                    activity_type=1,
                    user_id=current_user_id,
                    post_id=post_id,
                    created_at=datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%S.%fZ")
                )
                db.session.add(new_reaction)

        db.session.commit()
        print('Reaction updated successfully') 

        return jsonify({'message': 'Reaction updated successfully'})
    except KeyError as e:
        error_message = 'Missing required field: {}'.format(e)
        logging.error(error_message)
        return jsonify({'error': error_message}), 400
    except Exception as e:
        error_message = 'Internal server error: {}'.format(e)
        logging.error(error_message)
        return jsonify({'error': error_message}), 500


    
# get reactions for post
@app.route('/posts/<int:post_id>/reactions', methods=['GET'])
def get_post_reactions(post_id):
    post = Post.query.get_or_404(post_id)
    reactions = Reaction.query.filter_by(post_id=post_id).all()
    
    # Count the number of likes for this post
    likes_count = Reaction.query.filter_by(post_id=post_id, activity_type=1).count()
    
    # Prepare response data
    response_data = {
        'reactions': [reaction.activity_type for reaction in reactions],
        'likes_count': likes_count
    }
    print(f'Likes count for post {post_id}: {likes_count}')
    
    return jsonify(response_data)

import base64

@app.route('/get_friends', methods=['GET'])
@jwt_required()
def get_current_user_friends():
    try:
        current_user_id = get_jwt_identity()
        logging.info(f'Current user ID from JWT: {current_user_id}')
        
        friend_type = request.args.get('type')  # Retrieve the type of friends to fetch: followers or following

        current_user = User.query.get(current_user_id)
        if current_user:
            if friend_type == 'followers':
                friends = db.session.query(User).join(Follow, Follow.user_id == User.user_id)\
                    .filter(Follow.followed_user_id == current_user_id).all()
            elif friend_type == 'following':
                friends = db.session.query(User).join(Follow, Follow.followed_user_id == User.user_id)\
                    .filter(Follow.user_id == current_user_id).all()
            else:
                return jsonify({"error": "Invalid friend type. Use 'followers' or 'following'."}), 400

            friends_data = [{
                'user_id': friend.user_id,
                'first_name': friend.first_name,
                'last_name': friend.last_name,
                'profile_picture': base64.b64encode(friend.profile_picture).decode('utf-8') if friend.profile_picture else 'default',
            } for friend in friends]

            logging.info(f'{friend_type.capitalize()} data: {friends_data}')
            return jsonify(friends_data)
        else:
            logging.error('Current user not found')
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logging.error(f'Error occurred: {e}')
        return jsonify({"error": "An error occurred"}), 500