import traceback
from fastapi import HTTPException
from database.conn import Session
from database.model_class import User, UserInfo, UserPermission
from sqlalchemy.orm import joinedload
from service.user_service.models import UserCreateRequest, UserUpdateRequest

def users_list_service(page: int, pageSize: int):
    try:
        session = Session()
        offset = (page - 1) * pageSize
        query = session.query(User)\
                       .options(joinedload(User.info), joinedload(User.permissions))\
                       .order_by(User.id.asc())\
                       .offset(offset)\
                       .limit(pageSize)
                       
        # Fetch all users with their info and permissions
        users = query.all()
        
        # Prepare the response data
        response = []
        for u in users:
            user_data = {
                "id": u.id,
                "username": u.username,
                "permission": u.permissions.permission if u.permissions else None,
                "full_name": u.info.full_name if u.info else None,
                "contact": u.info.contact if u.info else None,
                "email": u.info.email if u.info else None
            }
            response.append(user_data)
        
        # Total count of users
        total = session.query(User).count()
        
        # Close the session
        session.close()
        
        # Return the result as a JSON object
        result = {"users": response, "total": total}
        return result
        
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"users": [], "total": 0}
    

def create_user_service(user_data: UserCreateRequest):
    session = Session()
    try:
        # Create a new user object
        new_user = User(username=user_data.username, password=user_data.password)

        # Add user info if provided
        if user_data.info:
            new_user.info = UserInfo(
                full_name=user_data.info.full_name,
                email=user_data.info.email,
                contact=user_data.info.contact
            )

        # Add user permissions if provided
        if user_data.permission:
            new_user.permissions = UserPermission(permission=user_data.permission)

        # Add new user to session, commit changes, and refresh the object to get its ID
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Prepare the response data
        created_user = {
            "id": new_user.id,
            "username": new_user.username,
            "full_name": new_user.info.full_name if new_user.info else None,
            "email": new_user.info.email if new_user.info else None,
            "contact": new_user.info.contact if new_user.info else None,
            "permission": new_user.permissions.permission if new_user.permissions else None
        }

        return created_user
    except Exception as e:
        session.rollback()
        traceback.print_exc()
        raise e
    finally:
        session.close()

def update_user_service(user_id: int, updated_user_data: UserUpdateRequest):
    try:
        session = Session()
        user_to_update = session.query(User).filter(User.id == user_id).first()
        
        if not user_to_update:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
        
        if updated_user_data.password:
            user_to_update.password = updated_user_data.password
            
        if 'username' in updated_user_data:
            user_to_update.username = updated_user_data.username
        
        if updated_user_data.info:
            info_data = updated_user_data.info
            if user_to_update.info:
                user_to_update.info.full_name = info_data.full_name
                user_to_update.info.email = info_data.email
                user_to_update.info.contact = info_data.contact
            else:
                user_to_update.info = UserInfo(
                    full_name=info_data.full_name,
                    email=info_data.email,
                    contact=info_data.contact
                )
        
        if updated_user_data.permission:
            permission_data = updated_user_data.permission
            if user_to_update.permissions:
                user_to_update.permissions.permission = permission_data
            else:
                user_to_update.permissions = UserPermission(permission=permission_data)
        
        session.commit()
        session.refresh(user_to_update)
        
        updated_user = {
            "id": user_to_update.id,
            "username": user_to_update.username,
            "full_name": user_to_update.info.full_name if user_to_update.info else None,
            "email": user_to_update.info.email if user_to_update.info else None,
            "contact": user_to_update.info.contact if user_to_update.info else None,
            "permission": user_to_update.permissions.permission if user_to_update.permissions else None
        }
        
        return updated_user
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def delete_user_service(user_id: int):
    try:
        session = Session()

        user_to_delete = session.query(User).filter(User.id == user_id).first()
        
        if user_to_delete.info:
            session.delete(user_to_delete.info)
        if user_to_delete.permissions:
            session.delete(user_to_delete.permissions)
            
        if not user_to_delete:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
        
        session.delete(user_to_delete)
        session.commit()
        
    except Exception as e:
        session.rollback()
        traceback.print_exc()
        raise e
    finally:
        session.close()