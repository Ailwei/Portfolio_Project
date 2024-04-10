# CommunityHub: User Interaction and Management

## Introduction

Welcome to the CommunityHub's User Interaction and Management documentation! This repository serves as a comprehensive guide for managing user interactions within the CommunityHub platform. Whether you're a developer integrating these functionalities or a user exploring the available features, this documentation covers all aspects of user interaction and management.

CommunityHub offers a platform for users to engage with communities, create and join groups, share posts, and communicate with other users. The API routes, endpoints, and class methods outlined in this documentation facilitate seamless user interactions and effective management of community engagement.

Please refer to the sections below for detailed information on API routes, endpoints, and the user interaction storyboard within the CommunityHub platform.

## Overview

This repository contains API routes and endpoints for managing user interactions within a web client environment. These routes facilitate user registration, authentication, profile management, post creation, group management, messaging, and more. Additionally, the repository includes a storyboard detailing user interaction scenarios and acceptance criteria.

## API Routes for Web Client Communication

### User Authentication and Registration
- **POST /api/user/login:** Allows users to log in with their credentials.
- **POST /api/user/logout:** Logs out the authenticated user, invalidating the session.
- **POST /api/user/register:** Allows users to register for a new account.

### User Profile Management
- **GET /api/user/profile:** Retrieves the user's profile information.
- **PUT /api/user/profile:** Updates the user's profile information.
- **DELETE /api/user/profile:** Deletes the user's account.

### User Management
- **GET /api/user/:id:** Retrieves information about a specific user.
- **PUT /api/user/:id:** Updates user information.
- **DELETE /api/user/:id:** Deletes the user.

### User Follow/Following
- **POST /api/user/:id/follow:** Allows a user to follow another user.
- **DELETE /api/user/:id/follow:** Allows a user to unfollow another user.

### Group Management
- **POST /api/groups:** Allows a user to create a new group.
- **GET /api/groups:** Retrieves a list of groups.
- **GET /api/groups/:id:** Retrieves information about a specific group.
- **PUT /api/groups/:id:** Updates group information.
- **DELETE /api/groups/:id:** Deletes the group.

### Post Management
- **POST /api/posts:** Allows a user to create a public post.
- **GET /api/posts:** Retrieves a list of public posts.
- **GET /api/posts/:id:** Retrieves information about a specific public post.
- **PUT /api/posts/:id:** Updates the content of a public post.
- **DELETE /api/posts/:id:** Allows the creator of the post to delete it.

### Comment Management
- **POST /api/posts/:id/comments:** Allows a user to add a comment to a public post.
- **GET /api/posts/:id/comments:** Retrieves comments for a specific public post.
- **GET /api/comments/:id:** Retrieves information about a specific comment.
- **PUT /api/comments/:id:** Updates the content of a comment.
- **DELETE /api/comments/:id:** Deletes a comment.

### Voting on Posts and Comments
- **POST /api/posts/:id/vote:** Allows a user to upvote or downvote a public post.
- **POST /api/comments/:id/vote:** Allows a user to upvote or downvote a comment.

### Messaging
- **POST /api/messages:** Allows a user to send a private message to another user.
- **GET /api/messages:** Retrieves a list of messages for the authenticated user.
- **GET /api/messages/:id:** Retrieves information about a specific message.
- **DELETE /api/messages/:id:** Allows the sender to delete a message.

## API Endpoints or Functions/Methods for Other Clients

### User Class Methods
- `getPublicPosts()`
- `getPublicPostById(postId)`
- `getBlockedUsers(userId)`

### Group Class Methods
- `getGroups(userId)`
- `getAdminGroups(userId)`
- `isAdmin(groupId, userId)`

### Blocking Class Methods
- `getBlockedUsers(userId)`

### Post Class Methods
- `getPublicPosts()`
- `getPublicPostById(postId)`

### Comment Class Methods
- `getComments(postId)`

### Message Class Methods
- `sendMessage(senderId, receiverId, messageContent)`
- `getMessages(userId)`
- `getMessageById(messageId)`
- `deleteMessage(messageId)`

### Group Class Methods
- `createGroup(userId, groupName, description)`
- `getGroupById(groupId)`
- `updateGroup(groupId, groupName, description)`
- `deleteGroup(groupId)`

## Storyboard: User Interaction and Management

**Title:** User Interaction and Management

**Objective:** As a registered user, I want to have full control over my interactions with other users and groups, so that I can engage with the community, manage my groups, and control my privacy and notifications effectively.

**Acceptance Criteria:**

1. **Registration and Login:**
   - Users should have the option to register for an account if they don't already have one.
   - Registered users should be able to log in to their accounts securely.

2. **Dashboard and Navigation:**
   - After logging in, users should be directed to a dashboard or navigation menu.
   - The dashboard/menu should provide easy access to various actions, including following other users, sending messages, creating posts, creating groups, and managing group memberships.

3. **Following Users:**
   - Users should be able to follow/unfollow other users to receive notifications when they post new content.

4. **Messaging:**
   - Users should have the ability to send private messages to other users.

5. **Creating and Sharing Posts:**
   - Users should be able to create new posts and share them with the community.

6. **Group Creation and Management:**
   - Users should be able to create new groups and automatically become the admin of those groups.
   - Group admins should have the authority to manage group settings, approve or decline membership requests, post announcements, and remove members.

7. **Blocking Users:**
   - Users should have the ability to block other users, preventing them from sending messages or interacting with the user's content.

8. **Leaving Groups:**
   - Users should be able to leave groups they have joined, removing themselves from the group membership.

9. **Notifications:**
   - Users should receive notifications when the users they are following post new content or when significant events occur within their groups.
   - Users should have the option to adjust notification settings, including frequency and type of notifications received.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This API documentation is inspired by real-world user interaction scenarios and requirements.
- Special thanks to the development team for their contributions to the project.
