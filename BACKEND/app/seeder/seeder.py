from sqlalchemy.orm import Session
from app.models.roles import Role , Permission , RolePermission 




def seed_roles_and_permissions(db: Session):
    roles = ["Admin", "Editor", "Viewer"]
    permissions = ["create_task", "edit_task", "delete_task", "view_task", "create_project", "delete_project"]

    # Add roles
    for role_name in roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
    
    # Add permissions
    for perm_name in permissions:
        permission = db.query(Permission).filter(Permission.name == perm_name).first()
        if not permission:
            permission = Permission(name=perm_name)
            db.add(permission)

    db.commit()

    # Example: Assign all permissions to Admin role
    admin_role = db.query(Role).filter(Role.name == "Admin").first()
    for permission in db.query(Permission).all():
        role_perm = db.query(RolePermission).filter(RolePermission.role_id == admin_role.id, RolePermission.permission_id == permission.id).first()
        if not role_perm:
            role_perm = RolePermission(role_id=admin_role.id, permission_id=permission.id)
            db.add(role_perm)

    db.commit()
