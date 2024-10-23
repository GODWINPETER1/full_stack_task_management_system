from app.models.role import Role
from app.models.role import Permission
from app.db.session import SessionLocal

def init_db():
    db = SessionLocal()

    # Add default roles
    admin_role = Role(name="Admin")
    editor_role = Role(name="Editor")
    viewer_role = Role(name="Viewer")

    db.add(admin_role)
    db.add(editor_role)
    db.add(viewer_role)

    # Add some permissions
    create_permission = Permission(name="create", description="Can create tasks and projects")
    edit_permission = Permission(name="edit", description="Can edit tasks and projects")
    view_permission = Permission(name="view", description="Can view tasks and projects")

    db.add(create_permission)
    db.add(edit_permission)
    db.add(view_permission)

    db.commit()
    db.close()
