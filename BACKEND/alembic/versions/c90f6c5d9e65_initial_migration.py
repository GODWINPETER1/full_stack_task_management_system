"""Initial migration

Revision ID: c90f6c5d9e65
Revises: 7f3e95b6d3b5
Create Date: 2024-09-03 12:05:11.957595

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c90f6c5d9e65'
down_revision: Union[str, None] = '7f3e95b6d3b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
